from app.services.globalgiving import parse_organization, parse_project

# Trimmed down from a real /all/projects/active response captured during
# manual verification — keeps the parser tests honest about the real shape.
RAW_PROJECT = {
    "id": 354,
    "organization": {
        "id": 372,
        "name": "Afghan Institute of Learning",
        "url": "http://www.afghaninstituteoflearning.org",
        "logoUrl": "https://www.globalgiving.org/pfil/organ/372/orglogo.jpg",
        "country": "United States",
        "countries": {"country": [{"name": "Afghanistan", "iso3166CountryCode": "AF"}]},
    },
    "title": "Learning Centers for Rural Afghan Women",
    "summary": "This project supports rural Learning Centers for Afghan women.",
    "need": "Fallback text used only if summary is missing.",
    "themes": {"theme": [{"id": "edu", "name": "Education"}]},
    "goal": 98000.0,
    "funding": 67364.43,
}


def test_parse_organization_maps_real_fields():
    org = parse_organization(RAW_PROJECT)
    assert org == {
        "globalgiving_id": "372",
        "name": "Afghan Institute of Learning",
        "home_country": "United States",
        "countries_served": "Afghanistan",
        "logo_url": "https://www.globalgiving.org/pfil/organ/372/orglogo.jpg",
        "homepage_url": "http://www.afghaninstituteoflearning.org",
    }


def test_parse_organization_joins_multiple_countries_served():
    raw = {**RAW_PROJECT, "organization": {**RAW_PROJECT["organization"], "countries": {
        "country": [{"name": "Afghanistan"}, {"name": "Pakistan"}]
    }}}
    org = parse_organization(raw)
    assert org["countries_served"] == "Afghanistan, Pakistan"


def test_parse_organization_handles_missing_organization_key():
    org = parse_organization({"id": 1})
    assert org["globalgiving_id"] == "None"
    assert org["name"] is None
    assert org["countries_served"] is None


def test_parse_project_maps_real_fields():
    project = parse_project(RAW_PROJECT)
    assert project == {
        "globalgiving_id": "354",
        "title": "Learning Centers for Rural Afghan Women",
        "theme": "Education",
        "description_raw": "This project supports rural Learning Centers for Afghan women.",
        "funding_goal": 98000.0,
        "funding_raised": 67364.43,
    }


def test_parse_project_falls_back_to_need_when_summary_missing():
    raw = {**RAW_PROJECT, "summary": None}
    project = parse_project(raw)
    assert project["description_raw"] == "Fallback text used only if summary is missing."


def test_parse_project_handles_missing_themes():
    raw = {**RAW_PROJECT, "themes": {}}
    project = parse_project(raw)
    assert project["theme"] is None
