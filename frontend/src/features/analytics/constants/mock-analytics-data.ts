import type {
  SurveyorProductivityItem,
  LandUseBreakdown,
  AIInspectionAlert,
  ExecutiveActivityItem,
} from "../types/analytics-types";

export const SURVEYOR_LEADERBOARD: SurveyorProductivityItem[] = [
  {
    officerId: "usr-srv-01",
    officerName: "Vikram Deshmukh",
    district: "Mumbai Suburban (Andheri)",
    missionsCompleted: 142,
    parcelsSurveyed: 584,
    avgAccuracyCm: 1.4,
    qaApprovalRate: 99.3,
    status: "ACTIVE_FIELD",
  },
  {
    officerId: "usr-srv-02",
    officerName: "Priya Nair",
    district: "Mumbai Suburban (Borivali)",
    missionsCompleted: 128,
    parcelsSurveyed: 512,
    avgAccuracyCm: 1.5,
    qaApprovalRate: 98.8,
    status: "ACTIVE_FIELD",
  },
  {
    officerId: "usr-srv-03",
    officerName: "Rajesh Shinde",
    district: "Thane (Kalyan)",
    missionsCompleted: 114,
    parcelsSurveyed: 468,
    avgAccuracyCm: 1.8,
    qaApprovalRate: 97.4,
    status: "QA_REVIEW",
  },
  {
    officerId: "usr-srv-04",
    officerName: "Amit Kulkarni",
    district: "Pune (Haveli)",
    missionsCompleted: 98,
    parcelsSurveyed: 410,
    avgAccuracyCm: 1.6,
    qaApprovalRate: 98.1,
    status: "ACTIVE_FIELD",
  },
  {
    officerId: "usr-srv-05",
    officerName: "Sunita Patil",
    district: "Nagpur (Urban)",
    missionsCompleted: 86,
    parcelsSurveyed: 350,
    avgAccuracyCm: 1.7,
    qaApprovalRate: 96.9,
    status: "ON_LEAVE",
  },
];

export const LAND_USE_DISTRIBUTION: LandUseBreakdown[] = [
  { category: "Residential (Plotted & Strata)", count: 74280, percentage: 52, areaHectares: 14200, color: "bg-gov-primary" },
  { category: "Commercial & Office Parks", count: 25710, percentage: 18, areaHectares: 4900, color: "bg-gov-accent" },
  { category: "Government & Public Utilities", count: 17140, percentage: 12, areaHectares: 3300, color: "bg-purple-600" },
  { category: "Vacant & Agricultural Reserve", count: 14280, percentage: 10, areaHectares: 2750, color: "bg-amber-500" },
  { category: "Industrial & Warehousing", count: 11440, percentage: 8, areaHectares: 2200, color: "bg-slate-500" },
];

export const ULPIN_THROUGHPUT_METRICS = {
  generatedToday: 18420,
  verifiedToday: 42850,
  pendingVerification: 1420,
  duplicateAttemptsBlocked: 84,
  revisionsRecorded: 342,
  certificateDownloads: 9810,
  qrScansToday: 64280,
  avgGenerationTimeMs: 42,
};

export const SURVEY_QUALITY_METRICS = {
  avgAccuracyCm: 1.6,
  satelliteCountAvg: 18.4,
  rtkFixUsagePercent: 94.2,
  photoEvidenceCoveragePercent: 98.6,
  qaApprovalFirstPassPercent: 98.9,
  rejectionRatePercent: 1.1,
};

export const DIGITAL_TWIN_METRICS = {
  buildingsModelled: 42800,
  totalFloorsExtruded: 385200,
  totalUnitsMapped: 1420500,
  averageBuildingHeightMeters: 48.2,
  coveragePercent: 88.4,
  syncStatus: "SYNCHRONIZED",
};

export const AI_INSPECTION_ALERTS: AIInspectionAlert[] = [
  {
    id: "ai-alt-01",
    type: "ENCROACHMENT",
    severity: "CRITICAL",
    title: "Airspace Setback Encroachment (3.2m)",
    parcelOrUlpin: "27518001004204 (CTS-144/A)",
    location: "Western Link Road, Versova",
    riskScore: 92,
    detectionDate: "03-Sep-2026",
    status: "NOTICE_ISSUED",
  },
  {
    id: "ai-alt-02",
    type: "FORGERY_SUSPECT",
    severity: "HIGH",
    title: "Conveyance Deed Stamp Duty Anomaly",
    parcelOrUlpin: "27518001004180 (CTS-139)",
    location: "Andheri West, Mumbai Suburban",
    riskScore: 78,
    detectionDate: "02-Sep-2026",
    status: "PENDING_INVESTIGATION",
  },
  {
    id: "ai-alt-03",
    type: "STRUCTURAL_DAMAGE",
    severity: "MEDIUM",
    title: "Cantilever Facade Deflection (>15mm)",
    parcelOrUlpin: "27518001004201-B02 (Tower B)",
    location: "Palm Heights Complex, Versova",
    riskScore: 64,
    detectionDate: "01-Sep-2026",
    status: "PENDING_INVESTIGATION",
  },
];

export const EXECUTIVE_NOTIFICATIONS: ExecutiveActivityItem[] = [
  {
    id: "notif-01",
    type: "MUTATION_APPROVED",
    title: "Mutation Deed #7421 Approved by Sub-Registrar",
    timestamp: "10 mins ago",
    actor: "Anil Deshmukh (Registrar)",
    targetId: "27518001004201-B01-TA-F05-U502",
  },
  {
    id: "notif-02",
    type: "COURT_STAY_NOTICE",
    title: "High Court Contested Easement Notice Lodged",
    timestamp: "45 mins ago",
    actor: "High Court Registry",
    targetId: "CTS-144/A (Versova)",
  },
  {
    id: "notif-03",
    type: "SURVEY_SUBMITTED",
    title: "Field Demarcation Mission SM-2024-MH-401 Ready for QA",
    timestamp: "2 hours ago",
    actor: "Vikram Deshmukh (Surveyor)",
    targetId: "SM-2024-MH-401",
  },
];
