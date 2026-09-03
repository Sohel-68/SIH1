import { openDB, type IDBPDatabase } from "idb";
import type { SurveyMission, GNSSPoint, SurveyPhoto } from "../types/survey-types";

const DB_NAME = "geostrata_survey_offline_db";
const DB_VERSION = 1;

interface SurveyOfflineSchema {
  survey_missions: {
    key: string;
    value: SurveyMission;
  };
  captured_points: {
    key: string;
    value: GNSSPoint & { missionId: string };
  };
  captured_photos: {
    key: string;
    value: SurveyPhoto & { missionId: string };
  };
  survey_sync_queue: {
    key: string;
    value: {
      missionId: string;
      action: "SUBMIT_SURVEY" | "UPDATE_POINTS" | "UPLOAD_PHOTOS";
      payload: any;
      timestamp: number;
      synced: boolean;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<SurveyOfflineSchema>> | null = null;

function getDB() {
  if (typeof window === "undefined") return null;
  if (!dbPromise) {
    dbPromise = openDB<SurveyOfflineSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("survey_missions")) {
          db.createObjectStore("survey_missions", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("captured_points")) {
          db.createObjectStore("captured_points", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("captured_photos")) {
          db.createObjectStore("captured_photos", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("survey_sync_queue")) {
          db.createObjectStore("survey_sync_queue", { keyPath: "missionId" });
        }
      },
    });
  }
  return dbPromise;
}

export const offlineSurveyService = {
  async saveMissionLocally(mission: SurveyMission): Promise<void> {
    const db = await getDB();
    if (!db) return;
    await db.put("survey_missions", mission);
  },

  async getLocalMissions(): Promise<SurveyMission[]> {
    const db = await getDB();
    if (!db) return [];
    return db.getAll("survey_missions");
  },

  async recordPointLocally(missionId: string, point: GNSSPoint): Promise<void> {
    const db = await getDB();
    if (!db) return;
    await db.put("captured_points", { ...point, missionId });
  },

  async recordPhotoLocally(missionId: string, photo: SurveyPhoto): Promise<void> {
    const db = await getDB();
    if (!db) return;
    await db.put("captured_photos", { ...photo, missionId });
  },

  async queueMissionSubmission(missionId: string, payload: any): Promise<void> {
    const db = await getDB();
    if (!db) return;
    await db.put("survey_sync_queue", {
      missionId,
      action: "SUBMIT_SURVEY",
      payload,
      timestamp: Date.now(),
      synced: false,
    });
  },

  async getPendingSyncItems(): Promise<any[]> {
    const db = await getDB();
    if (!db) return [];
    return db.getAll("survey_sync_queue");
  },

  async markItemSynced(missionId: string): Promise<void> {
    const db = await getDB();
    if (!db) return;
    await db.delete("survey_sync_queue", missionId);
  },
};
