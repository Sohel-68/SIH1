from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import Float, Index, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.building import Building
    from app.models.survey import Survey


class LandParcel(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    2D Cadastral Ground Land Parcel (Bhu-Aadhaar Ground Cadastre).
    Conforms to ISO 19152 LADM Basic Administrative Unit (BAUnit).
    """
    __tablename__ = "land_parcels"

    # 14-Character National Standard Base ULPIN (Bhu-Aadhaar)
    base_ulpin: Mapped[str] = mapped_column(String(14), unique=True, index=True, nullable=False)

    # Administrative hierarchy
    state_code: Mapped[str] = mapped_column(String(4), index=True, nullable=False)
    district_code: Mapped[str] = mapped_column(String(8), index=True, nullable=False)
    subdistrict_code: Mapped[str] = mapped_column(String(8), nullable=False)
    village_code: Mapped[str] = mapped_column(String(12), index=True, nullable=False)
    parcel_number: Mapped[str] = mapped_column(String(32), nullable=False)

    # 2D Boundary Polygon in WGS 84 (EPSG:4326)
    boundary_2d = mapped_column(
        Geometry(geometry_type="POLYGON", srid=4326, spatial_index=True),
        nullable=False
    )

    # Elevation Above Mean Sea Level (AMSL) in meters
    ground_elevation_amsl: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    area_sqm: Mapped[float] = mapped_column(Float, nullable=False)

    # Classification & Status
    land_use_type: Mapped[str] = mapped_column(String(32), default="RESIDENTIAL")
    status: Mapped[str] = mapped_column(String(16), default="ACTIVE")

    # Relationships
    buildings: Mapped[List["Building"]] = relationship(
        "Building", back_populates="land_parcel", cascade="all, delete-orphan"
    )
    surveys: Mapped[List["Survey"]] = relationship(
        "Survey", back_populates="land_parcel"
    )

    __table_args__ = (
        Index("idx_land_parcels_admin", "state_code", "district_code", "village_code"),
    )
