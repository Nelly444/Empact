from fastapi.testclient import TestClient

from app.db.session import get_session_factory
from app.main import app
from app.models.embedding import EMBEDDING_DIM, ProjectEmbedding
from app.models.organization import Organization
from app.models.project import Project

client = TestClient(app)


def _vector(hot_index: int) -> list[float]:
    """A unit vector with a 1.0 in one slot - lets tests control cosine
    similarity exactly instead of depending on real embedded content."""
    vector = [0.0] * EMBEDDING_DIM
    vector[hot_index] = 1.0
    return vector


def test_similar_projects_excludes_self_and_low_similarity_matches():
    db = get_session_factory()()
    org = Organization(globalgiving_id="test-similar-org", name="Test Similar Org")
    db.add(org)
    db.flush()

    anchor = Project(org_id=org.id, globalgiving_id="test-similar-anchor", title="Anchor Project")
    close_match = Project(org_id=org.id, globalgiving_id="test-similar-close", title="Close Match Project")
    far_match = Project(org_id=org.id, globalgiving_id="test-similar-far", title="Far Match Project")
    db.add_all([anchor, close_match, far_match])
    db.flush()

    # Identical vector -> similarity 1.0 (well above threshold). Orthogonal
    # vector -> similarity 0.0 (well below threshold).
    db.add_all(
        [
            ProjectEmbedding(project_id=anchor.id, embedding=_vector(0)),
            ProjectEmbedding(project_id=close_match.id, embedding=_vector(0)),
            ProjectEmbedding(project_id=far_match.id, embedding=_vector(1)),
        ]
    )
    db.commit()

    try:
        response = client.get(f"/projects/{anchor.id}")
        assert response.status_code == 200
        similar_titles = [p["title"] for p in response.json()["similar_projects"]]
        assert "Close Match Project" in similar_titles
        assert "Anchor Project" not in similar_titles
        assert "Far Match Project" not in similar_titles
    finally:
        db.query(ProjectEmbedding).filter(
            ProjectEmbedding.project_id.in_([anchor.id, close_match.id, far_match.id])
        ).delete(synchronize_session=False)
        db.delete(anchor)
        db.delete(close_match)
        db.delete(far_match)
        db.delete(org)
        db.commit()


def test_similar_projects_is_empty_list_when_project_has_no_embedding():
    db = get_session_factory()()
    org = Organization(globalgiving_id="test-no-embed-org", name="Test No Embedding Org")
    db.add(org)
    db.flush()
    project = Project(org_id=org.id, globalgiving_id="test-no-embed-project", title="No Embedding Project")
    db.add(project)
    db.commit()

    try:
        response = client.get(f"/projects/{project.id}")
        assert response.status_code == 200
        assert response.json()["similar_projects"] == []
    finally:
        db.delete(project)
        db.delete(org)
        db.commit()
