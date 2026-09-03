import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  onRetry?: () => void;
  action?: React.ReactNode;
}

export function ErrorState({
  title = "Failed to load data",
  message = "An error occurred while connecting to the geospatial registry. Please check your network connection and try again.",
  onRetry,
  action,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-gov-danger/20 bg-gov-danger/5 p-8 text-center",
        className
      )}
      role="alert"
      {...props}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gov-danger/10 text-gov-danger mb-4">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h4 className="text-base font-semibold text-foreground">{title}</h4>
      <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md leading-relaxed">
        {message}
      </p>
      {(onRetry || action) && (
        <div className="mt-5 flex items-center gap-3">
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
            >
              Retry
            </Button>
          )}
          {action}
        </div>
      )}
    </div>
  );
}
