import uuid
from typing import Optional
from pydantic import BaseModel, Field


class ULPIN3DGenerateRequest(BaseModel):
    strata_unit_id: uuid.UUID
    base_ulpin: str = Field(..., min_length=14, max_length=14, description="14-char standard Bhu-Aadhaar")
    tower_number: str
    floor_number: int
    unit_number: str
    base_elevation_amsl: float


class ULPINVerifyResponse(BaseModel):
    is_valid: bool
    ulpin_3d: str
    base_ulpin: str
    verification_code: str
    status: str
    spatial_hash: str
    qr_payload: str
