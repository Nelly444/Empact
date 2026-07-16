from datetime import datetime, timedelta, timezone

import pytest

from app.models.project import Project
from app.models.snapshot import ProjectSnapshot
from app.services.impact import (
    MIN_SNAPSHOTS_FOR_VELOCITY,
    build_impact_estimate,
    funding_velocity,
    marginal_dollar_framing,
)


def test_marginal_dollar_framing_normal_case():
    project = Project(funding_goal=100.0, funding_raised=50.0)
    remaining_need, coverage_pct, summary = marginal_dollar_framing(project, donation=5.0)
    assert remaining_need == 50.0
    assert coverage_pct == 10.0
    assert "10.0%" in summary


def test_marginal_dollar_framing_switches_to_donation_count_when_coverage_underflows():
    # A remaining need this large makes $5 round to "~0.0%" at any sane
    # precision - the common case for real charity goals in the tens of
    # thousands+, which is exactly why this branch exists.
    project = Project(funding_goal=100_000.0, funding_raised=0.0)
    remaining_need, coverage_pct, summary = marginal_dollar_framing(project, donation=5.0)
    assert remaining_need == 100_000.0
    assert coverage_pct == pytest.approx(0.005)
    assert "0.0%" not in summary
    assert "20,000 donations of $5" in summary


def test_marginal_dollar_framing_goal_already_met():
    project = Project(funding_goal=100.0, funding_raised=150.0)
    remaining_need, coverage_pct, summary = marginal_dollar_framing(project, donation=5.0)
    assert remaining_need == 0.0
    assert coverage_pct == 0.0
    assert "already been met" in summary


def test_marginal_dollar_framing_missing_fields_treated_as_zero():
    project = Project(funding_goal=None, funding_raised=None)
    remaining_need, coverage_pct, summary = marginal_dollar_framing(project, donation=5.0)
    assert remaining_need == 0.0
    assert "already been met" in summary


def _snapshot(amount: float, days_ago: int) -> ProjectSnapshot:
    captured_at = datetime.now(timezone.utc) - timedelta(days=days_ago)
    return ProjectSnapshot(amount_raised=amount, captured_at=captured_at)


def test_funding_velocity_returns_none_below_minimum_snapshots():
    snapshots = [_snapshot(100, days_ago=i) for i in range(MIN_SNAPSHOTS_FOR_VELOCITY - 1)]
    per_day, _ = funding_velocity(snapshots)
    assert per_day is None


def test_funding_velocity_computes_dollars_per_day():
    snapshots = [_snapshot(100, days_ago=10), _snapshot(150, days_ago=5), _snapshot(200, days_ago=0)]
    per_day, _ = funding_velocity(snapshots)
    assert per_day == pytest.approx(10.0)  # (200 - 100) raised over 10 days


def test_build_impact_estimate_omits_velocity_without_enough_history():
    project = Project(funding_goal=100.0, funding_raised=50.0)
    estimate = build_impact_estimate(project, snapshots=[_snapshot(50, days_ago=0)])
    assert estimate.funding_velocity_per_day is None
    assert estimate.days_to_fully_funded is None


def test_build_impact_estimate_includes_velocity_with_enough_history():
    project = Project(funding_goal=100.0, funding_raised=50.0)
    snapshots = [_snapshot(30, days_ago=10), _snapshot(40, days_ago=5), _snapshot(50, days_ago=0)]
    estimate = build_impact_estimate(project, snapshots=snapshots)
    assert estimate.funding_velocity_per_day == pytest.approx(2.0)  # (50 - 30) over 10 days
    assert estimate.days_to_fully_funded == pytest.approx(25.0)  # 50 remaining / 2 per day
