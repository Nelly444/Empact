from pydantic import BaseModel, Field

from app.schemas.project import ProjectCardOut


class SearchRequest(BaseModel):
    query: str | None = Field(None, max_length=500)
    org_name: str | None = Field(None, max_length=200)
    home_country: str | None = Field(None, max_length=100)
    countries_served: str | None = Field(None, max_length=100)
    themes: list[str] | None = Field(None, max_length=50)
    limit: int = Field(20, ge=1, le=100)


class SearchResponse(BaseModel):
    results: list[ProjectCardOut]
