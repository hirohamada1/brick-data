from __future__ import annotations

from pathlib import Path

from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.watchlist import router as watchlist_router
from routes.runs import router as runs_router

ENV_PATH = Path(__file__).resolve().parents[3] / ".env.local"
load_dotenv(ENV_PATH)

app = FastAPI(title="Immo Scan Backend API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(watchlist_router)
app.include_router(runs_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=3001)
