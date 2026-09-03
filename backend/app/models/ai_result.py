import uuid
from typing import Optional
from sqlalchemy import Float, Index, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class AIResult(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    AI Spatial & Document Analysis Output Registry.
    Stores ML footprint matching, vertical height reconstruction, and deed OCR outputs.
    """
    __tablename__ = "ai_results"

    task_type: Mapped[str] = mapped_column(String(32), index=True, nullable=False)  # FOOTPRINT_EXTRACTION, HEIGHT_ESTIMATION, DEED_OCR
    target_entity_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True, nullable=False)
    model_version: Mapped[str] = mapped_column(String(32), nullable=False)

    confidence_score: Mapped[float] = mapped_column(Float, nullable=False)  # 0.0 - 1.0
    status: Mapped[str] = mapped_column(String(24), default="COMPLETED")  # QUEUED, PROCESSING, COMPLETED, FAILED

    # Raw Inference Output and Feature Boundaries
    inference_output: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    discrepancy_detected: Mapped[bool] = mapped_column(default=False, nullable=False)
    discrepancy_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    __table_args__ = (
        Index("idx_ai_task_target", "task_type", "target_entity_id"),
    )
