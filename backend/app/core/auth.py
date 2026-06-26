import secrets

from fastapi import Header, HTTPException

from app.core.config import settings


def require_api_key(x_api_key: str = Header(default="")) -> None:
    if not settings.backend_api_key or not secrets.compare_digest(x_api_key, settings.backend_api_key):
        raise HTTPException(status_code=401, detail="Missing or invalid API key")
