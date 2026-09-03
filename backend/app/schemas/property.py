import uuid
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class LandParcelBase(BaseModel):
    base_ulpin: str
    state_code: str
    district_code: str
    subdistrict_code: str
    village_code: str
    parcel_number: str
    ground_elevation_amsl: float
    area_sqm: float
    land_use_type: str = "RESIDENTIAL"


class LandParcelRead(LandParcelBase):
    id: uuid.UUID
    status: str
    model_config = ConfigDict(from_attributes=True)


class BuildingRead(BaseModel):
    id: uuid.UUID
    land_parcel_id: uuid.UUID
    name: str
    building_code: str
    total_height_m: float
    total_floors: int
    total_towers: int
    structural_type: str
    model_config = ConfigDict(from_attributes=True)


class TowerRead(BaseModel):
    id: uuid.UUID
    building_id: uuid.UUID
    tower_number: str
    name: str
    floor_count: int
    base_elevation_amsl: float
    model_config = ConfigDict(from_attributes=True)


class FloorRead(BaseModel):
    id: uuid.UUID
    tower_id: uuid.UUID
    floor_number: int
    floor_label: str
    z_min_amsl: float
    z_max_amsl: float
    floor_height_m: float
    unit_count: int
    model_config = ConfigDict(from_attributes=True)


class StrataUnitRead(BaseModel):
    id: uuid.UUID
    floor_id: uuid.UUID
    unit_number: str
    ulpin_3d: str
    carpet_area_sqm: float
    builtup_area_sqm: float
    volume_cum: float
    base_elevation_amsl: float
    ceiling_elevation_amsl: float
    usage_type: str
    status: str
    model_config = ConfigDict(from_attributes=True)
