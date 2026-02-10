from __future__ import annotations

from fastapi import APIRouter, HTTPException

from services.run_service import create_run, get_latest_run, run_watchlist

import threading

from services.run_service import from_env


router = APIRouter()

def _run_watchlist_background(watchlist_id: str, run_id: str):
    print("BACKGROUND THREAD STARTED", watchlist_id, run_id)

    print("ABOUT TO CALL from_env()")
    svc = from_env()
    print("from_env() RETURNED", svc)

    try:
        svc.run_watchlist(watchlist_id, run_id)
    except Exception as exc:
        print("BACKGROUND THREAD CRASHED:", exc)


@router.post("/api/watchlists/{watchlist_id}/runs")
def start_pipeline_run(watchlist_id: str):
    print("STEP A: /runs endpoint called", watchlist_id)

    watchlist_id = watchlist_id.strip()
    if not watchlist_id:
        raise HTTPException(status_code=400, detail="watchlist_id must be non-empty")

    run_id = create_run(watchlist_id=watchlist_id, status="queued")
    print("STEP A: run row created", run_id)

    threading.Thread(
        target=_run_watchlist_background,
        args=(watchlist_id, run_id),
        daemon=True,
    ).start()
    print("STEP A: background thread dispatched", run_id)

    return {"run_id": run_id, "status": "queued"}



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
