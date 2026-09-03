"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  otpVerifySchema,
  resetPasswordSchema,
  type ForgotPasswordFormValues,
  type OTPVerifyFormValues,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/auth-schemas";
import { authService } from "@/features/auth/services/auth-service";
import { useAuditLogger } from "@/features/auth/hooks/use-audit-logger";
import { OTPInput } from "@/features/auth/components/otp-input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Mail,
  Lock,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
  Send,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { logEvent } = useAuditLogger();

  // Wizard Steps: 1: Identifier -> 2: OTP -> 3: New Password -> 4: Success
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1);
  const [identifier, setIdentifier] = React.useState("");
  const [otpCode, setOtpCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  // Forms for each step
  const step1Form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { identifier: "" },
  });

  const step3Form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  // Watch password value for real-time strength evaluation
  const newPasswordValue = step3Form.watch("newPassword") || "";

  const passwordStrength = React.useMemo(() => {
    if (!newPasswordValue) return { score: 0, label: "None", color: "primary" as const };
    let score = 0;
    if (newPasswordValue.length >= 8) score += 25;
    if (/[A-Z]/.test(newPasswordValue)) score += 25;
    if (/[0-9]/.test(newPasswordValue)) score += 25;
    if (/[^A-Za-z0-9]/.test(newPasswordValue)) score += 25;

    if (score <= 25) return { score, label: "Weak", color: "danger" as const };
    if (score <= 75) return { score, label: "Moderate", color: "warning" as const };
    return { score, label: "Strong & Compliant", color: "success" as const };
  }, [newPasswordValue]);

  // Step 1: Submit Identifier
  const onStep1Submit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await authService.requestPasswordReset(values);
      setIdentifier(values.identifier);
      setStep(2);
    } catch {
      setErrorMessage("Failed to send reset code. Please verify the government email or ID.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const onStep2Submit = async () => {
    if (otpCode.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await authService.verifyOTP(identifier, { otp: otpCode });
      if (res.valid) {
        setStep(3);
      } else {
        setErrorMessage("Invalid OTP code. Please try again.");
      }
    } catch {
      setErrorMessage("Verification service unavailable. Please retry.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Set New Password
  const onStep3Submit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await authService.resetPassword(identifier, values);
      logEvent("PASSWORD_RESET", { identifier });
      setStep(4);
    } catch {
      setErrorMessage("Password reset failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-md shadow-2xl border-border/80 bg-card">
        {/* Step Indicator Header */}
        <div className="p-6 border-b border-border/70">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Account Recovery
            </span>
            <span className="text-[11px] font-mono font-bold text-gov-primary">
              Step {step} of 4
            </span>
          </div>
          <Progress value={(step / 4) * 100} size="sm" color="primary" />
        </div>

        {/* STEP 1: Enter Identifier */}
        {step === 1 && (
          <>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gov-primary/10 text-gov-primary mb-2">
                <KeyRound className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Forgot Password</CardTitle>
              <CardDescription className="text-xs">
                Enter your registered government email or officer employee ID to receive a secure 6-digit OTP.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {errorMessage && (
                <Alert variant="error" className="mb-4">
                  {errorMessage}
                </Alert>
              )}

              <Form {...step1Form}>
                <form onSubmit={step1Form.handleSubmit(onStep1Submit)} className="space-y-4">
                  <FormField
                    control={step1Form.control}
                    name="identifier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Official Email or Employee ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. officer@geostrata.gov.in"
                            leftIcon={<Mail className="h-4 w-4" />}
                            autoFocus
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="w-full font-bold"
                    isLoading={isLoading}
                    rightIcon={<Send className="h-4 w-4" />}
                  >
                    Send Verification Code
                  </Button>
                </form>
              </Form>
            </CardContent>

            <CardFooter className="flex justify-center border-t border-border/70 pt-4">
              <Link
                href="/login"
                className="flex items-center space-x-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Sign In</span>
              </Link>
            </CardFooter>
          </>
        )}

        {/* STEP 2: Verify 6-Digit OTP */}
        {step === 2 && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gov-accent/10 text-gov-accent mb-2">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Enter Security Code</CardTitle>
              <CardDescription className="text-xs">
                We sent a 6-digit one-time code to <strong className="text-foreground">{identifier}</strong>.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {errorMessage && <Alert variant="error">{errorMessage}</Alert>}

              <OTPInput
                value={otpCode}
                onChange={setOtpCode}
                onComplete={onStep2Submit}
                onResend={() => {
                  authService.requestPasswordReset({ identifier });
                }}
              />

              <Button
                type="button"
                variant="default"
                size="lg"
                className="w-full font-bold mt-2"
                isLoading={isLoading}
                disabled={otpCode.length !== 6}
                onClick={onStep2Submit}
              >
                Verify Code
              </Button>
            </CardContent>

            <CardFooter className="flex justify-between border-t border-border/70 pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(1)}
                leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
              >
                Change Email
              </Button>
            </CardFooter>
          </>
        )}

        {/* STEP 3: Set New Password */}
        {step === 3 && (
          <>
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gov-success/10 text-gov-success mb-2">
                <Lock className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl">Create New Password</CardTitle>
              <CardDescription className="text-xs">
                Your new password must satisfy National Cyber Security standards.
              </CardDescription>
            </CardHeader>

            <CardContent>
              {errorMessage && (
                <Alert variant="error" className="mb-4">
                  {errorMessage}
                </Alert>
              )}

              <Form {...step3Form}>
                <form onSubmit={step3Form.handleSubmit(onStep3Submit)} className="space-y-4">
                  <FormField
                    control={step3Form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••••••"
                              leftIcon={<Lock className="h-4 w-4" />}
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </FormControl>
                        {/* Real-time Password Strength Bar */}
                        {newPasswordValue && (
                          <div className="space-y-1 pt-1">
                            <div className="flex justify-between text-[10px]">
                              <span className="text-muted-foreground">Strength:</span>
                              <span className="font-semibold text-foreground">{passwordStrength.label}</span>
                            </div>
                            <Progress value={passwordStrength.score} size="sm" color={passwordStrength.color} />
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={step3Form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••••••"
                            leftIcon={<Lock className="h-4 w-4" />}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    variant="default"
                    size="lg"
                    className="w-full font-bold"
                    isLoading={isLoading}
                  >
                    Reset &amp; Lock Password
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        )}

        {/* STEP 4: Success Screen */}
        {step === 4 && (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gov-success/15 text-gov-success">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">Password Reset Successfully</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
              Your credentials have been updated and synchronized with the National Directory. You can now log in securely.
            </p>
            <div className="pt-4">
              <Button
                variant="default"
                size="lg"
                className="w-full font-bold"
                onClick={() => router.push("/login")}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Sign In with New Password
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
