import threading
import time
from collections import defaultdict, deque

from fastapi import HTTPException, Request


class RateLimiter:
    """Blocks each call until enough time has passed since the last one."""

    def __init__(self, max_calls_per_minute: int):
        self._min_interval = 60.0 / max_calls_per_minute
        self._lock = threading.Lock()
        self._last_call = 0.0

    def wait(self) -> None:
        with self._lock:
            elapsed = time.monotonic() - self._last_call
            if elapsed < self._min_interval:
                time.sleep(self._min_interval - elapsed)
            self._last_call = time.monotonic()


class PerClientRateLimiter:
    """Sliding-window request limiter keyed by client IP.

    Public endpoints have no API key (a value shipped to every browser isn't
    a real secret), so this is what actually guards against a single client
    hammering the API or burning through the shared OpenAI/Anthropic budget.
    """

    def __init__(self, max_requests: int, window_seconds: float):
        self._max_requests = max_requests
        self._window = window_seconds
        self._lock = threading.Lock()
        self._hits: dict[str, deque[float]] = defaultdict(deque)

    def check(self, key: str) -> None:
        now = time.monotonic()
        with self._lock:
            hits = self._hits[key]
            while hits and now - hits[0] > self._window:
                hits.popleft()
            if len(hits) >= self._max_requests:
                raise HTTPException(status_code=429, detail="Too many requests")
            hits.append(now)


def _client_key(request: Request) -> str:
    return request.client.host if request.client else "unknown"


# General ceiling across all public data endpoints.
_general_limiter = PerClientRateLimiter(max_requests=60, window_seconds=60)

# /search can trigger a live paid OpenAI embedding call per request, so it
# gets a tighter per-IP ceiling on top of the general one.
_search_limiter = PerClientRateLimiter(max_requests=12, window_seconds=60)


def rate_limit_general(request: Request) -> None:
    _general_limiter.check(_client_key(request))


def rate_limit_search(request: Request) -> None:
    _search_limiter.check(_client_key(request))
