import { create } from "zustand";
import type {
  SurveyMission,
  GNSSPoint,
  SurveyPhoto,
  SurveyFieldNote,
  SurveyValidationChecklist,
  QAApprovalReview,
  SurveyMissionStatus,
} from "../types/survey-types";
import type { LiveHardwareTelemetry } from "../types/telemetry-types";
import { SAMPLE_SURVEY_MISSIONS } from "../constants/sample-missions";
import { dgpsTelemetryService } from "../services/dgps-telemetry-service";
import { surveyValidator } from "../services/survey-validator";
import { offlineSurveyService } from "../services/offline-survey-service";

interface SurveyState {
  missions: SurveyMission[];
  activeMissionId: string;
  liveTelemetry: LiveHardwareTelemetry;
  isSimulatingRover: boolean;

  // Dialogs
  isValidationModalOpen: boolean;
  isQADialogOpen: boolean;
  isNewMissionModalOpen: boolean;
  activeValidationReport: SurveyValidationChecklist | null;

  // Actions
  selectMission: (id: string) => void;
  addCapturedPoint: (point: GNSSPoint) => void;
  deleteCapturedPoint: (pointId: string) => void;
  addSurveyPhoto: (photo: SurveyPhoto) => void;
  addFieldNote: (note: SurveyFieldNote) => void;
  updateMissionStatus: (id: string, status: SurveyMissionStatus, reason?: string) => void;
  submitActiveMission: () => void;
  runValidationChecklist: () => SurveyValidationChecklist;
  addQAReview: (review: QAApprovalReview) => void;
  createMission: (mission: SurveyMission) => void;
  updateLiveTelemetry: (telemetry: LiveHardwareTelemetry) => void;
  setValidationModalOpen: (open: boolean) => void;
  setQADialogOpen: (open: boolean) => void;
  setNewMissionModalOpen: (open: boolean) => void;
}

export const useSurveyStore = create<SurveyState>((set, get) => ({
  missions: SAMPLE_SURVEY_MISSIONS,
  activeMissionId: "mission-01",
  liveTelemetry: dgpsTelemetryService.getSimulatedTelemetry(),
  isSimulatingRover: true,

  isValidationModalOpen: false,
  isQADialogOpen: false,
  isNewMissionModalOpen: false,
  activeValidationReport: null,

  selectMission: (activeMissionId) => set({ activeMissionId }),

  addCapturedPoint: (point) => {
    const { activeMissionId, missions } = get();
    const updatedMissions = missions.map((m) => {
      if (m.id === activeMissionId) {
        const newPoints = [...m.points, point];
        const progress = Math.min(100, Math.round((newPoints.length / 4) * 100));
        return {
          ...m,
          points: newPoints,
          progressPercent: progress,
          status: m.status === "ASSIGNED" ? ("IN_PROGRESS" as const) : m.status,
        };
      }
      return m;
    });

    set({ missions: updatedMissions });
    offlineSurveyService.recordPointLocally(activeMissionId, point);
  },

  deleteCapturedPoint: (pointId) => {
    const { activeMissionId, missions } = get();
    set({
      missions: missions.map((m) =>
        m.id === activeMissionId
          ? { ...m, points: m.points.filter((p) => p.id !== pointId) }
          : m
      ),
    });
  },

  addSurveyPhoto: (photo) => {
    const { activeMissionId, missions } = get();
    set({
      missions: missions.map((m) =>
        m.id === activeMissionId ? { ...m, photos: [photo, ...m.photos] } : m
      ),
    });
    offlineSurveyService.recordPhotoLocally(activeMissionId, photo);
  },

  addFieldNote: (note) => {
    const { activeMissionId, missions } = get();
    set({
      missions: missions.map((m) =>
        m.id === activeMissionId ? { ...m, fieldNotes: [note, ...m.fieldNotes] } : m
      ),
    });
  },

  updateMissionStatus: (id, status, reason) => {
    set((state) => ({
      missions: state.missions.map((m) =>
        m.id === id ? { ...m, status, ...(reason ? { rejectionReason: reason } : {}) } : m
      ),
    }));
  },

  submitActiveMission: () => {
    const { activeMissionId } = get();
    const checklist = get().runValidationChecklist();

    set((state) => ({
      missions: state.missions.map((m) =>
        m.id === activeMissionId
          ? {
              ...m,
              status: "SUBMITTED" as const,
              validationChecklist: checklist,
              progressPercent: 100,
            }
          : m
      ),
    }));

    offlineSurveyService.queueMissionSubmission(activeMissionId, { status: "SUBMITTED" });
  },

  runValidationChecklist: () => {
    const { activeMissionId, missions } = get();
    const mission = missions.find((m) => m.id === activeMissionId);
    if (!mission) {
      const emptyChecklist: SurveyValidationChecklist = {
        gpsAccuracyValid: false,
        boundaryClosed: false,
        noOverlaps: false,
        requiredPhotosPresent: false,
        requiredDocsPresent: false,
        noDuplicates: false,
        topologyValid: false,
        overallStatus: "FAIL",
        issues: ["Mission not found"],
      };
      return emptyChecklist;
    }

    const report = surveyValidator.validateMission(mission);
    set({ activeValidationReport: report, isValidationModalOpen: true });
    return report;
  },

  addQAReview: (review) => {
    const { activeMissionId, missions } = get();
    const newStatus: SurveyMissionStatus =
      review.verdict === "APPROVE"
        ? "QA_APPROVED"
        : review.verdict === "REJECT"
        ? "REJECTED"
        : "RETURNED_FOR_CORRECTION";

    set({
      missions: missions.map((m) =>
        m.id === activeMissionId
          ? {
              ...m,
              status: newStatus,
              qaReviews: [review, ...m.qaReviews],
            }
          : m
      ),
      isQADialogOpen: false,
    });
  },

  createMission: (mission) => {
    set((state) => ({
      missions: [mission, ...state.missions],
      activeMissionId: mission.id,
      isNewMissionModalOpen: false,
    }));
    offlineSurveyService.saveMissionLocally(mission);
  },

  updateLiveTelemetry: (liveTelemetry) => set({ liveTelemetry }),
  setValidationModalOpen: (isValidationModalOpen) => set({ isValidationModalOpen }),
  setQADialogOpen: (isQADialogOpen) => set({ isQADialogOpen }),
  setNewMissionModalOpen: (isNewMissionModalOpen) => set({ isNewMissionModalOpen }),
}));
