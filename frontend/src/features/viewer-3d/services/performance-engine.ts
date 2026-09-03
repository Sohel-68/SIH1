import * as THREE from "three";

export type LODTier = "LOD1_MASSING" | "LOD2_EXTERIOR" | "LOD3_STRATA_UNITS";

export const performanceEngine = {
  /**
   * Determine optimal Level of Detail (LOD) based on camera distance to building centroid
   */
  calculateLOD(cameraDistance: number): LODTier {
    if (cameraDistance > 160) {
      return "LOD1_MASSING"; // 2.5D Prismatic bounding envelope
    }
    if (cameraDistance > 65) {
      return "LOD2_EXTERIOR"; // Architectural facade & floor plates
    }
    return "LOD3_STRATA_UNITS"; // Volumetric strata apartments & interior partitions
  },

  /**
   * Deep dispose Three.js geometry, materials, and textures from GPU VRAM
   */
  disposeHierarchy(object: THREE.Object3D): void {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach((mat) => mat.dispose());
        } else if (child.material) {
          child.material.dispose();
        }
      }
    });
  },
};
