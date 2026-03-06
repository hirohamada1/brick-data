from fastapi import Header, HTTPException
from user_service import get_clerk_user_id_from_token, ensure_user_exists

def get_current_user_id(authorization: str = Header(...)):
    try:
        token = authorization.replace("Bearer ", "")
        clerk_id = get_clerk_user_id_from_token(token)
        return ensure_user_exists(clerk_id)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid authentication")
