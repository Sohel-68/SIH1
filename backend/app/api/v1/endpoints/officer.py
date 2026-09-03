from fastapi import APIRouter
from app.schemas.common import APIEnvelope

router = APIRouter()


@router.get("/pending-approvals", response_model=APIEnvelope[list], summary="Pending cadastral approvals")
async def get_pending_approvals():
    """Government officer pending approvals contract."""
    return APIEnvelope(message="Pending approvals retrieved.", data=[])


@router.post("/approve/{id}", response_model=APIEnvelope[dict], summary="Approve survey or deed")
async def approve_record(id: str):
    """Officer verification sign-off contract."""
    return APIEnvelope(message=f"Record {id} approved successfully.", data={"id": id, "status": "APPROVED"})
