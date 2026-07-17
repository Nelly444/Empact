"""Shared cosine-similarity threshold for ranked pgvector results.

Empirically derived against the live dataset: garbage queries ("f", "asdf
qwer zxcv") top out around 0.20-0.21, while genuine queries ("girls
education in East Africa", "help kids learn to code") score 0.32+ on even
their weakest top-3 result. Used by both /search (query-to-project) and
/projects/{id}'s similar-projects list (project-to-project).
"""

MIN_SIMILARITY = 0.25


def passes_similarity_threshold(similarity: float) -> bool:
    return similarity >= MIN_SIMILARITY
