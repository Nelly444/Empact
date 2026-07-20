from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.api.serializers import to_project_card, to_project_detail
from app.db.session import get_db
from app.models.embedding import ProjectEmbedding
from app.models.organization import Organization
from app.models.project import Project
from app.schemas.project import ProjectCardOut, ProjectDetailOut
from app.services.similarity import passes_similarity_threshold

router = APIRouter()

SIMILAR_PROJECTS_LIMIT = 4


def _base_query():
    return select(Project).options(joinedload(Project.organization), joinedload(Project.snapshots))


def _similar_projects(db: Session, project: Project) -> list[tuple[Project, float]]:
    own_embedding = db.scalar(select(ProjectEmbedding).where(ProjectEmbedding.project_id == project.id))
    if own_embedding is None:
        return []

    distance = ProjectEmbedding.embedding.cosine_distance(own_embedding.embedding)
    ranked = (
        _base_query()
        .join(ProjectEmbedding, ProjectEmbedding.project_id == Project.id)
        .where(Project.id != project.id)
        .order_by(distance)
        .limit(SIMILAR_PROJECTS_LIMIT)
    )
    rows = db.execute(ranked.add_columns(distance)).unique().all()
    return [(p, 1 - dist) for p, dist in rows if passes_similarity_threshold(1 - dist)]


@router.get("/projects", response_model=list[ProjectCardOut])
def list_projects(
    org_name: str | None = Query(None, max_length=200),
    home_country: str | None = Query(None, max_length=100),
    theme: str | None = Query(None, max_length=100),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = _base_query()
    if org_name or home_country:
        query = query.join(Organization)
    if org_name:
        query = query.where(Organization.name == org_name)
    if home_country:
        query = query.where(Organization.home_country == home_country)
    if theme:
        query = query.where(Project.theme == theme)

    query = query.order_by(Project.id).distinct().offset(offset).limit(limit)
    projects = db.scalars(query).unique().all()
    return [to_project_card(p) for p in projects]


@router.get("/projects/{project_id}", response_model=ProjectDetailOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.scalar(_base_query().where(Project.id == project_id))
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return to_project_detail(project, similar_projects=_similar_projects(db, project))
