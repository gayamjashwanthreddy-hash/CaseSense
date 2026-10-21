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
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 text-center space-y-3">
        <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-extrabold text-emerald-950 tracking-tight">
          Grievance Successfully Registered
        </h1>
        <p className="text-emerald-900/80 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
          Your complaint has been formally entered into the AICTE CaseBridge registry. Save your non-guessable reference and security verification credentials below.
        </p>
      </div>

      {/* Official Receipt Card */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 text-xs">
          <div>
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
              Official Grievance Receipt
            </span>
            <span className="text-slate-500 text-[11px]">
              AICTE Public Grievance Redressal Cell (PGRC)
            </span>
          </div>
          <span className="font-mono text-slate-500 text-[11px]">
            Dated: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Reference Number */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Complaint Reference Number
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-black text-blue-900 tracking-wider">
                {refNumber}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(refNumber, false)}
                className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-white rounded border border-transparent hover:border-slate-300 transition-colors"
                title="Copy reference number"
              >
                {copiedRef ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Use this identifier in all future official correspondence.
            </p>
          </div>

          {/* Security Tracking Code */}
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
              Security Tracking Code
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-lg font-black text-slate-800 tracking-wider">
                {trackingCode}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(trackingCode, true)}
                className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-white rounded border border-transparent hover:border-slate-300 transition-colors"
                title="Copy tracking code"
              >
                {copiedCode ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              Required alongside your reference number to verify status.
            </p>
          </div>
        </div>

        {/* Respondent Details */}
        <div className="p-3.5 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
          <span className="text-[10px] uppercase font-semibold text-slate-400 block">
            Respondent Institution
          </span>
          <div className="font-bold text-slate-900">{institutionName}</div>
          <div className="text-[11px] text-slate-500">
            Initial Desk Scrutiny Target: 7 Working Days (AICTE Citizen Charter SLA)
          </div>
        </div>

        {/* Actions Strip */}
        <div className="flex flex-wrap items-center justify-between pt-2 gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Official Receipt</span>
          </button>

          <Link
            href={`/track-complaint`}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded shadow-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track Application Status Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Simulated Notice */}
      <div className="p-4 bg-slate-100 border border-slate-200 rounded-lg flex items-start space-x-3 text-xs text-slate-600">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <span className="font-bold text-slate-800 block">Simulated Delivery Disclosure:</span>
          <span>
            In this demonstration prototype, automated SMS and email notifications are simulated in your local browser state. No actual SMS or external emails were transmitted.
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ComplaintConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading confirmation receipt...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
