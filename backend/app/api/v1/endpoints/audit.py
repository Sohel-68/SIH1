from fastapi import APIRouter
from app.schemas.common import APIEnvelope

router = APIRouter()


@router.get("/trail", response_model=APIEnvelope[list], summary="Query immutable audit trail")
async def get_audit_trail(entity_name: str, entity_id: str):
    """Immutable audit trail query contract."""
    return APIEnvelope(message="Audit trail records retrieved.", data=[])
