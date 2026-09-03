"use client";

import * as React from "react";
import { useSurveyStore } from "../stores/use-survey-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Mic, AlertTriangle, Paperclip, Send } from "lucide-react";

export function FieldNotesPanel() {
  const { missions, activeMissionId, addFieldNote } = useSurveyStore();
  const mission = missions.find((m) => m.id === activeMissionId) || missions[0];

  const [noteText, setNoteText] = React.useState("");
  const [category, setCategory] = React.useState<
    "GENERAL" | "TOPOGRAPHIC_FEATURE" | "BOUNDARY_DISPUTE" | "ENCROACHMENT_FLAG"
  >("GENERAL");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    addFieldNote({
      id: `fn-${Date.now()}`,
      authorName: mission.assignedOfficerName.split("(")[0].trim(),
      textContent: noteText.trim(),
      category,
      timestamp: new Date().toLocaleTimeString(),
    });

    setNoteText("");
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-4 space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground uppercase tracking-wider text-[10px]">
          Field Observations &amp; Cadastral Notes ({mission.fieldNotes.length})
        </h3>
        <Badge variant="outline" size="sm" className="font-mono text-[9px]">
          Field Rover Log
        </Badge>
      </div>

      {/* New Note Form */}
      <form onSubmit={handleAddNote} className="space-y-2.5">
        <textarea
          rows={2}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Record physical boundary observations, easement checks, or dispute notices..."
          className="w-full rounded-lg border border-input bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Category Selector */}
          <div className="flex items-center space-x-1.5">
            {(["GENERAL", "TOPOGRAPHIC_FEATURE", "BOUNDARY_DISPUTE"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-colors ${
                  category === cat
                    ? "bg-gov-primary text-white border-gov-primary"
                    : "bg-muted/40 text-muted-foreground border-border hover:bg-muted"
                }`}
              >
                {cat.replace("_", " ")}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-7 text-[11px]"
              onClick={() => alert("Voice memo recording placeholder: Audio input ready.")}
              leftIcon={<Mic className="h-3 w-3" />}
            >
              Voice
            </Button>
            <Button type="submit" variant="default" size="sm" className="h-7 text-[11px] font-bold" leftIcon={<Send className="h-3 w-3" />}>
              Add Note
            </Button>
          </div>
        </div>
      </form>

      {/* Notes List */}
      <div className="space-y-2 pt-2 border-t border-border">
        {mission.fieldNotes.map((note) => (
          <div key={note.id} className="p-3 rounded-lg border border-border bg-muted/20 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground text-xs">{note.authorName}</span>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" size="sm" className="text-[9px]">
                  {note.category.replace("_", " ")}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{note.timestamp}</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {note.textContent}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
