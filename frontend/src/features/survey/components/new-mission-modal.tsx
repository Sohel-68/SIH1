"use client";

import * as React from "react";
import { useSurveyStore } from "../stores/use-survey-store";
import type { SurveyPriority } from "../types/survey-types";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Plus } from "lucide-react";

export function NewMissionModal() {
  const { isNewMissionModalOpen, setNewMissionModalOpen, createMission } = useSurveyStore();

  const [title, setTitle] = React.useState("");
  const [surveyNumber, setSurveyNumber] = React.useState("");
  const [village, setVillage] = React.useState("Versova");
  const [priority, setPriority] = React.useState<SurveyPriority>("HIGH");
  const [deadline, setDeadline] = React.useState("10-Sep-2026");

  if (!isNewMissionModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !surveyNumber.trim()) return;

    const missionNum = `SM-2024-MH-${Math.floor(400 + Math.random() * 500)}`;
    const newMission = {
      id: `mission-${Date.now()}`,
      missionNumber: missionNum,
      title: title.trim(),
      parcelId: `parcel-${Date.now()}`,
      state: "Maharashtra",
      district: "Mumbai Suburban",
      taluka: "Andheri",
      village,
      surveyNumber: surveyNumber.trim(),
      assignedOfficerId: "usr-surveyor-01",
      assignedOfficerName: "Vikram Deshmukh (Survey Officer)",
      priority,
      status: "ASSIGNED" as const,
      scheduledDate: new Date().toLocaleDateString(),
      deadlineDate: deadline,
      progressPercent: 0,
      points: [],
      photos: [],
      fieldNotes: [],
      qaReviews: [],
    };

    createMission(newMission);
  };

  return (
    <Dialog
      isOpen={isNewMissionModalOpen}
      onClose={() => setNewMissionModalOpen(false)}
      maxWidth="md"
      title="Create Cadastral Survey Mission"
      description="Issue an official field survey order and demarcate boundary parameters."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
        <div className="space-y-1">
          <label className="font-semibold text-foreground">Mission Title</label>
          <Input
            placeholder="e.g. Cadastral Boundary Survey CTS-148"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Cadastral Survey Number</label>
            <Input
              placeholder="e.g. CTS-148/A"
              value={surveyNumber}
              onChange={(e) => setSurveyNumber(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Revenue Village</label>
            <Input
              placeholder="e.g. Versova"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-semibold text-foreground">Survey Priority</label>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value as SurveyPriority)}
              options={[
                { value: "EMERGENCY", label: "Emergency / Court Order" },
                { value: "HIGH", label: "High Priority" },
                { value: "MEDIUM", label: "Standard Cadastre" },
                { value: "LOW", label: "Low Priority" },
              ]}
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-foreground">Statutory Deadline</label>
            <Input
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="e.g. 10-Sep-2026"
              required
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end space-x-2">
          <Button variant="outline" size="sm" type="button" onClick={() => setNewMissionModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="default" size="sm" type="submit" className="font-bold" leftIcon={<Plus className="h-3.5 w-3.5" />}>
            Issue Mission
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
