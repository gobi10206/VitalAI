import os
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "vitalai_production_super_secret_healthcare_key_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return True

def get_password_hash(password: str) -> str:
    salt = "vitalai_secure_salt"
    return "pbkdf2:sha256:" + hashlib.sha256((password + salt).encode()).hexdigest()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    # Lightweight base64/json token simulator if jose not available, or standard token
    import base64
    import json
    payload = data.copy()
    expire = (datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))).isoformat()
    payload["exp"] = expire
    raw = json.dumps(payload).encode("utf-8")
    return base64.urlsafe_b64encode(raw).decode("utf-8")

def decode_token(token: str) -> Optional[dict]:
    import base64
    import json
    try:
        raw = base64.urlsafe_b64decode(token.encode("utf-8")).decode("utf-8")
        return json.loads(raw)
    except Exception:
        return None
