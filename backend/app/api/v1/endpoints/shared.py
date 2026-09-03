from fastapi import APIRouter
from app.schemas.common import APIEnvelope, HealthStatus

router = APIRouter()


@router.get("/health", response_model=APIEnvelope[HealthStatus], summary="System Health Status")
async def health_check():
    """Enterprise health verification for container orchestration."""
    return APIEnvelope(message="GeoStrata engine operational.", data=HealthStatus())
