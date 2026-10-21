"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { CaseBridgeStore } from "@/lib/api/store";
import { PublicTrackingData } from "@/lib/api/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BureauBadge } from "@/components/shared/BureauBadge";
import { formatDate } from "@/lib/utils";

export default function TrackComplaintPage() {
  const [refNumber, setRefNumber] = useState("");
  const [verificationKey, setVerificationKey] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [trackingData, setTrackingData] = useState<PublicTrackingData | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!refNumber.trim() || !verificationKey.trim()) {
      setErrorMessage("Please enter both the Reference Number and your Complainant Email / Phone / Tracking Code.");
      return;
    }

    setIsSearching(true);
    setErrorMessage(null);

    // Call store method
    setTimeout(() => {
      CaseBridgeStore.init();
      const result = CaseBridgeStore.trackComplaint(refNumber, verificationKey);
      setIsSearching(false);
      setHasSearched(true);
      if (result) {
        setTrackingData(result);
      } else {
        setTrackingData(null);
        setErrorMessage("No matching complaint record found. Ensure the Reference Number matches your receipt and that you provided the registered email or phone used during submission.");
      }
    }, 300);
  };

  const handleDemoPreset = (ref: string, key: string) => {
    setRefNumber(ref);
    setVerificationKey(key);
    setIsSearching(true);
    setErrorMessage(null);
    setTimeout(() => {
      CaseBridgeStore.init();
      const result = CaseBridgeStore.trackComplaint(ref, key);
      setIsSearching(false);
      setHasSearched(true);
      setTrackingData(result);
    }, 200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Grievance / Application Status
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">
          Verify the real-time procedural status of your submitted grievance across AICTE bureaus using your unique reference number and dual-factor credentials.
        </p>
      </div>

      {/* Dual-Factor Search Box */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
            <Lock className="w-4 h-4 text-blue-700" />
            <span>Secure Verification Required</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Protected against sequential ID enumeration
          </span>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Complaint Reference Number *
            </label>
            <input
              type="text"
              required
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value)}
              placeholder="e.g. PGRC-2026-0892 or AICTE/PGRC/2026/0892"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600 font-mono uppercase"
            />
          </div>

          <div className="md:col-span-4 space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Complainant Email / Phone / Token *
            </label>
            <input
              type="text"
              required
              value={verificationKey}
              onChange={(e) => setVerificationKey(e.target.value)}
              placeholder="Registered email or phone"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full h-[38px] px-4 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              {isSearching ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Search className="w-3.5 h-3.5" />
              )}
              <span>{isSearching ? "Checking..." : "Verify & Track"}</span>
            </button>
          </div>
        </form>

        {/* Quick Demo Pre-fill Pills */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="text-[11px] font-medium text-slate-400">Quick Demo Presets:</span>
          <button
            type="button"
            onClick={() => handleDemoPreset("AICTE/PGRC/2026/0892", "demo")}
            className="text-[11px] font-mono bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2 py-0.5 rounded border border-slate-200 transition-colors"
          >
            PGRC-2026-0892 (Apex Institute)
          </button>
          <button
            type="button"
            onClick={() => handleDemoPreset("AICTE/REG/2026/0142", "demo")}
            className="text-[11px] font-mono bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2 py-0.5 rounded border border-slate-200 transition-colors"
          >
            REG-2026-0142 (Capitation Fee)
          </button>
          <button
            type="button"
            onClick={() => handleDemoPreset("AICTE/APP/2026/0078", "demo")}
            className="text-[11px] font-mono bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 px-2 py-0.5 rounded border border-slate-200 transition-colors"
          >
            APP-2026-0078 (Approval Bureau)
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Authentication / Search Error</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Verified Safe Tracking Result */}
      {trackingData && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden space-y-6 p-6">
          {/* Result Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-base font-bold text-slate-900">
                  {trackingData.refNumber}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  ({trackingData.caseId})
                </span>
              </div>
              <h2 className="text-sm font-semibold text-slate-700 mt-0.5">
                {trackingData.subject}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <BureauBadge bureau={trackingData.bureau} />
              <StatusBadge status={trackingData.status} />
            </div>
          </div>

          {/* Key Facts Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-md bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Respondent Institution
              </span>
              <span className="font-semibold text-slate-800 block mt-0.5">
                {trackingData.institutionName}
              </span>
              <span className="text-[11px] text-slate-500">
                {trackingData.institutionState}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Lodged Date & Target SLA
              </span>
              <span className="font-semibold text-slate-800 block mt-0.5">
                Lodged: {formatDate(trackingData.receivedDate)}
              </span>
              <span className="text-[11px] text-blue-700 font-medium">
                SLA Target: {formatDate(trackingData.slaDeadline)}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Institutional Reply Status
              </span>
              <span
                className={`font-semibold inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] ${
                  trackingData.institutionResponseStatus === "RECEIVED"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {trackingData.institutionResponseStatus === "RECEIVED"
                  ? "Counter-Affidavit Filed"
                  : "Response Awaited (Within 14d SLA)"}
              </span>
            </div>
          </div>

          {/* Action Required from Citizen Prompt */}
          {trackingData.actionRequiredFromComplainant && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                <strong>Action Needed:</strong> {trackingData.actionRequiredFromComplainant}
              </span>
            </div>
          )}

          {/* Safe Public Milestone Timeline */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Procedural Milestone Timeline
            </h3>

            <div className="relative border-l-2 border-slate-200 ml-3.5 space-y-6 py-1">
              {trackingData.publicTimeline.map((item, idx) => (
                <div key={idx} className="relative pl-6">
                  {/* Timeline Node */}
                  <div
                    className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      item.isCompleted
                        ? "border-emerald-600 text-emerald-600"
                        : "border-slate-300 text-slate-300"
                    }`}
                  >
                    {item.isCompleted && <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-slate-900">{item.stage}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.date ? formatDate(item.date) : "Pending"}
                      </span>
                      {item.isCompleted ? (
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 rounded">
                          Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 rounded">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500 flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              Internal official case notes and officer deliberations are protected under administrative privacy rules and omitted from public tracking.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
