"""Batch job: GlobalGiving -> Postgres cache, snapshots, embeddings, summaries.

Run with: python -m app.jobs.refresh_cache

This is the only place that calls the paid OpenAI/Anthropic APIs (FR-2,
FR-4) — embeddings and summaries are generated once per project and
persisted, never regenerated on a read path.
"""

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_session_factory
from app.models.embedding import ProjectEmbedding
from app.models.organization import Organization
from app.models.project import Project
from app.models.snapshot import ProjectSnapshot
from app.services.embeddings import embed_text
from app.services.globalgiving import GlobalGivingClient, parse_organization, parse_project
from app.services.summarization import summarize_project


def upsert_organization(db: Session, raw: dict) -> Organization:
    fields = parse_organization(raw)
    org = db.scalar(select(Organization).where(Organization.globalgiving_id == fields["globalgiving_id"]))
    if org is None:
        org = Organization(**fields)
        db.add(org)
    else:
        for key, value in fields.items():
            setattr(org, key, value)
    db.flush()
    return org


def upsert_project(db: Session, raw: dict, org: Organization) -> Project:
    fields = parse_project(raw)
    project = db.scalar(select(Project).where(Project.globalgiving_id == fields["globalgiving_id"]))
    if project is None:
        project = Project(org_id=org.id, **fields)
        db.add(project)
    else:
        for key, value in fields.items():
            setattr(project, key, value)
    db.flush()

    # Append-only snapshot of amount_raised — never overwrite history.
    if project.funding_raised is not None:
        db.add(ProjectSnapshot(project_id=project.id, amount_raised=project.funding_raised))

    return project


def ensure_embedding(db: Session, project: Project) -> None:
    if project.embedding is not None or not project.description_raw:
        return
    vector = embed_text(project.description_raw)
    db.add(ProjectEmbedding(project_id=project.id, embedding=vector))


def ensure_summary(db: Session, project: Project) -> None:
    if project.summary_cached or not project.description_raw:
        return
    project.summary_cached = summarize_project(project.description_raw)


def run() -> None:
    client = GlobalGivingClient(settings.globalgiving_api_key)
    session_factory = get_session_factory()
    try:
        with session_factory() as db:
            for raw_project in client.fetch_active_projects():
                org = upsert_organization(db, raw_project)
                project = upsert_project(db, raw_project, org)
                ensure_embedding(db, project)
                ensure_summary(db, project)
            db.commit()
    finally:
        client.close()


if __name__ == "__main__":
    run()
