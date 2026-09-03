export type TwinNodeType =
  | "PARCEL"
  | "BUILDING"
  | "TOWER"
  | "FLOOR"
  | "UNIT"
  | "ROOM";

export type CameraMode =
  | "orbit"
  | "walk"
  | "fly"
  | "first-person"
  | "orthographic"
  | "perspective";

export type SectionCutMode =
  | "none"
  | "horizontal"
  | "vertical-x"
  | "vertical-z"
  | "box";

export type LightingMode = "day" | "night" | "golden-hour" | "solar-analysis";

export type Measurement3DType = "none" | "height" | "distance" | "area" | "volume";

export interface Measurement3DResult {
  type: Measurement3DType;
  primaryValue: string; // e.g. "54.2 m (Building Height)" or "184.5 m³ (Volume)"
  secondaryValue?: string;
  points: [number, number, number][];
}

export interface RealWorldCoordinates {
  latitude: number;
  longitude: number;
  elevationAmsl: number; // Meters above mean sea level
  rotationDegrees: [number, number, number]; // [pitch, yaw, roll]
  scale: [number, number, number];
  heightMeters: number;
  floorElevationAmsl?: number;
}

export interface DigitalTwinNode {
  id: string;
  type: TwinNodeType;
  name: string;
  code: string;
  parentId?: string;
  childrenIds: string[];
  coordinates: RealWorldCoordinates;
  meshProperties: {
    color: string;
    opacity: number;
    wireframe?: boolean;
    visible: boolean;
    isIsolated?: boolean;
  };
  metadata: {
    ulpin?: string;
    ulpin3D?: string;
    ownerName?: string;
    surveyNumber?: string;
    carpetAreaSqm?: number;
    builtupAreaSqm?: number;
    volumeCum?: number;
    usageType?: "RESIDENTIAL" | "COMMERCIAL" | "CIVIC" | "UTILITY";
    floorLevel?: number;
    unitNumber?: string;
    taxStatus?: "PAID" | "PENDING" | "OVERDUE";
  };
}
