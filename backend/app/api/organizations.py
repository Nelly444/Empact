from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.organization import Organization
from app.models.project import Project
from app.schemas.organization import OrganizationOut

router = APIRouter()


@router.get("/organizations", response_model=list[OrganizationOut])
def list_organizations(db: Session = Depends(get_db)):
    return db.scalars(select(Organization).order_by(Organization.name)).all()


@router.get("/organizations/filter-options")
def filter_options(db: Session = Depends(get_db)) -> dict:
    """Drives the FR-5 dropdowns: org name, home country, countries served, theme."""
    org_names = db.scalars(select(Organization.name).order_by(Organization.name)).all()
    home_countries = db.scalars(
        select(Organization.home_country).where(Organization.home_country.isnot(None)).distinct().order_by(Organization.home_country)
    ).all()
    themes = db.scalars(
        select(Project.theme).where(Project.theme.isnot(None)).distinct().order_by(Project.theme)
    ).all()
    return {"org_names": org_names, "home_countries": home_countries, "themes": themes}
