export interface GeoJSONFeature<G = unknown, P = Record<string, unknown>> {
  type: "Feature";
  id?: string | number;
  geometry: G;
  properties: P;
}

export interface GeoJSONFeatureCollection<G = unknown, P = Record<string, unknown>> {
  type: "FeatureCollection";
  features: GeoJSONFeature<G, P>[];
}

export interface Coordinates3D {
  longitude: number;
  latitude: number;
  altitudeAMSL: number;
}
