import uuid
from typing import TYPE_CHECKING, Optional
from sqlalchemy import BigInteger, ForeignKey, Index, String
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.unit import StrataUnit


class Document(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    Cadastral and Property Title Deed Registry.
    Guarantees document integrity with SHA-256 hashes and digital signatures.
    """
    __tablename__ = "documents"

    strata_unit_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("strata_units.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )

    document_type: Mapped[str] = mapped_column(String(32), nullable=False)  # TITLE_DEED, FLOOR_PLAN, ENCUMBRANCE, SURVEY_MAP
    file_name: Mapped[str] = mapped_column(String(256), nullable=False)
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)  # S3 / MinIO Object Key
    file_size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=False)
    mime_type: Mapped[str] = mapped_column(String(64), default="application/pdf", nullable=False)

    # Cryptographic SHA-256 Checksum for tamper prevention
    checksum_sha256: Mapped[str] = mapped_column(String(64), index=True, nullable=False)

    verification_status: Mapped[str] = mapped_column(String(24), default="PENDING")  # PENDING, VERIFIED, REJECTED
    verified_by: Mapped[Optional[uuid.UUID]] = mapped_column(UUID(as_uuid=True), nullable=True)

    metadata_payload: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)

    # Relationship
    strata_unit: Mapped[Optional["StrataUnit"]] = relationship("StrataUnit", back_populates="documents")

    __table_args__ = (
        Index("idx_document_type_status", "document_type", "verification_status"),
    )
