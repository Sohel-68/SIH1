import type { KPICardItem, JurisdictionScope } from "../types/analytics-types";

export const NATIONAL_KPIS: Record<JurisdictionScope, KPICardItem[]> = {
  NATIONAL: [
    { id: "kpi-parcels", label: "Total Land Parcels", value: "142,850,210", changeText: "+2.4% MoM", trend: "up", category: "LAND", iconName: "Layers" },
    { id: "kpi-buildings", label: "Total 3D Buildings", value: "8,412,900", changeText: "+5.1% MoM", trend: "up", category: "LAND", iconName: "Building2" },
    { id: "kpi-units", label: "Vertical Strata Units", value: "32,840,150", changeText: "+6.8% MoM", trend: "up", category: "LAND", iconName: "Box" },
    { id: "kpi-ulpins", label: "Generated Bhu-Aadhaar ULPINs", value: "118,420,500", changeText: "82.9% National Coverage", trend: "up", category: "ULPIN", iconName: "QrCode" },
    { id: "kpi-verified-ulpins", label: "Verified ULPINs", value: "98,140,200", changeText: "+12.3% Verification rate", trend: "up", category: "ULPIN", iconName: "ShieldCheck" },
    { id: "kpi-surveys-pending", label: "Pending Field Surveys", value: "482,100", changeText: "-4.2% Backlog clearance", trend: "down", category: "SURVEY", iconName: "Clock" },
    { id: "kpi-surveys-completed", label: "Completed Surveys (DGPS/RTK)", value: "14,280,450", changeText: "+8.9% This quarter", trend: "up", category: "SURVEY", iconName: "CheckCircle2" },
    { id: "kpi-pending-qa", label: "Pending District QA", value: "32,450", changeText: "Avg SLA: 3.2 days", trend: "neutral", category: "SURVEY", iconName: "FileCheck" },
    { id: "kpi-rejected-surveys", label: "Rejected Surveys (Re-survey)", value: "14,820", changeText: "1.03% Error rate", trend: "down", category: "SURVEY", iconName: "XCircle" },
    { id: "kpi-mutations", label: "Form 6 Ferfar Mutations", value: "3,892,100", changeText: "+14.2% Digital registrations", trend: "up", category: "LAND", iconName: "FileText" },
    { id: "kpi-disputes", label: "Active Boundary Disputes", value: "84,120", changeText: "-18.4% Post-DGPS demarcation", trend: "down", category: "DISPUTE", iconName: "AlertTriangle" },
    { id: "kpi-owners", label: "Registered Proprietary Owners", value: "89,450,200", changeText: "+3.8% MoM", trend: "up", category: "LAND", iconName: "Users" },
  ],

  STATE_MH: [
    { id: "kpi-parcels", label: "Total Land Parcels (MH)", value: "16,420,500", changeText: "+3.1% MoM", trend: "up", category: "LAND", iconName: "Layers" },
    { id: "kpi-buildings", label: "Total 3D Buildings", value: "1,842,100", changeText: "+6.4% MoM", trend: "up", category: "LAND", iconName: "Building2" },
    { id: "kpi-units", label: "Vertical Strata Units", value: "6,920,400", changeText: "+8.2% MoM", trend: "up", category: "LAND", iconName: "Box" },
    { id: "kpi-ulpins", label: "Generated Bhu-Aadhaar ULPINs", value: "14,950,200", changeText: "91.0% State Coverage", trend: "up", category: "ULPIN", iconName: "QrCode" },
    { id: "kpi-verified-ulpins", label: "Verified ULPINs", value: "13,100,500", changeText: "+14.1% MoM", trend: "up", category: "ULPIN", iconName: "ShieldCheck" },
    { id: "kpi-surveys-pending", label: "Pending Field Surveys", value: "42,100", changeText: "-8.1% Clearance", trend: "down", category: "SURVEY", iconName: "Clock" },
    { id: "kpi-surveys-completed", label: "Completed Surveys (DGPS/RTK)", value: "2,140,800", changeText: "+11.4% MoM", trend: "up", category: "SURVEY", iconName: "CheckCircle2" },
    { id: "kpi-pending-qa", label: "Pending District QA", value: "3,820", changeText: "Avg SLA: 2.1 days", trend: "neutral", category: "SURVEY", iconName: "FileCheck" },
    { id: "kpi-rejected-surveys", label: "Rejected Surveys", value: "1,240", changeText: "0.58% Error rate", trend: "down", category: "SURVEY", iconName: "XCircle" },
    { id: "kpi-mutations", label: "MahaBhulekh Mutations", value: "482,100", changeText: "+16.8% MoM", trend: "up", category: "LAND", iconName: "FileText" },
    { id: "kpi-disputes", label: "Active Boundary Disputes", value: "8,420", changeText: "-22.1% Post-DGPS", trend: "down", category: "DISPUTE", iconName: "AlertTriangle" },
    { id: "kpi-owners", label: "Registered Property Owners", value: "11,840,200", changeText: "+4.2% MoM", trend: "up", category: "LAND", iconName: "Users" },
  ],

  DISTRICT_MUMBAI: [
    { id: "kpi-parcels", label: "Total Cadastral Parcels", value: "324,500", changeText: "+1.2% MoM", trend: "up", category: "LAND", iconName: "Layers" },
    { id: "kpi-buildings", label: "Total High-Rise Towers", value: "42,800", changeText: "+4.8% MoM", trend: "up", category: "LAND", iconName: "Building2" },
    { id: "kpi-units", label: "Strata Apartments (Units)", value: "1,420,500", changeText: "+7.4% MoM", trend: "up", category: "LAND", iconName: "Box" },
    { id: "kpi-ulpins", label: "Issued 3D & 2D ULPINs", value: "1,680,200", changeText: "96.4% District Coverage", trend: "up", category: "ULPIN", iconName: "QrCode" },
    { id: "kpi-verified-ulpins", label: "Verified Title ULPINs", value: "1,540,800", changeText: "+18.2% MoM", trend: "up", category: "ULPIN", iconName: "ShieldCheck" },
    { id: "kpi-surveys-pending", label: "Pending Cadastral Orders", value: "1,420", changeText: "SLA Compliant", trend: "down", category: "SURVEY", iconName: "Clock" },
    { id: "kpi-surveys-completed", label: "Completed Surveys (DGPS)", value: "182,400", changeText: "+14.2% MoM", trend: "up", category: "SURVEY", iconName: "CheckCircle2" },
    { id: "kpi-pending-qa", label: "Pending Registrar Review", value: "284", changeText: "Sub-Registrar Queue", trend: "neutral", category: "SURVEY", iconName: "FileCheck" },
    { id: "kpi-rejected-surveys", label: "Rejected Demarcations", value: "42", changeText: "0.23% Re-survey rate", trend: "down", category: "SURVEY", iconName: "XCircle" },
    { id: "kpi-mutations", label: "City Survey CTS Mutations", value: "64,200", changeText: "Andheri / Versova / Borivali", trend: "up", category: "LAND", iconName: "FileText" },
    { id: "kpi-disputes", label: "Contested Easement Disputes", value: "412", changeText: "High Court / Revenue Court", trend: "down", category: "DISPUTE", iconName: "AlertTriangle" },
    { id: "kpi-owners", label: "Verified Khatedar Owners", value: "1,240,500", changeText: "MCGM Tax Integrated", trend: "up", category: "LAND", iconName: "Users" },
  ],
};
