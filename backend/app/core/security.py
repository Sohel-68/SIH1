from datetime import datetime, timedelta, timezone
from typing import Any, Optional, Union
import jwt
from passlib.context import CryptContext
from app.core.config import settings

# Bcrypt context for government password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain text password against an encrypted hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Computes a bcrypt hash for a given password."""
    return pwd_context.hash(password)


def create_access_token(
    subject: Union[str, Any],
    role: str = "citizen",
    expires_delta: Optional[timedelta] = None
) -> str:
    """Generates a digitally signed JSON Web Token."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "role": role,
        "iss": "GeoStrata-Auth-Engine",
        "iat": datetime.now(timezone.utc)
    }
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> dict:
    """Decodes and validates a JSON Web Token."""
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
