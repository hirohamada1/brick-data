from __future__ import annotations

import os
from fastapi import APIRouter, Request, HTTPException
from svix.webhooks import Webhook, WebhookVerificationError


router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])


@router.post("/clerk")
async def clerk_webhook(request: Request):
    """
    Empfängt Webhook-Events von Clerk für User-Änderungen.
    
    Clerk sendet Events bei:
    - user.created: Neuer User registriert sich
    - user.updated: User ändert Name, Email, etc.
    - user.deleted: User löscht Account
    
    Sicherheit: Clerk signiert alle Webhooks mit Svix.
    Wir verifizieren die Signatur, bevor wir das Event verarbeiten.
    """
    
    # 1) Webhook Secret aus Environment holen
    webhook_secret = os.getenv("CLERK_WEBHOOK_SECRET")
    if not webhook_secret:
        raise HTTPException(
            status_code=500, 
            detail="CLERK_WEBHOOK_SECRET not configured"
        )
    
    # 2) Svix-Header extrahieren (für Signatur-Verifizierung)
    svix_id = request.headers.get("svix-id")
    svix_timestamp = request.headers.get("svix-timestamp")
    svix_signature = request.headers.get("svix-signature")
    
    if not all([svix_id, svix_timestamp, svix_signature]):
        raise HTTPException(
            status_code=400, 
            detail="Missing svix headers"
        )
    
    # 3) Request Body lesen
    body_bytes = await request.body()
    
    # 4) Signatur verifizieren
    wh = Webhook(webhook_secret)
    try:
        payload = wh.verify(body_bytes, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        })
    except WebhookVerificationError as e:
        print(f"[webhook] Invalid signature: {e}")
        raise HTTPException(
            status_code=400, 
            detail="Invalid webhook signature"
        )
    
    # 5) Event-Typ auswerten und entsprechende Handler aufrufen
    event_type = payload.get("type")
    user_data = payload.get("data")
    
    print(f"[webhook] Received event: {event_type}")
    
    if event_type == "user.created":
        from src.services.webhook_service import handle_user_created
        handle_user_created(user_data)
    
    elif event_type == "user.updated":
        from src.services.webhook_service import handle_user_updated
        handle_user_updated(user_data)
    
    elif event_type == "user.deleted":
        from src.services.webhook_service import handle_user_deleted
        handle_user_deleted(user_data)
    
    else:
        print(f"[webhook] Unhandled event type: {event_type}")
    
    return {"ok": True}
