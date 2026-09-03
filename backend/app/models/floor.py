import uuid
from typing import TYPE_CHECKING, List
from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.tower import Tower
    from app.models.unit import StrataUnit


class Floor(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    Vertical Floor Slab (Level).
    Defines vertical elevation boundaries (Z_min and Z_max Above Mean Sea Level).
    """
    __tablename__ = "floors"

    tower_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("towers.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    floor_number: Mapped[int] = mapped_column(Integer, nullable=False)  # -1 for basement, 0 for ground, 1+
    floor_label: Mapped[str] = mapped_column(String(32), nullable=False)  # e.g., "5th Floor", "Basement 1"

    # Vertical Z-Axis Metrics (Meters AMSL)
    z_min_amsl: Mapped[float] = mapped_column(Float, nullable=False)  # Bottom slab elevation
    z_max_amsl: Mapped[float] = mapped_column(Float, nullable=False)  # Top slab elevation
    floor_height_m: Mapped[float] = mapped_column(Float, nullable=False)  # Net vertical clearance

    unit_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Relationships
    tower: Mapped["Tower"] = relationship("Tower", back_populates="floors")
    units: Mapped[List["StrataUnit"]] = relationship(
        "StrataUnit", back_populates="floor", cascade="all, delete-orphan"
    )
