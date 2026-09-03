import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, Minus } from "lucide-react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  checked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: string;
  error?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      checked = false,
      indeterminate = false,
      onCheckedChange,
      label,
      description,
      error,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "inline-flex items-start gap-2.5 cursor-pointer select-none group",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <div className="relative flex items-center justify-center pt-0.5">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            checked={checked}
            disabled={disabled}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            className="sr-only"
            {...props}
          />
          <div
            className={cn(
              "h-4 w-4 rounded border transition-all duration-150 flex items-center justify-center ring-offset-background group-focus-within:ring-2 group-focus-within:ring-ring group-focus-within:ring-offset-1",
              checked || indeterminate
                ? "bg-gov-primary border-gov-primary text-white"
                : "border-input bg-background/80 hover:border-gov-primary/70",
              error && "border-gov-danger"
            )}
          >
            {indeterminate ? (
              <Minus className="h-3 w-3 stroke-[3]" />
            ) : checked ? (
              <Check className="h-3 w-3 stroke-[3]" />
            ) : null}
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-sm font-medium leading-none text-foreground">
                {label}
              </span>
            )}
            {description && (
              <span className="text-xs text-muted-foreground mt-1">
                {description}
              </span>
            )}
          </div>
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
