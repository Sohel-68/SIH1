import * as React from "react";
import { cn } from "@/lib/utils";

export interface TimelineItem {
  id: string;
  title: React.ReactNode;
  timestamp: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  status?: "complete" | "current" | "pending" | "failed";
}

export interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const statusDotMap = {
  complete: "bg-gov-success border-gov-success text-white",
  current: "bg-gov-primary border-gov-primary text-white ring-4 ring-gov-primary/20",
  pending: "bg-muted border-border text-muted-foreground",
  failed: "bg-gov-danger border-gov-danger text-white",
};

export function Timeline({ items, className }: TimelineProps) {
  return (
    <div className={cn("relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border", className)}>
      {items.map((item, idx) => {
        const status = item.status || "complete";

        return (
          <div key={item.id || idx} className="relative group">
            {/* Timeline Node Dot */}
            <div
              className={cn(
                "absolute -left-6 top-1 h-5 w-5 rounded-full border-2 flex items-center justify-center text-[10px] shadow-sm transition-all",
                statusDotMap[status]
              )}
            >
              {item.icon ? (
                <span className="h-3 w-3 flex items-center justify-center">{item.icon}</span>
              ) : (
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
              )}
            </div>

            {/* Timeline Content */}
            <div className="flex flex-col">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-semibold text-foreground">
                  {item.title}
                </span>
                <time className="text-[10px] text-muted-foreground font-mono">
                  {item.timestamp}
                </time>
              </div>
              {item.description && (
                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {item.description}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
