/**
 * ISO 19152: Land Administration Domain Model (LADM)
 * Conforming to Government of India Digital Land Governance Architecture.
 */

import type { Feature, Polygon, MultiPolygon } from "geojson";

// 1. LA_Party: Natural persons, corporations, government authorities
export type PartyType =
  | "NATURAL_PERSON"
  | "LEGAL_ENTITY"
  | "GOVERNMENT_DEPARTMENT"
  | "JOINT_OWNERS"
  | "COMMUNITY_BODY";

export interface LA_Party {
  id: string;
  type: PartyType;
  name: string;
  identifierType: "AADHAAR_HASH" | "PAN" | "CIN" | "GOV_OFFICER_ID" | "PASSPORT";
  identifierMasked: string;
  shareRatio: number; // e.g. 0.5 for 50%, 1.0 for sole ownership
  isPrimaryContact: boolean;
  contactNumber?: string;
  email?: string;
  address: string;
}

// 2. LA_RRR: Rights, Restrictions, Responsibilities
export type RightType =
  | "FREEHOLD"
  | "LEASEHOLD"
  | "STRATA_TITLE"
  | "CUSTOMARY"
  | "SUBLEASE"
  | "USUFRUCT";

export interface LA_Right {
  id: string;
  type: RightType;
  holderPartyId: string;
  validFrom: string;
  validTo?: string;
  sharePercentage: number;
  description?: string;
}

export type RestrictionType =
  | "MORTGAGE_LIEN"
  | "COURT_INJUNCTION"
  | "COASTAL_REGULATION_ZONE"
  | "PUBLIC_RIGHT_OF_WAY"
  | "HERITAGE_RESTRICTION"
  | "MINING_RESTRICTION";

export interface LA_Restriction {
  id: string;
  type: RestrictionType;
  beneficiaryAuthority: string;
  encumbranceAmount?: number;
  validFrom: string;
  validTo?: string;
  courtCaseNumber?: string;
  isActive: boolean;
  details: string;
}

export type ResponsibilityType =
  | "ANNUAL_PROPERTY_TAX"
  | "STATUTORY_MAINTENANCE"
  | "MUNICIPAL_DEVELOPMENT_CESS"
  | "NON_AGRICULTURAL_ASSESSMENT";

export interface LA_Responsibility {
  id: string;
  type: ResponsibilityType;
  obligedPartyId: string;
  annualFee: number;
  duePeriod: string;
  paymentStatus: "PAID" | "PENDING" | "OVERDUE";
}

export interface LA_RRR {
  rights: LA_Right[];
  restrictions: LA_Restriction[];
  responsibilities: LA_Responsibility[];
}

// 3. LA_BAUnit: Basic Administrative Unit
export interface LA_BAUnit {
  id: string;
  cadastralDeedNumber: string;
  registrationOffice: string;
  deedDate: string;
  stampDutyAmount: number;
  marketValuation: number;
  la_rrr: LA_RRR;
}

// 4. LA_SpatialUnit: 2D ground parcels, 3D buildings, floors, volumetric units
export type SpatialUnitType =
  | "GROUND_PARCEL"
  | "BUILDING_ENVELOPE"
  | "FLOOR_SLAB"
  | "VOLUMETRIC_UNIT";

export interface LA_SpatialUnit {
  id: string;
  type: SpatialUnitType;
  baseUlpin: string;
  ulpin3D?: string;
  areaSqm: number;
  volumeCum?: number;
  elevationAmsl: number;
  zMinAmsl?: number;
  zMaxAmsl?: number;
  geometry: Feature<Polygon | MultiPolygon>;
}

// 5. LA_SpatialSource: Survey documents, drone ortho-mosaics, title deeds
export interface LA_SpatialSource {
  id: string;
  type: "SURVEY_MAP" | "TITLE_DEED" | "DRONE_ORTHOPHOTO" | "DGPS_ROVER_LOG" | "INDEX_II";
  documentName: string;
  issuingAuthority: string;
  issuedDate: string;
  fileUrl?: string;
  cryptographicHash: string; // SHA-256 tamper-evident hash
  isDigitallySigned: boolean;
}
