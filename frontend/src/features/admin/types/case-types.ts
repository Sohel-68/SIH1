import type {
  GovernmentDepartment,
  GovernmentRole,
  CaseType,
  CaseStatus,
  CasePriority,
} from "./workflow-types";

export interface NotingSheetEntry {
  id: string;
  paragraphNumber: number; // e.g. 1, 2, 3 (standard Government format)
  authorName: string;
  authorRole: GovernmentRole;
  department: GovernmentDepartment;
  remarks: string;
  timestamp: string;
  actionTaken: "NOTE" | "FORWARD" | "ORDER_SURVEY" | "APPROVE" | "REJECT" | "ESCALATE";
  forwardedToDepartment?: GovernmentDepartment;
  forwardedToRole?: GovernmentRole;
  digitalSignatureHash?: string;
}

export interface CaseAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  sha256Hash: string;
}

export interface GovernmentCase {
  id: string;
  caseNumber: string; // e.g. "CASE-2024-MH-REV-0482"
  fileNumber: string; // e.g. "FILE-ANDHERI-CTS-142/1"
  title: string;
  caseType: CaseType;
  currentDepartment: GovernmentDepartment;
  currentAssigneeRole: GovernmentRole;
  currentAssigneeName: string;
  applicantName: string;
  applicantMaskedId: string;
  priority: CasePriority;
  status: CaseStatus;
  targetUlpin?: string;
  targetParcelId: string;
  village: string;
  surveyNumber: string;
  filingDate: string;
  statutoryDeadline: string;
  slaDaysRemaining: number;
  isEscalated: boolean;
  escalationReason?: string;
  notingSheet: NotingSheetEntry[];
  attachments: CaseAttachment[];
}

export interface WorkflowTask {
  taskId: string;
  caseId: string;
  caseNumber: string;
  taskType: "SURVEY" | "REVIEW" | "APPROVAL" | "INSPECTION" | "VERIFICATION";
  title: string;
  assignedToRole: GovernmentRole;
  assignedToName: string;
  dueDate: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
}
