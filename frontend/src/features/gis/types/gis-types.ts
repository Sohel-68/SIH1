import type { Feature, Polygon, LineString, Point, MultiPolygon } from "geojson";

export type BasemapStyle =
  | "dark"
  | "light"
  | "satellite"
  | "terrain"
  | "street"
  | "hybrid";

export type LayerCategory = "cadastre" | "infrastructure" | "base" | "analytics";

export interface CadastralLayer {
  id: string;
  name: string;
  category: LayerCategory;
  description: string;
  visible: boolean;
  opacity: number; // 0 to 1
  zIndex: number;
  type: "vector" | "raster" | "geojson" | "future";
  color: string;
  isSystem?: boolean;
}

export type DrawingMode =
  | "none"
  | "point"
  | "line"
  | "polygon"
  | "rectangle"
  | "circle"
  | "freehand";

export type MeasurementType = "none" | "distance" | "area" | "bearing";

export interface CadastralParcel {
  id: string;
  ulpin: string;
  parcelNumber: string;
  surveyNumber: string;
  ownerName: string;
  carpetAreaSqm: number;
  perimeterMeters: number;
  landUse: "Residential" | "Commercial" | "Industrial" | "Agricultural" | "Government";
  state: string;
  district: string;
  taluka: string;
  village: string;
  status: "ACTIVE" | "PENDING_SURVEY" | "DISPUTED" | "LOCKED";
  centroid: [number, number]; // [lng, lat]
  geometry: Feature<Polygon | MultiPolygon>;
  disputeNotes?: string;
  registeredDate: string;
}

export interface TelemetryCoordinates {
  lng: number;
  lat: number;
  utmEasting: number;
  utmNorthing: number;
  utmZone: string;
  elevationMeters: number;
  zoom: number;
  bearing: number;
  pitch: number;
  scaleMeters: number;
}

export interface MeasurementResult {
  type: MeasurementType;
  primaryValue: string; // e.g. "1,420 m²" or "320.5 m"
  secondaryValue?: string; // e.g. "0.351 Acres" or "0.32 km"
  perimeter?: string;
  bearing?: string;
  pointsCount: number;
}
