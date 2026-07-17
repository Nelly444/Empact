from app.services.similarity import passes_similarity_threshold


def test_similarity_threshold_filters_low_scores():
    """Empirically, garbage queries score <=0.21 and genuine queries score
    >=0.32 against the live dataset - the threshold sits between them."""
    assert not passes_similarity_threshold(0.21)
    assert passes_similarity_threshold(0.32)
