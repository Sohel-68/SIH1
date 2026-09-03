import { create } from "zustand";
import type {
  ULPINRecord,
  ULPINGenerationParams,
  BulkULPINBatch,
} from "../types/ulpin-types";
import { SAMPLE_ULPIN_REGISTRY } from "../constants/sample-ulpins";
import { ulpinGenerator } from "../services/ulpin-generator";
import { ulpinValidator } from "../services/ulpin-validator";
import { bulkULPINService } from "../services/bulk-ulpin-service";

export interface ULPINAuditEntry {
  id: string;
  action: "ULPIN_GENERATED" | "ULPIN_VERIFIED" | "ULPIN_REVISED" | "CERTIFICATE_DOWNLOADED" | "BULK_EXPORT";
  ulpin: string;
  timestamp: string;
  user: string;
  details: string;
}

interface ULPINState {
  registry: ULPINRecord[];
  activeUlpinId: string;
  isVersionModalOpen: boolean;
  auditLogs: ULPINAuditEntry[];
  bulkBatches: BulkULPINBatch[];

  // Actions
  selectRecord: (id: string) => void;
  generateNewULPIN: (params: ULPINGenerationParams) => { success: boolean; record?: ULPINRecord; errors?: string[] };
  createRevision: (
    previousId: string,
    params: ULPINGenerationParams,
    reasonForRevision: string
  ) => { success: boolean; record?: ULPINRecord; errors?: string[] };
  verifyULPIN: (query: string) => { record: ULPINRecord | null; status: "AUTHENTIC_ACTIVE" | "SUPERSEDED_HISTORICAL" | "NOT_FOUND" };
  processBulkBatch: (batch: BulkULPINBatch) => void;
  logAuditEvent: (action: ULPINAuditEntry["action"], ulpin: string, details: string) => void;
  setVersionModalOpen: (open: boolean) => void;
}

export const useULPINStore = create<ULPINState>((set, get) => ({
  registry: SAMPLE_ULPIN_REGISTRY,
  activeUlpinId: "ulp-rec-01", // Default to Unit 502
  isVersionModalOpen: false,
  auditLogs: [
    {
      id: "aud-01",
      action: "ULPIN_GENERATED",
      ulpin: "27518001004201-B01-TA-F05-U502",
      timestamp: "14-Jan-2024 11:20:05",
      user: "Sub-Registrar Office, Andheri",
      details: "Official 3D strata ULPIN generation for Unit 502, Palm Heights Tower A.",
    },
    {
      id: "aud-02",
      action: "ULPIN_VERIFIED",
      ulpin: "27518001004201-B01-TA-F05-U502",
      timestamp: "03-Sep-2026 14:45:12",
      user: "Citizen Portal User (Public)",
      details: "QR scan verification verified authentic and current.",
    },
  ],
  bulkBatches: [],

  selectRecord: (activeUlpinId) => set({ activeUlpinId }),

  generateNewULPIN: (params) => {
    const { registry, logAuditEvent } = get();

    // Run validation
    const validation = ulpinValidator.validate(params.hierarchy, params.centroid, registry);
    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const newRecord = ulpinGenerator.generateRecord(params);

    set({
      registry: [newRecord, ...registry],
      activeUlpinId: newRecord.id,
    });

    logAuditEvent(
      "ULPIN_GENERATED",
      newRecord.ulpin3D || newRecord.baseUlpin,
      `Issued for ${newRecord.ownerName}`
    );

    return { success: true, record: newRecord };
  },

  createRevision: (previousId, params, reasonForRevision) => {
    const { registry, logAuditEvent } = get();
    const previousRecord = registry.find((r) => r.id === previousId);

    if (!previousRecord) {
      return { success: false, errors: ["Previous ULPIN record not found in registry."] };
    }

    const newVersion = previousRecord.version + 1;
    const newRecord = ulpinGenerator.generateRecord(params, newVersion, true, reasonForRevision);
    newRecord.previousVersionId = previousId;

    // Mark previous record as superseded (Never overwrite!)
    const updatedRegistry = registry.map((r) => {
      if (r.id === previousId) {
        return {
          ...r,
          isCurrent: false,
          status: "SUPERSEDED" as const,
          supersededByUlpin: newRecord.ulpin3D || newRecord.baseUlpin,
        };
      }
      return r;
    });

    set({
      registry: [newRecord, ...updatedRegistry],
      activeUlpinId: newRecord.id,
    });

    logAuditEvent(
      "ULPIN_REVISED",
      newRecord.ulpin3D || newRecord.baseUlpin,
      `Version ${newVersion} created: ${reasonForRevision}`
    );

    return { success: true, record: newRecord };
  },

  verifyULPIN: (query) => {
    const { registry, logAuditEvent } = get();
    const cleanQ = query.trim().toUpperCase();

    // Match either full 3D ULPIN or 14-digit base ULPIN or parcel number
    const matched = registry.find(
      (r) =>
        r.ulpin3D?.toUpperCase() === cleanQ ||
        r.baseUlpin.toUpperCase() === cleanQ ||
        r.hierarchy.parcelNumber.toUpperCase() === cleanQ ||
        r.ownerName.toUpperCase().includes(cleanQ)
    );

    if (!matched) {
      return { record: null, status: "NOT_FOUND" };
    }

    const status = matched.isCurrent ? "AUTHENTIC_ACTIVE" : "SUPERSEDED_HISTORICAL";
    logAuditEvent(
      "ULPIN_VERIFIED",
      matched.ulpin3D || matched.baseUlpin,
      `Public verification returned: ${status}`
    );

    return { record: matched, status };
  },

  processBulkBatch: (batch) => {
    const { registry, bulkBatches, logAuditEvent } = get();
    const { updatedBatch, newRecords } = bulkULPINService.processBatch(batch, registry);

    set({
      registry: [...newRecords, ...registry],
      bulkBatches: [updatedBatch, ...bulkBatches],
    });

    logAuditEvent(
      "ULPIN_GENERATED",
      `Batch ${batch.batchId}`,
      `Bulk processed ${batch.totalCount} items: ${updatedBatch.successCount} succeeded, ${updatedBatch.failedCount} failed.`
    );
  },

  logAuditEvent: (action, ulpin, details) => {
    const entry: ULPINAuditEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      ulpin,
      timestamp: new Date().toLocaleString(),
      user: "Authorized Registrar",
      details,
    };
    set((state) => ({ auditLogs: [entry, ...state.auditLogs] }));
  },

  setVersionModalOpen: (isVersionModalOpen) => set({ isVersionModalOpen }),
}));
