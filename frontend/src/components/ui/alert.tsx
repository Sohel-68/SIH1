import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 text-xs sm:text-sm flex items-start space-x-3 [&>svg]:shrink-0 transition-all",
  {
    variants: {
      variant: {
        info: "border-gov-primary/30 bg-gov-primary/10 text-foreground [&>svg]:text-gov-primary",
        success: "border-gov-success/30 bg-gov-success/10 text-foreground [&>svg]:text-gov-success",
        warning: "border-gov-warning/30 bg-gov-warning/10 text-foreground [&>svg]:text-gov-warning",
        error: "border-gov-danger/30 bg-gov-danger/10 text-foreground [&>svg]:text-gov-danger",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof alertVariants> {
  title?: React.ReactNode;
  onDismiss?: () => void;
  action?: React.ReactNode;
}

export function Alert({
  className,
  variant = "info",
  title,
  children,
  onDismiss,
  action,
  ...props
}: AlertProps) {
  const getIcon = () => {
    switch (variant) {
      case "success":
        return <CheckCircle2 className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "error":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        {title && (
          <h5 className="font-semibold leading-none tracking-tight mb-1 text-foreground">
            {title}
          </h5>
        )}
        <div className="text-muted-foreground leading-relaxed">{children}</div>
        {action && <div className="mt-3">{action}</div>}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors shrink-0 -mr-1 -mt-1"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
