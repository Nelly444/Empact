from functools import lru_cache

from openai import OpenAI

from app.core.config import settings
from app.core.rate_limit import RateLimiter

EMBEDDING_MODEL = "text-embedding-3-small"
RATE_LIMIT_PER_MINUTE = 60

_rate_limiter = RateLimiter(RATE_LIMIT_PER_MINUTE)


@lru_cache
def get_client() -> OpenAI:
    return OpenAI(api_key=settings.openai_api_key)


def embed_text(text: str) -> list[float]:
    _rate_limiter.wait()
    response = get_client().embeddings.create(model=EMBEDDING_MODEL, input=text)
    return response.data[0].embedding
