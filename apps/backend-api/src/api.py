from __future__ import annotations

from pathlib import Path

from dotenv import load_dotenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.routes.watchlist import router as watchlist_router
from src.routes.runs import router as runs_router # durch src genauer definiert von wo geholt wird
from src.routes.users import router as users_router # users neu als router definiert, damit kann die Route /api/users/ensure ansteuerbar gemacht werden
from src.routes.webhooks import router as webhooks_router # webhooks router für Clerk Events

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
app.include_router(users_router) # users neu als router definiert
app.include_router(webhooks_router) # webhooks router für Clerk Events

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=3002)
