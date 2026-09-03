from fastapi import APIRouter
from app.schemas.common import APIEnvelope

router = APIRouter()


@router.get("/zone-metrics/{zone}", response_model=APIEnvelope[dict], summary="Query FSI and vertical density metrics")
async def get_zone_metrics(zone: str):
    """Volumetric density and FSI metrics."""
    return APIEnvelope(message="Zone metrics retrieved.", data={"zone": zone, "avg_fsi": 2.5})
