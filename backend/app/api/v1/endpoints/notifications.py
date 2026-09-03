from fastapi import APIRouter
from app.schemas.common import APIEnvelope

router = APIRouter()


@router.get("/unread", response_model=APIEnvelope[list], summary="Fetch unread alerts")
async def get_unread_notifications():
    """Notification queue polling contract."""
    return APIEnvelope(message="Notifications retrieved.", data=[])
