from sqlalchemy import Float, Index, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class AnalyticsSnapshot(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    Cadastral & Vertical Strata Volumetric Analytics Snapshot.
    Computes Floor Space Index (FSI/FAR), volumetric density, and tax brackets.
    """
    __tablename__ = "analytics_snapshots"

    geographic_zone: Mapped[str] = mapped_column(String(64), index=True, nullable=False)  # Ward/Zone code
    time_bucket: Mapped[str] = mapped_column(String(16), index=True, nullable=False)  # e.g., "2026-Q1"

    total_parcels_counted: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_strata_units_counted: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    total_builtup_volume_cum: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    average_fsi_ratio: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    max_fsi_ratio: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    density_metrics: Mapped[dict] = mapped_column(JSONB, default=dict, nullable=False)

    __table_args__ = (
        Index("idx_analytics_zone_bucket", "geographic_zone", "time_bucket"),
    )
