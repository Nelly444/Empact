"""Funding-impact estimate calculations — PRD §10.

Every number here is computed from real GlobalGiving fields. No invented
outcome ratios (e.g. "$5 = 2 meals") are used anywhere in this module.
"""

from app.models.project import Project
from app.models.snapshot import ProjectSnapshot
from app.schemas.project import ImpactEstimateOut

EXAMPLE_DONATION = 5.0

# Formula 2 needs enough time-series spread to mean anything; with fewer
# snapshots than this the velocity figure would be noise, so it's omitted
# rather than shown misleadingly.
MIN_SNAPSHOTS_FOR_VELOCITY = 3


def marginal_dollar_framing(project: Project, donation: float = EXAMPLE_DONATION) -> tuple[float, float, str]:
    """PRD §10.1 — pure arithmetic on funding_goal / funding_raised."""
    goal = float(project.funding_goal or 0)
    raised = float(project.funding_raised or 0)
    remaining_need = max(goal - raised, 0)

    if remaining_need <= 0:
        return remaining_need, 0.0, "This project's funding goal has already been met."

    coverage_pct = (donation / remaining_need) * 100
    summary = (
        f"A ${donation:g} donation would cover ~{coverage_pct:.1f}% of this "
        "project's remaining funding need."
    )
    return remaining_need, coverage_pct, summary


def funding_velocity(snapshots: list[ProjectSnapshot]) -> tuple[float | None, float | None]:
    """PRD §10.2 — $/day raised over the snapshot window, projected to
    days-to-fully-funded. Returns (None, None) until enough history exists.
    """
    if len(snapshots) < MIN_SNAPSHOTS_FOR_VELOCITY:
        return None, None

    ordered = sorted(snapshots, key=lambda s: s.captured_at)
    first, last = ordered[0], ordered[-1]
    elapsed_days = (last.captured_at - first.captured_at).total_seconds() / 86400
    if elapsed_days <= 0:
        return None, None

    raised_delta = float(last.amount_raised) - float(first.amount_raised)
    per_day = raised_delta / elapsed_days
    return per_day, None


def build_impact_estimate(project: Project, snapshots: list[ProjectSnapshot] | None = None) -> ImpactEstimateOut:
    remaining_need, coverage_pct, summary = marginal_dollar_framing(project)

    per_day = None
    days_remaining = None
    if snapshots:
        per_day, _ = funding_velocity(snapshots)
        if per_day and per_day > 0:
            days_remaining = remaining_need / per_day

    return ImpactEstimateOut(
        remaining_need=remaining_need,
        example_donation=EXAMPLE_DONATION,
        coverage_pct=coverage_pct,
        summary=summary,
        funding_velocity_per_day=per_day,
        days_to_fully_funded=days_remaining,
    )
