/**
 * Identity & Access Management (IAM) Core Types
 * Conforming to Government of India Digital Security Standards.
 */

export type UserRole =
  | "SUPER_ADMIN"
  | "STATE_ADMIN"
  | "DISTRICT_REGISTRAR"
  | "GOVERNMENT_OFFICER"
  | "SURVEY_OFFICER"
  | "CITIZEN";

export type Permission =
  | "parcel:read"
  | "parcel:write"
  | "parcel:delete"
  | "strata:extrude"
  | "strata:subdivide"
  | "survey:submit"
  | "survey:review"
  | "survey:approve"
  | "ulpin:generate"
  | "ulpin:verify"
  | "deed:upload"
  | "deed:verify"
  | "audit:read"
  | "audit:export"
  | "user:manage"
  | "system:config"
  | "analytics:read"
  | "reports:generate";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number; // Seconds
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string;
  role: UserRole;
  employeeId?: string;
  aadhaarMasked?: string;
  department?: string;
  state?: string;
  district?: string;
  avatarUrl?: string;
  lastLogin: string;
  permissions: Permission[];
}

export interface SessionDetails {
  id: string;
  ipAddress: string;
  userAgent: string;
  browser: string;
  os: string;
  deviceType: "Desktop" | "Mobile" | "Tablet";
  loginTime: string;
  lastActiveTime: string;
  isCurrentSession: boolean;
}

export interface AuditSecurityEvent {
  action: "LOGIN" | "LOGOUT" | "TOKEN_REFRESH" | "PASSWORD_RESET" | "SESSION_EXPIRY" | "ACCESS_DENIED";
  actorId: string;
  actorRole: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface LoginResponseData {
  user: AuthUser;
  tokens: AuthTokens;
  session: SessionDetails;
}
