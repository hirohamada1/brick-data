from __future__ import annotations

import re
from typing import Any, Optional

_ALLOWED_NUMERIC_CHARS_RE = re.compile(r"[^\d,\.]")
_NUMBER_TOKEN_RE = re.compile(r"\d+(?:[.,]\d+)?")


def parse_german_number(value: Any) -> Optional[float]:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)

    text = str(value).strip()
    if not text:
        return None

    m = _NUMBER_TOKEN_RE.search(text)
    if not m:
        return None

    token = m.group(0).replace(",", ".")
    try:
        return float(token)
    except Exception:
        return None


def parse_price_eur(value: Any) -> Optional[float]:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)

    text = str(value).strip()
    if not text:
        return None

    clean = _ALLOWED_NUMERIC_CHARS_RE.sub("", text)
    if not clean:
        return None

    try:
        if "." in clean and "," in clean:
            return float(clean.replace(".", "").replace(",", "."))

        if "," in clean:
            left, right = clean.split(",", 1)
            if len(right) == 3 and right.isdigit() and left.isdigit():
                return float(left + right)
            return float(f"{left}.{right}")

        if "." in clean:
            parts = clean.split(".")
            if len(parts) > 1 and all(p.isdigit() for p in parts) and len(parts[-1]) == 3:
                return float("".join(parts))
            return float(clean)

        return float(clean)
    except Exception:
        return None
