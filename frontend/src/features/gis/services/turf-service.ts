import * as turf from "@turf/turf";
import type { MeasurementResult, MeasurementType } from "../types/gis-types";

export const turfService = {
  /**
   * Geodesic Area calculation in m², hectares, and acres
   */
  calculateArea(coordinates: number[][]): { sqm: number; hectares: number; acres: number } {
    if (coordinates.length < 3) return { sqm: 0, hectares: 0, acres: 0 };

    try {
      // Ensure closed ring for polygon
      const ring = [...coordinates];
      if (
        ring[0][0] !== ring[ring.length - 1][0] ||
        ring[0][1] !== ring[ring.length - 1][1]
      ) {
        ring.push(ring[0]);
      }

      const polygon = turf.polygon([ring]);
      const sqmMeters = turf.area(polygon);
      return {
        sqm: Math.round(sqmMeters * 10) / 10,
        hectares: Math.round((sqmMeters / 10000) * 1000) / 1000,
        acres: Math.round((sqmMeters / 4046.86) * 1000) / 1000,
      };
    } catch {
      return { sqm: 0, hectares: 0, acres: 0 };
    }
  },

  /**
   * Geodesic Distance / Length calculation in meters and kilometers
   */
  calculateLength(coordinates: number[][]): { meters: number; kilometers: number } {
    if (coordinates.length < 2) return { meters: 0, kilometers: 0 };

    try {
      const line = turf.lineString(coordinates);
      const km = turf.length(line, { units: "kilometers" });
      return {
        meters: Math.round(km * 1000 * 10) / 10,
        kilometers: Math.round(km * 1000) / 1000,
      };
    } catch {
      return { meters: 0, kilometers: 0 };
    }
  },

  /**
   * Calculate polygon perimeter in meters
   */
  calculatePerimeter(coordinates: number[][]): number {
    if (coordinates.length < 3) return 0;
    const ring = [...coordinates];
    if (
      ring[0][0] !== ring[ring.length - 1][0] ||
      ring[0][1] !== ring[ring.length - 1][1]
    ) {
      ring.push(ring[0]);
    }
    return this.calculateLength(ring).meters;
  },

  /**
   * Calculate initial compass bearing between two points (0° - 360°)
   */
  calculateBearing(p1: [number, number], p2: [number, number]): { degrees: number; cardinal: string } {
    try {
      let b = turf.bearing(p1, p2);
      if (b < 0) b += 360;
      const deg = Math.round(b * 10) / 10;

      const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
      const index = Math.round(deg / 22.5) % 16;

      return { degrees: deg, cardinal: directions[index] };
    } catch {
      return { degrees: 0, cardinal: "N" };
    }
  },

  /**
   * Centroid of any coordinate list
   */
  calculateCentroid(coordinates: number[][]): [number, number] {
    if (coordinates.length === 0) return [72.8285, 19.1382];
    try {
      const points = turf.points(coordinates);
      const c = turf.center(points);
      return c.geometry.coordinates as [number, number];
    } catch {
      return [coordinates[0][0], coordinates[0][1]];
    }
  },

  /**
   * Snap cursor to nearest vertex within tolerance (meters)
   */
  findSnapVertex(
    cursorPoint: [number, number],
    vertices: [number, number][],
    toleranceMeters: number = 8
  ): { snapped: boolean; point: [number, number] } {
    let closestDist = Infinity;
    let closestPoint: [number, number] = cursorPoint;

    for (const v of vertices) {
      const dist = turf.distance(cursorPoint, v, { units: "meters" });
      if (dist < closestDist && dist <= toleranceMeters) {
        closestDist = dist;
        closestPoint = v;
      }
    }

    return {
      snapped: closestDist !== Infinity,
      point: closestPoint,
    };
  },

  /**
   * Convert WGS84 (Lng, Lat) to UTM Zone 43N (Easting, Northing)
   * Formula implementation for Indian Central/Western Cadastral Datum
   */
  wgs84ToUtmZone43N(lng: number, lat: number): { easting: number; northing: number; zone: string } {
    const a = 6378137.0; // WGS84 major radius
    const f = 1 / 298.257223563;
    const k0 = 0.9996;
    const utmZone = 43; // Zone 43N covers Western & Central India (including Maharashtra)
    const centralMeridian = (utmZone - 1) * 6 - 180 + 3; // 75.0 degrees East

    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    const cmRad = (centralMeridian * Math.PI) / 180;

    const e2 = 2 * f - f * f;
    const e4 = e2 * e2;
    const e6 = e4 * e2;
    const ep2 = e2 / (1 - e2);

    const N = a / Math.sqrt(1 - e2 * Math.sin(latRad) * Math.sin(latRad));
    const T = Math.tan(latRad) * Math.tan(latRad);
    const C = ep2 * Math.cos(latRad) * Math.cos(latRad);
    const A = (lngRad - cmRad) * Math.cos(latRad);

    const M =
      a *
      ((1 - e2 / 4 - (3 * e4) / 64 - (5 * e6) / 256) * latRad -
        ((3 * e2) / 8 + (3 * e4) / 32 + (45 * e6) / 1024) * Math.sin(2 * latRad) +
        ((15 * e4) / 256 + (45 * e6) / 1024) * Math.sin(4 * latRad) -
        ((35 * e6) / 3072) * Math.sin(6 * latRad));

    const easting =
      500000 +
      k0 *
        N *
        (A +
          ((1 - T + C) * A * A * A) / 6 +
          ((5 - 18 * T + T * T + 72 * C - 58 * ep2) * A * A * A * A * A) / 120);

    const northing =
      k0 *
      (M +
        N *
          Math.tan(latRad) *
          ((A * A) / 2 +
            ((5 - T + 9 * C + 4 * C * C) * A * A * A * A) / 24 +
            ((61 - 58 * T + T * T + 600 * C - 330 * ep2) * A * A * A * A * A * A) / 720));

    return {
      easting: Math.round(easting * 10) / 10,
      northing: Math.round(northing * 10) / 10,
      zone: "43N",
    };
  },

  /**
   * Format live measurement result for HUD overlay
   */
  formatMeasurement(type: MeasurementType, coordinates: number[][]): MeasurementResult | null {
    if (type === "none" || coordinates.length < 2) return null;

    if (type === "distance") {
      const len = this.calculateLength(coordinates);
      return {
        type: "distance",
        primaryValue: len.meters > 1000 ? `${len.kilometers} km` : `${len.meters} m`,
        secondaryValue: len.meters > 1000 ? `${len.meters} meters` : `${Math.round(len.meters * 3.28084)} feet`,
        pointsCount: coordinates.length,
      };
    }

    if (type === "area") {
      if (coordinates.length < 3) {
        const len = this.calculateLength(coordinates);
        return {
          type: "area",
          primaryValue: `${len.meters} m (baseline)`,
          secondaryValue: "Click 3rd vertex to compute solid area",
          pointsCount: coordinates.length,
        };
      }
      const area = this.calculateArea(coordinates);
      const perim = this.calculatePerimeter(coordinates);
      return {
        type: "area",
        primaryValue: `${area.sqm.toLocaleString()} m²`,
        secondaryValue: `${area.hectares} ha &bull; ${area.acres} acres`,
        perimeter: `${perim} m`,
        pointsCount: coordinates.length,
      };
    }

    if (type === "bearing" && coordinates.length >= 2) {
      const p1 = coordinates[coordinates.length - 2] as [number, number];
      const p2 = coordinates[coordinates.length - 1] as [number, number];
      const bearing = this.calculateBearing(p1, p2);
      const dist = this.calculateLength([p1, p2]);

      return {
        type: "bearing",
        primaryValue: `${bearing.degrees}° (${bearing.cardinal})`,
        secondaryValue: `Distance: ${dist.meters} m`,
        bearing: `${bearing.degrees}°`,
        pointsCount: 2,
      };
    }

    return null;
  },
};
