from __future__ import annotations
# Ermöglicht moderne Typ-Hinweise (z.B. str | None) auch bei älteren Python-Versionen.

from fastapi import APIRouter, Header, HTTPException
# APIRouter -> Definiert eine Gruppe von API-Routen
# Header -> Ermöglicht das Auslesen von HTTP-Headern (z.B. Authorization)
# HTTPException -> Ermöglicht kontrolliertes Zurückgeben von HTTP-Fehlercodes

from src.services.user_service import ensure_user_from_clerk
# Importiert die Business-Logik.
# WICHTIG: Diese Datei kümmert sich NUR um HTTP, nicht um Datenbank oder JWT-Logik.
# Die eigentliche Verarbeitung passiert im Service-Layer.

# Erstellen eines Routers mit einem Prefix.
# Das bedeutet:
# Alle Endpunkte in dieser Datei beginnen automatisch mit /api/users
# Beispiel: @router.post("/ensure") -> /api/users/ensure
router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("/ensure")
def ensure_user(authorization: str | None = Header(default=None)):
    """
    Endpoint: POST /api/users/ensure

    Erwartet im Header:
    Authorization: Bearer <clerk_jwt>

    Zweck:
    - Wird vom Frontend aufgerufen, sobald ein User eingeloggt ist.
    - Der Clerk-JWT wird an das Backend gesendet.
    - Das Backend validiert den Token.
    - Falls gültig, wird der User in der Datenbank angelegt (oder aktualisiert).
    """

    # Sicherheitsprüfung
    if not authorization or not authorization.startswith("Bearer "):
        # Falls nicht vorhanden oder falsches Format
        # 401 = Unauthorized (nicht authentifiziert)
        raise HTTPException(status_code=401, detail="Missing Bearer token")

    # Extrahiert den tatsächlichen JWT
    token = authorization.split(" ", 1)[1].strip()

    # Übergabe an Service-Layer
    result = ensure_user_from_clerk(token)

    # Rückgabe
    return {"ok": True, "user": result}