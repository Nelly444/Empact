from pydantic import BaseModel

from app.schemas.project import ProjectCardOut


class SearchRequest(BaseModel):
    query: str | None = None
    org_name: str | None = None
    home_country: str | None = None
    countries_served: str | None = None
    themes: list[str] | None = None
    limit: int = 20


class SearchResponse(BaseModel):
    results: list[ProjectCardOut]
