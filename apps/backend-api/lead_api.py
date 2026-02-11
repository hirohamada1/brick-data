"""
Lead-API für BrickData: POST /api/lead speichert Anfragen in data/leads.json.
Laufend mit: uvicorn lead_api:app --port 3001 --reload
"""
import os
import json
import psycopg
from pathlib import Path
from datetime import datetime, timezone
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Load env from root
ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env")
load_dotenv(ROOT_DIR / ".env.local", override=True)

APP_DIR = Path(__file__).resolve().parent
DATA_DIR = APP_DIR / "data"
LEADS_FILE = DATA_DIR / "leads.json"
USERS_FILE = DATA_DIR / "users.json"


class LeadIn(BaseModel):
    name: str
    email: str
    zweck: str
    region: str | None = None

class UserIn(BaseModel):
    clerk_id: str
    email: str | None = None
    first_name: str | None = None
    last_name: str | None = None


app = FastAPI(title="BrickData Lead API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)


def _ensure_data_dir() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)


def _read_json(file_path: Path) -> list[dict]:
    _ensure_data_dir()
    if not file_path.exists():
        return []
    try:
        text = file_path.read_text(encoding="utf-8")
        return json.loads(text) if text.strip() else []
    except (json.JSONDecodeError, OSError):
        return []

def _write_json(file_path: Path, data: list[dict]) -> None:
    _ensure_data_dir()
    file_path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


@app.post("/api/lead")
def post_lead(lead: LeadIn):
    lead_dict = {
        "name": lead.name.strip(),
        "email": lead.email.strip(),
        "zweck": lead.zweck.strip(),
        "region": lead.region.strip() if lead.region else None,
        "createdAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }
    leads = _read_json(LEADS_FILE)
    leads.append(lead_dict)
    _write_json(LEADS_FILE, leads)
    return {"ok": True}

@app.post("/api/sync-user")
def sync_user(user: UserIn):
    # 1. Save to JSON (Backup/Dev)
    users = _read_json(USERS_FILE)
    existing = next((u for u in users if u.get("clerk_id") == user.clerk_id), None)
    
    user_data = user.dict()
    user_data["updatedAt"] = datetime.now(timezone.utc).isoformat()
    
    if existing:
        existing.update(user_data)
    else:
        user_data["createdAt"] = datetime.now(timezone.utc).isoformat()
        users.append(user_data)
    
    _write_json(USERS_FILE, users)
    
    # 2. Sync to DB if available
    db_url = os.getenv("DATABASE_URL")
    if db_url:
        try:
            with psycopg.connect(db_url) as conn:
                with conn.cursor() as cur:
                    # Upsert using clerk_id as key
                    cur.execute("""
                        INSERT INTO users (clerk_id, email, first_name, last_name)
                        VALUES (%s, %s, %s, %s)
                        ON CONFLICT (clerk_id) DO UPDATE 
                        SET email = EXCLUDED.email,
                            first_name = EXCLUDED.first_name,
                            last_name = EXCLUDED.last_name,
                            updated_at = NOW();
                    """, (user.clerk_id, user.email, user.first_name, user.last_name))
                conn.commit()
                print(f"Synced user {user.clerk_id} to DB")
        except Exception as e:
            print(f"DB Sync failed: {e}")
            # Do not fail logic, as JSON fallback worked
            
    return {"ok": True}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
