import time

import pytest
from fastapi import HTTPException

from app.core.rate_limit import PerClientRateLimiter, RateLimiter


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
