/**
 * Digital Twin Linkage Contracts
 * Bridge connecting Cadastral Land Administration to 3D Volumetric Digital Twin.
 */

export type LODLevel = "LOD1" | "LOD2" | "LOD3";

export interface DigitalTwinLinkage {
  parcelId: string;
  baseUlpin: string;
  buildingId?: string;
  towerId?: string;
  floorId?: string;
  unitId?: string;
  ulpin3D?: string;
  model3D: {
    lodLevel: LODLevel;
    meshFormat: "GLTF" | "GLB" | "OBJ" | "CITYGML";
    modelUrl?: string;
    boundingVolumeCum: number;
    zMinAmsl: number;
    zMaxAmsl: number;
    transformationMatrix?: number[];
  };
  syncedWithCadastre: boolean;
  lastSpatialSyncTimestamp: string;
}
