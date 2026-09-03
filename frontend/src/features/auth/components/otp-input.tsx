"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";

export interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  onComplete?: (code: string) => void;
  onResend?: () => void;
  className?: string;
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  onComplete,
  onResend,
  className,
}: OTPInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = React.useState(60);
  const [canResend, setCanResend] = React.useState(false);

  // Resend Countdown
  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleResendClick = () => {
    if (!canResend) return;
    setResendTimer(60);
    setCanResend(false);
    onResend?.();
  };

  const digits = value.split("");

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const char = e.target.value.slice(-1);
    if (char && !/^\d+$/.test(char)) return;

    const newDigits = [...digits];
    newDigits[index] = char || "";
    const newValue = newDigits.join("");
    onChange(newValue);

    if (char && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newValue.length === length && !newValue.includes(" ")) {
      onComplete?.(newValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().slice(0, length);
    if (!/^\d+$/.test(pastedData)) return;

    onChange(pastedData);
    const targetFocus = Math.min(pastedData.length, length - 1);
    inputRefs.current[targetFocus]?.focus();

    if (pastedData.length === length) {
      onComplete?.(pastedData);
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-center space-x-2 sm:space-x-3">
        {Array.from({ length }).map((_, index) => {
          const digit = digits[index] || "";

          return (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              aria-label={`Digit ${index + 1}`}
              className={cn(
                "h-12 w-11 sm:h-14 sm:w-12 text-center text-xl font-bold font-mono rounded-lg border border-input bg-background text-foreground transition-all",
                "focus:border-gov-primary focus:ring-2 focus:ring-gov-primary/30 focus:outline-none",
                digit ? "border-gov-primary bg-gov-primary/5" : ""
              )}
            />
          );
        })}
      </div>

      {/* Resend Action */}
      <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
        {canResend ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResendClick}
            leftIcon={<RotateCw className="h-3.5 w-3.5" />}
          >
            Resend OTP Code
          </Button>
        ) : (
          <span>
            Resend code in <strong className="text-foreground font-mono">{resendTimer}s</strong>
          </span>
        )}
      </div>
    </div>
  );
}
