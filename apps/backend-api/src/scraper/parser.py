"""
Parsers for ImmoScout24 search-result pages.

Important: this module parses result-list pages only (not expose detail pages).
"""

from __future__ import annotations

import ast
import html as html_lib
import json
import logging
import re
from typing import Any, Optional

_SCRIPT_RE = re.compile(r"<script[^>]*>(.*?)</script>", re.IGNORECASE | re.DOTALL)
_BLOCK_COMMENT_RE = re.compile(r"/\*.*?\*/", re.DOTALL)
_UNQUOTED_KEY_RE = re.compile(r'([{\[,]\s*)([A-Za-z_@$][\w@.$-]*)(\s*:)')
_TRAILING_COMMA_RE = re.compile(r",\s*([}\]])")
logger = logging.getLogger(__name__)


def parse_search_results(html: str) -> list[dict]:
    try:
        payload = extract_embedded_search_payload(html)
    except ValueError as exc:
        logger.info("Could not extract IS24 embedded payload: %s", exc)
        return []
    return parse_listings(payload)


def parse_listing_details(html: str) -> dict:
    # This pipeline intentionally does not parse expose pages.
    _ = html
    return {}


def extract_embedded_search_payload(html: str) -> dict:
    """Extract payload containing 'resultlistEntries' from page HTML."""
    if not html or "resultlistEntries" not in html:
        raise ValueError("Could not find embedded payload containing 'resultlistEntries'")

    candidates = [m.group(1) for m in _SCRIPT_RE.finditer(html) if "resultlistEntries" in m.group(1)]
    if not candidates:
        candidates = [html]

    for candidate in candidates:
        parsed = _parse_candidate(candidate)
        payload = _find_payload_with_resultlist_entries(parsed)
        if payload is not None:
            return payload

    around_hint = _extract_object_around_hint(html, "resultlistEntries")
    if around_hint:
        parsed = _parse_candidate(around_hint)
        payload = _find_payload_with_resultlist_entries(parsed)
        if payload is not None:
            return payload

    raise ValueError("Could not parse IS24 embedded search payload with 'resultlistEntries'")


def parse_listings(payload: dict) -> list[dict]:
    listings: list[dict] = []
    containers = payload.get("resultlistEntries")

    if isinstance(containers, dict):
        containers = [containers]
    if not isinstance(containers, list):
        return listings

    for container in containers:
        if not isinstance(container, dict):
            continue

        entries = container.get("resultlistEntry", [])
        if isinstance(entries, dict):
            entries = [entries]
        if not isinstance(entries, list):
            continue

        for entry in entries:
            if not isinstance(entry, dict):
                continue

            real = entry.get("resultlist.realEstate")
            if not isinstance(real, dict):
                real = {}

            address = real.get("address")
            if not isinstance(address, dict):
                address = {}

            price = real.get("price")
            if not isinstance(price, dict):
                price = {}

            listing_id = _to_int(
                entry.get("realEstateId")
                or real.get("realEstateId")
                or real.get("@id")
                or real.get("id")
            )
            if listing_id is None:
                continue

            listings.append(
                {
                    "listing_id": listing_id,
                    "modification": _to_str(entry.get("@modification")),
                    "title": _to_str(real.get("title")),
                    "living_space_sqm": _to_number(real.get("livingSpace")),
                    "price_eur": _to_int(price.get("value")),
                    "street": _to_str(address.get("street")),
                    "house_number": _to_str(address.get("houseNumber") or address.get("house_number")),
                    "city": _to_str(address.get("city")),
                    "postcode": _to_str(address.get("postcode")),
                    "quarter": _to_str(address.get("quarter")),
                }
            )

    return listings


def _parse_candidate(candidate: str) -> Any:
    text = html_lib.unescape(candidate).strip()

    direct = _parse_json_like(text)
    if direct is not None:
        return direct

    object_text = _extract_first_object(text)
    if object_text:
        parsed_object = _parse_json_like(object_text)
        if parsed_object is not None:
            return parsed_object

    return {}


