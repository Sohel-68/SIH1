import type { FeatureCollection, Polygon, Point, LineString } from "geojson";

export const CADASTRAL_PARCELS_GEOJSON: FeatureCollection<Polygon> = {
  type: "FeatureCollection",
  features: [
    // 1. Palm Heights Mother Parcel (CTS-142/1)
    {
      type: "Feature",
      id: "parcel-01",
      properties: {
        id: "parcel-01",
        ulpin: "27518001004201",
        parcelNumber: "P-401/A",
        surveyNumber: "CTS-142/1",
        ownerName: "Rajiv M. Mehra & Sunita R. Mehra",
        carpetAreaSqm: 1420.5,
        landUse: "Residential",
        village: "Versova",
        taluka: "Andheri",
        district: "Mumbai Suburban",
        state: "Maharashtra",
        status: "ACTIVE",
        color: "#0B7285",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.8280, 19.1379],
            [72.8290, 19.1379],
            [72.8290, 19.1385],
            [72.8280, 19.1385],
            [72.8280, 19.1379],
          ],
        ],
      },
    },

    // 2. Commercial Development Parcel (CTS-142/2)
    {
      type: "Feature",
      id: "parcel-02",
      properties: {
        id: "parcel-02",
        ulpin: "27518001004202",
        parcelNumber: "P-401/B",
        surveyNumber: "CTS-142/2",
        ownerName: "Godrej Properties Dev. Ltd.",
        carpetAreaSqm: 2850.0,
        landUse: "Commercial",
        village: "Versova",
        taluka: "Andheri",
        district: "Mumbai Suburban",
        state: "Maharashtra",
        status: "ACTIVE",
        color: "#2B8A3E",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.8291, 19.1379],
            [72.8305, 19.1379],
            [72.8305, 19.1386],
            [72.8291, 19.1386],
            [72.8291, 19.1379],
          ],
        ],
      },
    },

    // 3. Disputed Inheritance Parcel (CTS-144/A)
    {
      type: "Feature",
      id: "parcel-03",
      properties: {
        id: "parcel-03",
        ulpin: "27518001004203",
        parcelNumber: "P-402",
        surveyNumber: "CTS-144/A",
        ownerName: "Kishore K. Deshmukh (Heirs)",
        carpetAreaSqm: 890.2,
        landUse: "Mixed",
        village: "Versova",
        taluka: "Andheri",
        district: "Mumbai Suburban",
        state: "Maharashtra",
        status: "DISPUTED",
        color: "#E03131",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.8280, 19.1371],
            [72.8292, 19.1371],
            [72.8292, 19.1378],
            [72.8280, 19.1378],
            [72.8280, 19.1371],
          ],
        ],
      },
    },

    // 4. Municipal Reserve Plot (CTS-145)
    {
      type: "Feature",
      id: "parcel-04",
      properties: {
        id: "parcel-04",
        ulpin: "27518001004204",
        parcelNumber: "P-403",
        surveyNumber: "CTS-145",
        ownerName: "Municipal Corp. of Greater Mumbai (MCGM)",
        carpetAreaSqm: 3100.0,
        landUse: "Public Utility",
        village: "Versova",
        taluka: "Andheri",
        district: "Mumbai Suburban",
        state: "Maharashtra",
        status: "ACTIVE",
        color: "#15AABF",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.8268, 19.1379],
            [72.8279, 19.1379],
            [72.8279, 19.1388],
            [72.8268, 19.1388],
            [72.8268, 19.1379],
          ],
        ],
      },
    },
  ],
};

export const CADASTRAL_BUILDINGS_GEOJSON: FeatureCollection<Polygon> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "bldg-tower-a",
      properties: {
        id: "bldg-tower-a",
        name: "Tower A (Palm Heights)",
        floors: 24,
        heightMeters: 72.0,
        unitsCount: 48,
        buildingType: "High-Rise Residential",
        ulpin: "27518001004201-B01",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.8282, 19.1380],
            [72.8285, 19.1380],
            [72.8285, 19.1384],
            [72.8282, 19.1384],
            [72.8282, 19.1380],
          ],
        ],
      },
    },
    {
      type: "Feature",
      id: "bldg-tower-b",
      properties: {
        id: "bldg-tower-b",
        name: "Tower B (Palm Heights)",
        floors: 18,
        heightMeters: 54.0,
        unitsCount: 36,
        buildingType: "High-Rise Residential",
        ulpin: "27518001004201-B02",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.82865, 19.1380],
            [72.82895, 19.1380],
            [72.82895, 19.1384],
            [72.82865, 19.1384],
            [72.82865, 19.1380],
          ],
        ],
      },
    },
  ],
};

