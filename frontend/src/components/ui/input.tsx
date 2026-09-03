import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean | string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, rightIcon, onClear, value, ...props }, ref) => {
    const hasValue = value !== undefined && value !== "" && value !== null;

    return (
      <div className="relative flex items-center w-full">
        {leftIcon && (
          <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          value={value}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background/70 px-3 py-2 text-sm ring-offset-background transition-colors placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
            leftIcon && "pl-9",
            (rightIcon || onClear) && "pr-9",
            error && "border-gov-danger focus-visible:ring-gov-danger/80",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          {...props}
        />
        {onClear && hasValue && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 p-0.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
            aria-label="Clear input"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        {!onClear && rightIcon && (
          <div className="absolute right-3 flex items-center pointer-events-none text-muted-foreground">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
