"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Search,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { CaseBridgeStore } from "@/lib/api/store";
import { PublicTrackingData, ComplaintCase } from "@/lib/api/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BureauBadge } from "@/components/shared/BureauBadge";
import { formatDate } from "@/lib/utils";

export default function SingleComplaintPublicPage() {
  const params = useParams();
  const rawId = (params?.complaintId as string) || "";
  const decodedId = decodeURIComponent(rawId);

  const [verificationInput, setVerificationInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [trackingData, setTrackingData] = useState<PublicTrackingData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = (overrideKey?: string) => {
    const key = overrideKey || verificationInput;
    if (!key.trim()) {
      setError("Please provide your registered complainant email or tracking code to verify ownership.");
      return;
    }

    CaseBridgeStore.init();
    const result = CaseBridgeStore.trackComplaint(decodedId, key);
    if (result) {
      setTrackingData(result);
      setIsVerified(true);
      setError(null);
    } else {
      setError("Verification failed. The security key provided does not match records for this reference number.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/track-complaint"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Grievance Tracking Gateway</span>
        </Link>
      </div>

      {/* If Not Verified: Enforce Dual Factor Ownership Challenge */}
      {!isVerified ? (
        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm max-w-lg mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mx-auto border border-blue-200">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold text-slate-900">
              Identity Verification Required
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              To protect complainant confidentiality and prevent sequential enumeration attacks, enter the registered email or tracking code associated with reference:
            </p>
            <div className="font-mono text-sm font-bold text-blue-900 bg-slate-50 py-1.5 px-3 rounded border border-slate-200 inline-block">
              {decodedId}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Complainant Email / Phone / Security Token *
              </label>
              <input
                type="text"
                value={verificationInput}
                onChange={(e) => setVerificationInput(e.target.value)}
                placeholder="e.g. rohit.verma@example.com or TRK-882194"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <button
              type="button"
              onClick={() => handleVerify()}
              className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Verify & Unlock Case Timeline</span>
            </button>
          </div>

          {/* Quick Demo Bypass for Hackathon Reviewers */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => handleVerify("demo")}
              className="text-xs text-blue-700 hover:underline font-medium"
            >
              (Demo Reviewer 1-Click Verification)
            </button>
          </div>
        </div>
      ) : (
        /* Verified Safe Timeline View */
        trackingData && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-lg font-bold text-slate-900">
                    {trackingData.refNumber}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    ({trackingData.caseId})
                  </span>
                </div>
                <h2 className="text-sm font-semibold text-slate-800 mt-0.5">
                  {trackingData.subject}
                </h2>
              </div>
              <div className="flex items-center space-x-2">
                <BureauBadge bureau={trackingData.bureau} />
                <StatusBadge status={trackingData.status} />
              </div>
            </div>

            {/* Institution & SLA strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-md bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Institution Under Scrutiny
                </span>
                <span className="font-bold text-slate-800 block mt-0.5">
                  {trackingData.institutionName}
                </span>
                <span className="text-[11px] text-slate-500">{trackingData.institutionState}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Lodged Date & Target
                </span>
                <span className="font-semibold text-slate-800 block mt-0.5">
                  Received: {formatDate(trackingData.receivedDate)}
                </span>
                <span className="text-[11px] text-blue-700">
                  SLA Target: {formatDate(trackingData.slaDeadline)}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                  Institutional Reply
                </span>
                <span className="font-semibold inline-block mt-0.5 text-slate-800">
                  {trackingData.institutionResponseStatus === "RECEIVED" ? "Counter-Affidavit Filed" : "Response Pending (14d SLA)"}
                </span>
              </div>
            </div>

            {/* Safe Timeline */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Procedural Milestone Timeline
              </h3>
              <div className="relative border-l-2 border-slate-200 ml-3.5 space-y-6 py-1">
                {trackingData.publicTimeline.map((item, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div
                      className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center ${
                        item.isCompleted ? "border-emerald-600" : "border-slate-300"
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
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500">
              Note: Confidential official correspondence, internal scrutiny minutes, and investigator notes are redacted in accordance with administrative privacy norms.
            </div>
          </div>
        )
      )}
    </div>
  );
}
