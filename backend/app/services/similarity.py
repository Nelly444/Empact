MIN_SIMILARITY = 0.25


def passes_similarity_threshold(similarity: float) -> bool:
    return similarity >= MIN_SIMILARITY
