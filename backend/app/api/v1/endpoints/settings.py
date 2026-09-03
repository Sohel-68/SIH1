from fastapi import APIRouter
from app.schemas.common import APIEnvelope

router = APIRouter()


@router.get("/spatial-parameters", response_model=APIEnvelope[dict], summary="Get system Spatial Reference System config")
async def get_spatial_settings():
    """Spatial coordinate reference system (CRS) parameters."""
    return APIEnvelope(
        message="Spatial configuration parameters retrieved.",
        data={"default_srid": 4326, "vertical_datum": "AMSL_METERS", "projected_srid": 3857}
    )
