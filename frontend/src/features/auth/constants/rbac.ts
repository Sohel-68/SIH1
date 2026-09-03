import type { Permission, UserRole, AuthUser } from "../types";

export interface RoleMetadata {
  role: UserRole;
  title: string;
  description: string;
  badgeVariant: "default" | "secondary" | "accent" | "success" | "warning" | "danger" | "outline";
  hierarchyLevel: number;
}

export const ROLES_METADATA: Record<UserRole, RoleMetadata> = {
  SUPER_ADMIN: {
    role: "SUPER_ADMIN",
    title: "Super Administrator",
    description: "National Directorate administrator with universal system and security governance.",
    badgeVariant: "danger",
    hierarchyLevel: 100,
  },
  STATE_ADMIN: {
    role: "STATE_ADMIN",
    title: "State Administrator",
    description: "State department administrator managing district registrars and state CRS configurations.",
    badgeVariant: "default",
    hierarchyLevel: 80,
  },
  DISTRICT_REGISTRAR: {
    role: "DISTRICT_REGISTRAR",
    title: "District Registrar",
    description: "Senior revenue officer authorizing title deeds, encumbrances, and vertical disputes.",
    badgeVariant: "secondary",
    hierarchyLevel: 60,
  },
  GOVERNMENT_OFFICER: {
    role: "GOVERNMENT_OFFICER",
    title: "Government Cadastral Officer",
    description: "Revenue officer validating 2D boundaries and issuing 3D Bhu-Aadhaar keys.",
    badgeVariant: "accent",
    hierarchyLevel: 40,
  },
  SURVEY_OFFICER: {
    role: "SURVEY_OFFICER",
    title: "Survey Officer",
    description: "Licensed field surveyor capturing DGPS rover telemetry and strata slabs.",
    badgeVariant: "warning",
    hierarchyLevel: 20,
  },
  CITIZEN: {
    role: "CITIZEN",
    title: "Citizen",
    description: "Property owner or applicant searching titles and verifying 3D ULPIN authenticity.",
    badgeVariant: "outline",
    hierarchyLevel: 10,
  },
};

/**
 * Enterprise Role-to-Permission Mapping Matrix
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: [
    "parcel:read",
    "parcel:write",
    "parcel:delete",
    "strata:extrude",
    "strata:subdivide",
    "survey:submit",
    "survey:review",
    "survey:approve",
    "ulpin:generate",
    "ulpin:verify",
    "deed:upload",
    "deed:verify",
    "audit:read",
    "audit:export",
    "user:manage",
    "system:config",
    "analytics:read",
    "reports:generate",
  ],
  STATE_ADMIN: [
    "parcel:read",
    "parcel:write",
    "strata:extrude",
    "strata:subdivide",
    "survey:review",
    "survey:approve",
    "ulpin:generate",
    "ulpin:verify",
    "deed:verify",
    "audit:read",
    "user:manage",
    "analytics:read",
    "reports:generate",
  ],
  DISTRICT_REGISTRAR: [
    "parcel:read",
    "parcel:write",
    "strata:extrude",
    "survey:review",
    "survey:approve",
    "ulpin:generate",
    "ulpin:verify",
    "deed:upload",
    "deed:verify",
    "audit:read",
    "reports:generate",
  ],
  GOVERNMENT_OFFICER: [
    "parcel:read",
    "parcel:write",
    "strata:extrude",
    "survey:review",
    "ulpin:generate",
    "ulpin:verify",
    "deed:upload",
    "reports:generate",
  ],
  SURVEY_OFFICER: [
    "parcel:read",
    "strata:extrude",
    "survey:submit",
    "ulpin:verify",
    "deed:upload",
  ],
  CITIZEN: [
    "parcel:read",
    "ulpin:verify",
    "deed:upload",
  ],
};

/**
 * Route-to-Permission Mapping for Menu & Route Guards
 */
