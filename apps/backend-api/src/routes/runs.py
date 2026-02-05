from __future__ import annotations

from fastapi import APIRouter, HTTPException

from services.run_service import create_run, get_latest_run, run_watchlist


router = APIRouter()


@router.post("/api/watchlist/{watchlist_id}/runs")
def start_pipeline_run(watchlist_id: str):
    watchlist_id = watchlist_id.strip()
    if not watchlist_id:
        raise HTTPException(status_code=400, detail="watchlist_id must be non-empty")

    try:
        run_id = create_run(watchlist_id=watchlist_id, status="queued")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    try:
        run_watchlist(watchlist_id=watchlist_id, run_id=run_id)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail={
                "run_id": run_id,
                "status": "failed",
                "error": str(exc),
            },
        ) from exc

    return {"run_id": run_id, "status": "done"}


@router.post("/api/watchlists/{watchlist_id}/runs")
def start_pipeline_run_plural(watchlist_id: str):
    return start_pipeline_run(watchlist_id)


@router.get("/api/watchlists/{watchlist_id}/runs/latest")
def latest_run(watchlist_id: str):
    watchlist_id = watchlist_id.strip()
    if not watchlist_id:
        raise HTTPException(status_code=400, detail="watchlist_id must be non-empty")

    try:
        run = get_latest_run(watchlist_id=watchlist_id)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

    if run is None:
        raise HTTPException(status_code=404, detail="No runs found for watchlist")

    return run
