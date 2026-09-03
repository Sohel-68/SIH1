import uuid
from typing import Optional
from sqlalchemy import Index, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Notification(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    Multi-channel Citizen and Officer Notification Record.
    """
    __tablename__ = "notifications"

    recipient_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True, nullable=False)
    channel: Mapped[str] = mapped_column(String(16), default="IN_APP")  # IN_APP, SMS, EMAIL, PUSH
    notification_type: Mapped[str] = mapped_column(String(32), nullable=False)  # SURVEY_SCHEDULED, ULPIN_ISSUED, DEED_VERIFIED

    title: Mapped[str] = mapped_column(String(256), nullable=False)
    message: Mapped[Text] = mapped_column(Text, nullable=False)
    payload: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)

    status: Mapped[str] = mapped_column(String(16), default="PENDING")  # PENDING, SENT, DELIVERED, READ, FAILED
    read_at: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)

    __table_args__ = (
        Index("idx_notification_user_status", "recipient_id", "status"),
    )
