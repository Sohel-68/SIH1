import uuid
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Float, ForeignKey, Index, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.floor import Floor
    from app.models.owner import Owner
    from app.models.ulpin import ULPINRecord
    from app.models.document import Document


class StrataUnit(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    3D Strata Unit / Independent Property Unit (Flat, Shop, Office).
    Conforms to ISO 19152 LADM 3D Spatial Unit (LA_SpatialUnit).
    Stores true 3D volumetric boundaries using PostGIS 3D geometry types.
    """
    __tablename__ = "strata_units"

    floor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("floors.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    unit_number: Mapped[str] = mapped_column(String(32), nullable=False)  # e.g., "502", "Unit A-3"
    ulpin_3d: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)

    # 3D Volumetric Geometry in EPSG:4326 with Z coordinates (PolyhedralSurface Z or MultiPolygon Z)
    volume_3d = mapped_column(
        Geometry(geometry_type="POLYHEDRALSURFACEZ", srid=4326, spatial_index=True),
        nullable=True
    )

    # 2D Projected Footprint for fallback 2D rendering
    footprint_2d = mapped_column(
        Geometry(geometry_type="POLYGON", srid=4326, spatial_index=True),
        nullable=True
    )

    # Dimensional Metrics
    carpet_area_sqm: Mapped[float] = mapped_column(Float, nullable=False)
    builtup_area_sqm: Mapped[float] = mapped_column(Float, nullable=False)
    volume_cum: Mapped[float] = mapped_column(Float, nullable=False)  # Net Volume in cubic meters

    # Elevation Reference AMSL
    base_elevation_amsl: Mapped[float] = mapped_column(Float, nullable=False)
    ceiling_elevation_amsl: Mapped[float] = mapped_column(Float, nullable=False)

    # Classification & Legal Status
    usage_type: Mapped[str] = mapped_column(String(32), default="RESIDENTIAL")  # RESIDENTIAL, COMMERCIAL, MIXED
    status: Mapped[str] = mapped_column(String(24), default="REGISTERED")  # PENDING_SURVEY, VERIFIED, REGISTERED, DISPUTED

    # Relationships
    floor: Mapped["Floor"] = relationship("Floor", back_populates="units")
    owners: Mapped[List["Owner"]] = relationship(
        "Owner", back_populates="strata_unit", cascade="all, delete-orphan"
    )
    ulpin_record: Mapped[Optional["ULPINRecord"]] = relationship(
        "ULPINRecord", back_populates="strata_unit", uselist=False
    )
    documents: Mapped[List["Document"]] = relationship(
        "Document", back_populates="strata_unit"
    )

    __table_args__ = (
        Index("idx_strata_unit_lookup", "floor_id", "unit_number"),
    )
