import threading
import time


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
