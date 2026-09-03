"use client";

import * as React from "react";
import { useSurveyStore } from "../stores/use-survey-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import {
  Camera,
  Compass,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Plus,
} from "lucide-react";

export function PhotoEvidenceGallery() {
  const { missions, activeMissionId, liveTelemetry, addSurveyPhoto } = useSurveyStore();
  const mission = missions.find((m) => m.id === activeMissionId) || missions[0];

  const [copiedHash, setCopiedHash] = React.useState<string | null>(null);

  const handleCapturePhoto = () => {
    const nextIdx = mission.photos.length + 1;
    const cornerRef = `CP-${Math.min(4, nextIdx)}`;

    // Generate random SHA-256 hash stamp
    const hexChars = "0123456789abcdef";
    let mockHash = "";
    for (let i = 0; i < 64; i++) {
      mockHash += hexChars[Math.floor(Math.random() * hexChars.length)];
    }

    const sampleImages = [
      "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=60",
    ];

    const newPhoto = {
      id: `ph-${Date.now()}`,
      photoUrl: sampleImages[(nextIdx - 1) % sampleImages.length],
      caption: `Corner Marker ${cornerRef} Demarcation Evidence`,
      cornerMarkerRef: cornerRef,
      latitude: liveTelemetry.latitude,
      longitude: liveTelemetry.longitude,
      elevationAMSL: liveTelemetry.altitudeAMSL,
      headingAzimuthDeg: Math.round(Math.random() * 360),
      timestamp: new Date().toLocaleTimeString(),
      deviceModel: liveTelemetry.roverModel.split("/")[0].trim(),
      sha256Hash: mockHash,
      isVerified: true,
    };

    addSurveyPhoto(newPhoto);
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm p-4 space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-foreground uppercase tracking-wider text-[10px]">
            Geotagged Photo Documentation ({mission.photos.length})
          </h3>
          <p className="text-[11px] text-muted-foreground">
            All photos contain tamper-evident SHA-256 hash &amp; EXIF geodetic coordinates.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCapturePhoto}
          leftIcon={<Camera className="h-3.5 w-3.5" />}
        >
          Capture Corner Photo
        </Button>
      </div>

      {mission.photos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {mission.photos.map((ph) => (
            <div
              key={ph.id}
              className="rounded-lg border border-border bg-muted/20 overflow-hidden space-y-2 group"
            >
              {/* Photo Preview */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                <img
                  src={ph.photoUrl}
                  alt={ph.caption}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Corner Marker Badge */}
                {ph.cornerMarkerRef && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-gov-primary text-white text-[10px] font-bold font-mono shadow">
                    {ph.cornerMarkerRef}
                  </div>
                )}

                {/* Verified Hash Badge */}
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-gov-success/90 text-white text-[10px] font-semibold flex items-center space-x-1 shadow">
                  <ShieldCheck className="h-3 w-3" />
                  <span>SHA-256 Verified</span>
                </div>
              </div>

              {/* Photo Metadata */}
              <div className="p-3 space-y-1.5">
                <span className="font-semibold text-foreground text-xs block truncate">
                  {ph.caption}
                </span>

                <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-gov-primary shrink-0" />
                    <span className="truncate">
                      {ph.latitude.toFixed(4)}°, {ph.longitude.toFixed(4)}°
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Compass className="h-3 w-3 text-gov-accent shrink-0" />
                    <span>Azimuth: {ph.headingAzimuthDeg}°</span>
                  </div>
                </div>

                {/* SHA-256 Hash Display */}
                <div className="flex items-center justify-between pt-1 border-t border-border/70 text-[10px] font-mono">
                  <span className="text-muted-foreground truncate max-w-[200px]">
                    Hash: {ph.sha256Hash.slice(0, 16)}...
                  </span>
                  <Tooltip content={copiedHash === ph.sha256Hash ? "Copied!" : "Copy Full Hash"} position="left">
                    <button
                      onClick={() => handleCopyHash(ph.sha256Hash)}
                      className="p-1 rounded text-muted-foreground hover:text-foreground"
                      aria-label="Copy Hash"
                    >
                      {copiedHash === ph.sha256Hash ? (
                        <Check className="h-3 w-3 text-gov-success" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </Tooltip>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
          No photographic evidence captured yet. Minimum 4 corner photos required for statutory cadastral signoff.
        </div>
      )}
    </div>
  );
}
