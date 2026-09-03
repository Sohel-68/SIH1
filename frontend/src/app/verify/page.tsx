"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useULPINStore } from "@/features/ulpin/stores/use-ulpin-store";
import type { ULPINRecord } from "@/features/ulpin/types/ulpin-types";
import { VerificationCard } from "@/features/ulpin/components/verification-card";
import { ULPINCertificate } from "@/features/ulpin/components/ulpin-certificate";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, ShieldCheck } from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialUlpin = searchParams.get("ulpin") || "";
  const [selectedCertificate, setSelectedCertificate] = React.useState<ULPINRecord | null>(null);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {selectedCertificate ? (
        <div className="space-y-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedCertificate(null)}
            leftIcon={<ArrowLeft className="h-3.5 w-3.5" />}
          >
            Back to Verification Search
          </Button>
          <ULPINCertificate record={selectedCertificate} />
        </div>
      ) : (
        <VerificationCard
          initialQuery={initialUlpin}
          onViewCertificate={(rec) => setSelectedCertificate(rec)}
        />
      )}
    </div>
  );
}

export default function PublicVerificationPage() {
  return (
    <div className="min-h-full p-4 sm:p-8 space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-1.5 pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          National Land &amp; Strata Verification Portal
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Authenticate 2D ground parcels (Bhu-Aadhaar) and 3D vertical property units across India.
        </p>
      </div>

      <React.Suspense fallback={<div className="p-8 text-center text-xs text-muted-foreground">Loading verification portal...</div>}>
        <VerifyContent />
      </React.Suspense>
    </div>
  );
}
