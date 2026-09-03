import { openDB, type DBSchema, type IDBPDatabase } from "idb";

interface GeoStrataOfflineDB extends DBSchema {
  mutation_queue: {
    key: string;
    value: {
      id: string;
      endpoint: string;
      method: string;
      payload: any;
      timestamp: number;
      retryCount: number;
    };
    indexes: { "by-timestamp": number };
  };
  cached_parcels: {
    key: string;
    value: any;
  };
}

const DB_NAME = "geostrata_offline_db";
const DB_VERSION = 1;

export async function getOfflineDB(): Promise<IDBPDatabase<GeoStrataOfflineDB>> {
  return openDB<GeoStrataOfflineDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("mutation_queue")) {
        const store = db.createObjectStore("mutation_queue", { keyPath: "id" });
        store.createIndex("by-timestamp", "timestamp");
      }
      if (!db.objectStoreNames.contains("cached_parcels")) {
        db.createObjectStore("cached_parcels", { keyPath: "id" });
      }
    },
  });
}
