from __future__ import annotations

import os
from typing import Any

import psycopg2
from psycopg2.extras import RealDictCursor


def _get_env(name: str) -> str:
    """Helper zum Lesen von Umgebungsvariablen."""
    v = os.getenv(name)
    if not v:
        raise RuntimeError(f"Missing env var: {name}")
    return v


def _db_conn():
    """Erstellt eine Datenbankverbindung."""
    database_url = _get_env("DATABASE_URL")
    return psycopg2.connect(database_url)


def handle_user_created(user_data: dict[str, Any]) -> None:
    """
    Wird aufgerufen, wenn Clerk einen neuen User anlegt.
    Erstellt oder aktualisiert den User in der Supabase-Datenbank.
    
    Args:
        user_data: Die User-Daten von Clerk (aus dem Webhook-Event)
    """
    clerk_id = user_data.get("id")
    first_name = user_data.get("first_name")
    last_name = user_data.get("last_name")
    
    # Email extrahieren (Clerk gibt eine Liste zurück)
    email = None
    if user_data.get("email_addresses"):
        # Primäre Email finden
        for email_obj in user_data["email_addresses"]:
            if email_obj.get("id") == user_data.get("primary_email_address_id"):
                email = email_obj.get("email_address")
                break
        # Fallback: Erste Email in der Liste
        if not email and user_data["email_addresses"]:
            email = user_data["email_addresses"][0].get("email_address")
    
    print(f"[webhook] Processing user.created: {clerk_id} ({first_name} {last_name})")
    
    # DB Upsert
    with _db_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
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
                (clerk_id, first_name, last_name, email),
            )
            row = cur.fetchone()
            print(f"[webhook] User synced to DB: ID={row['id']}, clerk_id={clerk_id}")


def handle_user_updated(user_data: dict[str, Any]) -> None:
    """
    Wird aufgerufen, wenn ein User seine Daten ändert (z.B. neuer Name).
    Nutzt die gleiche Logik wie user.created (Upsert überschreibt).
    
    Args:
        user_data: Die aktualisierten User-Daten von Clerk
    """
    print(f"[webhook] Processing user.updated: {user_data.get('id')}")
    handle_user_created(user_data)


def handle_user_deleted(user_data: dict[str, Any]) -> None:
    """
    Wird aufgerufen, wenn ein User sein Konto löscht.
    
    WICHTIG: Aktuell Hard Delete. Für Production könnte man auch
    Soft Delete (deleted_at timestamp) oder Daten behalten (für Analytics).
    
    Args:
        user_data: Die User-Daten des gelöschten Accounts
    """
    clerk_id = user_data.get("id")
    
    print(f"[webhook] Processing user.deleted: {clerk_id}")
    
    with _db_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "DELETE FROM public.users WHERE clerk_id = %s",
                (clerk_id,)
            )
            print(f"[webhook] User deleted from DB: clerk_id={clerk_id}")
