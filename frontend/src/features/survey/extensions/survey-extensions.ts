/**
 * Survey Module Future Extension Interfaces
 * Architectural contracts for Drone photogrammetry, LiDAR, and CORS networks.
 */

export interface DroneFlightMetadata {
  flightId: string;
  droneModel: string;
  groundSamplingDistanceCm: number; // e.g. 2.5 cm/pixel
  flightAltitudeMeters: number;
  totalImagesCaptured: number;
  orthophotoResolutionMeters: number;
  surveyAreaHectares: number;
}

export interface IDroneSurveyIngestor {
  processDroneFlightMosaic: (flightData: DroneFlightMetadata) => Promise<{ success: boolean; mosaicTifUrl: string }>;
}

export interface LiDARScanMetadata {
  scannerType: "AIRBORNE_DRONE" | "TERRESTRIAL_TRIPOD" | "MOBILE_MAPPING";
  pointDensityPerSqm: number;
  verticalAccuracyMm: number;
  pointCloudFileUrl: string;
}

export interface ILiDARScanAdapter {
  ingestPointCloudData: (scanData: LiDARScanMetadata) => Promise<{ success: boolean; extractedDtmUrl: string }>;
}

export interface CORSStationStatus {
  stationId: string;
  networkAgency: "SURVEY_OF_INDIA" | "STATE_SURVEY_DEPT";
  latitude: number;
  longitude: number;
  rtcmCorrectionPort: number;
  isBroadcasting: boolean;
  differentialAgeSeconds: number;
}

export interface ICORSNetworkStation {
  subscribeRTCMCorrections: (stationId: string) => Promise<{ connected: boolean; streamSessionId: string }>;
}

export interface IAIAssistedBoundaryExtractor {
  extractCadastralBoundariesFromOrtho: (orthoImageUrl: string) => Promise<{ extractedPolygonCoordinates: number[][][] }>;
}
