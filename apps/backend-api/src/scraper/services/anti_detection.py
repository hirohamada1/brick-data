from __future__ import annotations

import random
import time
from typing import Any


def add_stealth_init_script(page: Any) -> None:
    page.add_init_script(
        """
        Object.defineProperty(navigator, 'webdriver', {
            get: () => undefined,
        });
        """
    )


def randomized_scroll(page: Any, *, min_pixels: int = 300, max_pixels: int = 900) -> None:
    distance = random.randint(min_pixels, max_pixels)
    page.mouse.wheel(0, distance)


def randomized_delay(*, min_seconds: float = 20.0, max_seconds: float = 60.0) -> None:
    if max_seconds <= 0:
        return
    if min_seconds < 0:
        min_seconds = 0.0
    if min_seconds > max_seconds:
        min_seconds = max_seconds
    time.sleep(random.uniform(min_seconds, max_seconds))
