import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gov-primary text-white shadow-sm hover:bg-blue-700",
        secondary: "border-transparent bg-gov-secondary text-white shadow-sm hover:bg-slate-800",
        accent: "border-transparent bg-gov-accent text-slate-950 shadow-sm hover:bg-cyan-400 font-bold",
        success: "border-transparent bg-gov-success text-white shadow-sm hover:bg-emerald-700",
        warning: "border-transparent bg-gov-warning text-slate-950 shadow-sm hover:bg-amber-600",
        danger: "border-transparent bg-gov-danger text-white shadow-sm hover:bg-red-700",
        outline: "text-foreground border-border bg-background/50",
        glass: "bg-background/80 backdrop-blur-sm border border-border/80 text-foreground",
      },
      size: {
        default: "text-xs px-2.5 py-0.5",
        sm: "text-[10px] px-2 py-0.2",
        lg: "text-sm px-3 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
  onRemove?: () => void;
}

function Badge({ className, variant, size, dot, onRemove, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span
          className={cn(
            "mr-1.5 h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-white",
            variant === "danger" && "bg-white",
            variant === "warning" && "bg-slate-900",
            variant === "default" && "bg-white",
            (!variant || variant === "outline" || variant === "glass") && "bg-gov-primary"
          )}
        />
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 -mr-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Remove badge"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

export { Badge, badgeVariants };
