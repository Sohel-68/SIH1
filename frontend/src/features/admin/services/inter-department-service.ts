import type {
  GovernmentCase,
  NotingSheetEntry,
} from "../types/case-types";
import type {
  GovernmentDepartment,
  GovernmentRole,
} from "../types/workflow-types";

export interface ForwardCaseRequest {
  caseId: string;
  fromRole: GovernmentRole;
  fromName: string;
  toDepartment: GovernmentDepartment;
  toRole: GovernmentRole;
  officialRemarks: string;
}

export const interDepartmentService = {
  /**
   * Forwards an active government file to another department with official noting sheet record
   */
  forwardCase(
    caseItem: GovernmentCase,
    req: ForwardCaseRequest
  ): {
    updatedCase: GovernmentCase;
    newNotingEntry: NotingSheetEntry;
  } {
    const nextParagraphNum = caseItem.notingSheet.length + 1;

    const newNotingEntry: NotingSheetEntry = {
      id: `note-${Date.now()}`,
      paragraphNumber: nextParagraphNum,
      authorName: req.fromName,
      authorRole: req.fromRole,
      department: caseItem.currentDepartment,
      remarks: req.officialRemarks,
      timestamp: new Date().toLocaleString(),
      actionTaken: "FORWARD",
      forwardedToDepartment: req.toDepartment,
      forwardedToRole: req.toRole,
    };

    const updatedCase: GovernmentCase = {
      ...caseItem,
      currentDepartment: req.toDepartment,
      currentAssigneeRole: req.toRole,
      currentAssigneeName: `Officer (${req.toRole.replace("_", " ")})`,
      notingSheet: [...caseItem.notingSheet, newNotingEntry],
    };

    return { updatedCase, newNotingEntry };
  },
};
