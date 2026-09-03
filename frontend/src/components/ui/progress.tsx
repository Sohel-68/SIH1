import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  showValue?: boolean;
  color?: "primary" | "success" | "warning" | "danger" | "accent";
  size?: "sm" | "md" | "lg";
}

const colorMap = {
  primary: "bg-gov-primary",
  success: "bg-gov-success",
  warning: "bg-gov-warning",
  danger: "bg-gov-danger",
  accent: "bg-gov-accent",
};

const sizeMap = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function Progress({
  value,
  max = 100,
  showValue = false,
  color = "primary",
  size = "md",
  className,
  ...props
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("w-full space-y-1", className)} {...props}>
      {showValue && (
        <div className="flex justify-between text-xs text-muted-foreground font-medium">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full overflow-hidden rounded-full bg-muted/60 dark:bg-muted/40",
          sizeMap[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn("h-full transition-all duration-300 ease-out rounded-full", colorMap[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
