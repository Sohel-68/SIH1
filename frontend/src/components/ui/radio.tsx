import * as React from "react";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  className?: string;
  disabled?: boolean;
}

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  className,
  disabled = false,
}: RadioGroupProps) {
  return (
    <div className={cn("flex flex-col space-y-2.5", className)} role="radiogroup">
      {options.map((option) => {
        const isChecked = value === option.value;
        const isDisabled = disabled || option.disabled;

        return (
          <label
            key={option.value}
            className={cn(
              "inline-flex items-start gap-2.5 cursor-pointer select-none group",
              isDisabled && "cursor-not-allowed opacity-50"
            )}
          >
            <div className="relative flex items-center justify-center pt-0.5">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isChecked}
                disabled={isDisabled}
                onChange={() => onChange?.(option.value)}
                className="sr-only"
              />
              <div
                className={cn(
                  "h-4 w-4 rounded-full border transition-all duration-150 flex items-center justify-center ring-offset-background group-focus-within:ring-2 group-focus-within:ring-ring group-focus-within:ring-offset-1",
                  isChecked
                    ? "border-gov-primary bg-background"
                    : "border-input bg-background/80 hover:border-gov-primary/70"
                )}
              >
                {isChecked && (
                  <div className="h-2 w-2 rounded-full bg-gov-primary" />
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-none text-foreground">
                {option.label}
              </span>
              {option.description && (
                <span className="text-xs text-muted-foreground mt-1">
                  {option.description}
                </span>
              )}
            </div>
          </label>
        );
      })}
    </div>
  );
}
