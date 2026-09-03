import type {
  AdministrativeHierarchyCodes,
  ULPINRecord,
  ULPINValidationResult,
} from "../types/ulpin-types";
import { ULPIN_FORMATS } from "../constants/ulpin-formats";
import { indiaBoundaryService } from "@/features/property/services/india-boundary-service";

export const ulpinValidator = {
  /**
   * Validate Administrative Hierarchy and Parameters before ULPIN Generation
   */
  validate(
    hierarchy: AdministrativeHierarchyCodes,
    centroid: [number, number],
    existingRegistry: ULPINRecord[],
    currentId?: string
  ): ULPINValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    let hierarchyValid = true;
    let noDuplicateUlpin = true;
    let noDuplicateParcel = true;
    let geometryMatched = true;
    let surveyMatched = true;
    let checksumValid = true;

    // 1. India-First Sovereign Boundary Validation
    if (!indiaBoundaryService.isInsideIndia(centroid[0], centroid[1])) {
      errors.push("Geospatial centroid coordinates fall outside the sovereign territory of the Republic of India.");
      geometryMatched = false;
    }

    // 2. Hierarchy Codes Validation
    if (!hierarchy.stateCode || hierarchy.stateCode.length !== 2) {
      errors.push("Invalid State LGD Code. Must be exactly 2 numeric digits.");
      hierarchyValid = false;
    }
    if (!hierarchy.districtCode || hierarchy.districtCode.length !== 3) {
      errors.push("Invalid District LGD Code. Must be exactly 3 numeric digits.");
      hierarchyValid = false;
    }
    if (!hierarchy.villageCode) {
      errors.push("Revenue Village Code is required.");
      hierarchyValid = false;
    }
    if (!hierarchy.surveyNumber) {
      errors.push("Cadastral Survey Number is mandatory.");
      surveyMatched = false;
    }
    if (!hierarchy.parcelNumber) {
      errors.push("Cadastral Parcel Number is mandatory.");
      hierarchyValid = false;
    }

    // 3. Duplicate Active Parcel & ULPIN Checks
    const duplicateParcel = existingRegistry.find(
      (r) =>
        r.isCurrent &&
        r.id !== currentId &&
        r.hierarchy.stateCode === hierarchy.stateCode &&
        r.hierarchy.districtCode === hierarchy.districtCode &&
        r.hierarchy.villageCode === hierarchy.villageCode &&
        r.hierarchy.parcelNumber === hierarchy.parcelNumber &&
        r.hierarchy.unitNumber === hierarchy.unitNumber
    );

    if (duplicateParcel) {
      noDuplicateParcel = false;
      noDuplicateUlpin = false;
      errors.push(
        `Active parcel record already exists in registry: ${duplicateParcel.ulpin3D || duplicateParcel.baseUlpin} (Version ${duplicateParcel.version}). Please issue a revision instead of duplicating.`
      );
    }

    // 4. Centroid Coordinates Validity
    if (centroid[0] < -180 || centroid[0] > 180 || centroid[1] < -90 || centroid[1] > 90) {
      errors.push("Invalid WGS-84 centroid coordinates.");
      geometryMatched = false;
    }

    const isValid = errors.length === 0;

    return {
      isValid,
      checks: {
        hierarchyValid,
        noDuplicateUlpin,
        noDuplicateParcel,
        geometryMatched,
        surveyMatched,
        checksumValid,
      },
      errors,
      warnings,
    };
  },

  /**
   * Validate ULPIN String Syntax against Official Government Pattern
   */
  validateSyntax(ulpinString: string): boolean {
    const isBase14 = new RegExp(ULPIN_FORMATS.BASE_14_DIGIT.pattern).test(ulpinString);
    const isStrata3D = new RegExp(ULPIN_FORMATS.STRATA_3D.pattern).test(ulpinString);
    return isBase14 || isStrata3D;
  },
};
