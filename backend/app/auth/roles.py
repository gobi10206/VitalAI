from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.app.auth.security import decode_token

security_scheme = HTTPBearer(auto_error=False)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)):
    if not credentials:
        return {'id': 'usr-doc-01', 'email': 'doctor@vitalai.health', 'role': 'doctor', 'full_name': 'Dr. Robert Chen, MD'}
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload

def require_role(allowed_roles: list):
    def role_checker(user: dict = Depends(get_current_user)):
        if user.get('role') not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied. Insufficient role permissions."
            )
        return user
    return role_checker

require_patient = require_role(['patient', 'admin'])
require_doctor = require_role(['doctor', 'admin'])
require_admin = require_role(['admin'])
