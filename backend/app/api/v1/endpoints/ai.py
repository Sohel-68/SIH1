from fastapi import APIRouter
from app.schemas.common import APIEnvelope

router = APIRouter()


@router.post("/task-contract", response_model=APIEnvelope[dict], summary="AI inference task queue contract")
async def register_ai_task():
    """Foundation contract for async AI footprint and deed OCR inference jobs."""
    return APIEnvelope(message="AI worker task contract ready.", data={"status": "CONTRACT_ACTIVE"})
