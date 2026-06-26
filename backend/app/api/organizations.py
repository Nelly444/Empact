from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.organization import Organization
from app.models.project import Project
from app.schemas.organization import OrganizationOut

router = APIRouter()


@router.get("/organizations", response_model=list[OrganizationOut])
def list_organizations(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = select(Organization).order_by(Organization.name, Organization.id).offset(offset).limit(limit)
    return db.scalars(query).all()


@router.get("/organizations/filter-options")
def filter_options(db: Session = Depends(get_db)) -> dict:
    """Feeds the frontend's filter dropdowns."""
    org_names = db.scalars(select(Organization.name).order_by(Organization.name)).all()
    home_countries = db.scalars(
        select(Organization.home_country).where(Organization.home_country.isnot(None)).distinct().order_by(Organization.home_country)
    ).all()
    themes = db.scalars(
        select(Project.theme).where(Project.theme.isnot(None)).distinct().order_by(Project.theme)
    ).all()
    return {"org_names": org_names, "home_countries": home_countries, "themes": themes}
