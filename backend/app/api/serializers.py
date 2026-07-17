from app.models.project import Project
from app.schemas.project import ProjectCardOut, ProjectDetailOut
from app.services.impact import build_impact_estimate


def to_project_card(project: Project, similarity: float | None = None) -> ProjectCardOut:
    card = ProjectCardOut.model_validate(project, from_attributes=True)
    card.impact_estimate = build_impact_estimate(project, project.snapshots)
    card.similarity = similarity
    return card


def to_project_detail(project: Project, similar_projects: list[tuple[Project, float]] = ()) -> ProjectDetailOut:
    detail = ProjectDetailOut.model_validate(project, from_attributes=True)
    detail.impact_estimate = build_impact_estimate(project, project.snapshots)
    detail.similar_projects = [to_project_card(p, similarity=s) for p, s in similar_projects]
    return detail
