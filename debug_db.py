import os
import psycopg
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent
load_dotenv(ROOT_DIR / ".env.local")

db_url = os.getenv("DATABASE_URL")
print(f"Checking DB: {db_url}")

try:
    with psycopg.connect(db_url) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';")
            tables = cur.fetchall()
            print(f"Tables: {tables}")
            
            # Check watchlists schema
            cur.execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'watchlists';")
            cols = cur.fetchall()
            print(f"Watchlists Columns: {cols}")
            
            # Check watchlists data
            cur.execute("SELECT * FROM watchlists;")
            w_rows = cur.fetchall()
            print(f"Watchlists in DB: {len(w_rows)}")
            for r in w_rows:
                print(r)
except Exception as e:
    print(f"Error: {e}")
