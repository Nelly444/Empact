"""GlobalGiving API client.

Field names below follow the PRD's documented shape (PRD §8). This is
explicitly unverified against a live response — PRD §11 flags the same
risk: "confirm against a live pull before finalizing schema." Treat the
parsing in `_parse_organization` / `_parse_project` as the first thing to
revisit once a real API key is available.
"""

import httpx

BASE_URL = "https://api.globalgiving.org/api/public/projectservice"


class GlobalGivingClient:
    def __init__(self, api_key: str):
        self._api_key = api_key
        self._client = httpx.Client(base_url=BASE_URL, params={"api_key": api_key}, timeout=30.0)

    def fetch_active_projects(self, page: int = 1) -> list[dict]:
        response = self._client.get("/all/projects", params={"nextProjectId": page})
        response.raise_for_status()
        data = response.json()
        return data.get("projects", {}).get("project", [])

    def close(self):
        self._client.close()


def parse_organization(raw: dict) -> dict:
    org = raw.get("organization", {})
    return {
        "globalgiving_id": str(org.get("id")),
        "name": org.get("name"),
        "home_country": org.get("country"),
        "logo_url": org.get("logoUrl"),
        "homepage_url": org.get("homepageUrl") or org.get("organizationUrl"),
    }


def parse_project(raw: dict) -> dict:
    return {
        "globalgiving_id": str(raw.get("id")),
        "title": raw.get("title"),
        "theme": (raw.get("themes", {}).get("theme") or [{}])[0].get("name"),
        "description_raw": raw.get("summary") or raw.get("need"),
        "funding_goal": raw.get("goal"),
        "funding_raised": raw.get("funding"),
    }
