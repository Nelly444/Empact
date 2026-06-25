from pydantic import BaseModel, ConfigDict


class OrganizationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    globalgiving_id: str
    name: str
    home_country: str | None
    countries_served: str | None
    logo_url: str | None
    homepage_url: str | None
