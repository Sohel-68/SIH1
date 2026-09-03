import * as turf from "@turf/turf";
import type { DrawingMode } from "../types/gis-types";

export interface LiveMeasurementData {
  areaSqm: number;
  areaHectares: number;
  areaAcres: number;
  perimeterMeters: number;
  lengthMeters: number;
  bearingDegrees: number;
  centroid: [number, number];
  boundingBox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  elevationMeters: number;
  isSelfIntersecting: boolean;
  isValid: boolean;
}

export const drawingService = {
  /**
   * Snaps a coordinate to the nearest existing vertex if within tolerance
   */
  snapToNearestVertex(
    targetCoord: [number, number],
    existingVertices: [number, number][],
    toleranceMeters = 5.0
  ): [number, number] {
    if (existingVertices.length === 0) return targetCoord;

    const targetPoint = turf.point(targetCoord);
    let nearestCoord = targetCoord;
    let minDistance = Infinity;

    for (const v of existingVertices) {
      const vPoint = turf.point(v);
      const distance = turf.distance(targetPoint, vPoint, { units: "meters" });
      if (distance < toleranceMeters && distance < minDistance) {
        minDistance = distance;
        nearestCoord = v;
      }
    }

    return nearestCoord;
  },

  /**
   * Compute live measurements for current polygon/line coordinates
   */
  computeLiveMeasurements(
    mode: DrawingMode,
    coordinates: [number, number][]
  ): LiveMeasurementData {
    const defaultData: LiveMeasurementData = {
      areaSqm: 0,
      areaHectares: 0,
      areaAcres: 0,
      perimeterMeters: 0,
      lengthMeters: 0,
      bearingDegrees: 0,
      centroid: coordinates[0] || [72.8285, 19.1382],
      boundingBox: [72.82, 19.13, 72.83, 19.14],
      elevationMeters: 14.5,
      isSelfIntersecting: false,
      isValid: true,
    };

    if (coordinates.length < 2) return defaultData;

    try {
      // Calculate Bounding Box
      const lats = coordinates.map((c) => c[1]);
      const lngs = coordinates.map((c) => c[0]);
      defaultData.boundingBox = [
        Math.min(...lngs),
        Math.min(...lats),
        Math.max(...lngs),
        Math.max(...lats),
      ];

      // Calculate length & bearing if line or polygon
      if (coordinates.length >= 2) {
        const line = turf.lineString(coordinates);
        defaultData.lengthMeters = Math.round(turf.length(line, { units: "meters" }) * 10) / 10;

        const p1 = turf.point(coordinates[coordinates.length - 2]);
        const p2 = turf.point(coordinates[coordinates.length - 1]);
        const bearing = Math.round(turf.bearing(p1, p2));
        defaultData.bearingDegrees = bearing < 0 ? bearing + 360 : bearing;
      }

      // Calculate area and perimeter if polygon (minimum 3 points)
      if (mode === "polygon" || mode === "rectangle" || mode === "circle") {
        if (coordinates.length >= 3) {
          const closedRing = [...coordinates];
          if (
            closedRing[0][0] !== closedRing[closedRing.length - 1][0] ||
            closedRing[0][1] !== closedRing[closedRing.length - 1][1]
          ) {
            closedRing.push(closedRing[0]);
          }

          const poly = turf.polygon([closedRing]);
          const area = turf.area(poly);
          defaultData.areaSqm = Math.round(area * 10) / 10;
          defaultData.areaHectares = Math.round((area / 10000) * 1000) / 1000;
          defaultData.areaAcres = Math.round((area / 4046.86) * 1000) / 1000;

          // Perimeter
          const perimeter = turf.length(turf.lineString(closedRing), { units: "meters" });
          defaultData.perimeterMeters = Math.round(perimeter * 10) / 10;

          // Centroid
          const center = turf.centroid(poly);
          defaultData.centroid = center.geometry.coordinates as [number, number];

          // Check self-intersection (kinks)
          const kinks = turf.kinks(poly);
          defaultData.isSelfIntersecting = kinks.features.length > 0;
          defaultData.isValid = !defaultData.isSelfIntersecting;
        }
      }
    } catch (e) {
      console.warn("Turf calculation notice:", e);
    }

    return defaultData;
  },

  /**
   * Helper to generate rectangle coordinates from 2 opposite corners
   */
  generateRectangle(p1: [number, number], p2: [number, number]): [number, number][] {
    return [
      p1,
      [p2[0], p1[1]],
      p2,
      [p1[0], p2[1]],
      p1,
    ];
  },

  /**
   * Helper to generate approximate circle polygon from center and radius
   */
  generateCircle(center: [number, number], radiusMeters: number, steps = 32): [number, number][] {
    const centerPt = turf.point(center);
    const circlePoly = turf.circle(centerPt, radiusMeters, { steps, units: "meters" });
    return circlePoly.geometry.coordinates[0] as [number, number][];
  },

  /**
   * Translates (moves) geometry by deltaLng and deltaLat
   */
  translateGeometry(coords: [number, number][], deltaLng: number, deltaLat: number): [number, number][] {
    return coords.map(([lng, lat]) => [lng + deltaLng, lat + deltaLat]);
  },
};
