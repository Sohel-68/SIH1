/**
 * India-First Geospatial Governance
 * Official Sovereign Boundary Configuration of the Republic of India.
 */

export interface SovereignBoundaryConfig {
  countryCode: "IND";
  countryName: "Republic of India";
  // Bounding box [minLng, minLat, maxLng, maxLat]
  boundingBox: [number, number, number, number];
  // Official rejection message
  restrictedOperationMessage: string;
  allowGlobalViewing: boolean;
  enforceCadastralBoundary: boolean;
}

export const INDIA_SOVEREIGN_CONFIG: SovereignBoundaryConfig = {
  countryCode: "IND",
  countryName: "Republic of India",
  // Extent covers from Gujarat to Arunachal Pradesh, and Ladakh to Great Nicobar
  boundingBox: [68.1, 6.7, 97.4, 37.1],
  restrictedOperationMessage:
    "GeoStrata currently supports cadastral operations only within the Republic of India.",
  allowGlobalViewing: true,
  enforceCadastralBoundary: true,
};

/**
 * Sovereign Mainland Polygon for Geodesic Point-in-Polygon validation
 */
export const INDIA_SOVEREIGN_POLYGON: [number, number][] = [
  [74.8, 37.1], // Indira Col, Ladakh
  [78.5, 35.5],
  [80.3, 30.5],
  [88.1, 27.8],
  [92.5, 27.5],
  [97.4, 28.2], // Kibithu, Arunachal Pradesh
  [95.5, 24.2],
  [92.3, 21.5],
  [88.8, 21.6],
  [85.5, 19.8],
  [80.3, 13.1],
  [77.5, 8.1],  // Kanyakumari
  [76.0, 10.5],
  [73.8, 15.5],
  [72.8, 19.1], // Mumbai
  [68.7, 23.8],
  [68.1, 24.0], // Ghuar Mota, Gujarat
  [71.5, 28.5],
  [74.0, 32.5],
  [74.8, 37.1], // Closed ring
];
