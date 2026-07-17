"""GlobalGiving API client.

Verified against a live pull: /all/projects (no suffix) returns no nested
organization data at all, and defaults to XML. /all/projects/active is the
endpoint that nests a real organization object, and requires an explicit
Accept: application/json header to get JSON instead of XML.
"""

from collections.abc import Iterator

import httpx

BASE_URL = "https://api.globalgiving.org/api/public/projectservice"


class GlobalGivingClient:
    def __init__(self, api_key: str):
        self._client = httpx.Client(
            base_url=BASE_URL,
            params={"api_key": api_key},
            headers={"Accept": "application/json"},
            timeout=30.0,
        )

    def fetch_active_projects(self, limit: int | None = None) -> Iterator[dict]:
        next_id, fetched = 1, 0
        while next_id is not None:
            response = self._client.get("/all/projects/active", params={"nextProjectId": next_id})
            response.raise_for_status()
            page = response.json().get("projects", {})
            for project in page.get("project", []):
                yield project
                fetched += 1
                if limit is not None and fetched >= limit:
                    return
            next_id = page.get("nextProjectId") if page.get("hasNext") else None

    def close(self):
        self._client.close()


def parse_organization(raw: dict) -> dict:
    org = raw.get("organization", {})
    countries = org.get("countries", {}).get("country", [])
    address_parts = [
        org.get("addressLine1"),
        org.get("addressLine2"),
        org.get("city"),
        " ".join(part for part in (org.get("state"), org.get("postal")) if part) or None,
    ]
    return {
        "globalgiving_id": str(org.get("id")),
        "name": org.get("name"),
        "home_country": org.get("country"),
        "countries_served": ", ".join(c["name"] for c in countries if c.get("name")) or None,
        "address": ", ".join(part for part in address_parts if part) or None,
        "logo_url": org.get("logoUrl"),
        "homepage_url": org.get("url"),
    }


def parse_project(raw: dict) -> dict:
    return {
        "globalgiving_id": str(raw.get("id")),
        "title": raw.get("title"),
        "theme": (raw.get("themes", {}).get("theme") or [{}])[0].get("name"),
        "description_raw": raw.get("summary") or raw.get("need"),
        "funding_goal": raw.get("goal"),
        "funding_raised": raw.get("funding"),
        "project_url": raw.get("projectLink"),
    }
