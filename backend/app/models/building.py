import uuid
from typing import TYPE_CHECKING, List
from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.land_parcel import LandParcel
    from app.models.tower import Tower


class Building(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    Building Footprint on a Land Parcel.
    Links the 2D ground cadastre to vertical structural towers.
    """
    __tablename__ = "buildings"

    land_parcel_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("land_parcels.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    name: Mapped[str] = mapped_column(String(128), nullable=False)
    building_code: Mapped[str] = mapped_column(String(32), index=True, nullable=False)

    # 2D Building Footprint
    footprint_2d = mapped_column(
        Geometry(geometry_type="POLYGON", srid=4326, spatial_index=True),
        nullable=False
    )

    total_height_m: Mapped[float] = mapped_column(Float, nullable=False)
    total_floors: Mapped[int] = mapped_column(Integer, nullable=False)
    total_towers: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    structural_type: Mapped[str] = mapped_column(String(64), default="RCC_FRAME")

    # Relationships
    land_parcel: Mapped["LandParcel"] = relationship("LandParcel", back_populates="buildings")
    towers: Mapped[List["Tower"]] = relationship(
        "Tower", back_populates="building", cascade="all, delete-orphan"
    )
