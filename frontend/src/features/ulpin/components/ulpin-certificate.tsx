"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ULPINRecord } from "../types/ulpin-types";
import { qrCodeService } from "../services/qr-code-service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  ShieldCheck,
  Award,
  Stamp,
  CheckCircle2,
  Building,
  QrCode,
  Calendar,
  Layers,
} from "lucide-react";

export interface ULPINCertificateProps {
  record: ULPINRecord;
}

export function ULPINCertificate({ record }: ULPINCertificateProps) {
  const qrSvg = React.useMemo(() => {
    return qrCodeService.generateQRCodeSVG(record.qrPayload, 140);
  }, [record.qrPayload]);

  const handlePrint = () => {
    window.print();
  };

  const is3D = !!record.ulpin3D;

  return (
    <div className="space-y-4">
      {/* Top Action Ribbon */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center space-x-2">
          <Award className="h-4 w-4 text-gov-accent" />
          <span className="font-bold text-xs uppercase tracking-wider text-foreground">
            Official Bhu-Aadhaar Certificate (DoLR Format)
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs font-semibold"
          onClick={handlePrint}
          leftIcon={<Printer className="h-3.5 w-3.5" />}
        >
          Print / Save PDF
        </Button>
      </div>

      {/* Printable Certificate Sheet (A4 Proportion) */}
      <div className="rounded-2xl border-2 border-slate-700 bg-white text-slate-900 shadow-2xl p-6 sm:p-10 space-y-6 select-none font-sans relative overflow-hidden">
        {/* Background Sovereign Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-9xl font-black tracking-widest text-slate-900 uppercase">
            BHU-AADHAAR
          </span>
        </div>

        {/* Certificate Header */}
        <div className="text-center space-y-1.5 border-b-2 border-slate-300 pb-5">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xl font-bold tracking-widest text-slate-900">
              GOVERNMENT OF INDIA
            </span>
          </div>
          <p className="text-xs uppercase tracking-wider font-semibold text-slate-600">
            Ministry of Rural Development &bull; Department of Land Resources (DoLR)
          </p>
          <p className="text-[11px] text-slate-500">
            National Land Records Modernization Programme (DILRMP) &bull; National 3D ULPIN Platform
          </p>
          <h2 className="text-lg font-bold text-slate-900 pt-2 tracking-wide uppercase">
            Certificate of Unique Land Parcel Identification Number
          </h2>
        </div>

        {/* Prominent ULPIN Hero Banner */}
        <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
              {is3D ? "Official 3D Strata ULPIN" : "14-Digit Base ULPIN (Bhu-Aadhaar)"}
            </span>
            <span className="font-mono text-xl sm:text-2xl font-black text-slate-950 tracking-wider block">
              {record.ulpin3D || record.baseUlpin}
            </span>
            {is3D && (
              <span className="text-xs font-mono text-slate-600 block">
                Base Ground Cadastre: <strong>{record.baseUlpin}</strong> &bull; Version {record.version}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <Badge variant="success" size="default" className="font-bold tracking-wide">
              {record.status}
            </Badge>
          </div>
        </div>

        {/* Certificate Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
          {/* Left 8 Cols: Cadastral Hierarchy & Spatial Specifications */}
          <div className="md:col-span-8 space-y-5">
            {/* 12-Level Hierarchy Path */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                1. Administrative Cadastral Hierarchy
              </span>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 text-[11px] space-y-1">
                <p>
                  <strong>State / UT:</strong> Maharashtra (Code: {record.hierarchy.stateCode}) &bull;{" "}
                  <strong>District:</strong> Mumbai Suburban ({record.hierarchy.districtCode})
                </p>
                <p>
                  <strong>Taluka:</strong> Andheri ({record.hierarchy.talukaCode}) &bull;{" "}
                  <strong>Village:</strong> Versova (LGD: {record.hierarchy.villageCode})
                </p>
                <p>
                  <strong>Cadastral Survey No:</strong> {record.hierarchy.surveyNumber} &bull;{" "}
                  <strong>Subdivision:</strong> {record.hierarchy.subdivision} &bull;{" "}
                  <strong>Parcel:</strong> {record.hierarchy.parcelNumber}
                </p>
                {is3D && (
                  <p className="pt-1 border-t border-slate-200 text-slate-800 font-semibold">
                    <strong>Building:</strong> B{record.hierarchy.buildingCode || "01"} &bull;{" "}
                    <strong>Tower:</strong> {record.hierarchy.towerNumber || "TA"} &bull;{" "}
                    <strong>Floor:</strong> Floor {record.hierarchy.floorLevel} &bull;{" "}
                    <strong>Apartment:</strong> Unit {record.hierarchy.unitNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Registered Ownership Details */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                2. Registered Proprietary Title
              </span>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 text-[11px] space-y-1">
                <p>
                  <strong>Registered Owner(s):</strong> {record.ownerName}
                </p>
                <p className="text-slate-600 font-mono text-[10px]">
                  <strong>Identification:</strong> {record.ownerMaskedId}
                </p>
                {record.reasonForRevision && (
                  <p className="text-[10px] text-amber-800 pt-1 border-t border-slate-200">
                    <strong>Mutation Remark:</strong> {record.reasonForRevision}
                  </p>
                )}
              </div>
            </div>

            {/* Spatial & Volumetric Parameters */}
            <div className="space-y-1.5">
              <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider block">
                3. Spatial Extent &amp; Georeferenced Coordinates
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-500 block">Carpet Area</span>
                  <span className="font-bold text-slate-900">{record.carpetAreaSqm} m²</span>
                </div>
                {record.volumeCum && (
                  <div className="p-2 rounded border border-slate-200 bg-white">
                    <span className="text-[10px] text-slate-500 block">Enclosed Volume</span>
                    <span className="font-bold text-slate-900">{record.volumeCum} m³</span>
                  </div>
                )}
                <div className="p-2 rounded border border-slate-200 bg-white">
                  <span className="text-[10px] text-slate-500 block">Elevation (AMSL)</span>
                  <span className="font-bold text-slate-900">{record.elevationAmsl} m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right 4 Cols: QR Code, Digital Signature, Issuing Stamp */}
          <div className="md:col-span-4 flex flex-col items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                Secure QR Code Verification
              </span>
              {/* Embedded Vector QR Code */}
              <div
                className="p-2 bg-white rounded-lg border border-slate-300 shadow-sm inline-block"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
              <p className="text-[9px] text-slate-500 leading-tight">
                Scan with any smartphone or government QR scanner to verify authenticity.
              </p>
            </div>

            {/* Digital Signature Seal */}
            <div className="w-full pt-3 border-t border-slate-300 space-y-1 text-[10px]">
              <div className="flex items-center justify-center space-x-1 text-gov-primary font-bold">
                <Stamp className="h-3.5 w-3.5" />
                <span>Digitally Certified</span>
              </div>
              <p className="text-slate-800 font-semibold">{record.issuingAuthority}</p>
              <p className="text-slate-500 font-mono text-[9px]">Date: {record.issueDate}</p>
              <p className="text-[9px] font-mono text-slate-400 truncate max-w-full">
                Hash: {record.verificationHash.slice(0, 24)}...
              </p>
            </div>
          </div>
        </div>

        {/* Certificate Statutory Disclaimer Footer */}
        <div className="pt-4 border-t border-slate-300 text-center text-[10px] text-slate-500 space-y-0.5">
          <p>
            This is an authenticated electronic certificate issued under Section 65B of the Indian Evidence Act.
          </p>
          <p className="font-mono text-[9px] text-slate-400">
            Digital Signature Digest: {record.verificationHash}
          </p>
        </div>
      </div>
    </div>
  );
}
