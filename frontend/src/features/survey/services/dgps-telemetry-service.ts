import type { LiveHardwareTelemetry, NMEAParsedSentence } from "../types/telemetry-types";
import type { GNSSFixType } from "../types/survey-types";

export const dgpsTelemetryService = {
  /**
   * Parse standard NMEA-0183 $GNGGA sentence
   * Format: $GNGGA,hhmmss.ss,llll.ll,a,yyyyy.yy,a,x,xx,x.x,x.x,M,x.x,M,x.x,xxxx*hh
   */
  parseGGA(sentence: string): NMEAParsedSentence | null {
    if (!sentence.startsWith("$GNGGA") && !sentence.startsWith("$GPGGA")) {
      return null;
    }

    try {
      const parts = sentence.split("*")[0].split(",");
      const utcTime = parts[1];
      const rawLat = parseFloat(parts[2]);
      const latDir = parts[3];
      const rawLng = parseFloat(parts[4]);
      const lngDir = parts[5];
      const quality = parseInt(parts[6], 10);
      const numSatellites = parseInt(parts[7], 10);
      const hdop = parseFloat(parts[8]);
      const altitude = parseFloat(parts[9]);
      const geoidSeparation = parseFloat(parts[11]);

      // NMEA degree-minutes to decimal degrees conversion
      const latDeg = Math.floor(rawLat / 100);
      const latMin = rawLat - latDeg * 100;
      let latitude = latDeg + latMin / 60;
      if (latDir === "S") latitude = -latitude;

      const lngDeg = Math.floor(rawLng / 100);
      const lngMin = rawLng - lngDeg * 100;
      let longitude = lngDeg + lngMin / 60;
      if (lngDir === "W") longitude = -longitude;

      return {
        talker: parts[0].substring(1, 3) as "GN" | "GP",
        type: "GGA",
        utcTime,
        latitude,
        longitude,
        quality,
        numSatellites,
        hdop,
        altitude,
        geoidSeparation,
      };
    } catch {
      return null;
    }
  },

  /**
   * Map NMEA quality integer to Cadastral Fix Type
   */
  mapQualityToFixType(quality: number): GNSSFixType {
    switch (quality) {
      case 4:
        return "RTK_FIX"; // Centimeter accuracy
      case 5:
        return "RTK_FLOAT";
      case 2:
        return "DGPS";
      case 1:
        return "AUTONOMOUS_GPS";
      default:
        return "AUTONOMOUS_GPS";
    }
  },

  /**
   * Live Field Telemetry Simulator for Demo and Field Rover emulation
   */
  getSimulatedTelemetry(baseLat = 19.1382, baseLng = 72.8285): LiveHardwareTelemetry {
    // Subtle jitter (0.000001 deg ~ 10cm)
    const jitterLat = (Math.random() - 0.5) * 0.000004;
    const jitterLng = (Math.random() - 0.5) * 0.000004;

    return {
      roverModel: "Trimble R12i GNSS / Survey of India CORS Rover",
      firmwareVersion: "v6.24.1-IN",
      batteryPercentage: 88,
      isCharging: false,
      isOnline: true,
      fixType: "RTK_FIX",
      latitude: Math.round((baseLat + jitterLat) * 1000000) / 1000000,
      longitude: Math.round((baseLng + jitterLng) * 1000000) / 1000000,
      altitudeAMSL: 14.5,
      horizontalAccuracyCm: 1.4, // 1.4 cm
      verticalAccuracyCm: 2.1,
      hdop: 0.8,
      vdop: 1.1,
      satelliteCount: 19,
      baseStationId: "SOI-CORS-MUM-04",
      correctionLatencySec: 0.8,
      lastUpdateTimestamp: new Date().toLocaleTimeString(),
    };
  },
};
