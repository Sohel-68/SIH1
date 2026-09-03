import uuid
from typing import TYPE_CHECKING
from sqlalchemy import Float, ForeignKey, Index, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.unit import StrataUnit


class Owner(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    Legal Property Title Holder / Owner Registry.
    Conforms to ISO 19152 LADM Party (LA_Party) and Right (LA_RRR).
    """
    __tablename__ = "owners"

    strata_unit_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("strata_units.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    full_name: Mapped[str] = mapped_column(String(256), nullable=False)
    # Cryptographic SHA-256 hash of Aadhaar / National Identity (GovTech Privacy Protection)
    identity_hash: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    contact_phone_masked: Mapped[str] = mapped_column(String(16), nullable=True)
    contact_email: Mapped[str] = mapped_column(String(256), nullable=True)

    share_percentage: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)
    ownership_type: Mapped[str] = mapped_column(String(32), default="SOLE")  # SOLE, JOINT, TENANT_IN_COMMON, TRUST
    title_deed_number: Mapped[str] = mapped_column(String(64), nullable=False)
    is_verified: Mapped[bool] = mapped_column(default=False, nullable=False)

    # Relationship
    strata_unit: Mapped["StrataUnit"] = relationship("StrataUnit", back_populates="owners")

    __table_args__ = (
        Index("idx_owner_identity_unit", "identity_hash", "strata_unit_id"),
    )
