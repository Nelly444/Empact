from fastapi.testclient import TestClient

from app.db.session import get_session_factory
from app.main import app
from app.models.organization import Organization
from app.models.project import Project

client = TestClient(app)


def test_countries_served_filter_does_not_match_substring_country_names():
    """Regression test: filtering for "Niger" used to also match orgs that only
    serve "Nigeria" because the filter was a raw substring check."""
    db = get_session_factory()()
    niger_org = Organization(
        globalgiving_id="test-niger-org",
        name="Test Niger Org",
        countries_served="Niger",
    )
    nigeria_org = Organization(
        globalgiving_id="test-nigeria-org",
        name="Test Nigeria Org",
        countries_served="Nigeria",
    )
    db.add_all([niger_org, nigeria_org])
    db.flush()
    niger_project = Project(org_id=niger_org.id, globalgiving_id="test-niger-project", title="Niger Project")
    nigeria_project = Project(
        org_id=nigeria_org.id, globalgiving_id="test-nigeria-project", title="Nigeria Project"
    )
    db.add_all([niger_project, nigeria_project])
    db.commit()

    try:
        response = client.post("/search", json={"countries_served": "Niger"})
        assert response.status_code == 200
        titles = [r["title"] for r in response.json()["results"]]
        assert "Niger Project" in titles
        assert "Nigeria Project" not in titles
    finally:
        db.delete(niger_project)
        db.delete(nigeria_project)
        db.delete(niger_org)
        db.delete(nigeria_org)
        db.commit()


def test_search_rejects_oversized_query():
    """Query text feeds a paid OpenAI embedding call, so an unbounded string
    would let a client force expensive requests even under the rate limit."""
    response = client.post("/search", json={"query": "x" * 501})
    assert response.status_code == 422


def test_search_rejects_single_character_query():
    """A 1-character query has no real content, so it shouldn't be allowed to
    trigger a billed embedding call at all."""
    response = client.post("/search", json={"query": "f"})
    assert response.status_code == 422


def test_search_rejects_null_byte_in_query():
    response = client.post("/search", json={"query": "hi\x00there"})
    assert response.status_code == 422


def test_search_treats_whitespace_only_query_as_no_query():
    """Whitespace-only input shouldn't error, and shouldn't burn an embedding
    call either - it should fall back to plain structured filtering."""
    response = client.post("/search", json={"query": "   ", "limit": 1})
    assert response.status_code == 200
