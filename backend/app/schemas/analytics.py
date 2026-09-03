import uuid
from pydantic import BaseModel


class AnalyticsZoneMetric(BaseModel):
    id: uuid.UUID
    geographic_zone: str
    time_bucket: str
    total_parcels_counted: int
    total_strata_units_counted: int
    total_builtup_volume_cum: float
    average_fsi_ratio: float
    max_fsi_ratio: float
