import uuid
from typing import TYPE_CHECKING, Optional
from sqlalchemy import Float, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.land_parcel import LandParcel


class Survey(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    Cadastral & Vertical Strata Field Survey Record.
    Captures GPS measurements, accuracy confidence, telemetry, and approval status.
    """
    __tablename__ = "surveys"

    survey_order_number: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    land_parcel_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("land_parcels.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    surveyor_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), index=True, nullable=False)
    survey_type: Mapped[str] = mapped_column(String(32), default="STRATA_VERTICAL")  # GROUND_2D, STRATA_VERTICAL, DRONE_LIDAR
    status: Mapped[str] = mapped_column(String(24), default="SUBMITTED")  # DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED

    # Survey Trajectory / Bounding Footprint captured by surveyor
    survey_geometry = mapped_column(
        Geometry(geometry_type="GEOMETRY", srid=4326, spatial_index=True),
        nullable=True
    )

    # GPS Accuracy & Environmental Telemetry
    gps_accuracy_m: Mapped[float] = mapped_column(Float, default=0.5, nullable=False)
    vertical_datum: Mapped[str] = mapped_column(String(32), default="AMSL_SOI")  # Survey of India Benchmark
    equipment_type: Mapped[str] = mapped_column(String(64), default="DGPS_ROVER")

    # Offline Sync and Telemetry Metadata
    offline_sync_id: Mapped[Optional[str]] = mapped_column(String(64), unique=True, nullable=True)
    telemetry_metadata: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)
    officer_remarks: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationship
    land_parcel: Mapped[Optional["LandParcel"]] = relationship("LandParcel", back_populates="surveys")

    __table_args__ = (
        Index("idx_survey_status_date", "status", "created_at"),
    )