export const SURVEY_MARKERS_GEOJSON: FeatureCollection<Point> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "cp-1",
      properties: { name: "CP-1 (NW Corner)", precisionCm: 1.4, status: "RTK_FIX" },
      geometry: { type: "Point", coordinates: [72.8280, 19.1385] },
    },
    {
      type: "Feature",
      id: "cp-2",
      properties: { name: "CP-2 (NE Corner)", precisionCm: 1.5, status: "RTK_FIX" },
      geometry: { type: "Point", coordinates: [72.8290, 19.1385] },
    },
    {
      type: "Feature",
      id: "cp-3",
      properties: { name: "CP-3 (SE Corner)", precisionCm: 1.3, status: "RTK_FIX" },
      geometry: { type: "Point", coordinates: [72.8290, 19.1379] },
    },
    {
      type: "Feature",
      id: "cp-4",
      properties: { name: "CP-4 (SW Corner)", precisionCm: 1.4, status: "RTK_FIX" },
      geometry: { type: "Point", coordinates: [72.8280, 19.1379] },
    },
    {
      type: "Feature",
      id: "cp-5",
      properties: { name: "GCP-102 (Triangulation Pillar)", precisionCm: 0.8, status: "BENCHMARK" },
      geometry: { type: "Point", coordinates: [72.8275, 19.1390] },
    },
  ],
};

// ---------------------------------------------------------------------------
// 5 AI Spatial Intelligence Overlays
// ---------------------------------------------------------------------------

// 1. Encroachments (Building setback & airspace overhang)
export const AI_ENCROACHMENTS_GEOJSON: FeatureCollection<Polygon> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "ai-encroach-01",
      properties: {
        title: "Airspace Road Setback Encroachment (3.2m)",
        severity: "CRITICAL",
        category: "Encroachment",
        encroachingMeters: 3.2,
        detectedDate: "02-Sep-2026",
        source: "Drone LiDAR Elevation Scan",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.8277, 19.1376],
            [72.8279, 19.1376],
            [72.8279, 19.1380],
            [72.8277, 19.1380],
            [72.8277, 19.1376],
          ],
        ],
      },
    },
  ],
};

// 2. Boundary Conflicts (Disputed Overlap Between CTS-142/1 and CTS-144/A)
export const AI_BOUNDARY_CONFLICTS_GEOJSON: FeatureCollection<Polygon> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "ai-conflict-01",
      properties: {
        title: "Cadastral Boundary Conflict (CTS-142/1 vs CTS-144/A)",
        severity: "HIGH",
        category: "Boundary Conflict",
        overlapAreaSqm: 18.4,
        status: "PENDING_MUTATION_HEARING",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.8280, 19.1378],
            [72.8290, 19.1378],
            [72.8290, 19.1379],
            [72.8280, 19.1379],
            [72.8280, 19.1378],
          ],
        ],
      },
    },
  ],
};

// 3. Risk Zones (Coastal CRZ-II High Tide Line Buffer)
export const AI_RISK_ZONES_GEOJSON: FeatureCollection<Polygon> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "ai-risk-01",
      properties: {
        title: "Coastal Regulation Zone II (100m High Tide Buffer)",
        severity: "MEDIUM",
        category: "Environmental Risk",
        restriction: "FSI Capped at 1.5, No Sub-surface Basements",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.8260, 19.1370],
            [72.8275, 19.1370],
            [72.8275, 19.1395],
            [72.8260, 19.1395],
            [72.8260, 19.1370],
          ],
        ],
      },
    },
  ],
};

// 4. Satellite Changes (Multi-Temporal NDRE Construction Activity)
export const AI_SATELLITE_CHANGES_GEOJSON: FeatureCollection<Polygon> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "ai-change-01",
      properties: {
        title: "New Foundation Excavation Detected (Sentinel-2 L2A)",
        severity: "LOW",
        category: "Satellite Temporal Change",
        varianceConfidence: 0.94,
        previousState: "Vacant Plot (July 2026)",
        currentState: "Active Foundation Pouring (Sept 2026)",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [72.8292, 19.1382],
            [72.8302, 19.1382],
            [72.8302, 19.1386],
            [72.8292, 19.1386],
            [72.8292, 19.1382],
          ],
        ],
      },
    },
  ],
};

// 5. Road Widening Reservation Corridor (18.3m DP Road Line)
export const AI_ROAD_WIDENING_GEOJSON: FeatureCollection<LineString> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "ai-road-widening-01",
      properties: {
        title: "MCGM Development Plan 2034 Road Widening (18.3m Corridor)",
        category: "Road Widening",
        affectedParcels: ["CTS-142/1", "CTS-142/2", "CTS-145"],
        setbackRequiredM: 3.5,
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [72.8265, 19.1379],
          [72.8310, 19.1379],
        ],
      },
    },
  ],
};

// Backwards-compatible export
export const AI_VIOLATION_GEOJSON = AI_ENCROACHMENTS_GEOJSON;
