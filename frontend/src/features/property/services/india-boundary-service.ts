import * as turf from "@turf/turf";
import { INDIA_SOVEREIGN_CONFIG, INDIA_SOVEREIGN_POLYGON } from "../constants/india-boundary";

export interface BoundaryValidationResult {
  allowed: boolean;
  reason?: string;
  countryCode: string;
}

export const indiaBoundaryService = {
  /**
   * Check if a geographic coordinate falls within the sovereign territory of the Republic of India
   */
  isInsideIndia(lng: number, lat: number): boolean {
    const [minLng, minLat, maxLng, maxLat] = INDIA_SOVEREIGN_CONFIG.boundingBox;

    // Fast reject via bounding box
    if (lng < minLng || lng > maxLng || lat < minLat || lat > maxLat) {
      return false;
    }

    try {
      const pt = turf.point([lng, lat]);
      const poly = turf.polygon([INDIA_SOVEREIGN_POLYGON]);
      return turf.booleanPointInPolygon(pt, poly);
    } catch {
      // Fallback to bounding box if topology evaluation throws
      return lng >= minLng && lng <= maxLng && lat >= minLat && lat <= maxLat;
    }
  },

  /**
   * Enforce India-first geospatial governance on cadastral operations
   * (Property creation, parcel editing, survey capture, ULPIN generation, mutation, saving)
   */
  validateCadastralOperation(
    coords: [number, number],
    operationName: string = "Cadastral Operation"
  ): BoundaryValidationResult {
    if (!INDIA_SOVEREIGN_CONFIG.enforceCadastralBoundary) {
      return { allowed: true, countryCode: "IND" };
    }

    const isPermitted = this.isInsideIndia(coords[0], coords[1]);

    if (!isPermitted) {
      return {
        allowed: false,
        reason: INDIA_SOVEREIGN_CONFIG.restrictedOperationMessage,
        countryCode: "NON_IND",
      };
    }

    return {
      allowed: true,
      countryCode: "IND",
    };
  },

  /**
   * Validate all vertices of a GeoJSON polygon
   */
  isGeometryInsideIndia(coordinates: number[][]): BoundaryValidationResult {
    for (const pt of coordinates) {
      if (!this.isInsideIndia(pt[0], pt[1])) {
        return {
          allowed: false,
          reason: INDIA_SOVEREIGN_CONFIG.restrictedOperationMessage,
          countryCode: "NON_IND",
        };
      }
    }
    return { allowed: true, countryCode: "IND" };
  },
};
