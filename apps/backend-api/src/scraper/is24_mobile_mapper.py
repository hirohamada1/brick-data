from __future__ import annotations

import re
from typing import Any, Mapping, Optional


def _to_int_or_original(value: Any) -> Any:
    if value is None or isinstance(value, bool):
        return value
    try:
        if isinstance(value, int):
            return value
        as_text = str(value).strip()
        if as_text.isdigit():
            return int(as_text)
    except Exception:
        pass
    return value


def _extract_entries(payload: Mapping[str, Any]) -> list[dict[str, Any]]:
    if "resultListItems" in payload:
        items = payload.get("resultListItems")
        if isinstance(items, list):
            return [x for x in items if isinstance(x, dict)]

    if "resultListModel" in payload:
        model = payload["resultListModel"]
        if isinstance(model, Mapping):
            try:
                entries = (
                    model["searchResponseModel"]["resultlist.resultlist"]["resultlistEntries"][0]["resultlistEntry"]
                )
                if isinstance(entries, list):
                    return [x for x in entries if isinstance(x, dict)]
            except Exception:
                pass

    if "resultlistEntries" in payload:
        entries_root = payload.get("resultlistEntries")
        if isinstance(entries_root, list) and entries_root:
            first = entries_root[0]
            if isinstance(first, Mapping):
                entries = first.get("resultlistEntry")
                if isinstance(entries, list):
                    return [x for x in entries if isinstance(x, dict)]

    for key in ("results", "items", "listings"):
        entries = payload.get(key)
        if isinstance(entries, list):
            return [x for x in entries if isinstance(x, dict)]

    return []


def _price_value(price: Any) -> Any:
    if isinstance(price, Mapping):
        return price.get("value")
    return price


def _parse_price_from_text(value: Any) -> Any:
    text = str(value or "").strip()
    if not text:
        return None
    digits = re.sub(r"\D", "", text)
    if not digits:
        return None
    try:
        return int(digits)
    except Exception:
        return None


def _parse_decimal_from_text(value: Any) -> Any:
    text = str(value or "").replace("\xa0", " ").strip()
    if not text:
        return None
    match = re.search(r"(\d+(?:[.,]\d+)?)", text)
    if not match:
        return None
    number_text = match.group(1).replace(",", ".")
    try:
        number_value = float(number_text)
    except Exception:
        return None
    if number_value.is_integer():
        return int(number_value)
    return number_value


def _extract_from_attributes(attributes: Any) -> dict[str, Any]:
    out: dict[str, Any] = {
        "price_eur": None,
        "living_space_sqm": None,
        "rooms": None,
    }
    if not isinstance(attributes, list):
        return out

    for attr in attributes:
        if not isinstance(attr, Mapping):
            continue
        value = attr.get("value")
        if value is None:
            continue
        text = str(value)
        lowered = text.lower()
        if out["price_eur"] is None and "€" in text:
            out["price_eur"] = _parse_price_from_text(text)
            continue
        if out["living_space_sqm"] is None and ("m²" in lowered or "qm" in lowered):
            out["living_space_sqm"] = _parse_decimal_from_text(text)
            continue
        if out["rooms"] is None and ("zi" in lowered or "zimmer" in lowered):
            out["rooms"] = _parse_decimal_from_text(text)
            continue

    return out


def _parse_address_line(line: Any) -> dict[str, Any]:
    out: dict[str, Any] = {
        "postcode": None,
        "city": None,
        "quarter": None,
        "street": None,
        "house_number": None,
    }
    text = str(line or "").replace("\xa0", " ").strip()
    if not text:
        return out

    parts = [p.strip() for p in text.split(",") if p.strip()]
    if not parts:
        return out

    street_part = parts[0]
    street_match = re.match(r"^(?P<street>.+?)(?:\s+(?P<house_number>\d[\w/-]*))?$", street_part)
    if street_match:
        out["street"] = street_match.group("street")
        out["house_number"] = street_match.group("house_number")
    else:
        out["street"] = street_part

    if len(parts) >= 2:
        locality = parts[1]
        locality_match = re.match(r"^(?P<postcode>\d{5})\s+(?P<city_quarter>.+)$", locality)
        if locality_match:
            out["postcode"] = locality_match.group("postcode")
            city_quarter = locality_match.group("city_quarter").strip()
            if "/" in city_quarter:
                city_part, quarter_part = [x.strip() for x in city_quarter.split("/", 1)]
                out["city"] = city_part or None
                out["quarter"] = quarter_part or None
            else:
                out["city"] = city_quarter or None
        else:
            out["city"] = locality

    if len(parts) >= 3 and parts[2]:
        out["quarter"] = parts[2]

    return out


def _normalize_entry(entry: Mapping[str, Any]) -> Optional[dict[str, Any]]:
    wrapped_item = entry.get("item")
    if isinstance(wrapped_item, Mapping):
        entry_type = str(entry.get("type") or "").strip().upper()
        if entry_type and not entry_type.startswith("EXPOSE"):
            return None
        real = wrapped_item
    else:
        real = entry.get("resultlist.realEstate")
    if not isinstance(real, Mapping):
        real = entry.get("realEstate")
    if not isinstance(real, Mapping):
        real = entry

    listing_id = entry.get("realEstateId")
    if listing_id is None:
        listing_id = real.get("id")
    if listing_id is None:
        listing_id = entry.get("id")
    if listing_id is None:
        return None

    listing_id_int_or_raw = _to_int_or_original(listing_id)
    listing_id_text = str(listing_id).strip()
    if not listing_id_text:
        return None

    address = real.get("address")
    if not isinstance(address, Mapping):
        address = {}
    address_from_line = _parse_address_line(address.get("line"))

    expose_url = (
        entry.get("exposeUrl")
        or real.get("exposeUrl")
        or real.get("url")
        or f"https://www.immobilienscout24.de/expose/{listing_id_text}"
    )

    attrs = _extract_from_attributes(real.get("attributes"))
    price_eur = _price_value(real.get("price")) or attrs["price_eur"]
    living_space = real.get("livingSpace") or real.get("living_space") or attrs["living_space_sqm"]
    rooms = real.get("numberOfRooms") or real.get("rooms") or attrs["rooms"]

    return {
        "source": "immoscout",
        "listing_id": listing_id_int_or_raw,
        "external_id": listing_id_text,
        "expose_url": expose_url,
        "title": real.get("title") or entry.get("title"),
        "price_eur": price_eur,
        "living_space_sqm": living_space,
        "rooms": rooms,
        "postcode": address.get("postcode") or address.get("zip") or address.get("postalCode") or address_from_line["postcode"],
        "city": address.get("city") or address.get("addressLocality") or address_from_line["city"],
        "quarter": address.get("quarter") or address.get("district") or address_from_line["quarter"],
        "street": address.get("street") or address_from_line["street"],
        "house_number": address.get("houseNumber") or address.get("house_number") or address_from_line["house_number"],
        "published_at": entry.get("@publishDate") or entry.get("publishDate") or real.get("published"),
        "modified_at": entry.get("@modification") or entry.get("modification"),
    }


def normalize_mobile_search_payload(payload: Mapping[str, Any]) -> list[dict[str, Any]]:
    """
    Normalize IS24 mobile search payloads into the existing run-service listing contract.
    """
    entries = _extract_entries(payload)
    normalized: list[dict[str, Any]] = []
    for entry in entries:
        item = _normalize_entry(entry)
        if item is not None:
            normalized.append(item)
    return normalized
