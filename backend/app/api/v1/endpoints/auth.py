from fastapi import APIRouter, Depends, status
from app.schemas.common import APIEnvelope
from app.schemas.auth import LoginRequest, RegisterUserRequest, TokenResponse

router = APIRouter()


@router.post("/login", response_model=APIEnvelope[TokenResponse], summary="Authenticate user and return JWT")
async def login(credentials: LoginRequest):
    """Production foundation endpoint for user authentication."""
    return APIEnvelope(
        message="Authentication endpoint ready for identity provider integration.",
        data=TokenResponse(access_token="foundation_token_placeholder", expires_in=3600)
    )


@router.post("/register", response_model=APIEnvelope[dict], status_code=status.HTTP_201_CREATED, summary="Register citizen account")
async def register(payload: RegisterUserRequest):
    """Production foundation endpoint for citizen onboarding."""
    return APIEnvelope(message="Registration contract initialized.", data={"status": "registered"})
