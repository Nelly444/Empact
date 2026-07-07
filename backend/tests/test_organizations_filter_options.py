from fastapi.testclient import TestClient

from app.db.session import get_session_factory
from app.main import app
from app.models.organization import Organization

client = TestClient(app)


def test_countries_served_options_are_split_and_deduped():
    db = get_session_factory()()
    org_a = Organization(
        globalgiving_id="test-filter-org-a",
        name="Test Filter Org A",
        countries_served="Niger, Chad",
    )
    org_b = Organization(
        globalgiving_id="test-filter-org-b",
        name="Test Filter Org B",
        countries_served="Chad, Nigeria",
    )
    db.add_all([org_a, org_b])
    db.commit()

    try:
        response = client.get("/organizations/filter-options")
        assert response.status_code == 200
        countries_served = response.json()["countries_served"]
        assert "Niger" in countries_served
        assert "Nigeria" in countries_served
        assert "Chad" in countries_served
        # "Chad" appears in both orgs but should only be listed once.
        assert countries_served.count("Chad") == 1
    finally:
        db.delete(org_a)
        db.delete(org_b)
        db.commit()
