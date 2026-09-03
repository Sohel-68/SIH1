export interface ULPIN3DRecord {
  id: string;
  strata_unit_id: string;
  base_ulpin: string;
  ulpin_3d: string;
  spatial_hash: string;
  verification_code: string;
  qr_payload: string;
  status: "GENERATED" | "ISSUED" | "REVOKED";
  encoding_version: string;
}

export interface ULPINGenerationInput {
  strata_unit_id: string;
  base_ulpin: string;
  tower_number: string;
  floor_number: number;
  unit_number: string;
  base_elevation_amsl: number;
}
