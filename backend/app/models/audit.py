import uuid
from typing import Optional
from sqlalchemy import Index, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class AuditLog(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    Immutable Government Audit Trail Ledger.
    Tracks every transaction, title transfer, and spatial modification
    with cryptographic tamper-evident signatures.
    """
    __tablename__ = "audit_logs"

    # Action & Domain
    action: Mapped[str] = mapped_column(String(64), index=True, nullable=False)  # CREATE_ULPIN, TRANSFER_TITLE, APPROVE_SURVEY
    entity_name: Mapped[str] = mapped_column(String(64), index=True, nullable=False)  # LandParcel, StrataUnit, Owner
    entity_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)

    # Actor Metadata
    actor_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True, nullable=False)
    actor_role: Mapped[str] = mapped_column(String(32), nullable=False)
    ip_address: Mapped[str] = mapped_column(String(45), nullable=False)
    user_agent: Mapped[str] = mapped_column(Text, nullable=False)

    # State Diffs
    state_before: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    state_after: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Cryptographic Hash / HMAC of the record for immutability verification
    record_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    correlation_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)

    __table_args__ = (
        Index("idx_audit_actor_action", "actor_id", "action"),
        Index("idx_audit_entity", "entity_name", "entity_id"),
    )
