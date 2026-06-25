from pydantic import BaseModel, ConfigDict

from app.schemas.organization import OrganizationOut


class ImpactEstimateOut(BaseModel):
    remaining_need: float
    example_donation: float
    coverage_pct: float
    summary: str
    # Present once enough snapshots exist; absent (None) otherwise rather
    # than guessed — see app/services/impact.py.
    funding_velocity_per_day: float | None = None
    days_to_fully_funded: float | None = None


class ProjectCardOut(BaseModel):
    """Shape used by search results / list views (FR-6)."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    theme: str | None
    organization: OrganizationOut
    summary_cached: str | None
    funding_goal: float | None
    funding_raised: float | None
    impact_estimate: ImpactEstimateOut | None = None
    similarity: float | None = None


class ProjectDetailOut(ProjectCardOut):
    """Full detail view (FR-7) — adds the raw description."""

    description_raw: str | None
