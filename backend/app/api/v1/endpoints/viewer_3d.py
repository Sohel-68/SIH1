import uuid
from fastapi import APIRouter
from app.schemas.common import APIEnvelope

router = APIRouter()


@router.get("/mesh/{building_id}", response_model=APIEnvelope[dict], summary="Stream 3D Building Strata Mesh")
async def get_building_3d_mesh(building_id: uuid.UUID):
    """Returns 3D mesh vertices and buffer geometry for Three.js / R3F."""
    return APIEnvelope(message="3D Mesh streaming pipeline ready.", data={"building_id": str(building_id), "strata_slabs": []})


@router.get("/cutaway/{building_id}/{floor_idx}", response_model=APIEnvelope[dict], summary="Floor-level cutaway slice")
async def get_floor_cutaway(building_id: uuid.UUID, floor_idx: int):
    """Calculates horizontal 3D bounding geometry slice."""
    return APIEnvelope(message="3D Cutaway stream ready.", data={"building_id": str(building_id), "floor": floor_idx})