def _parse_json_like(text: str) -> Optional[Any]:
    text = text.strip().rstrip(";")
    if not text:
        return None

    try:
        return json.loads(text)
    except Exception:
        pass

    cleaned = _BLOCK_COMMENT_RE.sub("", text)
    cleaned = cleaned.replace("\n", " ").replace("\r", " ")
    cleaned = cleaned.replace("undefined", "null")
    cleaned = _TRAILING_COMMA_RE.sub(r"\1", cleaned)
    cleaned = _UNQUOTED_KEY_RE.sub(r'\1"\2"\3', cleaned)
    cleaned = _replace_single_quotes(cleaned)

    try:
        return json.loads(cleaned)
    except Exception:
        pass

    py_like = (
        cleaned.replace(": true", ": True")
        .replace(": false", ": False")
        .replace(": null", ": None")
    )
    try:
        return ast.literal_eval(py_like)
    except Exception:
        return None


def _replace_single_quotes(text: str) -> str:
    out: list[str] = []
    in_single = False
    in_double = False
    escaped = False

    for char in text:
        if escaped:
            out.append(char)
            escaped = False
            continue

        if char == "\\":
            out.append(char)
            escaped = True
            continue

        if char == "'" and not in_double:
            in_single = not in_single
            out.append('"')
            continue

        if char == '"' and not in_single:
            in_double = not in_double
            out.append(char)
            continue

        out.append(char)

    return "".join(out)


def _extract_first_object(text: str) -> Optional[str]:
    start = text.find("{")
    if start < 0:
        return None
    return _extract_balanced_object(text, start)


def _extract_object_around_hint(text: str, hint: str) -> Optional[str]:
    idx = text.find(hint)
    if idx < 0:
        return None
    start = text.rfind("{", 0, idx)
    if start < 0:
        return None
    return _extract_balanced_object(text, start)


def _extract_balanced_object(text: str, start_idx: int) -> Optional[str]:
    depth = 0
    in_single = False
    in_double = False
    escaped = False

    for idx in range(start_idx, len(text)):
        char = text[idx]
        if escaped:
            escaped = False
            continue
        if char == "\\":
            escaped = True
            continue

        if char == "'" and not in_double:
            in_single = not in_single
            continue
        if char == '"' and not in_single:
            in_double = not in_double
            continue
        if in_single or in_double:
            continue

        if char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return text[start_idx : idx + 1]

    return None


def _find_payload_with_resultlist_entries(node: Any) -> Optional[dict]:
    if isinstance(node, dict):
        if "resultlistEntries" in node:
            return node
        for value in node.values():
            found = _find_payload_with_resultlist_entries(value)
            if found is not None:
                return found
    elif isinstance(node, list):
        for item in node:
            found = _find_payload_with_resultlist_entries(item)
            if found is not None:
                return found
    return None


def _to_int(value: Any) -> Optional[int]:
    if value is None:
        return None
    try:
        if isinstance(value, bool):
            return None
        if isinstance(value, int):
            return value
        if isinstance(value, float):
            return int(value)
        text = _normalize_numeric_text(str(value).strip())
        return int(float(text))
    except Exception:
        return None


def _to_number(value: Any) -> Optional[float | int]:
    if value is None:
        return None
    try:
        if isinstance(value, bool):
            return None
        if isinstance(value, int):
            return value
        if isinstance(value, float):
            return int(value) if value.is_integer() else value
        text = _normalize_numeric_text(str(value).strip())
        numeric = float(text)
        return int(numeric) if numeric.is_integer() else numeric
    except Exception:
        return None


def _to_str(value: Any) -> Optional[str]:
    if value is None:
        return None
    text = str(value).strip()
    return text if text else None


def _normalize_numeric_text(text: str) -> str:
    compact = text.replace(" ", "").replace("\u00a0", "")
    has_comma = "," in compact
    has_dot = "." in compact

    if has_comma and has_dot:
        if compact.rfind(",") > compact.rfind("."):
            compact = compact.replace(".", "").replace(",", ".")
        else:
            compact = compact.replace(",", "")
    elif has_comma:
        compact = compact.replace(",", ".")

    return compact
