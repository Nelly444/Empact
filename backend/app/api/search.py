from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.api.serializers import to_project_card
from app.db.session import get_db
from app.models.embedding import ProjectEmbedding
from app.models.organization import Organization
from app.models.project import Project
from app.schemas.search import SearchRequest, SearchResponse
from app.services.embeddings import embed_text

router = APIRouter()


@router.post("/search", response_model=SearchResponse)
def search(request: SearchRequest, db: Session = Depends(get_db)) -> SearchResponse:
    """Filter first, then rank by semantic relevance if a query was given."""
    query = select(Project).options(joinedload(Project.organization), joinedload(Project.snapshots))

    if request.org_name:
        query = query.join(Organization).where(Organization.name == request.org_name)
    if request.home_country:
        query = query.join(Organization).where(Organization.home_country == request.home_country)
    if request.countries_served:
        query = query.join(Organization).where(Organization.countries_served.contains(request.countries_served))
    if request.themes:
        query = query.where(Project.theme.in_(request.themes))

    if not request.query:
        projects = db.scalars(query.distinct().limit(request.limit)).unique().all()
        return SearchResponse(results=[to_project_card(p) for p in projects])

    query_vector = embed_text(request.query)
    distance = ProjectEmbedding.embedding.cosine_distance(query_vector)
    ranked = (
        query.join(ProjectEmbedding, ProjectEmbedding.project_id == Project.id)
        .order_by(distance)
        .limit(request.limit)
    )
    rows = db.execute(ranked.add_columns(distance)).unique().all()
    return SearchResponse(
        results=[to_project_card(project, similarity=1 - dist) for project, dist in rows]
    )
