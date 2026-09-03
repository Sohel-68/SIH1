export interface DigitalSignatureSeal {
  algorithm: "RSA-SHA256" | "ECDSA-P256";
  signerName: string;
  signerDesignation: string;
  department: string;
  signedTimestamp: string;
  signatureHash: string; // e.g. "SIG-GOV-REGISTRAR-..."
}

export interface ULPINCertificateData {
  certificateNumber: string;
  baseUlpin: string;
  ulpin3D?: string;
  version: number;
  parcelNumber: string;
  surveyNumber: string;
  subdivision: string;
  ownerName: string;
  ownerMaskedId: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  carpetAreaSqm: number;
  volumeCum?: number;
  elevationAmsl: number;
  issueDate: string;
  certifyingAuthority: string;
  qrPayload: string;
  verificationHash: string;
  signatureSeal: DigitalSignatureSeal;
}
