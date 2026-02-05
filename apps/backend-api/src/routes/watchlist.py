from __future__ import annotations

from urllib.parse import urlparse
from typing import Any, Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from services.watchlist_service import create_watchlist


router = APIRouter()


class WatchlistCreateIn(BaseModel):
    name: str
    search_url: str
    defaults: Dict[str, Any]


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
        watchlist_id = create_watchlist(name=name, search_url=search_url, defaults=payload.defaults)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    return {"id": watchlist_id}
