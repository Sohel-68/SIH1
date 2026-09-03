from fastapi import APIRouter
from app.schemas.common import APIEnvelope

router = APIRouter()


@router.get("/my-properties", response_model=APIEnvelope[list], summary="Fetch Citizen Title Registry")
async def get_citizen_properties():
    """Citizen property title query contract."""
    return APIEnvelope(message="Citizen properties retrieved.", data=[])


@router.get("/applications", response_model=APIEnvelope[list], summary="Citizen land applications")
async def get_citizen_applications():
    """Citizen application status query contract."""
    return APIEnvelope(message="Citizen applications retrieved.", data=[])
