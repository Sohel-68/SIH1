import type { AIDetectionRecord } from "../types/ai-types";

export const SAMPLE_AI_DETECTIONS: AIDetectionRecord[] = [
  // 1. Critical Road & Setback Encroachment
  {
    id: "ai-det-01",
    detectionType: "ENCROACHMENT",
    severity: "CRITICAL",
    targetUlpin: "27518001004204",
    parcelId: "parcel-04",
    title: "Airspace Road Setback Encroachment (3.2m)",
    coordinates: [72.8278, 19.1378],
    explanation: {
      confidencePercent: 94.8,
      primaryReason:
        "Building concrete plinth and boundary compound wall protrude 3.2 meters into the statutory 18.3m Versova Development Plan (DP) road widening corridor.",
      evidenceDetails: {
        encroachingMeters: 3.2,
        encroachingAreaSqm: 48.5,
        affectedBoundaryEdge: "Western Boundary (DP Road Edge)",
        coordinateDelta: [0.000032, 0.000015],
      },
      legalStatutoryReference: "Section 53 & 55, Maharashtra Regional and Town Planning Act (MRTP), 1966",
      actionableRecommendation:
        "Issue statutory 30-day demolition / rectification notice. Restrict mutation transfer until clearance.",
    },
    detectedAt: "03-Sep-2026 09:14:02",
    status: "NOTICE_ISSUED",
  },

  // 2. High-Severity Document Forgery Anomaly
  {
    id: "ai-det-02",
    detectionType: "DOCUMENT_FORGERY",
    severity: "HIGH",
    targetUlpin: "27518001004180",
    parcelId: "parcel-18",
    title: "Conveyance Deed Stamp Duty & GRAS Receipt Mismatch",
    coordinates: [72.8295, 19.1365],
    explanation: {
      confidencePercent: 91.4,
      primaryReason:
        "Deed OCR extracted Government Receipt Accounting System (GRAS) Challan #MH-2023-88914 does not match treasury reconciliation database.",
      evidenceDetails: {
        documentChecksumMismatch: "GRAS Treasury Hash Discrepancy: Expected 0x8a9f, Found 0x12bc",
      },
      legalStatutoryReference: "Section 59, Indian Stamp Act, 1899 & Section 468/471 IPC",
      actionableRecommendation:
        "Flag deed in Sub-Registrar audit queue. Withhold biometric title endorsement pending Treasury clearance.",
    },
    detectedAt: "02-Sep-2026 14:22:50",
    status: "UNREVIEWED",
  },

  // 3. Medium-Severity Structural Facade Deflection (3D Digital Twin)
  {
    id: "ai-det-03",
    detectionType: "STRUCTURAL_DAMAGE",
    severity: "MEDIUM",
    targetUlpin: "27518001004201-B02",
    parcelId: "parcel-01",
    title: "Cantilever Facade Deflection (>18mm) on Tower B",
    coordinates: [72.8285, 19.1382],
    explanation: {
      confidencePercent: 88.2,
      primaryReason:
        "3D mesh comparison against baseline BIM structural model indicates 18.5mm downward shear deflection on Floor 4 cantilever slab.",
      evidenceDetails: {
        damageSeverityPercent: 32.4,
      },
      legalStatutoryReference: "National Building Code of India (NBC 2016) Part 6 Structural Design",
      actionableRecommendation:
        "Dispatch municipal structural auditor. Issue advisory to society management for load testing.",
    },
    detectedAt: "01-Sep-2026 16:40:11",
    status: "UNREVIEWED",
  },

  // 4. High-Severity Satellite Change Detection (Unauthorized Shed)
  {
    id: "ai-det-04",
    detectionType: "SATELLITE_CHANGE",
    severity: "HIGH",
    targetUlpin: "27518001004202",
    parcelId: "parcel-02",
    title: "Unauthorized 142 m² Industrial Shed Addition",
    coordinates: [72.8302, 19.1382],
    explanation: {
      confidencePercent: 96.1,
      primaryReason:
        "Bi-temporal satellite change analysis (March 2021 vs August 2026) detected new high-reflectance tin roof structure not present on approved CTS layout.",
      evidenceDetails: {
        encroachingAreaSqm: 142.0,
      },
      legalStatutoryReference: "Section 351, Mumbai Municipal Corporation Act (MMC Act), 1888",
      actionableRecommendation:
        "Inspect municipal property tax assessment records. Verify building permission sanctions.",
    },
    detectedAt: "28-Aug-2026 11:05:33",
    status: "CONFIRMED_VIOLATION",
  },

  // 5. Critical CRZ-II Coastal Buffer Zone Violation
  {
    id: "ai-det-05",
    detectionType: "ENCROACHMENT",
    severity: "CRITICAL",
    targetUlpin: "27518001004210",
    parcelId: "parcel-10",
    title: "Coastal Regulation Zone (CRZ-II) High Tide Buffer Violation",
    coordinates: [72.8242, 19.1395],
    explanation: {
      confidencePercent: 97.5,
      primaryReason:
        "Construction activities identified within 42.0m of the Arabian Sea High Tide Line (HTL), violating the mandatory 100m No Development Zone (NDZ).",
      evidenceDetails: {
        encroachingMeters: 58.0,
        encroachingAreaSqm: 280.0,
      },
      legalStatutoryReference: "Coastal Regulation Zone (CRZ) Notification, 2019 under Environment Protection Act, 1986",
      actionableRecommendation:
        "Immediate stop-work notice by Maharashtra Coastal Zone Management Authority (MCZMA).",
    },
    detectedAt: "26-Aug-2026 08:30:15",
    status: "NOTICE_ISSUED",
  },
];
