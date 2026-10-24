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
import { SupabaseDataService } from "@/lib/supabase/dataService";
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

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!refNumber.trim() || !verificationKey.trim()) {
      setErrorMessage("Please enter both the Reference Number and your Complainant Email / Phone / Tracking Code.");
      return;
    }

    setIsSearching(true);
    setErrorMessage(null);

    try {
      const result = await SupabaseDataService.trackComplaint(refNumber, verificationKey);
      setIsSearching(false);
      setHasSearched(true);
      if (result) {
        setTrackingData(result);
      } else {
        setTrackingData(null);
        setErrorMessage("No matching complaint record found. Ensure the Reference Number matches your receipt and that you provided the registered email or phone used during submission.");
      }
    } catch (err: any) {
      setIsSearching(false);
      setHasSearched(true);
      setTrackingData(null);
      setErrorMessage("Service unavailable. Please retry shortly.");
    }
  };

  const handleDemoPreset = async (ref: string, key: string) => {
    setRefNumber(ref);
    setVerificationKey(key);
    setIsSearching(true);
    setErrorMessage(null);
    try {
      const result = await SupabaseDataService.trackComplaint(ref, key);
      setIsSearching(false);
      setHasSearched(true);
      setTrackingData(result);
    } catch {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="border-b border-[#E3E5DE] pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#20231F] tracking-tight">
          Track Grievance / Application Status
        </h1>
        <p className="text-[#62665F] text-xs sm:text-sm mt-1.5 leading-relaxed font-mono">
          Verify the real-time procedural status of your submitted grievance across AICTE bureaus using your unique reference number and dual-factor credentials.
        </p>
      </div>

      {/* Dual-Factor Search Box */}
      <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-semibold text-[#20231F]">
            <Lock className="w-4 h-4 text-[#344B3B]" />
            <span>Secure Verification Required</span>
          </div>
          <span className="text-[11px] text-[#85877F] font-mono">
            Protected against sequential ID enumeration
          </span>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 space-y-1">
            <label className="block text-xs font-semibold text-[#20231F]">
              Complaint Reference Number *
            </label>
            <input
              type="text"
              required
              value={refNumber}
              onChange={(e) => setRefNumber(e.target.value)}
              placeholder="e.g. PGRC-2026-0892 or AICTE/PGRC/2026/0892"
              className="w-full px-3 py-2 text-xs border border-[#E3E5DE] rounded-md bg-[#F7F7F4] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white text-[#20231F] font-mono uppercase"
            />
          </div>

          <div className="md:col-span-4 space-y-1">
            <label className="block text-xs font-semibold text-[#20231F]">
              Complainant Email / Phone / Token *
            </label>
            <input
              type="text"
              required
              value={verificationKey}
              onChange={(e) => setVerificationKey(e.target.value)}
              placeholder="Registered email or phone"
              className="w-full px-3 py-2 text-xs border border-[#E3E5DE] rounded-md bg-[#F7F7F4] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white text-[#20231F]"
            />
          </div>

          <div className="md:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isSearching}
              className="w-full h-[38px] px-4 bg-[#344B3B] hover:bg-[#293D30] text-white font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50 font-mono"
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
        <div className="pt-2 border-t border-[#E3E5DE] flex flex-wrap items-center gap-2 text-xs text-[#62665F]">
          <span className="text-[11px] font-medium text-[#85877F] font-mono">Quick Demo Presets:</span>
          <button
            type="button"
            onClick={() => handleDemoPreset("AICTE/PGRC/2026/0892", "demo")}
            className="text-[11px] font-mono bg-[#F7F7F4] hover:bg-[#E8EEE7] text-[#20231F] hover:text-[#344B3B] px-2 py-0.5 rounded border border-[#E3E5DE] transition-colors"
          >
            PGRC-2026-0892 (Apex Institute)
          </button>
          <button
            type="button"
            onClick={() => handleDemoPreset("AICTE/REG/2026/0142", "demo")}
            className="text-[11px] font-mono bg-[#F7F7F4] hover:bg-[#E8EEE7] text-[#20231F] hover:text-[#344B3B] px-2 py-0.5 rounded border border-[#E3E5DE] transition-colors"
          >
            REG-2026-0142 (Capitation Fee)
          </button>
          <button
            type="button"
            onClick={() => handleDemoPreset("AICTE/APP/2026/0078", "demo")}
            className="text-[11px] font-mono bg-[#F7F7F4] hover:bg-[#E8EEE7] text-[#20231F] hover:text-[#344B3B] px-2 py-0.5 rounded border border-[#E3E5DE] transition-colors"
          >
            APP-2026-0078 (Approval Bureau)
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="p-4 bg-[#FBEAEC] border border-[#B42332]/25 rounded-md flex items-start space-x-3 text-xs text-[#B42332] font-mono">
          <AlertCircle className="w-4 h-4 text-[#B42332] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Authentication / Search Error</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Verified Safe Tracking Result */}
      {trackingData && (
        <div className="bg-white rounded-xl border border-[#E3E5DE] shadow-xs overflow-hidden space-y-6 p-6">
          {/* Result Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E3E5DE] gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-base font-bold text-[#20231F]">
                  {trackingData.refNumber}
                </span>
                <span className="text-[10px] text-[#85877F] font-mono">
                  ({trackingData.caseId})
                </span>
              </div>
              <h2 className="text-sm font-semibold text-[#20231F] mt-0.5">
                {trackingData.subject}
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <BureauBadge bureau={trackingData.bureau} />
              <StatusBadge status={trackingData.status} />
            </div>
          </div>

          {/* Key Facts Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-lg bg-[#F7F7F4] border border-[#E3E5DE] text-xs">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#85877F] block font-mono">
                Respondent Institution
              </span>
              <span className="font-semibold text-[#20231F] block mt-0.5">
                {trackingData.institutionName}
              </span>
              <span className="text-[11px] text-[#62665F]">
                {trackingData.institutionState}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#85877F] block font-mono">
                Lodged Date &amp; Target SLA
              </span>
              <span className="font-semibold text-[#20231F] block mt-0.5 font-mono">
                Lodged: {formatDate(trackingData.receivedDate)}
              </span>
              <span className="text-[11px] text-[#344B3B] font-medium font-mono">
                SLA Target: {formatDate(trackingData.slaDeadline)}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#85877F] block font-mono">
                Institutional Reply Status
              </span>
              <span
                className={`font-semibold inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-mono ${
                  trackingData.institutionResponseStatus === "RECEIVED"
                    ? "bg-[#E8F4EC] text-[#23734D] border border-[#23734D]/25"
                    : "bg-[#FBF1DB] text-[#925C0B] border border-[#925C0B]/25"
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
            <div className="p-3 bg-[#E8EEE7] border border-[#344B3B]/20 rounded-md text-xs text-[#344B3B] flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#344B3B] shrink-0" />
              <span>
                <strong>Action Needed:</strong> {trackingData.actionRequiredFromComplainant}
              </span>
            </div>
          )}

          {/* Safe Public Milestone Timeline */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#20231F] font-mono">
              Procedural Milestone Timeline
            </h3>

            <div className="relative border-l-2 border-[#E3E5DE] ml-3.5 space-y-6 py-1">
              {trackingData.publicTimeline.map((item, idx) => (
                <div key={idx} className="relative pl-6">
                  {/* Timeline Node */}
                  <div
                    className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      item.isCompleted
                        ? "border-[#23734D] text-[#23734D]"
                        : "border-[#D4D8CF] text-[#85877F]"
                    }`}
                  >
                    {item.isCompleted && <div className="w-1.5 h-1.5 rounded-full bg-[#23734D]" />}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-xs font-bold text-[#20231F]">{item.stage}</h4>
                      <span className="text-[10px] text-[#85877F] font-mono">
                        {item.date ? formatDate(item.date) : "Pending"}
                      </span>
                      {item.isCompleted ? (
                        <span className="text-[10px] font-semibold text-[#23734D] bg-[#E8F4EC] px-1.5 rounded font-mono">
                          Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-[#62665F] bg-[#F0F1ED] px-1.5 rounded font-mono">
                          In Progress
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#62665F] mt-0.5 leading-relaxed font-sans">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-[#F7F7F4] border border-[#E3E5DE] rounded-md text-[11px] text-[#62665F] flex items-center space-x-2 font-mono">
            <Lock className="w-3.5 h-3.5 text-[#85877F] shrink-0" />
            <span>
              Internal official case notes and officer deliberations are protected under administrative privacy rules and omitted from public tracking.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
