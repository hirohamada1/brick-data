import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[3]
ENV = os.getenv("APP_ENV", "local")

ENV_FILE_MAP = {
    "local": ".env.local",
    "staging": ".env.staging",
    "prod": ".env.prod",
    "test": ".env.test",
}

env_file = BASE_DIR / ENV_FILE_MAP.get(ENV, ".env.local")
load_dotenv(env_file)

print(f"Loaded ENV file: {env_file}")

class Settings:
    def __init__(self):
        self.database_url = os.getenv("DATABASE_URL", "").strip()
        self.watchlist_schema = (
            os.getenv("WATCHLIST_SCHEMA", "sandbox").strip() or "sandbox"
        )

settings = Settings()
