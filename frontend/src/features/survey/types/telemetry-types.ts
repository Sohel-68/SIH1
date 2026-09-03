import type { GNSSFixType } from "./survey-types";

export interface LiveHardwareTelemetry {
  roverModel: string;
  firmwareVersion: string;
  batteryPercentage: number; // 0 to 100
  isCharging: boolean;
  isOnline: boolean;
  fixType: GNSSFixType;
  latitude: number;
  longitude: number;
  altitudeAMSL: number;
  horizontalAccuracyCm: number; // e.g. 1.4 cm for RTK
  verticalAccuracyCm: number;
  hdop: number;
  vdop: number;
  satelliteCount: number;
  baseStationId: string;
  correctionLatencySec: number;
  lastUpdateTimestamp: string;
}

export interface NMEAParsedSentence {
  talker: "GN" | "GP" | "GL";
  type: "GGA" | "RMC" | "GSA";
  utcTime: string;
  latitude: number;
  longitude: number;
  quality: number;
  numSatellites: number;
  hdop: number;
  altitude: number;
  geoidSeparation: number;
}
