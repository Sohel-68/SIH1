import { create } from "zustand";

export interface DemoStep {
  stepNumber: number;
  title: string;
  module: string;
  description: string;
  logMessage: string;
  targetHref: string;
}

export const DEMO_STAGES: DemoStep[] = [
  {
    stepNumber: 1,
    title: "GNSS / RTK Field Demarcation",
    module: "SURVEY",
    description: "Field Surveyor Vikram Deshmukh captures 4 corner boundary points with Trimble R12i rover (1.4 cm RTK accuracy).",
    logMessage: "Captured CP-1 [72.8282, 19.1380] to CP-4 [72.8288, 19.1384] with 19 satellites CORS fix.",
    targetHref: "/survey",
  },
  {
    stepNumber: 2,
    title: "Automated Cadastral QA Checklist",
    module: "SURVEY",
    description: "System verifies 7-point cadastral compliance (Closure error 0.002m, Survey of India Class-A tolerance).",
    logMessage: "QA Passed: Polygon closure 0.002m < 0.05m tolerance. Photo evidence SHA-256 integrity verified.",
    targetHref: "/survey",
  },
  {
    stepNumber: 3,
    title: "LADM Property Registration",
    module: "PROPERTY",
    description: "Generates ISO 19152 sovereign land parcel record for CTS-142/1 with 12-level administrative hierarchy.",
    logMessage: "LADM Record created: State 27 (MH) -> District 518 -> Village 00100 -> Parcel CTS-142/1 (1,420 m²).",
    targetHref: "/properties",
  },
  {
    stepNumber: 4,
    title: "3D Bhu-Aadhaar ULPIN Issuance",
    module: "ULPIN",
    description: "Generates deterministic 14-digit base ULPIN and 3D strata key (27518001004201-B01-TA-F05-U502) with QR seal.",
    logMessage: "Generated ULPIN 27518001004201-B01-TA-F05-U502 with cryptographic SHA-256 seal & digital certificate.",
    targetHref: "/ulpin",
  },
  {
    stepNumber: 5,
    title: "3D Digital Twin Volumetric Sync",
    module: "VIEWER_3D",
    description: "WebGL Three.js engine extrudes 18-storey tower mesh, isolating Floor 5, Unit 502 with height bounds.",
    logMessage: "Extruded Tower A (Z-range: 15.0m to 18.0m elevation). Unit 502 spatial polygon synchronized.",
    targetHref: "/viewer-3d",
  },
  {
    stepNumber: 6,
    title: "AI Spatial & Deed Audit",
    module: "AI",
    description: "Computer vision checks 18.3m DP road setback and validates GRAS stamp duty receipt.",
    logMessage: "AI Setback Audit: COMPLIANT (No encroachment on DP corridor). Risk Score: 12/100 (MINIMAL RISK).",
    targetHref: "/ai",
  },
  {
    stepNumber: 7,
    title: "E-Office Statutory Signoff",
    module: "ADMIN",
    description: "Sub-Registrar executes biometric and digital signature endorsement (SIG-GOV-SUB_REGISTRAR-e3b0...).",
    logMessage: "E-Office Case CASE-2024-MH-REV-0482 approved with Class-3 PKI digital signature certificate.",
    targetHref: "/admin",
  },
  {
    stepNumber: 8,
    title: "National Dashboard KPI Update",
    module: "DASHBOARD",
    description: "Real-time indicators increment national verified count, emit live notification, and update activity feed.",
    logMessage: "Executive KPI Updated: Verified ULPINs +1. Live broadcast emitted to all connected dashboards.",
    targetHref: "/",
  },
];

interface DemoModeState {
  isDemoModalOpen: boolean;
  currentStepIndex: number;
  isPlaying: boolean;
  executionLogs: string[];

  setIsDemoModalOpen: (open: boolean) => void;
  setCurrentStepIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  advanceStep: () => void;
  resetDemo: () => void;
}

export const useDemoModeStore = create<DemoModeState>((set, get) => ({
  isDemoModalOpen: false,
  currentStepIndex: 0,
  isPlaying: false,
  executionLogs: ["SIH National Cadastral Demo Engine initialized. Ready to execute simulation."],

  setIsDemoModalOpen: (isDemoModalOpen) => set({ isDemoModalOpen }),
  setCurrentStepIndex: (currentStepIndex) => set({ currentStepIndex }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),

  advanceStep: () => {
    const { currentStepIndex, executionLogs } = get();
    if (currentStepIndex < DEMO_STAGES.length - 1) {
      const nextStage = DEMO_STAGES[currentStepIndex + 1];
      set({
        currentStepIndex: currentStepIndex + 1,
        executionLogs: [...executionLogs, `[${nextStage.module}] ${nextStage.logMessage}`],
      });
    } else {
      set({
        isPlaying: false,
        executionLogs: [...executionLogs, "SIH National Demo completed successfully! All 8 systems synchronized."],
      });
    }
  },

  resetDemo: () => {
    set({
      currentStepIndex: 0,
      isPlaying: false,
      executionLogs: ["Demo reset. Ready to run full national simulation."],
    });
  },
}));