export const ROUTE_PERMISSIONS: Record<string, { roles?: UserRole[]; permissions?: Permission[] }> = {
  "/": {}, // Home / Dashboard overview open to all authenticated users
  "/gis": { permissions: ["parcel:read"] },
  "/viewer-3d": { permissions: ["strata:extrude"] },
  "/properties": { permissions: ["parcel:read"] },
  "/survey": { permissions: ["survey:submit", "survey:review"] },
  "/ulpin": { permissions: ["ulpin:generate", "ulpin:verify"] },
  "/documents": { permissions: ["deed:upload", "deed:verify"] },
  "/analytics": { permissions: ["analytics:read"] },
  "/ai": { permissions: ["analytics:read"] },
  "/activity": {},
  "/reports": { permissions: ["reports:generate"] },
  "/admin": { roles: ["SUPER_ADMIN", "STATE_ADMIN"] },
  "/settings": {},
  "/audit": { permissions: ["audit:read"] },
};

/**
 * Pre-configured Test Personas for seamless evaluation of all 6 Government Roles
 */
export const DEMO_PERSONAS: Record<UserRole, AuthUser> = {
  SUPER_ADMIN: {
    id: "usr-super-admin-001",
    email: "dir.general@geostrata.gov.in",
    username: "superadmin",
    fullName: "Dr. Rajeshwar Sharma, IAS",
    role: "SUPER_ADMIN",
    employeeId: "GOI-NIC-9901",
    department: "Department of Land Resources (DoLR), MoRD",
    state: "National Jurisdiction",
    district: "New Delhi Central",
    lastLogin: "Today at 09:15 AM",
    permissions: ROLE_PERMISSIONS.SUPER_ADMIN,
  },
  STATE_ADMIN: {
    id: "usr-state-admin-002",
    email: "sec.revenue.mh@geostrata.gov.in",
    username: "stateadmin_mh",
    fullName: "Smt. Sunita Deshmukh",
    role: "STATE_ADMIN",
    employeeId: "MH-REV-4102",
    department: "Maharashtra Settlement & Land Records",
    state: "Maharashtra",
    district: "Pune HQ",
    lastLogin: "Yesterday at 04:30 PM",
    permissions: ROLE_PERMISSIONS.STATE_ADMIN,
  },
  DISTRICT_REGISTRAR: {
    id: "usr-dist-reg-003",
    email: "reg.mumbai.sub@geostrata.gov.in",
    username: "registrar_mum",
    fullName: "Shri Anand Kulkarni",
    role: "DISTRICT_REGISTRAR",
    employeeId: "MH-REG-1055",
    department: "Registration and Stamp Department",
    state: "Maharashtra",
    district: "Mumbai Suburban",
    lastLogin: "Today at 10:00 AM",
    permissions: ROLE_PERMISSIONS.DISTRICT_REGISTRAR,
  },
  GOVERNMENT_OFFICER: {
    id: "usr-gov-off-004",
    email: "officer.andheri@geostrata.gov.in",
    username: "govofficer",
    fullName: "Pooja Patil",
    role: "GOVERNMENT_OFFICER",
    employeeId: "MH-REV-8821",
    department: "Cadastral Valuation & Strata Division",
    state: "Maharashtra",
    district: "Mumbai Suburban (Andheri)",
    lastLogin: "Today at 11:20 AM",
    permissions: ROLE_PERMISSIONS.GOVERNMENT_OFFICER,
  },
  SURVEY_OFFICER: {
    id: "usr-surv-off-005",
    email: "surveyor.vikram@geostrata.gov.in",
    username: "surveyor_vikram",
    fullName: "Vikram Singh",
    role: "SURVEY_OFFICER",
    employeeId: "SOI-DGPS-3341",
    department: "Survey of India (Cadastral Wing)",
    state: "Maharashtra",
    district: "Mumbai City",
    lastLogin: "Today at 08:00 AM",
    permissions: ROLE_PERMISSIONS.SURVEY_OFFICER,
  },
  CITIZEN: {
    id: "usr-citizen-006",
    email: "citizen.arun@gmail.com",
    username: "arun_patel",
    fullName: "Arun V. Patel",
    role: "CITIZEN",
    aadhaarMasked: "XXXXXXXX4821",
    state: "Maharashtra",
    district: "Mumbai Suburban",
    lastLogin: "2 days ago",
    permissions: ROLE_PERMISSIONS.CITIZEN,
  },
};
