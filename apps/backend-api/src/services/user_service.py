from __future__ import annotations
# Erlaubt moderne Typ-Hints wie dict[str, Any] und str | None (je nach Python-Version)

import os
import time
import json
from typing import Any

import jwt
import requests
import psycopg2
from psycopg2.extras import RealDictCursor



# ============================================================
# ZIEL DIESES FILES
# ============================================================
# Dieses File enthält die "Business-Logik" für:
# 1) Clerk JWT vom Frontend entgegennehmen
# 2) Token validieren (ist der User wirklich eingeloggt?)
# 3) Clerk User ID (sub) aus dem Token ziehen
# 4) User in Supabase/Postgres Tabelle public.users upserten
# ============================================================



# Speicher für die JWKS (JSON Web Key Set)
# 
_JWKS_CACHE: dict[str, Any] | None = None      # Speichert die JWKS-JSON (keys etc.)
_JWKS_CACHE_TS: float = 0.0                   # Timestamp, wann der Cache geladen wurde
_JWKS_CACHE_TTL_SECONDS = 60 * 10             # 10 Minuten Cache-Lifetime

#Kleine Helper-Funktion: liest ENV Variable
#wenn nicht vorhanden -> sofort Fehler werfen
#Warum? Damit du nicht "silent" mit None/"" weiterläufst,
#denn das führt zu schwer debugbaren Fehlern.
def _get_env(name: str) -> str:

    v = os.getenv(name)
    if not v:
        raise RuntimeError(f"Missing env var: {name}")
    return v


def _get_jwks() -> dict[str, Any]:
    #Lädt das JWKS von Clerk (öffentliche Keys) und cached es.

    
    # Wenn Cache existiert und nicht abgelaufen -> Cache zurückgeben
    # Sonst: JWKS URL aus ENV ziehen, per HTTP holen, JSON speicher
    global _JWKS_CACHE, _JWKS_CACHE_TS

    # Cache-Check: Existiert Cache + noch gültig?
    if _JWKS_CACHE and (time.time() - _JWKS_CACHE_TS) < _JWKS_CACHE_TTL_SECONDS:
        return _JWKS_CACHE

    # JWKS Endpoint von Clerk (kommt aus ENV)
    # Beispiel: https://<dein-instance>.accounts.dev/.well-known/jwks.json
    jwks_url = _get_env("CLERK_JWKS_URL")

    # HTTP Request an Clerk
    res = requests.get(jwks_url, timeout=10)
    res.raise_for_status()  # wirft Exception falls 4xx/5xx

    # JSON parsen und Cache setzen
    _JWKS_CACHE = res.json()
    _JWKS_CACHE_TS = time.time()

    return _JWKS_CACHE


def _verify_clerk_jwt(token: str) -> dict[str, Any]:

    issuer = _get_env("CLERK_ISSUER")  
    jwks = _get_jwks()

    
    unverified_header = jwt.get_unverified_header(token)

    kid = unverified_header.get("kid")
    if not kid:
        raise ValueError("JWT header missing kid")

    key = None
    for k in jwks.get("keys", []):
        if k.get("kid") == kid:
            key = k
            break

    if not key:
        raise ValueError("No matching JWKS key for kid")

    public_key = jwt.algorithms.RSAAlgorithm.from_jwk(json.dumps(key))

   
    payload = jwt.decode(
        token,
        public_key,
        algorithms=["RS256"],
        issuer=issuer,
        options={"verify_aud": False},
    )

 
    return payload



def _db_conn():

    database_url = _get_env("DATABASE_URL")
    return psycopg2.connect(database_url)


def ensure_user_from_clerk(clerk_jwt: str) -> dict[str, Any]:
    
   

    # TEMP DEBUG: Token ohne Signaturprüfung lesen (nur zum Issuer rausholen)
    unverified = jwt.decode(clerk_jwt, options={"verify_signature": False})
    print("[DEBUG jwt iss]", unverified.get("iss"))
    print("[DEBUG jwt sub]", unverified.get("sub"))

    payload = _verify_clerk_jwt(clerk_jwt)
    ...
   
    # 1) JWT prüfen + payload holen
    payload = _verify_clerk_jwt(clerk_jwt)

    # 2) Clerk user id steht im Standard-Claim "sub"
    clerk_user_id = payload.get("sub")
    if not clerk_user_id:
        raise ValueError("JWT payload missing sub")

    # Hinweis:
    # Email ist im JWT oft NICHT drin.
    # Für MVP reicht: clerk_id speichern.
    # Später kannst du:
    # - Clerk Backend API callen um Email/Name zu holen
    # - oder Webhooks nutzen (production standard)

    # 3) DB Upsert ausführen
    with _db_conn() as conn:
        # RealDictCursor macht aus rows dicts statt tuples
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                INSERT INTO public.users (clerk_id)
                VALUES (%s)
                ON CONFLICT (clerk_id)
                DO UPDATE SET clerk_id = EXCLUDED.clerk_id
                RETURNING *;
                """,
                (clerk_user_id,),
            )
            row = cur.fetchone()

    # 4) Rückgabe an Router
    return {"clerk_id": clerk_user_id, "db_row": row}