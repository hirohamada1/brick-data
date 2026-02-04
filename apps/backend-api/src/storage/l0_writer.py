# storage/l0_writer.py
from __future__ import annotations

import os
import json
import hashlib
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, Optional, Tuple

# psycopg2 (most common) OR psycopg (v3)
try:
    import psycopg2
    from psycopg2.extras import Json as PgJson
    _PSYCOPG_FLAVOR = "psycopg2"
except Exception:  # pragma: no cover
    psycopg2 = None
    PgJson = None
    _PSYCOPG_FLAVOR = "psycopg3"

try:
    import psycopg  # type: ignore
except Exception:  # pragma: no cover
    psycopg = None


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _stable_json(obj: Any) -> str:
    """
    Stable, deterministic JSON string for hashing/dedupe.
    """
    return json.dumps(obj, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def compute_raw_hash(raw: Dict[str, Any]) -> str:
    payload = _stable_json(raw).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


@dataclass(frozen=True)
class L0InsertResult:
    inserted: bool
    id: Optional[str] = None
    raw_hash: Optional[str] = None


@dataclass(frozen=True)
class L0Writer:
    """
    Writes L0 rows to Postgres table `l0_expose_raw`.

    - One row per (source, external_id)
    - Stores the *mapped* record as JSONB under `raw`
    """
    database_url: str
    table: str = "l0_expose_raw"
    parser_version: str = "immoscout_expose_scraper_v1"

    def insert_expose(self, *, expose: Dict[str, Any], scraped_at: Optional[datetime] = None) -> L0InsertResult:
        """
        expose: your mapped dict like:
          {'source': 'immoscout', 'external_id': '...', 'url': '...', ...}
        """
        source = str(expose.get("source") or "")
        external_id = str(expose.get("external_id") or "")
        url = str(expose.get("url") or "")

        if not source or not external_id or not url:
            raise ValueError("expose must include non-empty: source, external_id, url")

        raw_hash = compute_raw_hash(expose)
        scraped_at = scraped_at or _utc_now()

        sql = f"""
            insert into {self.table}
                (source, external_id, url, scraped_at, raw, raw_hash, parser_version)
            values
                (%s, %s, %s, %s, %s, %s, %s)
            on conflict (source, external_id) do update set
                url = excluded.url,
                scraped_at = excluded.scraped_at,
                raw = excluded.raw,
                raw_hash = excluded.raw_hash,
                parser_version = excluded.parser_version
            returning id;
        """

        # --- psycopg2 ---
        if psycopg2 is not None and PgJson is not None:
            with psycopg2.connect(self.database_url) as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        sql,
                        (
                            source,
                            external_id,
                            url,
                            scraped_at,
                            PgJson(expose),
                            raw_hash,
                            self.parser_version,
                        ),
                    )
                    row = cur.fetchone()
                    # commit handled by context manager
                    if row and row[0]:
                        return L0InsertResult(inserted=True, id=str(row[0]), raw_hash=raw_hash)
                    return L0InsertResult(inserted=False, id=None, raw_hash=raw_hash)

        # --- psycopg v3 fallback ---
        if psycopg is None:
            raise RuntimeError(
                "No postgres driver found. Install one of:\n"
                "  pip install psycopg2-binary\n"
                "or\n"
                "  pip install psycopg[binary]\n"
            )

        with psycopg.connect(self.database_url) as conn:  # type: ignore
            with conn.cursor() as cur:
                cur.execute(
                    sql,
                    (
                        source,
                        external_id,
                        url,
                        scraped_at,
                        json.dumps(expose, ensure_ascii=False),
                        raw_hash,
                        self.parser_version,
                    ),
                )
                row = cur.fetchone()
                conn.commit()
                if row and row[0]:
                    return L0InsertResult(inserted=True, id=str(row[0]), raw_hash=raw_hash)
                return L0InsertResult(inserted=False, id=None, raw_hash=raw_hash)


def from_env(
    *,
    env_key: str = "DATABASE_URL",
    table: str = "l0_expose_raw",
    parser_version: str = "immoscout_expose_scraper_v1",
) -> L0Writer:
    db_url = os.getenv(env_key)
    if not db_url:
        raise RuntimeError(f"{env_key} not set")
    return L0Writer(database_url=db_url, table=table, parser_version=parser_version)
