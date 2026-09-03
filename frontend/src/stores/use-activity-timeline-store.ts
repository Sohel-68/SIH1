import { create } from "zustand";

export type ActivityModule =
  | "GIS"
  | "PROPERTY"
  | "VIEWER_3D"
  | "SURVEY"
  | "ULPIN"
  | "AI"
  | "ADMIN";

export interface ActivityEvent {
  id: string;
  module: ActivityModule;
  title: string;
  actor: string;
  targetIdentifier: string;
  timestamp: string;
  severity: "INFO" | "SUCCESS" | "WARNING" | "CRITICAL";
  details: string;
}

interface ActivityTimelineState {
  events: ActivityEvent[];
  selectedModule: ActivityModule | "ALL";
  searchQuery: string;

  setSelectedModule: (mod: ActivityModule | "ALL") => void;
  setSearchQuery: (query: string) => void;
  addEvent: (event: Omit<ActivityEvent, "id">) => void;
  exportTimelineCSV: () => string;
}

const SAMPLE_TIMELINE_EVENTS: ActivityEvent[] = [
  {
    id: "act-01",
    module: "ADMIN",
    title: "Statutory Adjudication Order Signed",
    actor: "Anil Deshmukh (Sub-Registrar)",
    targetIdentifier: "CASE-2024-MH-REV-0482",
    timestamp: "03-Sep-2026 15:45:00",
    severity: "SUCCESS",
    details: "Applied Class-3 PKI digital signature to Mutation Order for CTS-142/1.",
  },
  {
    id: "act-02",
    module: "AI",
    title: "Airspace Road Setback Encroachment Detected",
    actor: "GeoStrata AI Vision Engine",
    targetIdentifier: "27518001004204 (CTS-144/A)",
    timestamp: "03-Sep-2026 09:14:02",
    severity: "CRITICAL",
    details: "Structure protrudes 3.2m into statutory 18.3m Versova DP road widening corridor.",
  },
  {
    id: "act-03",
    module: "ULPIN",
    title: "3D Bhu-Aadhaar ULPIN Generated",
    actor: "ULPIN Deterministic Engine",
    targetIdentifier: "27518001004201-B01-TA-F05-U502",
    timestamp: "03-Sep-2026 08:30:10",
    severity: "SUCCESS",
    details: "Generated 3D strata key with cryptographic SHA-256 seal and SVG QR code.",
  },
  {
    id: "act-04",
    module: "SURVEY",
    title: "Cadastral Survey Demarcation Completed",
    actor: "Vikram Deshmukh (Survey Officer)",
    targetIdentifier: "SM-2024-MH-401",
    timestamp: "02-Sep-2026 17:15:30",
    severity: "SUCCESS",
    details: "Recorded 4 boundary corner markers using Trimble R12i GNSS. Horizontal precision 1.4 cm.",
  },
  {
    id: "act-05",
    module: "VIEWER_3D",
    title: "Volumetric Digital Twin Synchronized",
    actor: "Three.js WebGL Engine",
    targetIdentifier: "Palm Heights Complex",
    timestamp: "02-Sep-2026 14:00:22",
    severity: "INFO",
    details: "Extruded 18 floors and 72 strata units from cadastral polygon boundary.",
  },
  {
    id: "act-06",
    module: "PROPERTY",
    title: "Form 6 Ferfar Mutation Lodged",
    actor: "Rajiv M. Mehra (Applicant)",
    targetIdentifier: "CTS-142/1",
    timestamp: "01-Sep-2026 11:30:15",
    severity: "INFO",
    details: "Gift deed registered under document #4412/2026 for Joint Title Addition.",
  },
];

export const useActivityTimelineStore = create<ActivityTimelineState>((set, get) => ({
  events: SAMPLE_TIMELINE_EVENTS,
  selectedModule: "ALL",
  searchQuery: "",

  setSelectedModule: (selectedModule) => set({ selectedModule }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  addEvent: (event) => {
    const newEvt: ActivityEvent = {
      ...event,
      id: `act-${Date.now()}`,
    };
    set((state) => ({ events: [newEvt, ...state.events] }));
  },

  exportTimelineCSV: () => {
    const events = get().events;
    const rows = [
      `"GeoStrata National Cadastral Activity Timeline"`,
      `"Export Date: ${new Date().toLocaleString()}"`,
      `""`,
      `"Event ID","Module","Title","Actor","Target Identifier","Timestamp","Severity","Details"`,
      ...events.map(
        (e) =>
          `"${e.id}","${e.module}","${e.title}","${e.actor}","${e.targetIdentifier}","${e.timestamp}","${e.severity}","${e.details.replace(/"/g, '""')}"`
      ),
    ];
    return rows.join("\n");
  },
}));
