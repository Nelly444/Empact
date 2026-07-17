import time

import pytest
from fastapi import HTTPException
from starlette.requests import Request

from app.core.rate_limit import PerClientRateLimiter, RateLimiter, _client_key


def _request(headers: dict[str, str], client_host: str | None = "127.0.0.1") -> Request:
    scope = {
        "type": "http",
        "headers": [(k.lower().encode(), v.encode()) for k, v in headers.items()],
        "client": (client_host, 12345) if client_host else None,
    }
    return Request(scope)


def test_first_call_does_not_wait():
    limiter = RateLimiter(max_calls_per_minute=30)
    start = time.monotonic()
    limiter.wait()
    assert time.monotonic() - start < 0.1


def test_second_call_waits_the_minimum_interval():
    limiter = RateLimiter(max_calls_per_minute=30)  # 2s minimum interval
    limiter.wait()
    start = time.monotonic()
    limiter.wait()
    elapsed = time.monotonic() - start
    assert elapsed >= 1.9


def test_per_client_limiter_allows_up_to_the_configured_max():
    limiter = PerClientRateLimiter(max_requests=3, window_seconds=60)
    for _ in range(3):
        limiter.check("1.2.3.4")  # should not raise


def test_per_client_limiter_blocks_once_max_is_exceeded():
    limiter = PerClientRateLimiter(max_requests=3, window_seconds=60)
    for _ in range(3):
        limiter.check("1.2.3.4")
    with pytest.raises(HTTPException) as exc_info:
        limiter.check("1.2.3.4")
    assert exc_info.value.status_code == 429


def test_per_client_limiter_tracks_clients_independently():
    limiter = PerClientRateLimiter(max_requests=1, window_seconds=60)
    limiter.check("1.2.3.4")
    limiter.check("5.6.7.8")  # different client, should not raise


def test_per_client_limiter_resets_after_the_window_elapses():
    limiter = PerClientRateLimiter(max_requests=1, window_seconds=0.2)
    limiter.check("1.2.3.4")
    time.sleep(0.25)
    limiter.check("1.2.3.4")  # window elapsed, should not raise


def test_client_key_prefers_x_forwarded_for_over_socket_peer():
    """Behind a reverse proxy, request.client.host is the proxy's own
    address for every visitor - X-Forwarded-For carries the real one."""
    request = _request({"x-forwarded-for": "203.0.113.5"}, client_host="10.0.0.1")
    assert _client_key(request) == "203.0.113.5"


def test_client_key_takes_the_leftmost_address_in_a_forwarded_chain():
    request = _request({"x-forwarded-for": "203.0.113.5, 10.0.0.2, 10.0.0.1"})
    assert _client_key(request) == "203.0.113.5"


def test_client_key_falls_back_to_socket_peer_without_the_header():
    """No proxy in local dev, so the header is simply absent."""
    request = _request({}, client_host="127.0.0.1")
    assert _client_key(request) == "127.0.0.1"


def test_client_key_falls_back_to_unknown_with_no_header_and_no_client():
    request = _request({}, client_host=None)
    assert _client_key(request) == "unknown"
