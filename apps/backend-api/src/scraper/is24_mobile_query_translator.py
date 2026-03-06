from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any, Mapping
from urllib.parse import parse_qs, urlparse


_SEARCH_PATH_RE = re.compile(
    r"/suche/de/(?P<location_path>.+?)/(?P<kind>wohnung-kaufen)(?:/|$)",
    re.IGNORECASE,
)
_RANGE_RE = re.compile(r"^\s*[0-9]*(?:[.,][0-9]+)?\s*-\s*[0-9]*(?:[.,][0-9]+)?\s*$")
_RANGE_KEYS = ("numberofrooms", "livingspace", "price")


class UnsupportedSearchError(ValueError):
    """Raised when a watchlist cannot be translated to IS24 mobile search params."""


@dataclass(frozen=True)
class MobileSearchTranslation:
    search_params: dict[str, str]
    source: str
    fallback_used: bool


def _to_optional_float(value: Any) -> float | None:
    if value is None or isinstance(value, bool):
        return None
    try:
        return float(value)
    except Exception:
        try:
            return float(str(value).strip().replace(",", "."))
        except Exception:
            return None


def _format_range(min_value: float | None, max_value: float | None, *, force_decimal: bool = False) -> str | None:
    if min_value is None and max_value is None:
        return None

    def _fmt(value: float | None) -> str:
        if value is None:
            return ""
        if force_decimal:
            return f"{value:.1f}"
        if value.is_integer():
            return str(int(value))
        return str(value)

    return f"{_fmt(min_value)}-{_fmt(max_value)}"


def _extract_location_path_and_kind(search_url: str) -> tuple[str, str]:
    parsed = urlparse(search_url)
    match = _SEARCH_PATH_RE.search(parsed.path or "")
    if not match:
        raise UnsupportedSearchError(
            "Only IS24 /Suche/de/.../wohnung-kaufen URLs are supported for mobile translation"
        )
    return match.group("location_path").strip("/"), match.group("kind").lower()


def _extract_legacy_ranges(search_url: str) -> dict[str, str]:
    parsed = urlparse(search_url)
    query = parse_qs(parsed.query, keep_blank_values=True)
    out: dict[str, str] = {}
    for key in _RANGE_KEYS:
        raw_values = query.get(key)
        if not raw_values:
            continue
        raw = str(raw_values[0]).strip()
        if not raw:
            continue
        if not _RANGE_RE.match(raw):
            raise UnsupportedSearchError(f"Invalid range value for '{key}': {raw}")
        normalized = raw.replace(" ", "")
        if normalized == "-":
            raise UnsupportedSearchError(f"Invalid range value for '{key}': {raw}")
        out[key] = normalized
    return out


def _build_base_params(location_path: str, *, kind: str) -> dict[str, str]:
    if kind != "wohnung-kaufen":
        raise UnsupportedSearchError(f"Unsupported IS24 search kind: {kind}")
    normalized_path = location_path.strip("/")
    if not normalized_path:
        raise UnsupportedSearchError("location_path is required for mobile translation")
    return {
        "searchType": "region",
        "realestatetype": "apartmentbuy",
        "geocodes": f"/de/{normalized_path}",
    }


def _translate_from_structured_fields(watchlist: Mapping[str, Any]) -> MobileSearchTranslation:
    location_path = str(watchlist.get("location_path") or "").strip().strip("/")
    if not location_path:
        raise UnsupportedSearchError("location_path missing")

    # v1 default: frontend currently creates apartment-buy watchlists only.
    params = _build_base_params(location_path, kind="wohnung-kaufen")

    rooms = _format_range(
        _to_optional_float(watchlist.get("rooms_min")),
        _to_optional_float(watchlist.get("rooms_max")),
        force_decimal=True,
    )
    if rooms:
        params["numberofrooms"] = rooms

    area = _format_range(
        _to_optional_float(watchlist.get("area_min")),
        _to_optional_float(watchlist.get("area_max")),
    )
    if area:
        params["livingspace"] = area

    price = _format_range(
        _to_optional_float(watchlist.get("price_min")),
        _to_optional_float(watchlist.get("price_max")),
    )
    if price:
        params["price"] = price

    return MobileSearchTranslation(
        search_params=params,
        source="structured_fields",
        fallback_used=False,
    )


def _translate_from_search_url(search_url: str) -> MobileSearchTranslation:
    if not search_url:
        raise UnsupportedSearchError("search_url is required when structured fields are unavailable")

    location_path, kind = _extract_location_path_and_kind(search_url)
    params = _build_base_params(location_path, kind=kind)
    params.update(_extract_legacy_ranges(search_url))

    return MobileSearchTranslation(
        search_params=params,
        source="search_url",
        fallback_used=True,
    )


def translate_watchlist_to_mobile_search(watchlist: Mapping[str, Any]) -> MobileSearchTranslation:
    """
    Translate a watchlist to IS24 mobile search params.

    Strategy:
    1) Use structured watchlist fields when location_path exists.
    2) Fallback to parsing legacy search_url.
    """
    location_path = str(watchlist.get("location_path") or "").strip().strip("/")
    if location_path:
        return _translate_from_structured_fields(watchlist)

    search_url = str(watchlist.get("search_url") or "").strip()
    return _translate_from_search_url(search_url)
