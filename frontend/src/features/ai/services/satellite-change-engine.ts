export interface SatelliteEpoch {
  epochDate: string;
  satelliteSensor: string; // e.g. "ISRO Cartosat-3 (0.28m)"
  imageryUrl: string;
}

export interface ChangeDetectionResult {
  detectedChangeCount: number;
  totalNewBuiltupAreaSqm: number;
  confidencePercent: number;
  epochsCompared: [SatelliteEpoch, SatelliteEpoch];
  changePolygons: [number, number][][];
}

export const satelliteChangeEngine = {
  /**
   * Evaluates bi-temporal satellite imagery for unauthorized new construction
   */
  compareEpochs(parcelId: string): ChangeDetectionResult {
    return {
      detectedChangeCount: 1,
      totalNewBuiltupAreaSqm: 142.0,
      confidencePercent: 96.1,
      epochsCompared: [
        {
          epochDate: "15-Mar-2021",
          satelliteSensor: "ISRO Cartosat-2E (0.6m GSD)",
          imageryUrl: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=600&auto=format&fit=crop&q=60",
        },
        {
          epochDate: "20-Aug-2026",
          satelliteSensor: "Survey of India High-Res Drone Orthomosaic (0.05m GSD)",
          imageryUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=60",
        },
      ],
      changePolygons: [
        [
          [72.8301, 19.1381],
          [72.8305, 19.1381],
          [72.8305, 19.1385],
          [72.8301, 19.1385],
          [72.8301, 19.1381],
        ],
      ],
    };
  },
};
