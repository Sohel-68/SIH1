import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "spinner" | "dots" | "radar";
  size?: "sm" | "md" | "lg";
  text?: string;
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

export function Loader({
  variant = "spinner",
  size = "md",
  text,
  className,
  ...props
}: LoaderProps) {
  if (variant === "radar") {
    return (
      <div className={cn("flex flex-col items-center justify-center p-4", className)} {...props}>
        <div className="relative flex items-center justify-center">
          <div className="absolute h-12 w-12 rounded-full border-2 border-gov-accent/40 animate-ping" />
          <div className="h-6 w-6 rounded-full bg-gov-accent/80 shadow-md shadow-gov-accent/30" />
        </div>
        {text && <p className="text-xs text-muted-foreground mt-3 font-medium">{text}</p>}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center space-x-1.5 p-2", className)} {...props}>
        <span className="h-2 w-2 rounded-full bg-gov-primary animate-bounce [animation-delay:-0.3s]" />
        <span className="h-2 w-2 rounded-full bg-gov-primary animate-bounce [animation-delay:-0.15s]" />
        <span className="h-2 w-2 rounded-full bg-gov-primary animate-bounce" />
        {text && <span className="text-xs text-muted-foreground ml-2">{text}</span>}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2 p-2", className)} {...props}>
      <Loader2 className={cn("animate-spin text-gov-primary", sizeMap[size])} />
      {text && <span className="text-xs text-muted-foreground font-medium">{text}</span>}
    </div>
  );
}

export function LoadingOverlay({ text = "Processing spatial data..." }: { text?: string }) {
  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/75 backdrop-blur-sm">
      <Loader variant="spinner" size="lg" text={text} />
    </div>
  );
}
