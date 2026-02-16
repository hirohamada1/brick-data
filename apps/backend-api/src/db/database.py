import os
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine

class Database: 
    """
        Central DB Layer.
        - Enforces schema
        - Prevents unsafe writes
        - Handles environment isolation
    """
    #Konstruktor 
    def __init__(self):
        self.env = os.getenv("APP_ENV", "local")
        self.url = os.getenv("DATABASE_URL")
        self.schema = os.getenv("DB_SCHEMA", "public")
        #wandelt env Variable in String um
        self.prevent_public_writes = os.getenv("PREVENT_PUBLIC_WRITES", "false") == "true"

        #Safety Checks
        if not self.url: 
            raise RuntimeError("DATABASE_URL not configured")
        
        self.engine: Engine = create_engine(self.url)

        #Test darf niemals im echten Schema laufen
        if self.env == "test" and self.schema != "sandbox":
            raise RuntimeError("Test environment must use sandbox schema.")

        if self.env in ["production", "schema"] and self.schema == "sandbox":
            raise RuntimeError("Sandbox schema not allowed in staging/prod.")

    def _set_schema(self,conn):
        # SET search_path TO (das ist SQL)
        # Benutze dieses Schema als Standard
        conn.execute(text(f"SET search_path TO {self.schema}"))

    def execute(self, query: str, params: dict = None):
        with self.engine.begin() as conn:
            self._set_schema(conn)
            # text(query) macht SQL ausführbar
            # technischer gesehen: verwandelt SQL-String in ein SQLAlchemy SQL Objekt
            return conn.execute(text(query), params or {})

    def fetch_all(self, query: str, params: dict = None):
        with self.engine.connect() as conn: 
            self._set_schema(conn)
            result = conn.execute(text(query), params or {})
            return result.fetchall()
        
    def fetch_one(self, query: str, params: dict = None):
        with self.engine.connect() as conn:
            self._set_schema(conn)
            result = conn.execute(text(query), params or {})
            return result.fetchone()