from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session, joinedload

from app.api.serializers import to_project_card
from app.core.rate_limit import rate_limit_search
from app.db.session import get_db
from app.models.embedding import ProjectEmbedding
from app.models.organization import Organization
from app.models.project import Project
from app.schemas.search import SearchRequest, SearchResponse
from app.services.embeddings import embed_text

router = APIRouter()

# Cosine similarity below this is noise, not a real match. Measured empirically
# against the live dataset: garbage queries ("f", "asdf qwer zxcv") top out
# around 0.20-0.21, while genuine queries ("girls education in East Africa",
# "help kids learn to code") score 0.32+ on even their weakest top-3 result.
MIN_SIMILARITY = 0.25


def _passes_similarity_threshold(similarity: float) -> bool:
    return similarity >= MIN_SIMILARITY


@router.post("/search", response_model=SearchResponse, dependencies=[Depends(rate_limit_search)])
def search(request: SearchRequest, db: Session = Depends(get_db)) -> SearchResponse:
    """Filter first, then rank by semantic relevance if a query was given."""
    query = select(Project).options(joinedload(Project.organization), joinedload(Project.snapshots))

    if request.org_name or request.home_country or request.countries_served:
        query = query.join(Organization)
    if request.org_name:
        query = query.where(Organization.name == request.org_name)
    if request.home_country:
        query = query.where(Organization.home_country == request.home_country)
    if request.countries_served:
        # countries_served is a comma-joined string (see Organization model), so a plain
        # substring match would wrongly match "Niger" against "Nigeria", "Sudan" against
        # "South Sudan", etc. Pad both sides with delimiters to require a whole-token match.
        padded_countries = func.concat(", ", Organization.countries_served, ",")
        query = query.where(padded_countries.contains(f", {request.countries_served},"))
    if request.themes:
        query = query.where(Project.theme.in_(request.themes))

    if not request.query:
        query = query.order_by(Project.id).distinct().limit(request.limit)
        projects = db.scalars(query).unique().all()
        return SearchResponse(results=[to_project_card(p) for p in projects])

    query_vector = embed_text(request.query)
    distance = ProjectEmbedding.embedding.cosine_distance(query_vector)
    ranked = (
        query.join(ProjectEmbedding, ProjectEmbedding.project_id == Project.id)
        .order_by(distance)
        .limit(request.limit)
    )
    rows = db.execute(ranked.add_columns(distance)).unique().all()
    results = [
        to_project_card(project, similarity=1 - dist)
        for project, dist in rows
        if _passes_similarity_threshold(1 - dist)
    ]
    return SearchResponse(results=results)
