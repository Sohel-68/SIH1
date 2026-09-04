from fastapi import APIRouter
from app.schemas.common import APIEnvelope

api_v2_router = APIRouter()


router_stub = APIRouter()
@router_stub.get("/spec", response_model=APIEnvelope[dict], summary="API v2 Specification & Microservices Gateway")
async def get_v2_spec():
    """
    API v2 Foundation Spec.
    Architectural bridge prepared for future decentralized microservice extraction
    and GraphQL federation.
    """
    return APIEnvelope(
        message="GeoStrata API v2 forward-compatible gateway operational.",
        data={
            "version": "2.0.0-alpha",
            "architecture": "Decentralized Domain Microservices Ready",
            "federation": "Apollo / gRPC compatible"
        }
    )

api_v2_router.include_router(router_stub, prefix="/gateway", tags=["v2 Gateway"])
