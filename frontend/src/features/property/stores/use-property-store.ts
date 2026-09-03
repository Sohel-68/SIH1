import { create } from "zustand";
import type { PropertyDossier, PropertyLifecycleState, MutationEntry } from "../types/intelligence-types";
import type { AdministrativeNode } from "../types/hierarchy-types";
import { SAMPLE_PROPERTY_DOSSIER } from "../constants/sample-intelligence";
import { SAMPLE_HIERARCHY_TREE } from "../constants/hierarchy-nodes";
import { indiaBoundaryService } from "../services/india-boundary-service";

interface PropertyState {
  dossier: PropertyDossier;
  hierarchyNodes: AdministrativeNode[];
  selectedNodeId: string;
  expandedNodeIds: string[];
  boundaryViolationAlert: string | null;

  setDossier: (dossier: PropertyDossier) => void;
  selectHierarchyNode: (nodeId: string) => void;
  toggleExpandNode: (nodeId: string) => void;
  addMutationRecord: (entry: MutationEntry) => void;
  updateLifecycleState: (newState: PropertyLifecycleState) => void;
  setBoundaryViolationAlert: (alert: string | null) => void;
  checkCadastralOperationAllowed: (coords: [number, number], operation: string) => boolean;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  dossier: SAMPLE_PROPERTY_DOSSIER,
  hierarchyNodes: SAMPLE_HIERARCHY_TREE,
  selectedNodeId: "node-unit-502",
  expandedNodeIds: [
    "node-india",
    "node-mh",
    "node-mum-sub",
    "node-andheri",
    "node-versova",
    "node-ward-kw",
    "node-cts-142",
    "node-subdiv-1",
    "node-parcel-401a",
    "node-bldg-palm",
    "node-floor-5",
  ],
  boundaryViolationAlert: null,

  setDossier: (dossier) => set({ dossier }),

  selectHierarchyNode: (selectedNodeId) => {
    set({ selectedNodeId });
  },

  toggleExpandNode: (nodeId) => {
    set((state) => ({
      expandedNodeIds: state.expandedNodeIds.includes(nodeId)
        ? state.expandedNodeIds.filter((id) => id !== nodeId)
        : [...state.expandedNodeIds, nodeId],
    }));
  },

  addMutationRecord: (entry) => {
    set((state) => ({
      dossier: {
        ...state.dossier,
        mutationHistory: [entry, ...state.dossier.mutationHistory],
      },
    }));
  },

  updateLifecycleState: (lifecycleState) => {
    set((state) => ({
      dossier: {
        ...state.dossier,
        lifecycleState,
      },
    }));
  },

  setBoundaryViolationAlert: (boundaryViolationAlert) => set({ boundaryViolationAlert }),

  checkCadastralOperationAllowed: (coords, operation) => {
    const result = indiaBoundaryService.validateCadastralOperation(coords, operation);
    if (!result.allowed) {
      set({ boundaryViolationAlert: result.reason || null });
      return false;
    }
    return true;
  },
}));
