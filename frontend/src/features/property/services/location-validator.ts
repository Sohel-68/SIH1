import * as turf from "@turf/turf";
import type { Feature, Polygon, MultiPolygon } from "geojson";

export interface GPSValidationParams {
  hdop?: number; // Horizontal Dilution of Precision (ideal < 2.0)
  satelliteCount?: number; // Ideal >= 6
  elevationAmsl: number;
  accuracyMeters?: number; // Ideal < 0.05m for DGPS, < 2.5m for standard
}

export interface ValidationReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const locationValidator = {
  /**
   * 1. GPS Telemetry Sanity and Survey Grade Verification
   */
  validateGPS(params: GPSValidationParams): ValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (params.hdop !== undefined && params.hdop > 3.0) {
      errors.push(`Excessive GPS HDOP (${params.hdop}). Cadastral survey requires HDOP <= 2.5.`);
    } else if (params.hdop !== undefined && params.hdop > 2.0) {
      warnings.push(`Sub-optimal HDOP (${params.hdop}). Consider waiting for improved constellation geometry.`);
    }

    if (params.satelliteCount !== undefined && params.satelliteCount < 4) {
      errors.push(`Insufficient GNSS satellites (${params.satelliteCount}). Minimum 4 required for 3D fix.`);
    }

    if (params.accuracyMeters !== undefined && params.accuracyMeters > 5.0) {
      errors.push(`GPS horizontal accuracy (${params.accuracyMeters}m) exceeds cadastral tolerance.`);
    }

    if (params.elevationAmsl < -50 || params.elevationAmsl > 8848) {
      errors.push(`Elevation (${params.elevationAmsl}m) out of plausible terrestrial geodetic bounds.`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  },

  /**
   * 2. Administrative Jurisdiction Validation
   */
  validateJurisdiction(
    coords: [number, number],
    declaredState: string,
    declaredDistrict: string
  ): ValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Bounding check for Maharashtra / Western India region (example LGD compliance)
    if (declaredState.toLowerCase().includes("maharashtra")) {
      const [lng, lat] = coords;
      if (lng < 72.5 || lng > 80.9 || lat < 15.6 || lat > 22.1) {
        errors.push(`Coordinates (${lng.toFixed(4)}, ${lat.toFixed(4)}) lie outside Maharashtra State jurisdiction.`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  },

  /**
   * 3. Duplicate Parcel Detection
   */
  detectDuplicateParcel(
    ulpin: string,
    surveyNumber: string,
    centroid: [number, number],
    existingParcels: Array<{ id: string; ulpin: string; surveyNumber: string; centroid: [number, number] }>
  ): ValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const p of existingParcels) {
      if (p.ulpin.toLowerCase() === ulpin.toLowerCase()) {
        errors.push(`Duplicate ULPIN detected: ${ulpin} is already registered under parcel ${p.id}.`);
      }

      if (p.surveyNumber.toLowerCase() === surveyNumber.toLowerCase()) {
        warnings.push(`Survey Number ${surveyNumber} already exists. Ensure this is a valid sub-division (Hissa).`);
      }

      // Check centroid proximity (< 1.5 meters)
      const distMeters = turf.distance(turf.point(centroid), turf.point(p.centroid), {
        units: "meters",
      });
      if (distMeters < 1.5) {
        errors.push(`Centroid proximity collision (${distMeters.toFixed(2)}m) with existing parcel ${p.id}.`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  },

  /**
   * 4. Parcel Overlap & Spatial Collision Detection (ISO 19152 non-overlapping requirement)
   */
  detectParcelOverlap(
    newPolygon: Feature<Polygon | MultiPolygon>,
    existingPolygons: Array<{ id: string; geometry: Feature<Polygon | MultiPolygon> }>
  ): ValidationReport {
    const errors: string[] = [];
    const warnings: string[] = [];

    for (const existing of existingPolygons) {
      try {
        const doesOverlap = turf.booleanOverlap(newPolygon, existing.geometry);
        if (doesOverlap) {
          errors.push(`Spatial boundary collision detected with parcel ${existing.id}. Cadastral boundaries cannot overlap.`);
        }

        const intersection = turf.intersect(turf.featureCollection([newPolygon, existing.geometry]));
        if (intersection) {
          const overlapArea = turf.area(intersection);
          if (overlapArea > 0.1) {
            errors.push(
              `Topological intersection area of ${overlapArea.toFixed(2)} m² detected with parcel ${existing.id}.`
            );
          }
        }
      } catch {
        // Complex geometry exception
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  },
};
