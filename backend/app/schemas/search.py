from pydantic import BaseModel, Field, field_validator

from app.schemas.project import ProjectCardOut


class SearchRequest(BaseModel):
    query: str | None = Field(None, max_length=500)
    org_name: str | None = Field(None, max_length=200)
    home_country: str | None = Field(None, max_length=100)
    countries_served: str | None = Field(None, max_length=100)
    themes: list[str] | None = Field(None, max_length=50)
    limit: int = Field(20, ge=1, le=100)

    @field_validator("query")
    @classmethod
    def normalize_query(cls, value: str | None) -> str | None:
        if value is None:
            return None
        stripped = value.strip()
        if "\x00" in stripped:
            raise ValueError("query must not contain null bytes")
        if not stripped:
            return None
        if len(stripped) < 2:
            raise ValueError("query must be at least 2 characters")
        return stripped


class SearchResponse(BaseModel):
    results: list[ProjectCardOut]
