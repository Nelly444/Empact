from pydantic import BaseModel, ConfigDict

from app.schemas.organization import OrganizationOut


class ImpactEstimateOut(BaseModel):
    remaining_need: float
    example_donation: float
    coverage_pct: float
    summary: str
    funding_velocity_per_day: float | None = None
    days_to_fully_funded: float | None = None


class ProjectCardOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    theme: str | None
    organization: OrganizationOut
    summary_cached: str | None
    funding_goal: float | None
    funding_raised: float | None
    project_url: str | None
    impact_estimate: ImpactEstimateOut | None = None
    similarity: float | None = None


class ProjectDetailOut(ProjectCardOut):
    description_raw: str | None
    similar_projects: list[ProjectCardOut] = []
