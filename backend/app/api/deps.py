from typing import Annotated, Generator
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import decode_token
from app.schemas.auth import TokenPayload

security_bearer = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Security(security_bearer)],
) -> TokenPayload:
    """Dependency validating bearer JWT and returning authenticated TokenPayload."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided."
        )
    try:
        payload_data = decode_token(credentials.credentials)
        return TokenPayload(**payload_data)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token."
        )


def require_role(allowed_roles: list[str]):
    """Role-Based Access Control (RBAC) dependency factory."""
    async def role_checker(
        current_user: Annotated[TokenPayload, Depends(get_current_user)]
    ) -> TokenPayload:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation requires one of the following roles: {allowed_roles}"
            )
        return current_user
    return role_checker
