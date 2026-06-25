from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.api.serializers import to_project_card, to_project_detail
from app.db.session import get_db
from app.models.organization import Organization
from app.models.project import Project
from app.schemas.project import ProjectCardOut, ProjectDetailOut

router = APIRouter()


def _base_query():
    return select(Project).options(joinedload(Project.organization), joinedload(Project.snapshots))


@router.get("/projects", response_model=list[ProjectCardOut])
def list_projects(
    org_name: str | None = None,
    home_country: str | None = None,
    theme: str | None = None,
    db: Session = Depends(get_db),
):
    """Structured filters only — no semantic ranking, unlike /search."""
    query = _base_query()
    if org_name:
        query = query.join(Organization).where(Organization.name == org_name)
    if home_country:
        query = query.join(Organization).where(Organization.home_country == home_country)
    if theme:
        query = query.where(Project.theme == theme)

    projects = db.scalars(query.distinct()).unique().all()
    return [to_project_card(p) for p in projects]


@router.get("/projects/{project_id}", response_model=ProjectDetailOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.scalar(_base_query().where(Project.id == project_id))
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return to_project_detail(project)
