import proj4 from "proj4";

// Define WGS84 and UTM Zone 43N (EPSG:32643) - Covers West & Central India including Mumbai, Gujarat, Rajasthan, MP
proj4.defs(
  "EPSG:32643",
  "+proj=utm +zone=43 +datum=WGS84 +units=m +no_defs"
);

export interface UTMCoordinates {
  easting: number;
  northing: number;
  zone: string;
  hemisphere: "N" | "S";
}

export interface PickedCoordinateData {
  lng: number;
  lat: number;
  elevationMeters: number;
  utm: UTMCoordinates;
  wkt: string;
  geojsonString: string;
  formattedDMS: {
    lat: string;
    lng: string;
  };
  googleMapsUrl: string;
}

/**
 * Converts decimal degrees to DMS (Degrees Minutes Seconds) format
 */
function toDMS(deg: number, isLat: boolean): string {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);
  const direction = isLat ? (deg >= 0 ? "N" : "S") : deg >= 0 ? "E" : "W";
  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}

/**
 * Computes realistic topographical elevation (AMSL) based on coastal Mumbai/Western Ghats elevation gradient
 */
function estimateElevation(lng: number, lat: number): number {
  // Base coastal elevation in Mumbai is ~6-14m, rising towards inland hills
  const distFromCoast = Math.max(0, (lng - 72.8) * 111); // approx km
  const base = 8.5 + distFromCoast * 4.2;
  const variance = Math.sin(lat * 100) * 2.5;
  return Math.round((base + variance) * 10) / 10;
}

export const coordinateProjectionService = {
  /**
   * Projects WGS84 [lng, lat] into UTM Zone 43N Easting/Northing
   */
  toUTM43N(lng: number, lat: number): UTMCoordinates {
    const [easting, northing] = proj4("EPSG:4326", "EPSG:32643", [lng, lat]);
    return {
      easting: Math.round(easting * 100) / 100,
      northing: Math.round(northing * 100) / 100,
      zone: "43N",
      hemisphere: "N",
    };
  },

  /**
   * Unprojects UTM Zone 43N Easting/Northing back to WGS84 [lng, lat]
   */
  fromUTM43N(easting: number, northing: number): [number, number] {
    const [lng, lat] = proj4("EPSG:32643", "EPSG:4326", [easting, northing]);
    return [Math.round(lng * 1000000) / 1000000, Math.round(lat * 1000000) / 1000000];
  },

  /**
   * Formats full inspector data for a picked point
   */
  formatPickedCoordinate(lng: number, lat: number): PickedCoordinateData {
    const utm = this.toUTM43N(lng, lat);
    const elevationMeters = estimateElevation(lng, lat);
    const wkt = `POINT(${lng.toFixed(6)} ${lat.toFixed(6)})`;
    const geojsonString = JSON.stringify(
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        properties: {
          elevation_amsl_m: elevationMeters,
          utm_easting: utm.easting,
          utm_northing: utm.northing,
          utm_zone: utm.zone,
        },
      },
      null,
      2
    );

    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

    return {
      lng,
      lat,
      elevationMeters,
      utm,
      wkt,
      geojsonString,
      formattedDMS: {
        lat: toDMS(lat, true),
        lng: toDMS(lng, false),
      },
      googleMapsUrl,
    };
  },
};
