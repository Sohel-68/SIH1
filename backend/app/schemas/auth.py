import uuid
from typing import Optional
from pydantic import BaseModel, EmailStr


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    refresh_token: Optional[str] = None


class TokenPayload(BaseModel):
    sub: str
    role: str
    exp: int
    iss: str


class LoginRequest(BaseModel):
    username_or_email: str
    password: str


class RegisterUserRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: str = "citizen"  # citizen, surveyor, officer, admin
