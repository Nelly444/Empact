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
    org_names = db.scalars(select(Organization.name).order_by(Organization.name)).all()
    home_countries = db.scalars(
        select(Organization.home_country).where(Organization.home_country.isnot(None)).distinct().order_by(Organization.home_country)
    ).all()
    themes = db.scalars(
        select(Project.theme).where(Project.theme.isnot(None)).distinct().order_by(Project.theme)
    ).all()

    raw_countries_served = db.scalars(
        select(Organization.countries_served).where(Organization.countries_served.isnot(None))
    ).all()
    countries_served = sorted(
        {country.strip() for value in raw_countries_served for country in value.split(",") if country.strip()}
    )

    return {
        "org_names": org_names,
        "home_countries": home_countries,
        "themes": themes,
        "countries_served": countries_served,
    }
