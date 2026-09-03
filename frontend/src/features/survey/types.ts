export interface SurveyPoint {
  latitude: number;
  longitude: number;
  altitudeAMSL: number;
  accuracyMeters: number;
  timestamp: number;
}

export interface SurveyOrderAssignment {
  orderId: string;
  parcelId: string;
  targetAddress: string;
  scheduledDate: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}
