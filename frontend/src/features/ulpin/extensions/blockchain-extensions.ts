/**
 * Blockchain & Distributed Ledger Extension Interfaces
 * Architectural contracts for immutable ULPIN anchoring and cryptographic title verification.
 */

export interface BlockchainAnchorReceipt {
  ledgerNetwork: "HYPERLEDGER_FABRIC" | "POLYGON_ENTERPRISE" | "BHARAT_BLOCKCHAIN";
  blockNumber: number;
  transactionHash: string;
  blockTimestamp: string;
  stateRootHash: string;
  isConfirmed: boolean;
}

export interface IBlockchainLedgerAdapter {
  anchorULPINRecord: (
    ulpin: string,
    verificationHash: string,
    version: number
  ) => Promise<BlockchainAnchorReceipt>;
}

export interface ImmutableTitleProof {
  ulpin: string;
  ownerHash: string;
  centroidSpatialHash: string;
  validFromTimestamp: string;
  validToTimestamp?: string;
  isRevoked: boolean;
}

export interface IImmutableHashStorage {
  verifyTitleProof: (ulpin: string, providedHash: string) => Promise<boolean>;
  fetchTitleHistory: (ulpin: string) => Promise<ImmutableTitleProof[]>;
}
