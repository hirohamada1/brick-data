from __future__ import annotations

from typing import Any, Dict

TRACKED_FIELDS = (
    "price_eur",
    "living_space_sqm",
    "title",
    "postcode",
    "city",
    "quarter",
    "street",
    "house_number",
)


def compute_deltas(previous: dict[int, dict], current: list[dict]) -> dict:
    previous = previous or {}
    current_by_id: Dict[int, dict] = {}

    for listing in current or []:
        listing_id = _safe_listing_id(listing.get("listing_id"))
        if listing_id is None:
            continue
        normalized = dict(listing)
        normalized["listing_id"] = listing_id
        current_by_id[listing_id] = normalized

    new_listings: list[dict] = []
    updated_listings: list[dict] = []

    for listing_id in sorted(current_by_id.keys()):
        current_listing = current_by_id[listing_id]
        previous_listing = previous.get(listing_id)

        if previous_listing is None:
            new_listings.append(current_listing)
            continue

        changes: Dict[str, Dict[str, Any]] = {}
        for field in TRACKED_FIELDS:
            old_value = previous_listing.get(field)
            new_value = current_listing.get(field)
            if old_value != new_value:
                changes[field] = {"previous": old_value, "current": new_value}

        if changes:
            updated_listings.append(
                {
                    "listing_id": listing_id,
                    "changes": changes,
                    "current": current_listing,
                }
            )

    removed_listing_ids = sorted([listing_id for listing_id in previous.keys() if listing_id not in current_by_id])

    return {
        "new_listings": new_listings,
        "updated_listings": updated_listings,
        "removed_listing_ids": removed_listing_ids,
    }


def _safe_listing_id(value: Any) -> int | None:
    if value is None:
        return None
    if isinstance(value, bool):
        return None
    try:
        return int(value)
    except Exception:
        return None
