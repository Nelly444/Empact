from functools import lru_cache

from anthropic import Anthropic

from app.core.config import settings

# Cheap, fast model — appropriate for a batch job, never called per-request.
SUMMARY_MODEL = "claude-haiku-4-5"

SUMMARY_PROMPT = (
    "Summarize the following charity project description in 2-3 plain-English "
    "sentences for a prospective donor. Do not invent facts, statistics, or "
    "impact figures that are not present in the text. Description:\n\n{description}"
)


@lru_cache
def get_client() -> Anthropic:
    return Anthropic(api_key=settings.anthropic_api_key)


def summarize_project(description: str) -> str:
    message = get_client().messages.create(
        model=SUMMARY_MODEL,
        max_tokens=200,
        messages=[{"role": "user", "content": SUMMARY_PROMPT.format(description=description)}],
    )
    return "".join(block.text for block in message.content if block.type == "text").strip()
