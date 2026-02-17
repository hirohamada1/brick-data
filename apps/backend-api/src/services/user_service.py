from __future__ import annotations
# Erlaubt moderne Typ-Hints wie dict[str, Any] und str | None (je nach Python-Version)

import os
import time
import json
from typing import Any

import jwt
import requests
try:
    import psycopg2
    from psycopg2.extras import RealDictCursor
except Exception:  # pragma: no cover
    psycopg2 = None
    RealDictCursor = None

try:
    import psycopg
    from psycopg.rows import dict_row
except Exception:  # pragma: no cover
    psycopg = None
    dict_row = None



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


def _fetch_user_metadata_from_clerk(clerk_user_id: str) -> dict[str, Any]:
    """
    Holt die vollständigen User-Daten (Name, Email) von der Clerk Backend API.
    
    Diese Funktion wird nach erfolgreicher JWT-Verifizierung aufgerufen,
    um Informationen zu erhalten, die nicht im Token enthalten sind.
    """
    secret_key = _get_env("CLERK_SECRET_KEY")
    
    # Clerk Backend API Endpoint
    url = f"https://api.clerk.com/v1/users/{clerk_user_id}"
    
    # Authorization Header mit Secret Key
    headers = {
        "Authorization": f"Bearer {secret_key}",
        "Content-Type": "application/json"
    }
    
    # API Request
    res = requests.get(url, headers=headers, timeout=10)
    res.raise_for_status()  
    
    user_data = res.json()
    
    # Email extrahieren (Clerk gibt eine Liste zurück, wir nehmen die erste)
    email = None
    if user_data.get("email_addresses"):
        # Primäre Email oder erste in der Liste
        for email_obj in user_data["email_addresses"]:
            if email_obj.get("id") == user_data.get("primary_email_address_id"):
                email = email_obj.get("email_address")
                break
        # Fallback: erste Email
        if not email and user_data["email_addresses"]:
            email = user_data["email_addresses"][0].get("email_address")
    
    return {
        "first_name": user_data.get("first_name"),
        "last_name": user_data.get("last_name"),
        "email": email
    }



def _db_conn():

    database_url = _get_env("DATABASE_URL")
    if psycopg2 is not None:
        return psycopg2.connect(database_url)
    if psycopg is not None:
        return psycopg.connect(database_url)
    raise RuntimeError("No postgres driver found. Install psycopg2-binary or psycopg[binary].")


def _db_cursor(conn):
    if psycopg2 is not None and RealDictCursor is not None:
        return conn.cursor(cursor_factory=RealDictCursor)
    if psycopg is not None and dict_row is not None:
        return conn.cursor(row_factory=dict_row)
    return conn.cursor()


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

    # DUAL-MODE STRATEGIE:
    # 1) Erst prüfen, ob User schon in DB existiert (durch Webhook angelegt)
    # 2) Falls NICHT -> API-Call als Fallback (für Legacy-User oder Webhook-Ausfälle)
    
    with _db_conn() as conn:
        with _db_cursor(conn) as cur:
            # Schritt 1: Schauen ob User existiert
            cur.execute(
                "SELECT * FROM public.users WHERE clerk_id = %s",
                (clerk_user_id,)
            )
            existing_user = cur.fetchone()
            
            # Schritt 2a: User existiert bereits (durch Webhook angelegt)
            if existing_user:
                print(f"[ensure_user] User found in DB (webhook): {clerk_user_id}")
                return {"clerk_id": clerk_user_id, "db_row": existing_user}
            
            # Schritt 2b: User existiert NICHT -> API-Fallback
            print(f"[ensure_user] User NOT in DB, fetching from Clerk API (fallback)")
            metadata = _fetch_user_metadata_from_clerk(clerk_user_id)
            
            # In DB eintragen
            cur.execute(
                """
                INSERT INTO public.users (clerk_id, first_name, last_name, email)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (clerk_id)
                DO UPDATE SET 
                    first_name = EXCLUDED.first_name,
                    last_name = EXCLUDED.last_name,
                    email = EXCLUDED.email
                RETURNING *;
                """,
                (
                    clerk_user_id,
                    metadata.get("first_name"),
                    metadata.get("last_name"),
                    metadata.get("email")
                ),
            )
            row = cur.fetchone()

    # 4) Rückgabe an Router
    return {"clerk_id": clerk_user_id, "db_row": row}
