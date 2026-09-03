import { create } from "zustand";
import type { GovernmentCase, NotingSheetEntry } from "../types/case-types";
import type { CaseStatus, GovernmentDepartment, GovernmentRole } from "../types/workflow-types";
import { SAMPLE_GOVERNMENT_CASES } from "../constants/sample-cases";
import { interDepartmentService } from "../services/inter-department-service";
import { workflowEngine } from "../services/workflow-engine";

export type InboxFolder = "PENDING" | "ASSIGNED" | "APPROVED" | "REJECTED" | "ALL";

interface WorkflowState {
  cases: GovernmentCase[];
  selectedCaseId: string;
  activeInboxTab: InboxFolder;
  searchFilter: string;
  isForwardModalOpen: boolean;
  isSignoffModalOpen: boolean;
  isNewCaseModalOpen: boolean;

  // Actions
  selectCase: (id: string) => void;
  setActiveInboxTab: (tab: InboxFolder) => void;
  setSearchFilter: (filter: string) => void;
  setForwardModalOpen: (open: boolean) => void;
  setSignoffModalOpen: (open: boolean) => void;
  setNewCaseModalOpen: (open: boolean) => void;

  addNotingEntry: (caseId: string, remarks: string, authorName: string, authorRole: GovernmentRole) => void;
  updateCaseStatus: (caseId: string, status: CaseStatus, remarks: string, authorName: string, authorRole: GovernmentRole) => void;
  forwardCaseToDepartment: (
    caseId: string,
    toDepartment: GovernmentDepartment,
    toRole: GovernmentRole,
    officialRemarks: string,
    fromName: string,
    fromRole: GovernmentRole
  ) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  cases: SAMPLE_GOVERNMENT_CASES,
  selectedCaseId: "case-rev-01",
  activeInboxTab: "PENDING",
  searchFilter: "",
  isForwardModalOpen: false,
  isSignoffModalOpen: false,
  isNewCaseModalOpen: false,

  selectCase: (selectedCaseId) => set({ selectedCaseId }),
  setActiveInboxTab: (activeInboxTab) => set({ activeInboxTab }),
  setSearchFilter: (searchFilter) => set({ searchFilter }),
  setForwardModalOpen: (isForwardModalOpen) => set({ isForwardModalOpen }),
  setSignoffModalOpen: (isSignoffModalOpen) => set({ isSignoffModalOpen }),
  setNewCaseModalOpen: (isNewCaseModalOpen) => set({ isNewCaseModalOpen }),

  addNotingEntry: (caseId, remarks, authorName, authorRole) => {
    set((state) => ({
      cases: state.cases.map((c) => {
        if (c.id !== caseId) return c;
        const newEntry: NotingSheetEntry = {
          id: `note-${Date.now()}`,
          paragraphNumber: c.notingSheet.length + 1,
          authorName,
          authorRole,
          department: c.currentDepartment,
          remarks,
          timestamp: new Date().toLocaleString(),
          actionTaken: "NOTE",
        };
        return {
          ...c,
          notingSheet: [...c.notingSheet, newEntry],
        };
      }),
    }));
  },

  updateCaseStatus: (caseId, status, remarks, authorName, authorRole) => {
    set((state) => ({
      cases: state.cases.map((c) => {
        if (c.id !== caseId) return c;
        const sigHash = workflowEngine.generateDigitalSignature(authorName, authorRole, c.caseNumber);
        const newEntry: NotingSheetEntry = {
          id: `note-${Date.now()}`,
          paragraphNumber: c.notingSheet.length + 1,
          authorName,
          authorRole,
          department: c.currentDepartment,
          remarks: `${remarks} [Official Decision: ${status}]`,
          timestamp: new Date().toLocaleString(),
          actionTaken: status === "APPROVED" ? "APPROVE" : status === "REJECTED" ? "REJECT" : "NOTE",
          digitalSignatureHash: sigHash,
        };
        return {
          ...c,
          status,
          notingSheet: [...c.notingSheet, newEntry],
        };
      }),
    }));
  },

  forwardCaseToDepartment: (caseId, toDepartment, toRole, officialRemarks, fromName, fromRole) => {
    const targetCase = get().cases.find((c) => c.id === caseId);
    if (!targetCase) return;

    const { updatedCase } = interDepartmentService.forwardCase(targetCase, {
      caseId,
      fromRole,
      fromName,
      toDepartment,
      toRole,
      officialRemarks,
    });

    set((state) => ({
      cases: state.cases.map((c) => (c.id === caseId ? updatedCase : c)),
      isForwardModalOpen: false,
    }));
  },
}));
