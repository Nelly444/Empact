from app.services.summarization import _strip_markdown


def test_strips_leading_header_line():
    raw = "# Flex Fund Summary\n\nA donation supports urgent causes across their network."
    assert _strip_markdown(raw) == "A donation supports urgent causes across their network."


def test_strips_bullet_points():
    raw = "- First point\n- Second point"
    assert _strip_markdown(raw) == "First point Second point"


def test_strips_bold_and_italic_emphasis():
    raw = "This project helps **many families** and *individuals* thrive."
    assert _strip_markdown(raw) == "This project helps many families and individuals thrive."


def test_collapses_multiple_blank_lines_into_single_spaces():
    raw = "First sentence.\n\n\nSecond sentence."
    assert _strip_markdown(raw) == "First sentence. Second sentence."


def test_leaves_plain_prose_untouched():
    raw = "This project supports rural learning centers for Afghan women."
    assert _strip_markdown(raw) == raw
