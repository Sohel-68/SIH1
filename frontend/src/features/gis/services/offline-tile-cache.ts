import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "geostrata-gis-offline";
const DB_VERSION = 1;
const TILE_STORE = "map-tiles";
const EDITS_STORE = "offline-edits";

export interface OfflineQueuedEdit {
  id: string;
  timestamp: number;
  operationType: "CREATE_PARCEL" | "MUTATION" | "SURVEY_DEMARCATION";
  payload: unknown;
  status: "QUEUED" | "SYNCED" | "FAILED";
}

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDB() {
  if (typeof window === "undefined") return null;
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(TILE_STORE)) {
          db.createObjectStore(TILE_STORE);
        }
        if (!db.objectStoreNames.contains(EDITS_STORE)) {
          db.createObjectStore(EDITS_STORE, { keyPath: "id" });
        }
      },
    });
  }
  return dbPromise;
}

export const offlineTileCache = {
  /**
   * Caches a map tile blob in IndexedDB
   */
  async cacheTile(tileKey: string, tileBlob: Blob): Promise<void> {
    const db = await getDB();
    if (!db) return;
    await db.put(TILE_STORE, tileBlob, tileKey);
  },

  /**
   * Retrieves a cached tile if available
   */
  async getTile(tileKey: string): Promise<Blob | undefined> {
    const db = await getDB();
    if (!db) return undefined;
    return db.get(TILE_STORE, tileKey);
  },

  /**
   * Queues a cadastral edit created while in field offline
   */
  async queueOfflineEdit(edit: Omit<OfflineQueuedEdit, "id" | "timestamp" | "status">): Promise<string> {
    const db = await getDB();
    const id = `edit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const queuedEdit: OfflineQueuedEdit = {
      ...edit,
      id,
      timestamp: Date.now(),
      status: "QUEUED",
    };
    if (db) {
      await db.put(EDITS_STORE, queuedEdit);
    }
    return id;
  },

  /**
   * Get all pending edits
   */
  async getQueuedEdits(): Promise<OfflineQueuedEdit[]> {
    const db = await getDB();
    if (!db) return [];
    return db.getAll(EDITS_STORE);
  },
};
