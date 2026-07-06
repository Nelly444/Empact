import re
from functools import lru_cache

from anthropic import Anthropic

from app.core.config import settings
from app.core.rate_limit import RateLimiter

# Cheap, fast model — appropriate for a batch job, never called per-request.
SUMMARY_MODEL = "claude-haiku-4-5"
RATE_LIMIT_PER_MINUTE = 30

SUMMARY_PROMPT = (
    "Summarize the following charity project description in 2-3 plain-English "
    "sentences for a prospective donor. Do not invent facts, statistics, or "
    "impact figures that are not present in the text. Respond with plain "
    "prose only — no markdown headers, titles, or bullet points. "
    "Description:\n\n{description}"
)

_rate_limiter = RateLimiter(RATE_LIMIT_PER_MINUTE)

_HEADER_LINE = re.compile(r"^\s*#{1,6}\s+\S")
_BULLET_LINE = re.compile(r"^\s*[-*•]\s+")
_BOLD_ITALIC = re.compile(r"\*{1,3}(.+?)\*{1,3}")


def _strip_markdown(text: str) -> str:
    """The model doesn't always honor the plain-prose instruction — drop
    stray title/header lines and clean up bullets/emphasis rather than
    caching malformed text."""
    lines = [
        _BULLET_LINE.sub("", line)
        for line in text.splitlines()
        if not _HEADER_LINE.match(line)
    ]
    cleaned = " ".join(line.strip() for line in lines if line.strip())
    cleaned = _BOLD_ITALIC.sub(r"\1", cleaned)
    return cleaned.strip()


@lru_cache
def get_client() -> Anthropic:
    return Anthropic(api_key=settings.anthropic_api_key)


def summarize_project(description: str) -> str:
    _rate_limiter.wait()
    message = get_client().messages.create(
        model=SUMMARY_MODEL,
        max_tokens=200,
        messages=[{"role": "user", "content": SUMMARY_PROMPT.format(description=description)}],
    )
    raw = "".join(block.text for block in message.content if block.type == "text").strip()
    return _strip_markdown(raw)
