import type { PropertyLifecycleState } from "../types/intelligence-types";
import type { UserRole } from "@/features/auth/types";

export interface LifecycleMetadata {
  state: PropertyLifecycleState;
  title: string;
  description: string;
  badgeVariant: "default" | "secondary" | "accent" | "success" | "warning" | "danger" | "outline";
  allowedNextStates: PropertyLifecycleState[];
  requiredRoleToTransition: UserRole[];
}

export const PROPERTY_LIFECYCLE: Record<PropertyLifecycleState, LifecycleMetadata> = {
  VACANT_LAND: {
    state: "VACANT_LAND",
    title: "Vacant Land",
    description: "Raw agricultural or non-agricultural ground parcel without active construction.",
    badgeVariant: "outline",
    allowedNextStates: ["CONSTRUCTION", "SURVEY"],
    requiredRoleToTransition: ["SURVEY_OFFICER", "GOVERNMENT_OFFICER", "SUPER_ADMIN"],
  },
  CONSTRUCTION: {
    state: "CONSTRUCTION",
    title: "Under Construction",
    description: "Structural development active per municipal commencement certificate.",
    badgeVariant: "secondary",
    allowedNextStates: ["SURVEY", "VERIFICATION"],
    requiredRoleToTransition: ["SURVEY_OFFICER", "GOVERNMENT_OFFICER", "SUPER_ADMIN"],
  },
  SURVEY: {
    state: "SURVEY",
    title: "Survey In Progress",
    description: "DGPS rover and spatial boundary measurements being recorded on site.",
    badgeVariant: "warning",
    allowedNextStates: ["VERIFICATION"],
    requiredRoleToTransition: ["SURVEY_OFFICER", "SUPER_ADMIN"],
  },
  VERIFICATION: {
    state: "VERIFICATION",
    title: "Statutory Verification",
    description: "Boundary review and non-overlapping topological checks by Cadastral Officer.",
    badgeVariant: "accent",
    allowedNextStates: ["ULPIN_ASSIGNED", "SURVEY"],
    requiredRoleToTransition: ["GOVERNMENT_OFFICER", "DISTRICT_REGISTRAR", "SUPER_ADMIN"],
  },
  ULPIN_ASSIGNED: {
    state: "ULPIN_ASSIGNED",
    title: "Bhu-Aadhaar Assigned",
    description: "14-digit national ULPIN key generated and cryptographically bound to centroid.",
    badgeVariant: "default",
    allowedNextStates: ["TAX_ACTIVE", "TRANSFER"],
    requiredRoleToTransition: ["GOVERNMENT_OFFICER", "DISTRICT_REGISTRAR", "SUPER_ADMIN"],
  },
  TAX_ACTIVE: {
    state: "TAX_ACTIVE",
    title: "Tax Active & Registered",
    description: "Municipal property tax assessed and annual revenue record active.",
    badgeVariant: "success",
    allowedNextStates: ["TRANSFER", "ARCHIVED"],
    requiredRoleToTransition: ["DISTRICT_REGISTRAR", "STATE_ADMIN", "SUPER_ADMIN"],
  },
  TRANSFER: {
    state: "TRANSFER",
    title: "Ownership Transfer / Mutation",
    description: "Active mutation proceeding under Form 6 for deed of sale, partition, or inheritance.",
    badgeVariant: "warning",
    allowedNextStates: ["TAX_ACTIVE", "VERIFICATION"],
    requiredRoleToTransition: ["DISTRICT_REGISTRAR", "STATE_ADMIN", "SUPER_ADMIN"],
  },
  ARCHIVED: {
    state: "ARCHIVED",
    title: "Archived Historical Record",
    description: "Superseded parent parcel preserved for historical title chain audit.",
    badgeVariant: "outline",
    allowedNextStates: [],
    requiredRoleToTransition: ["SUPER_ADMIN"],
  },
};
