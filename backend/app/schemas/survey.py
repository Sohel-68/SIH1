import uuid
from typing import Optional
from pydantic import BaseModel, Field


class SurveySubmissionDTO(BaseModel):
    survey_order_number: str
    land_parcel_id: Optional[uuid.UUID] = None
    survey_type: str = "STRATA_VERTICAL"
    gps_accuracy_m: float = Field(..., ge=0.0, le=10.0)
    vertical_datum: str = "AMSL_SOI"
    equipment_type: str = "DGPS_ROVER"
    offline_sync_id: Optional[str] = None
    telemetry_metadata: dict = Field(default_factory=dict)


class SurveyRead(BaseModel):
    id: uuid.UUID
    survey_order_number: str
    survey_type: str
    status: str
    gps_accuracy_m: float
    created_at: str
