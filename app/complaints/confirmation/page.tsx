"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Copy,
  Download,
  Search,
  Building2,
  Calendar,
  Lock,
  ArrowRight,
  Printer,
  AlertCircle,
} from "lucide-react";
import { useToast } from "@/lib/context/ToastContext";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const refNumber = searchParams.get("ref") || "PGRC-2026-7841";
  const trackingCode = searchParams.get("code") || "TRK-938210";
  const institutionName = searchParams.get("inst") || "Apex Institute of Technology, Pune";

  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const copyToClipboard = (text: string, isCode: boolean) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      if (isCode) {
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
      } else {
        setCopiedRef(true);
        setTimeout(() => setCopiedRef(false), 2000);
      }
      toast("Copied to clipboard.", "info");
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Badge Banner */}
      <div className="bg-[#E8F4EC] border border-[#23734D]/25 rounded-xl p-6 text-center space-y-3">
        <div className="w-12 h-12 bg-[#23734D] text-white rounded-full flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#20231F] tracking-tight">
          Grievance Successfully Registered
        </h1>
        <p className="text-[#20231F] text-xs sm:text-sm max-w-lg mx-auto leading-relaxed font-mono">
          Your complaint has been formally entered into the AICTE CaseSense registry. Save your non-guessable reference and security verification credentials below.
        </p>
      </div>

      {/* Official Receipt Card */}
      <div className="bg-white rounded-xl border border-[#E3E5DE] shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E3E5DE] text-xs">
          <div>
            <span className="font-bold text-[#20231F] uppercase tracking-wider text-[11px] block font-mono">
              Official Grievance Receipt
            </span>
            <span className="text-[#62665F] text-[11px] font-mono">
              AICTE Public Grievance Redressal Cell (PGRC)
            </span>
          </div>
          <span className="font-mono text-[#62665F] text-[11px]">
            Dated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Reference Number */}
          <div className="p-4 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#62665F] tracking-wider block font-mono">
              Complaint Reference Number
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-[#344B3B] tracking-wider">
                {refNumber}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(refNumber, false)}
                className="p-1.5 text-[#62665F] hover:text-[#20231F] hover:bg-white rounded border border-transparent hover:border-[#E3E5DE] transition-colors"
                title="Copy reference number"
              >
                {copiedRef ? <CheckCircle2 className="w-4 h-4 text-[#23734D]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-[#62665F] font-mono">
              Quoted in all subsequent statutory communications.
            </p>
          </div>

          {/* Security Key */}
          <div className="p-4 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE] space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#62665F] tracking-wider block font-mono">
              Secret Tracking Passcode
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-bold text-[#20231F] tracking-wider">
                {trackingCode}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(trackingCode, true)}
                className="p-1.5 text-[#62665F] hover:text-[#20231F] hover:bg-white rounded border border-transparent hover:border-[#E3E5DE] transition-colors"
                title="Copy security passcode"
              >
                {copiedCode ? <CheckCircle2 className="w-4 h-4 text-[#23734D]" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-[#62665F] font-mono">
              Required alongside your reference number to inspect status.
            </p>
          </div>
        </div>

        {/* Target College info */}
        <div className="p-4 rounded-lg bg-[#F7F7F4] border border-[#E3E5DE] flex items-center space-x-3 text-xs">
          <Building2 className="w-5 h-5 text-[#344B3B] shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#62665F] block font-mono">
              Target Technical Institution
            </span>
            <span className="font-semibold text-[#20231F] text-xs">
              {institutionName}
            </span>
          </div>
        </div>

        {/* Security Warning */}
        <div className="p-4 bg-[#FBF1DB] border border-[#925C0B]/25 rounded-lg text-xs text-[#925C0B] flex items-start space-x-2.5">
          <Lock className="w-4 h-4 text-[#925C0B] shrink-0 mt-0.5" />
          <div className="space-y-1 font-mono text-[11px]">
            <span className="font-bold block">Dual-Factor Verification Protocol:</span>
            <p className="leading-relaxed">
              To prevent unauthorized parties from discovering whether complaints exist against an institution, live tracking requires both your Reference Number and your Secret Tracking Passcode or registered email address.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 font-mono">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2 border border-[#E3E5DE] hover:bg-[#F7F7F4] text-[#20231F] font-semibold text-xs rounded-md transition-colors flex items-center justify-center space-x-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Receipt</span>
          </button>

          <Link
            href={`/track-complaint?ref=${encodeURIComponent(refNumber)}`}
            className="w-full sm:w-auto px-5 py-2 bg-[#344B3B] hover:bg-[#293D30] text-white font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <span>Proceed to Live Tracking Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-[#62665F] font-mono">Loading confirmation receipt...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
