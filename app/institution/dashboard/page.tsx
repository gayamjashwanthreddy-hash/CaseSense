"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  FileText,
  Send,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { CaseBridgeStore } from "@/lib/api/store";
import { SupabaseDataService } from "@/lib/supabase/dataService";
import { InstitutionAccount, ComplaintCase, InstitutionResponse, Institution } from "@/lib/api/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BureauBadge } from "@/components/shared/BureauBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { formatDate } from "@/lib/utils";

export default function InstitutionDashboardPage() {
  const router = useRouter();
  const [institution, setInstitution] = useState<InstitutionAccount | null>(null);
  const [institutionMaster, setInstitutionMaster] = useState<Institution | null>(null);
  const [scopedCases, setScopedCases] = useState<ComplaintCase[]>([]);
  const [scopedResponses, setScopedResponses] = useState<InstitutionResponse[]>([]);

  const loadData = () => {
    CaseBridgeStore.init();
    const current = CaseBridgeStore.getCurrentInstitution();
    if (!current) {
      router.push("/institution/login");
      return;
    }
    setInstitution(current);

    // Fetch master profile
    SupabaseDataService.getInstitutionById(current.institutionId).then((master) => {
      setInstitutionMaster(master || null);
    });

    // Fetch SCOPED complaints ONLY for this institution
    SupabaseDataService.getCases({ institutionId: current.institutionId }).then((allCases) => {
      setScopedCases(allCases);
    });

    // Fetch responses for this institution
    SupabaseDataService.getInstitutionResponses(current.institutionId).then((responses) => {
      setScopedResponses(responses);
    });
  };

  useEffect(() => {
    loadData();
    window.addEventListener("casebridge_store_updated", loadData);
    return () => window.removeEventListener("casebridge_store_updated", loadData);
  }, []);

  if (!institution) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Authenticating institutional session...
      </div>
    );
  }

  const activeInquiries = scopedCases.filter((c) => c.status !== "RESOLVED");
  const urgentNotices = scopedCases.filter(
    (c) => c.status === "NOTICE_ISSUED" || c.status === "OVERLAP_FLAGGED" || c.status === "JOINT_COMMITTEE"
  );
  const resolvedCount = scopedCases.filter((c) => c.status === "RESOLVED").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Institution Profile Summary */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300">
              AICTE PID: {institution.institutionId}
            </span>
            <span className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
              {institutionMaster?.approvalStatus || "Approved (2025-2026)"}
            </span>
            <span className="text-xs text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-semibold">
              {institutionMaster?.accreditation || "NAAC A+"}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {institution.institutionName}
          </h1>
          <p className="text-xs text-slate-500">
            Signatory: <strong className="text-slate-700">{institution.contactPerson}</strong> ({institution.designation}) • Affiliated to: {institutionMaster?.affiliatedUniversity || "State University"}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/institution/complaints"
            className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View All Inquiries ({scopedCases.length})</span>
          </Link>
          <Link
            href="/institution/profile"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs rounded-md border border-slate-300 transition-colors"
          >
            Institutional Profile
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Inquiries on Record
          </span>
          <div className="text-2xl font-black text-slate-900">{scopedCases.length}</div>
          <p className="text-[11px] text-slate-400">Scoped strictly to PID {institution.institutionId}</p>
        </div>

        <div className="p-4 bg-white rounded-lg border border-amber-200 shadow-2xs space-y-1 bg-amber-50/20">
          <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block">
            Active / Open Notices
          </span>
          <div className="text-2xl font-black text-amber-900">{activeInquiries.length}</div>
          <p className="text-[11px] text-amber-700 font-medium">Under active bureau scrutiny</p>
        </div>

        <div className="p-4 bg-white rounded-lg border border-red-200 shadow-2xs space-y-1 bg-red-50/20">
          <span className="text-[11px] font-semibold text-red-800 uppercase tracking-wider block">
            Urgent Responses Due
          </span>
          <div className="text-2xl font-black text-red-900">{urgentNotices.length}</div>
          <p className="text-[11px] text-red-700 font-medium">14-day SLA window active</p>
        </div>

        <div className="p-4 bg-white rounded-lg border border-emerald-200 shadow-2xs space-y-1 bg-emerald-50/20">
          <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
            Compliance Counter-Affidavits
          </span>
          <div className="text-2xl font-black text-emerald-900">{scopedResponses.length}</div>
          <p className="text-[11px] text-emerald-700 font-medium">Formally filed with AICTE</p>
        </div>
      </div>

      {/* Active Inquiries Requiring Immediate Attention */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Pending Institutional Inquiries & Show-Cause Notices</span>
            </h2>
            <p className="text-[11px] text-slate-500">
              Complaints registered across AICTE bureaus requiring counter-statements or supporting proofs.
            </p>
          </div>
          <Link
            href="/institution/complaints"
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeInquiries.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No active pending notices on record for your institution.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {activeInquiries.map((c) => (
              <div
                key={c.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-900">{c.id}</span>
                    <BureauBadge bureau={c.bureau} />
                    <PriorityBadge priority={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>
                  <h3 className="font-semibold text-slate-800 text-xs mt-0.5">
                    {c.subject}
                  </h3>
                  <div className="text-[11px] text-slate-500">
                    Category: <span className="font-medium text-slate-700">{c.category.replace(/_/g, " ")}</span> • Received: {formatDate(c.receivedDate)} • Response Deadline: <span className="text-red-700 font-semibold">{formatDate(c.nextActionDeadline)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <Link
                    href={`/institution/complaints/${encodeURIComponent(c.id)}`}
                    className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs rounded transition-colors flex items-center space-x-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>File Counter-Affidavit</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Submissions Strip */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Recently Filed Compliance Responses</span>
        </h2>

        {scopedResponses.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500">
            No counter-affidavits filed yet. Use the action button above to file a response to any open inquiry.
          </div>
        ) : (
          <div className="space-y-3">
            {scopedResponses.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded bg-slate-50 border border-slate-200 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-semibold text-slate-900">
                    <span className="font-mono text-blue-900">{r.id}</span>
                    <span>•</span>
                    <span className="font-mono text-slate-600">Re: {r.caseId}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                    {r.status}
                  </span>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed italic line-clamp-2">
                  &quot;{r.statement}&quot;
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                  <span>Signatory: {r.submittedBy} ({r.officialDesignation})</span>
                  <span>Filed: {r.submittedAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
