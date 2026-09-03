import type {
  BulkULPINBatch,
  BulkULPINItem,
  ULPINRecord,
} from "../types/ulpin-types";
import { ulpinGenerator } from "./ulpin-generator";
import { ulpinValidator } from "./ulpin-validator";

export const bulkULPINService = {
  /**
   * Process a Batch of ULPIN Generation Requests
   */
  processBatch(
    batch: BulkULPINBatch,
    existingRegistry: ULPINRecord[]
  ): { updatedBatch: BulkULPINBatch; newRecords: ULPINRecord[] } {
    const newRecords: ULPINRecord[] = [];
    let successCount = 0;
    let failedCount = 0;

    const processedItems: BulkULPINItem[] = batch.items.map((item) => {
      const validation = ulpinValidator.validate(
        item.params.hierarchy,
        item.params.centroid,
        [...existingRegistry, ...newRecords]
      );

      if (!validation.isValid) {
        failedCount++;
        return {
          ...item,
          status: "ERROR",
          error: validation.errors.join("; "),
        };
      }

      const record = ulpinGenerator.generateRecord(item.params);
      newRecords.push(record);
      successCount++;

      return {
        ...item,
        status: "SUCCESS",
        resultRecord: record,
      };
    });

    const updatedBatch: BulkULPINBatch = {
      ...batch,
      status: "COMPLETED",
      successCount,
      failedCount,
      items: processedItems,
    };

    return { updatedBatch, newRecords };
  },

  /**
   * Convert ULPIN Records to Standard CSV
   */
  exportToCSV(records: ULPINRecord[]): string {
    const headers = [
      "ULPIN_Base",
      "ULPIN_3D",
      "Version",
      "Status",
      "State",
      "District",
      "Taluka",
      "Village",
      "Survey_No",
      "Parcel_No",
      "Unit_No",
      "Owner_Name",
      "Carpet_Area_Sqm",
      "Volume_Cum",
      "Centroid_Lng",
      "Centroid_Lat",
      "Elevation_AMSL",
      "Issue_Date",
      "Verification_Hash",
    ];

    const rows = records.map((r) => [
      r.baseUlpin,
      r.ulpin3D || "N/A",
      r.version,
      r.status,
      r.hierarchy.stateCode,
      r.hierarchy.districtCode,
      r.hierarchy.talukaCode,
      r.hierarchy.villageCode,
      `"${r.hierarchy.surveyNumber}"`,
      `"${r.hierarchy.parcelNumber}"`,
      r.hierarchy.unitNumber || "N/A",
      `"${r.ownerName}"`,
      r.carpetAreaSqm,
      r.volumeCum || "N/A",
      r.centroid[0],
      r.centroid[1],
      r.elevationAmsl,
      r.issueDate,
      r.verificationHash,
    ]);

    return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
  },
};
