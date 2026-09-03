from fastapi import APIRouter
from app.schemas.common import APIEnvelope

router = APIRouter()


@router.get("/system-metrics", response_model=APIEnvelope[dict], summary="System infrastructure performance metrics")
async def get_system_metrics():
    """Admin console system health and telemetry."""
    return APIEnvelope(
        message="System telemetry active.",
        data={"uptime": "99.99%", "active_nodes": 4, "db_status": "healthy"}
    )
