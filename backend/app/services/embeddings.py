from functools import lru_cache

from openai import OpenAI

from app.core.config import settings

EMBEDDING_MODEL = "text-embedding-3-small"


@lru_cache
def get_client() -> OpenAI:
    return OpenAI(api_key=settings.openai_api_key)


def embed_text(text: str) -> list[float]:
    response = get_client().embeddings.create(model=EMBEDDING_MODEL, input=text)
    return response.data[0].embedding
