import time

from app.core.rate_limit import RateLimiter


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
