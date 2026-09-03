"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useDemoModeStore, DEMO_STAGES } from "@/stores/use-demo-mode-store";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Terminal,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export function SIHDemoModal() {
  const router = useRouter();
  const {
    isDemoModalOpen,
    setIsDemoModalOpen,
    currentStepIndex,
    isPlaying,
    setIsPlaying,
    advanceStep,
    resetDemo,
    executionLogs,
  } = useDemoModeStore();

  const currentStage = DEMO_STAGES[currentStepIndex];

  // Auto-play timer
  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      timer = setInterval(() => {
        advanceStep();
      }, 2400);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, advanceStep]);

  if (!isDemoModalOpen) return null;

  return (
    <Dialog
      isOpen={isDemoModalOpen}
      onClose={() => {
        setIsPlaying(false);
        setIsDemoModalOpen(false);
      }}
      maxWidth="xl"
      title="Smart India Hackathon &bull; National Cadastral Demo Engine"
      description="Autonomous end-to-end simulation of the vertical property lifecycle across all 8 integrated modules."
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2 w-full">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetDemo}
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
            >
              Reset
            </Button>
            <Button
              variant={isPlaying ? "destructive" : "default"}
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              leftIcon={isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            >
              {isPlaying ? "Pause Simulation" : "Auto-Play Demo"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={advanceStep}
              disabled={currentStepIndex >= DEMO_STAGES.length - 1}
              leftIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Next Stage
            </Button>
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setIsPlaying(false);
              setIsDemoModalOpen(false);
              router.push(currentStage.targetHref);
            }}
            leftIcon={<ExternalLink className="h-3.5 w-3.5" />}
          >
            Inspect Result in {currentStage.module}
          </Button>
        </div>
      }
    >
      <div className="space-y-5 pt-2 text-xs font-sans select-none">
        {/* 8-Step Interactive Progress Stepper */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-1 text-center font-mono">
          {DEMO_STAGES.map((s, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={s.stepNumber}
                onClick={() => useDemoModeStore.getState().setCurrentStepIndex(idx)}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isCurrent
                    ? "border-gov-primary bg-gov-primary/10 shadow-sm ring-1 ring-gov-primary/40 font-bold"
                    : isCompleted
                    ? "border-gov-success/40 bg-gov-success/5 text-gov-success"
                    : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-center space-x-1 mb-1">
                  {isCompleted ? (
                    <CheckCircle2 className="h-3 w-3 text-gov-success" />
                  ) : (
                    <span className="text-[10px] font-bold">#{s.stepNumber}</span>
                  )}
                </div>
                <span className="text-[9px] truncate block">{s.module}</span>
              </div>
            );
          })}
        </div>

        {/* Current Active Stage Hero Card */}
        <div className="p-4 rounded-xl border border-border bg-card shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="accent" size="sm" className="font-mono text-[9px]">
                Stage {currentStage.stepNumber} of 8 &bull; {currentStage.module}
              </Badge>
              <h3 className="font-bold text-sm text-foreground">{currentStage.title}</h3>
            </div>
            {isPlaying && (
              <span className="flex items-center space-x-1 text-[10px] font-mono text-gov-success font-bold">
                <span className="h-2 w-2 rounded-full bg-gov-success animate-ping" />
                <span>Simulating...</span>
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {currentStage.description}
          </p>
        </div>

        {/* Real-Time Simulation Execution Logs Console */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-1.5 text-[10px] font-mono text-muted-foreground font-semibold uppercase">
            <Terminal className="h-3.5 w-3.5 text-gov-accent" />
            <span>Cadastral Pipeline Telemetry Stream</span>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950 font-mono text-[11px] text-emerald-400 space-y-1 max-h-48 overflow-y-auto shadow-inner">
            {executionLogs.map((log, i) => (
              <div key={i} className="leading-relaxed flex items-start space-x-2">
                <span className="text-slate-600 select-none">&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
}
