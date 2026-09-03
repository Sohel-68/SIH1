"use client";

import * as React from "react";
import { useAIStore } from "../stores/use-ai-store";
import { modelRegistryService } from "../services/model-registry-service";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cpu, CheckCircle2, Zap, HardDrive } from "lucide-react";

export function ModelManagementModal() {
  const { isModelModalOpen, setModelModalOpen } = useAIStore();
  const models = modelRegistryService.getModels();

  if (!isModelModalOpen) return null;

  return (
    <Dialog
      isOpen={isModelModalOpen}
      onClose={() => setModelModalOpen(false)}
      maxWidth="lg"
      title="AI Model Registry & Runtime Management"
      description="Production computer vision model weights, inference latency metrics, and ONNX/PyTorch runtime health."
      footer={
        <Button variant="default" size="sm" onClick={() => setModelModalOpen(false)}>
          Close Registry
        </Button>
      }
    >
      <div className="space-y-4 pt-2 text-xs">
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-[11px] font-mono">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border font-sans">
              <tr>
                <th className="p-2.5 text-left font-semibold">Model Name</th>
                <th className="p-2.5 text-left font-semibold">Task</th>
                <th className="p-2.5 text-left font-semibold">Runtime</th>
                <th className="p-2.5 text-left font-semibold">Latency</th>
                <th className="p-2.5 text-left font-semibold">Accuracy</th>
                <th className="p-2.5 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {models.map((mod) => (
                <tr key={mod.modelId} className="hover:bg-muted/20">
                  <td className="p-2.5 font-bold font-sans text-foreground">
                    {mod.name}
                    <span className="text-[10px] text-muted-foreground font-mono block">
                      {mod.modelId} ({mod.version})
                    </span>
                  </td>
                  <td className="p-2.5 text-muted-foreground text-[10px]">
                    {mod.task.replace("_", " ")}
                  </td>
                  <td className="p-2.5">
                    <Badge variant="outline" size="sm" className="text-[9px]">
                      {mod.framework}
                    </Badge>
                  </td>
                  <td className="p-2.5 text-gov-primary font-semibold">
                    {mod.latencyMs} ms
                  </td>
                  <td className="p-2.5 text-gov-success font-semibold">
                    {mod.accuracyMetric}
                  </td>
                  <td className="p-2.5 text-center">
                    <Badge variant="success" size="sm" dot>
                      {mod.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Dialog>
  );
}
