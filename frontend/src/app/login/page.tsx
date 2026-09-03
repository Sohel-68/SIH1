"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/auth-schemas";
import { authService } from "@/features/auth/services/auth-service";
import { useAuthStore } from "@/stores/use-auth-store";
import { useAuditLogger } from "@/features/auth/hooks/use-audit-logger";
import { DEMO_PERSONAS, ROLES_METADATA } from "@/features/auth/constants/rbac";
import type { UserRole } from "@/features/auth/types";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Globe,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Box,
  Layers,
  FileCheck2,
} from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const reason = searchParams.get("reason");

  const { login } = useAuthStore();
  const { logEvent } = useAuditLogger();

  const [showPassword, setShowPassword] = React.useState(false);
  const [capsLockActive, setCapsLockActive] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: "dir.general@geostrata.gov.in",
      password: "Password@123",
      rememberMe: true,
    },
  });

  // Caps Lock detection on keyup/keydown
  const handlePasswordKeyChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState("CapsLock"));
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await authService.login(values);
      login(response.user, response.tokens, values.rememberMe);
      logEvent("LOGIN", {
        role: response.user.role,
        identifier: values.usernameOrEmail,
        success: true,
      });
      router.push(redirectUrl);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Invalid government credentials. Please check your username and password.";
      setErrorMessage(msg);
      logEvent("LOGIN", {
        identifier: values.usernameOrEmail,
        success: false,
        error: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fast evaluation helper: prefill with selected role credentials
  const prefillRole = (role: UserRole) => {
    const persona = DEMO_PERSONAS[role];
    if (persona) {
      form.setValue("usernameOrEmail", persona.email);
      form.setValue("password", "Password@123");
      setErrorMessage(null);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-background">
      {/* ------------------------------------------------------------- */}
      {/* LEFT COLUMN: Government Platform Hero & Cadastre Identity     */}
      {/* ------------------------------------------------------------- */}
      <div className="relative flex flex-col justify-between p-8 sm:p-12 lg:w-1/2 bg-gov-secondary text-white overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
        {/* Ambient Spatial Background Glows */}
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-gov-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-gov-accent/15 blur-3xl pointer-events-none" />

        {/* Top: National Emblem & Brand Header */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gov-primary text-white shadow-lg shadow-gov-primary/30">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight">GeoStrata</span>
              <Badge variant="accent" size="sm" className="bg-gov-accent/20 text-gov-accent border-gov-accent/30 font-mono">
                ISO 19152
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              National 3D ULPIN &amp; Vertical Property Mapping Platform
            </p>
          </div>
        </div>

        {/* Center: Hero Graphic & Core Security Feature Highlights */}
        <div className="relative z-10 my-10 lg:my-0 space-y-6">
          <div className="space-y-3">
            <Badge variant="outline" size="sm" className="border-slate-700 text-slate-300">
              Department of Land Resources &bull; MoRD, Govt. of India
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
              Sovereign 3D Bhu-Aadhaar <br />
              <span className="bg-gradient-to-r from-gov-accent to-blue-400 bg-clip-text text-transparent">
                Cadastral Architecture
              </span>
            </h1>
            <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
              Unified digital infrastructure providing volumetric land registration, vertical strata unit delineations, and multi-tier cryptographic integrity.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 backdrop-blur-sm flex items-start space-x-3">
              <Box className="h-5 w-5 text-gov-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">3D Strata Extrusion</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Multi-tier polyhedral boundaries with Z-axis heights.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 backdrop-blur-sm flex items-start space-x-3">
              <ShieldCheck className="h-5 w-5 text-gov-success shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Zero Spatial Overlap</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PostGIS 3D SFCGAL collision validation in real time.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 backdrop-blur-sm flex items-start space-x-3">
              <Layers className="h-5 w-5 text-gov-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">14-Digit Base Cadastre</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Strict centroid longitude/latitude indexing.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-slate-800 bg-slate-900/60 backdrop-blur-sm flex items-start space-x-3">
              <FileCheck2 className="h-5 w-5 text-gov-warning shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Audit &amp; Legal Chain</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Cryptographically signed title deeds &amp; encumbrances.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Attribution */}
        <div className="relative z-10 text-[11px] text-slate-400 border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>Digital India Land Records Modernization Programme (DILRMP)</span>
          <span className="font-mono text-[10px]">NIC/DoLR-2026-V1</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RIGHT COLUMN: Government Secure Sign-in Card                  */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Official Authentication
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Sign in with your official government identity or registered credentials.
            </p>
          </div>

          {/* Session Inactivity or Redirect Notices */}
          {reason === "inactivity" && (
            <Alert variant="warning" title="Session Timeout">
              Your previous session was closed due to prolonged inactivity. Please sign in again.
            </Alert>
          )}

          {errorMessage && (
            <Alert variant="error" title="Authentication Failed">
              {errorMessage}
            </Alert>
          )}

          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Username / Email */}
              <FormField
                control={form.control}
                name="usernameOrEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Government Email / Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="officer@geostrata.gov.in"
                        leftIcon={<Mail className="h-4 w-4" />}
                        autoComplete="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-semibold text-gov-primary hover:underline"
                        tabIndex={-1}
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••••••"
                          leftIcon={<Lock className="h-4 w-4" />}
                          autoComplete="current-password"
                          onKeyUp={handlePasswordKeyChange}
                          onKeyDown={handlePasswordKeyChange}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Caps Lock Warning */}
              {capsLockActive && (
                <div className="flex items-center space-x-2 rounded-md bg-gov-warning/10 border border-gov-warning/30 px-3 py-1.5 text-xs text-gov-warning animate-in fade-in-0">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  <span>Caps Lock is ON</span>
                </div>
              )}

              {/* Remember Me */}
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="pt-1">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        label="Remember my government workstation"
                        description="Keeps session credentials cached in persistent local storage."
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full font-bold shadow-md shadow-gov-primary/20"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Sign In to Cadastre
              </Button>
            </form>
          </Form>

          {/* Quick Evaluator Role Switcher */}
          <div className="pt-4 border-t border-border/70 space-y-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Quick Fill Demo Accounts:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
              {(Object.keys(ROLES_METADATA) as UserRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => prefillRole(role)}
                  className="px-2 py-1.5 rounded border border-border bg-card hover:bg-muted/60 text-[11px] font-medium text-foreground transition-all text-left truncate"
                >
                  {ROLES_METADATA[role].title.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-gov-secondary text-white font-mono text-xs">
          Loading Sovereign Authentication Portal...
        </div>
      }
    >
      <LoginFormContent />
    </React.Suspense>
  );
}
