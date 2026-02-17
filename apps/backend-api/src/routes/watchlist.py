from __future__ import annotations

from urllib.parse import urlparse
from typing import Any, Dict, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.watchlist_service import create_watchlist


router = APIRouter()


class WatchlistCreateIn(BaseModel):
    name: str
    search_url: str
    defaults: Dict[str, Any]
    # Structured search parameters (optional for backwards compatibility)
    location_label: Optional[str] = None
    location_path: Optional[str] = None
    price_min: Optional[float] = None
    price_max: Optional[float] = None
    area_min: Optional[float] = None
    area_max: Optional[float] = None
    rooms_min: Optional[float] = None
    rooms_max: Optional[float] = None


def _is_valid_url(value: str) -> bool:
    try:
        parsed = urlparse(value)
    except Exception:
        return False
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


@router.post("/api/watchlists")
def post_watchlist(payload: WatchlistCreateIn):
    name = payload.name.strip()
    search_url = payload.search_url.strip()

    if not name:
        raise HTTPException(status_code=400, detail="name must be non-empty")
    if not _is_valid_url(search_url):
        raise HTTPException(status_code=400, detail="search_url must be a valid http(s) URL")

    try:
        watchlist_id = create_watchlist(
            name=name,
            search_url=search_url,
            defaults=payload.defaults,
            location_label=payload.location_label,
            location_path=payload.location_path,
            price_min=payload.price_min,
            price_max=payload.price_max,
            area_min=payload.area_min,
            area_max=payload.area_max,
            rooms_min=payload.rooms_min,
            rooms_max=payload.rooms_max,
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {"id": watchlist_id}
