"""
Lead-API für BrickData: POST /api/lead speichert Anfragen in data/leads.json.
Laufend mit: uvicorn lead_api:app --port 3001 --reload
"""
from pathlib import Path
import json
from datetime import datetime, timezone
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

APP_DIR = Path(__file__).resolve().parent
DATA_DIR = APP_DIR / "data"
LEADS_FILE = DATA_DIR / "leads.json"


class LeadIn(BaseModel):
    name: str
    email: str
    zweck: str
    region: str | None = None


app = FastAPI(title="BrickData Lead API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


def _ensure_data_dir() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def _read_leads() -> list[dict]:
    _ensure_data_dir()
    if not LEADS_FILE.exists():
        return []
    try:
        text = LEADS_FILE.read_text(encoding="utf-8")
        return json.loads(text) if text.strip() else []
    except (json.JSONDecodeError, OSError):
        return []


def _write_leads(leads: list[dict]) -> None:
    _ensure_data_dir()
    LEADS_FILE.write_text(json.dumps(leads, indent=2, ensure_ascii=False), encoding="utf-8")


@app.post("/api/lead")
def post_lead(lead: LeadIn):
    lead_dict = {
        "name": lead.name.strip(),
        "email": lead.email.strip(),
        "zweck": lead.zweck.strip(),
        "region": lead.region.strip() if lead.region else None,
        "createdAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }
    leads = _read_leads()
    leads.append(lead_dict)
    _write_leads(leads)
    return {"ok": True}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
