from fastapi.testclient import TestClient

from app.core.config import settings
from app.main import app

client = TestClient(app)
HEADERS = {"X-API-Key": settings.backend_api_key}


def test_projects_with_org_name_and_home_country_does_not_500():
    """Regression test: combining two Organization filters used to double-join and 500."""
    response = client.get(
        "/projects", params={"org_name": "x", "home_country": "y"}, headers=HEADERS
    )
    assert response.status_code == 200


def test_search_with_all_org_filters_does_not_500():
    """Regression test: combining all three Organization filters used to double-join and 500."""
    response = client.post(
        "/search",
        json={"org_name": "x", "home_country": "y", "countries_served": "z"},
        headers=HEADERS,
    )
    assert response.status_code == 200
