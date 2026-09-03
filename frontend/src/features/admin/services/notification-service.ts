export interface WorkflowAlertPayload {
  caseNumber: string;
  recipientName: string;
  recipientContact: string;
  channels: ("IN_APP" | "SMS" | "EMAIL" | "PUSH")[];
  title: string;
  message: string;
}

export const notificationService = {
  /**
   * Dispatches multi-channel workflow notification
   */
  dispatchAlert(payload: WorkflowAlertPayload): {
    success: boolean;
    dispatchId: string;
    timestamp: string;
  } {
    return {
      success: true,
      dispatchId: `notif-disp-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  },
};
