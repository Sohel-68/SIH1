import uuid
from typing import TYPE_CHECKING, List
from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from geoalchemy2 import Geometry
from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.building import Building
    from app.models.floor import Floor


class Tower(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    Tower / Wing structural element within a Building complex.
    Enables multi-tower estates on a single ground parcel.
    """
    __tablename__ = "towers"

    building_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("buildings.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    tower_number: Mapped[str] = mapped_column(String(32), nullable=False)  # e.g., "T-A", "Tower 1"
    name: Mapped[str] = mapped_column(String(128), nullable=False)

    footprint_2d = mapped_column(
        Geometry(geometry_type="POLYGON", srid=4326, spatial_index=True),
        nullable=True
    )

    floor_count: Mapped[int] = mapped_column(Integer, nullable=False)
    base_elevation_amsl: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    # Relationships
    building: Mapped["Building"] = relationship("Building", back_populates="towers")
    floors: Mapped[List["Floor"]] = relationship(
        "Floor", back_populates="tower", cascade="all, delete-orphan"
    )
