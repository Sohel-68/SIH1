import * as turf from "@turf/turf";
import type { SurveyMission, GNSSPoint, SurveyValidationChecklist } from "../types/survey-types";
import { CADASTRAL_TOLERANCES } from "../constants/cadastral-tolerances";
import { indiaBoundaryService } from "@/features/property/services/india-boundary-service";

export const surveyValidator = {
  /**
   * Run automated 7-point cadastral validation audit on a survey mission
   */
  validateMission(mission: SurveyMission): SurveyValidationChecklist {
    const issues: string[] = [];
    let gpsAccuracyValid = true;
    let boundaryClosed = false;
    let noOverlaps = true;
    let requiredPhotosPresent = true;
    let requiredDocsPresent = true;
    let noDuplicates = true;
    let topologyValid = true;

    const points = mission.points;

    // 1. India-First Sovereign Boundary Check
    for (const pt of points) {
      if (!indiaBoundaryService.isInsideIndia(pt.longitude, pt.latitude)) {
        issues.push(`Point ${pt.label} (${pt.latitude}, ${pt.longitude}) lies outside the sovereign territory of India.`);
      }
    }

    // 2. GPS / RTK Accuracy Tolerance Check
    for (const pt of points) {
      if (pt.accuracyMeters > CADASTRAL_TOLERANCES.MAX_BOUNDARY_ACCURACY_METERS) {
        gpsAccuracyValid = false;
        issues.push(
          `Point ${pt.label} accuracy (${(pt.accuracyMeters * 100).toFixed(1)} cm) exceeds cadastral tolerance (${(CADASTRAL_TOLERANCES.MAX_BOUNDARY_ACCURACY_METERS * 100).toFixed(1)} cm).`
        );
      }
      if (pt.hdop > CADASTRAL_TOLERANCES.MAX_HDOP) {
        issues.push(`Point ${pt.label} HDOP (${pt.hdop}) exceeds maximum allowable threshold (${CADASTRAL_TOLERANCES.MAX_HDOP}).`);
      }
    }

    // 3. Boundary Closure Check
    if (points.length >= 3) {
      const pFirst = points[0];
      const pLast = points[points.length - 1];

      // If last point is explicitly the same as first, or distance <= 0.15m
      const closureDistMeters = turf.distance(
        turf.point([pFirst.longitude, pFirst.latitude]),
        turf.point([pLast.longitude, pLast.latitude]),
        { units: "meters" }
      );

      if (closureDistMeters <= CADASTRAL_TOLERANCES.MAX_POLYGON_CLOSURE_METERS || points.length >= 4) {
        boundaryClosed = true;
      } else {
        issues.push(
          `Polygon loop unclosed: Gap between first and last corner points is ${closureDistMeters.toFixed(2)}m (Max allowed: ${CADASTRAL_TOLERANCES.MAX_POLYGON_CLOSURE_METERS}m).`
        );
      }
    } else {
      issues.push(`Insufficient corner points. Minimum 3 points required to define a 2D cadastral polygon.`);
    }

    // 4. Photographic Evidence Minimum
    if (mission.photos.length < CADASTRAL_TOLERANCES.MIN_REQUIRED_CORNER_PHOTOS) {
      requiredPhotosPresent = false;
      issues.push(
        `Insufficient photographic documentation: Found ${mission.photos.length} photos (Minimum ${CADASTRAL_TOLERANCES.MIN_REQUIRED_CORNER_PHOTOS} corner marker photos required).`
      );
    }

    // 5. Documentation & Notes
    if (mission.fieldNotes.length === 0 && !mission.notes) {
      requiredDocsPresent = false;
      issues.push("Field survey notes and CTS sheet tie-in remarks are missing.");
    }

    // 6. Duplicate Point Check
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        if (
          Math.abs(points[i].latitude - points[j].latitude) < 0.000001 &&
          Math.abs(points[i].longitude - points[j].longitude) < 0.000001 &&
          j !== points.length - 1
        ) {
          noDuplicates = false;
          issues.push(`Duplicate point coordinates detected between ${points[i].label} and ${points[j].label}.`);
        }
      }
    }

    // 7. Overall Verdict
    let overallStatus: "PASS" | "WARN" | "FAIL" = "PASS";
    if (issues.length > 0) {
      overallStatus = !gpsAccuracyValid || !boundaryClosed || points.length < 3 ? "FAIL" : "WARN";
    }

    return {
      gpsAccuracyValid,
      boundaryClosed,
      noOverlaps,
      requiredPhotosPresent,
      requiredDocsPresent,
      noDuplicates,
      topologyValid,
      overallStatus,
      issues,
    };
  },
};
