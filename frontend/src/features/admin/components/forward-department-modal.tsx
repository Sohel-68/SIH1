"use client";

import * as React from "react";
import { useWorkflowStore } from "../stores/use-workflow-store";
import type { GovernmentDepartment, GovernmentRole } from "../types/workflow-types";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Send, Building, ShieldCheck } from "lucide-react";

export function ForwardDepartmentModal() {
  const {
    cases,
    selectedCaseId,
    isForwardModalOpen,
    setForwardModalOpen,
    forwardCaseToDepartment,
  } = useWorkflowStore();

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const [toDepartment, setToDepartment] = React.useState<GovernmentDepartment>("SURVEY");
  const [toRole, setToRole] = React.useState<GovernmentRole>("QA_OFFICER");
  const [remarks, setRemarks] = React.useState("");

  if (!isForwardModalOpen) return null;

  const handleSubmit = () => {
    if (!remarks.trim()) return;
    forwardCaseToDepartment(
      selectedCase.id,
      toDepartment,
      toRole,
      remarks.trim(),
      "Reviewing Officer",
      "TEHSILDAR"
    );
    setRemarks("");
  };

  const departmentOptions = [
    { value: "REVENUE", label: "Revenue Department (Collectorate / Tehsil)" },
    { value: "SURVEY", label: "Cadastral Survey Directorate (City Survey Office)" },
    { value: "MUNICIPALITY_MCGM", label: "Municipal Corporation (MCGM Building Proposal)" },
    { value: "FOREST", label: "Forest & Eco-Sensitive Buffer Directorate" },
    { value: "URBAN_PLANNING", label: "Town Planning & Valuation Department" },
    { value: "DISASTER_MANAGEMENT", label: "State Disaster Management Authority" },
  ];

  const roleOptions = [
    { value: "SURVEY_OFFICER", label: "Survey Officer (Field Cadastre)" },
    { value: "QA_OFFICER", label: "District QA Officer" },
    { value: "SUB_REGISTRAR", label: "Sub-Registrar (Registration & Stamps)" },
    { value: "TEHSILDAR", label: "Tehsildar & Executive Magistrate" },
    { value: "DISTRICT_COLLECTOR", label: "District Collector & DM" },
    { value: "STATE_ADMIN", label: "State Settlement Commissioner" },
  ];

  return (
    <Dialog
      isOpen={isForwardModalOpen}
      onClose={() => setForwardModalOpen(false)}
      maxWidth="md"
      title="Inter-Department File Movement & Referral"
      description={`Forward ${selectedCase.caseNumber} to another directorate with an official noting sheet record.`}
      footer={
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setForwardModalOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSubmit}
            disabled={!remarks.trim()}
            leftIcon={<Send className="h-3.5 w-3.5" />}
          >
            Dispatch &amp; Record in Noting Sheet
          </Button>
        </div>
      }
    >
      <div className="space-y-4 pt-2 text-xs font-sans">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground block">
            Destination Department
          </label>
          <Select
            options={departmentOptions}
            value={toDepartment}
            onChange={(e) => setToDepartment(e.target.value as GovernmentDepartment)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground block">
            Designated Recipient Role
          </label>
          <Select
            options={roleOptions}
            value={toRole}
            onChange={(e) => setToRole(e.target.value as GovernmentRole)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-foreground block">
            Official Referral Remarks / Instructions
          </label>
          <Textarea
            placeholder="Specify reason for inter-department referral (e.g. Conduct DGPS ground truth demarcation for boundary dispute)..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={3}
            className="text-xs"
          />
        </div>
      </div>
    </Dialog>
  );
}
