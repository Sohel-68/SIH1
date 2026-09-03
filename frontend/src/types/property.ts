export interface LandParcelEntity {
  id: string;
  base_ulpin: string;
  state_code: string;
  district_code: string;
  subdistrict_code: string;
  village_code: string;
  parcel_number: string;
  ground_elevation_amsl: number;
  area_sqm: number;
  land_use_type: string;
  status: "ACTIVE" | "PENDING_SURVEY" | "DISPUTED";
}

export interface BuildingEntity {
  id: string;
  land_parcel_id: string;
  name: string;
  building_code: string;
  total_height_m: number;
  total_floors: number;
  total_towers: number;
  structural_type: string;
}

export interface TowerEntity {
  id: string;
  building_id: string;
  tower_number: string;
  name: string;
  floor_count: number;
  base_elevation_amsl: number;
}

export interface FloorEntity {
  id: string;
  tower_id: string;
  floor_number: number;
  floor_label: string;
  z_min_amsl: number;
  z_max_amsl: number;
  floor_height_m: number;
  unit_count: number;
}

export interface StrataUnitEntity {
  id: string;
  floor_id: string;
  unit_number: string;
  ulpin_3d: string;
  carpet_area_sqm: number;
  builtup_area_sqm: number;
  volume_cum: number;
  base_elevation_amsl: number;
  ceiling_elevation_amsl: number;
  usage_type: "RESIDENTIAL" | "COMMERCIAL" | "MIXED";
  status: "REGISTERED" | "PENDING_SURVEY" | "DISPUTED";
}
