import { useGISStore } from "@/features/gis/stores/use-gis-store";
import { useDigitalTwinStore } from "../stores/use-digital-twin-store";

export const gisSyncService = {
  /**
   * Sync from 2D GIS to 3D Digital Twin
   * When a user clicks a parcel in the 2D map, focus the same 3D building and units.
   */
  syncParcelTo3D(ulpin: string): { success: boolean; targetNodeId?: string } {
    const twinStore = useDigitalTwinStore.getState();
    const targetNode = twinStore.nodes.find(
      (n) => n.metadata.ulpin === ulpin || n.metadata.ulpin3D?.startsWith(ulpin)
    );

    if (targetNode) {
      twinStore.selectNode(targetNode.id);
      return { success: true, targetNodeId: targetNode.id };
    }

    return { success: false };
  },

  /**
   * Sync from 3D Digital Twin back to 2D GIS
   * Synchronize viewport center, bearing, and zoom level.
   */
  sync3DToGIS(): void {
    const twinStore = useDigitalTwinStore.getState();
    const gisStore = useGISStore.getState();

    const selectedNode = twinStore.nodes.find((n) => n.id === twinStore.selectedNodeId);
    if (selectedNode) {
      const { longitude, latitude } = selectedNode.coordinates;
      gisStore.setCenter([longitude, latitude]);
      gisStore.setZoom(18);
    }
  },
};
