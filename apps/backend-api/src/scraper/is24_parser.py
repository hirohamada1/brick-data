from __future__ import annotations

import re
from dataclasses import asdict
from typing import Any

import json

try:
    import json5  # type: ignore
except Exception:  # pragma: no cover
    json5 = None

from src.scraper.models.listing_schema import FetchArtifact, ParsedSearchPayload

try:
    from src.scraper import parser as legacy_parser
except Exception:  # pragma: no cover
    from scraper import parser as legacy_parser  # type: ignore


_IS24_ASSIGNMENT_RE = re.compile(r"IS24\.resultList\s*=\s*({.*?});", re.DOTALL)
_SCRIPT_RE = re.compile(r"<script[^>]*>(.*?)</script>", re.IGNORECASE | re.DOTALL)


def extract_resultlist_json_text(html: str) -> str | None:
    match = _IS24_ASSIGNMENT_RE.search(html)
    if match:
        return match.group(1)

    for script_match in _SCRIPT_RE.finditer(html):
        script_body = script_match.group(1)
        if "resultlistEntries" in script_body:
            brace_idx = script_body.find("{")
            if brace_idx >= 0:
                return script_body[brace_idx:].strip().rstrip(";")
    return None


def extract_resultlist_json(html: str) -> dict:
    payload_text = extract_resultlist_json_text(html)
    if not payload_text:
        raise ValueError("Search payload not found")
    return _loads_json_flexible(payload_text)


def _entries_from_data(data: dict[str, Any]) -> list[dict[str, Any]]:
    if "resultListModel" in data:
        return (
            data["resultListModel"]
            ["searchResponseModel"]
            ["resultlist.resultlist"]
            ["resultlistEntries"][0]
            ["resultlistEntry"]
        )
    if "resultlistEntries" in data:
        return data["resultlistEntries"][0]["resultlistEntry"]
    raise ValueError("Unsupported search payload structure")


def _loads_json_flexible(text: str) -> dict[str, Any]:
    if json5 is not None:
        return json5.loads(text)
    return json.loads(text)


def _normalize_entries(entries: list[dict[str, Any]]) -> list[dict[str, Any]]:
    normalized: list[dict[str, Any]] = []
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        real = entry.get("resultlist.realEstate") or {}
        address = real.get("address") or {}
        price = real.get("price") or {}

        listing_id = entry.get("realEstateId")
        if listing_id is None:
            continue

        listing_id_str = str(listing_id)
        normalized.append(
            {
                "source": "immoscout",
                "listing_id": int(listing_id) if str(listing_id).isdigit() else listing_id,
                "external_id": listing_id_str,
                "expose_url": f"https://www.immobilienscout24.de/expose/{listing_id_str}",
                "title": real.get("title"),
                "price_eur": price.get("value"),
                "living_space_sqm": real.get("livingSpace"),
                "rooms": real.get("numberOfRooms"),
                "postcode": address.get("postcode"),
                "city": address.get("city"),
                "quarter": address.get("quarter"),
                "street": address.get("street"),
                "house_number": address.get("houseNumber") or address.get("house_number"),
                "published_at": entry.get("@publishDate"),
                "modified_at": entry.get("@modification"),
            }
        )
    return normalized


def parse_search_payload(artifact: FetchArtifact) -> ParsedSearchPayload:
    warnings: list[str] = []

    if artifact.extracted_json_text:
        try:
            data = _loads_json_flexible(artifact.extracted_json_text)
            return ParsedSearchPayload(
                source="json_endpoint",
                listings=_normalize_entries(_entries_from_data(data)),
                warnings=warnings,
            )
        except Exception as exc:
            warnings.append(f"json_endpoint_parse_failed:{exc}")

    html = artifact.raw_html or ""
    json_text = extract_resultlist_json_text(html)
    if json_text:
        try:
            data = _loads_json_flexible(json_text)
            return ParsedSearchPayload(
                source="embedded_script",
                listings=_normalize_entries(_entries_from_data(data)),
                warnings=warnings,
            )
        except Exception as exc:
            warnings.append(f"embedded_script_parse_failed:{exc}")

    listings = legacy_parser.parse_search_results(html)
    return ParsedSearchPayload(
        source="html_fallback",
        listings=listings,
        warnings=warnings,
    )


def parse_search_results(html: str) -> list[dict]:
    artifact = FetchArtifact(url="about:blank", raw_html=html)
    payload = parse_search_payload(artifact)
    return payload.listings


def parse_search_payload_dict(artifact: FetchArtifact) -> dict[str, Any]:
    payload = parse_search_payload(artifact)
    return asdict(payload)
