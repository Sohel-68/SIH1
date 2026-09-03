import type { Feature, Geometry } from "geojson";

export type AdministrativeLevel =
  | "COUNTRY"
  | "STATE"
  | "DISTRICT"
  | "TALUKA"
  | "VILLAGE"
  | "WARD"
  | "SURVEY_NUMBER"
  | "SUBDIVISION"
  | "PARCEL"
  | "BUILDING"
  | "FLOOR"
  | "UNIT";

export interface AdministrativeNode {
  id: string;
  level: AdministrativeLevel;
  code: string; // LG Directory (LGD) or Census code
  name: string;
  parentId?: string;
  childrenCount: number;
  geometry?: Feature<Geometry>;
  metadata: {
    lgdCode?: string;
    censusCode?: string;
    stateCode?: string;
    districtCode?: string;
    totalAreaHectares?: number;
    population?: number;
    ulpinCode?: string;
    verticalFloorIndex?: number;
    unitNumber?: string;
  };
}

export const HIERARCHY_LEVEL_LABELS: Record<AdministrativeLevel, string> = {
  COUNTRY: "Sovereign Nation",
  STATE: "State / Union Territory",
  DISTRICT: "Revenue District",
  TALUKA: "Taluka / Tehsil / Sub-District",
  VILLAGE: "Revenue Village / Town",
  WARD: "Municipal Ward",
  SURVEY_NUMBER: "Cadastral Survey Number",
  SUBDIVISION: "Hissa / Subdivision",
  PARCEL: "Ground Parcel (2D Cadastre)",
  BUILDING: "Building Structure / Tower",
  FLOOR: "Floor Level (Z-Elevation)",
  UNIT: "Strata Property Unit (3D ULPIN)",
};
