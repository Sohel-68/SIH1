"use client";

import * as React from "react";
import type { ULPINRecord } from "../types/ulpin-types";
import { qrCodeService } from "../services/qr-code-service";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { QrCode, Copy, Check, ExternalLink, Download } from "lucide-react";
import { useRouter } from "next/navigation";

export interface QRCodeDisplayProps {
  record: ULPINRecord;
}

export function QRCodeDisplay({ record }: QRCodeDisplayProps) {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);

  const qrSvg = React.useMemo(() => {
    return qrCodeService.generateQRCodeSVG(record.qrPayload, 160);
  }, [record.qrPayload]);

  const verifyUrl = `/verify?ulpin=${encodeURIComponent(record.ulpin3D || record.baseUlpin)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(record.qrPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    const blob = new Blob([qrSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `QR_${record.ulpin3D || record.baseUlpin}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm text-center space-y-4 text-xs select-none">
      <div className="space-y-1">
        <h4 className="font-bold text-foreground uppercase tracking-wider text-[11px] flex items-center justify-center space-x-1.5">
          <QrCode className="h-4 w-4 text-gov-accent" />
          <span>Security QR Code</span>
        </h4>
        <p className="text-[11px] text-muted-foreground">
          Scan to authenticate on the National Verification Portal.
        </p>
      </div>

      {/* Embedded High-Contrast QR Code */}
      <div
        className="p-3 bg-white rounded-xl border border-border shadow-inner inline-block mx-auto"
        dangerouslySetInnerHTML={{ __html: qrSvg }}
      />

      <div className="font-mono text-[11px] text-muted-foreground truncate max-w-full px-2">
        {record.ulpin3D || record.baseUlpin}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-2 pt-1 border-t border-border/60">
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-[11px] font-semibold"
          onClick={handleCopyLink}
          leftIcon={copied ? <Check className="h-3.5 w-3.5 text-gov-success" /> : <Copy className="h-3.5 w-3.5" />}
        >
          {copied ? "Link Copied" : "Copy Link"}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="h-8 text-[11px] font-semibold"
          onClick={handleDownloadSVG}
          leftIcon={<Download className="h-3.5 w-3.5" />}
        >
          Download SVG
        </Button>

        <Button
          variant="default"
          size="sm"
          className="h-8 text-[11px] font-bold"
          onClick={() => router.push(verifyUrl)}
          leftIcon={<ExternalLink className="h-3.5 w-3.5" />}
        >
          Verify
        </Button>
      </div>
    </div>
  );
}
