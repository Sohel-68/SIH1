import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback: string;
  status?: "online" | "offline" | "busy" | "away";
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-14 w-14 text-lg",
};

const statusClasses = {
  online: "bg-gov-success",
  offline: "bg-muted-foreground",
  busy: "bg-gov-danger",
  away: "bg-gov-warning",
};

export function Avatar({
  src,
  alt,
  fallback,
  status,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(!src);

  return (
    <div className={cn("relative inline-flex shrink-0 select-none", className)} {...props}>
      <div
        className={cn(
          "flex items-center justify-center rounded-full font-semibold overflow-hidden border border-border shadow-sm",
          sizeClasses[size],
          !src || imageError
            ? "bg-gov-primary/10 text-gov-primary dark:bg-gov-primary/20 dark:text-blue-300"
            : "bg-background"
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt || fallback}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{fallback.slice(0, 2).toUpperCase()}</span>
        )}
      </div>
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-background",
            statusClasses[status],
            size === "sm" ? "h-2 w-2" : "h-2.5 w-2.5"
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}
