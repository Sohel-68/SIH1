"use client";

import * as React from "react";
import { useThemeStore } from "@/stores/use-theme-store";
import { useAuthStore } from "@/stores/use-auth-store";
import { type SupportedLanguage, type MeasurementUnit } from "@/services/i18n-service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Settings,
  Globe,
  Sun,
  Moon,
  Laptop,
  Ruler,
  Bell,
  ShieldCheck,
  Check,
  User,
} from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const { user } = useAuthStore();

  const [language, setLanguage] = React.useState<SupportedLanguage>("en");
  const [unit, setUnit] = React.useState<MeasurementUnit>("METRIC");
  const [emailAlerts, setEmailAlerts] = React.useState(true);
  const [smsAlerts, setSmsAlerts] = React.useState(true);
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in-0 duration-200 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-border/70">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              System Settings &amp; Preferences
            </h1>
            <Badge variant="accent" size="sm" className="font-mono text-[9px]">
              Profile &bull; i18n &bull; Security
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Configure appearance theme, sovereign language, cadastral units, and DSC token credentials.
          </p>
        </div>

        <Button variant="default" size="sm" onClick={handleSave}>
          {savedSuccess ? "Preferences Saved!" : "Save Preferences"}
        </Button>
      </div>

      {/* 1. Appearance Theme */}
      <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-3">
        <div className="flex items-center space-x-2">
          <Sun className="h-4 w-4 text-gov-warning" />
          <h3 className="font-bold text-sm text-foreground">Appearance Theme</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Select dark mode for low-light GIS analysis, light theme for high-contrast reading, or sync with operating system.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {(
            [
              { id: "light", label: "Light Theme", icon: <Sun className="h-4 w-4 text-gov-warning" /> },
              { id: "dark", label: "Dark Mode (GIS)", icon: <Moon className="h-4 w-4 text-gov-accent" /> },
              { id: "system", label: "System Sync", icon: <Laptop className="h-4 w-4 text-gov-primary" /> },
            ] as const
          ).map((th) => (
            <div
              key={th.id}
              onClick={() => setTheme(th.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                theme === th.id
                  ? "border-gov-primary bg-gov-primary/10 shadow-sm ring-1 ring-gov-primary/40 font-bold"
                  : "border-border bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <div className="flex items-center space-x-2">
                {th.icon}
                <span className="text-xs text-foreground">{th.label}</span>
              </div>
              {theme === th.id && <Check className="h-4 w-4 text-gov-primary" />}
            </div>
          ))}
        </div>
      </div>

      {/* 2. Language & Localization (English, Hindi, Marathi) */}
      <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-3">
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-gov-accent" />
          <h3 className="font-bold text-sm text-foreground">Sovereign Language (भाषा)</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Choose official portal display language. Supports English and official State Eighth Schedule languages.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {(
            [
              { id: "en", label: "English (National)", sub: "Default Administrative" },
              { id: "hi", label: "हिन्दी (Hindi)", sub: "राजभाषा (Rajbhasha)" },
              { id: "mr", label: "मराठी (Marathi)", sub: "महाराष्ट्र शासन (MahaBhulekh)" },
            ] as const
          ).map((lang) => (
            <div
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                language === lang.id
                  ? "border-gov-primary bg-gov-primary/10 shadow-sm ring-1 ring-gov-primary/40 font-bold"
                  : "border-border bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <div>
                <span className="text-xs text-foreground block">{lang.label}</span>
                <span className="text-[10px] text-muted-foreground">{lang.sub}</span>
              </div>
              {language === lang.id && <Check className="h-4 w-4 text-gov-primary" />}
            </div>
          ))}
        </div>
      </div>

      {/* 3. Measurement Units (Metric vs Traditional Indian) */}
      <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-3">
        <div className="flex items-center space-x-2">
          <Ruler className="h-4 w-4 text-gov-primary" />
          <h3 className="font-bold text-sm text-foreground">Cadastral Measurement Units</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Display parcel areas in metric standard (sq meters, hectares), imperial, or traditional Indian units (Guntha, Bigha).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {(
            [
              { id: "METRIC", label: "Metric Standard", sub: "m² / Hectares / km²" },
              { id: "TRADITIONAL_INDIAN", label: "Traditional Indian", sub: "Guntha / Bigha / Vigha" },
              { id: "IMPERIAL", label: "Imperial Standard", sub: "Square Feet / Acres" },
            ] as const
          ).map((u) => (
            <div
              key={u.id}
              onClick={() => setUnit(u.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                unit === u.id
                  ? "border-gov-primary bg-gov-primary/10 shadow-sm ring-1 ring-gov-primary/40 font-bold"
                  : "border-border bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <div>
                <span className="text-xs text-foreground block">{u.label}</span>
                <span className="text-[10px] text-muted-foreground">{u.sub}</span>
              </div>
              {unit === u.id && <Check className="h-4 w-4 text-gov-primary" />}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Officer Security & DSC Token */}
      <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-3">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-4 w-4 text-gov-success" />
          <h3 className="font-bold text-sm text-foreground">Digital Signature Token &amp; Credentials</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Active eSign token credentials used for signing statutory orders, ULPIN certificates, and mutation deeds.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px] pt-1">
          <div className="p-3 rounded-lg border border-border bg-muted/20">
            <span className="text-[10px] text-muted-foreground block font-sans">Registered Officer</span>
            <span className="font-bold text-foreground">{user?.fullName || "Anil Deshmukh"}</span>
            <span className="text-[10px] text-muted-foreground block font-sans">Role: {user?.role || "SUB_REGISTRAR"}</span>
          </div>

          <div className="p-3 rounded-lg border border-border bg-muted/20">
            <span className="text-[10px] text-muted-foreground block font-sans">DSC Token Serial</span>
            <span className="font-bold text-gov-primary">IN-DSC-2026-8819-CLASS3</span>
            <span className="text-[10px] text-gov-success block font-sans">Status: VALID (Expires: Dec 2027)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
