import uuid
from typing import TYPE_CHECKING, Optional
from sqlalchemy import ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.unit import StrataUnit


class ULPINRecord(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    3D Unique Land Parcel Identification Number (Bhu-Aadhaar 3D Registry).
    Encapsulates hierarchical spatial coding and verification hashes.
    """
    __tablename__ = "ulpin_records"

    strata_unit_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("strata_units.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True
    )

    # Base 14-Character National Cadastral Identifier
    base_ulpin: Mapped[str] = mapped_column(String(14), index=True, nullable=False)

    # Extended 3D Identifier: {BASE_14}-T{TOWER}-F{FLOOR}-U{UNIT}-{Z_ELEV}
    ulpin_3d: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)

    # Spatial Coordinate Hash (SHA-256 of 3D polygon centroids & vertices)
    spatial_hash: Mapped[str] = mapped_column(String(64), nullable=False)

    # Digital Verification Code (for QR code & citizen verification portal)
    verification_code: Mapped[str] = mapped_column(String(32), unique=True, index=True, nullable=False)
    qr_payload: Mapped[str] = mapped_column(Text, nullable=False)

    status: Mapped[str] = mapped_column(String(24), default="ISSUED")  # GENERATED, ISSUED, REVOKED, REPLACED
    encoding_version: Mapped[str] = mapped_column(String(8), default="1.0")

    metadata_payload: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)

    # Relationship
    strata_unit: Mapped["StrataUnit"] = relationship("StrataUnit", back_populates="ulpin_record")

    __table_args__ = (
        Index("idx_ulpin_base_status", "base_ulpin", "status"),
    )
