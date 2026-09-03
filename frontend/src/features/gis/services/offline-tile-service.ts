import { openDB, type IDBPDatabase } from "idb";
import type { CadastralParcel } from "../types/gis-types";

const DB_NAME = "geostrata_gis_offline_db";
const DB_VERSION = 1;

interface OfflineGISSchema {
  cached_parcels: {
    key: string;
    value: CadastralParcel;
  };
  offline_edit_queue: {
    key: string;
    value: {
      id: string;
      action: "CREATE" | "UPDATE" | "DELETE";
      parcel: Partial<CadastralParcel>;
      timestamp: number;
      synced: boolean;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<OfflineGISSchema>> | null = null;

function getDB() {
  if (typeof window === "undefined") return null;
  if (!dbPromise) {
    dbPromise = openDB<OfflineGISSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("cached_parcels")) {
          db.createObjectStore("cached_parcels", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("offline_edit_queue")) {
          db.createObjectStore("offline_edit_queue", { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

export const offlineGISService = {
  /**
   * Cache parcels into IndexedDB for offline spatial queries
   */
  async cacheParcels(parcels: CadastralParcel[]): Promise<void> {
    const db = await getDB();
    if (!db) return;

    const tx = db.transaction("cached_parcels", "readwrite");
    for (const parcel of parcels) {
      await tx.store.put(parcel);
    }
    await tx.done;
  },

  /**
   * Retrieve cached parcels when offline
   */
  async getCachedParcels(): Promise<CadastralParcel[]> {
    const db = await getDB();
    if (!db) return [];
    return db.getAll("cached_parcels");
  },

  /**
   * Queue an offline geometry mutation (create/edit)
   */
  async queueOfflineEdit(
    action: "CREATE" | "UPDATE" | "DELETE",
    parcel: Partial<CadastralParcel>
  ): Promise<string> {
    const db = await getDB();
    const id = parcel.id || `offline-edit-${Date.now()}`;
    if (!db) return id;

    await db.put("offline_edit_queue", {
      id,
      action,
      parcel,
      timestamp: Date.now(),
      synced: false,
    });

    return id;
  },

  /**
   * Retrieve pending offline mutations for synchronization
   */
  async getPendingQueue(): Promise<any[]> {
    const db = await getDB();
    if (!db) return [];
    return db.getAll("offline_edit_queue");
  },

  /**
   * Clear synced mutations
   */
  async clearQueueItem(id: string): Promise<void> {
    const db = await getDB();
    if (!db) return;
    await db.delete("offline_edit_queue", id);
  },
};
