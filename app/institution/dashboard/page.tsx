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
      <div className="p-8 text-center text-xs text-[#62665F] font-mono">
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
      <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold bg-[#F7F7F4] text-[#20231F] px-2 py-0.5 rounded border border-[#E3E5DE]">
              AICTE PID: {institution.institutionId}
            </span>
            <span className="text-xs text-[#23734D] bg-[#E8F4EC] border border-[#23734D]/25 px-2 py-0.5 rounded font-semibold font-mono">
              {institutionMaster?.approvalStatus || "Approved (2025-2026)"}
            </span>
            <span className="text-xs text-[#344B3B] bg-[#E8EEE7] border border-[#344B3B]/25 px-2 py-0.5 rounded font-semibold font-mono">
              {institutionMaster?.accreditation || "NAAC A+"}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#20231F] tracking-tight">
            {institution.institutionName}
          </h1>
          <p className="text-xs text-[#62665F] font-mono">
            Signatory: <strong className="text-[#20231F]">{institution.contactPerson}</strong> ({institution.designation}) • Affiliated to: {institutionMaster?.affiliatedUniversity || "State University"}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            href="/institution/complaints"
            className="px-4 py-2 bg-[#344B3B] hover:bg-[#293D30] text-white font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center space-x-1.5 font-mono"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View All Inquiries ({scopedCases.length})</span>
          </Link>
          <Link
            href="/institution/profile"
            className="px-4 py-2 bg-white hover:bg-[#F7F7F4] text-[#20231F] font-medium text-xs rounded-md border border-[#E3E5DE] transition-colors font-mono"
          >
            Institutional Profile
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-[#E3E5DE] shadow-xs space-y-1">
          <span className="text-[11px] font-semibold text-[#62665F] uppercase tracking-wider block font-mono">
            Total Inquiries on Record
          </span>
          <div className="text-2xl font-bold font-mono text-[#20231F]">{scopedCases.length}</div>
          <p className="text-[11px] text-[#85877F] font-mono">Scoped strictly to PID {institution.institutionId}</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#925C0B]/25 shadow-xs space-y-1 bg-[#FBF1DB]/30">
          <span className="text-[11px] font-semibold text-[#925C0B] uppercase tracking-wider block font-mono">
            Active / Open Notices
          </span>
          <div className="text-2xl font-bold font-mono text-[#925C0B]">{activeInquiries.length}</div>
          <p className="text-[11px] text-[#925C0B]/90 font-medium font-mono">Under active bureau scrutiny</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#B42332]/25 shadow-xs space-y-1 bg-[#FBEAEC]/30">
          <span className="text-[11px] font-semibold text-[#B42332] uppercase tracking-wider block font-mono">
            Urgent Responses Due
          </span>
          <div className="text-2xl font-bold font-mono text-[#B42332]">{urgentNotices.length}</div>
          <p className="text-[11px] text-[#B42332]/90 font-medium font-mono">14-day statutory window</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#23734D]/25 shadow-xs space-y-1 bg-[#E8F4EC]/30">
          <span className="text-[11px] font-semibold text-[#23734D] uppercase tracking-wider block font-mono">
            Compliance Counter-Affidavits
          </span>
          <div className="text-2xl font-bold font-mono text-[#23734D]">{scopedResponses.length}</div>
          <p className="text-[11px] text-[#23734D]/90 font-medium font-mono">Formally filed with AICTE</p>
        </div>
      </div>

      {/* Active Inquiries Requiring Immediate Attention */}
      <div className="bg-white rounded-xl border border-[#E3E5DE] shadow-xs overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E3E5DE]">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-[#20231F] flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-[#925C0B]" />
              <span>Pending Institutional Inquiries &amp; Show-Cause Notices</span>
            </h2>
            <p className="text-[11px] text-[#62665F] font-mono">
              Complaints registered across AICTE bureaus requiring counter-statements or supporting proofs.
            </p>
          </div>
          <Link
            href="/institution/complaints"
            className="text-xs font-semibold text-[#344B3B] hover:text-[#202F25] inline-flex items-center space-x-1 font-mono"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeInquiries.length === 0 ? (
          <div className="p-8 text-center text-[#62665F] text-xs font-mono">
            No active pending notices on record for your institution.
          </div>
        ) : (
          <div className="divide-y divide-[#E3E5DE]">
            {activeInquiries.map((c) => (
              <div
                key={c.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-[#20231F]">{c.id}</span>
                    <BureauBadge bureau={c.bureau} />
                    <PriorityBadge priority={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>
                  <h3 className="font-semibold text-[#20231F] text-xs mt-0.5">
                    {c.subject}
                  </h3>
                  <div className="text-[11px] text-[#62665F] font-mono">
                    Category: <span className="font-medium text-[#20231F]">{c.category.replace(/_/g, " ")}</span> • Received: {formatDate(c.receivedDate)} • Response Deadline: <span className="text-[#B42332] font-semibold">{formatDate(c.nextActionDeadline)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <Link
                    href={`/institution/complaints/${encodeURIComponent(c.id)}`}
                    className="px-3.5 py-1.5 bg-[#344B3B] hover:bg-[#293D30] text-white font-semibold text-xs rounded-md transition-colors flex items-center space-x-1 font-mono"
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
      <div className="bg-white rounded-xl border border-[#E3E5DE] shadow-xs p-6 space-y-4">
        <h2 className="text-sm font-bold text-[#20231F] flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#23734D]" />
          <span>Recently Filed Compliance Responses</span>
        </h2>

        {scopedResponses.length === 0 ? (
          <div className="p-6 text-center text-xs text-[#62665F] font-mono">
            No counter-affidavits filed yet. Use the action button above to file a response to any open inquiry.
          </div>
        ) : (
          <div className="space-y-3">
            {scopedResponses.map((r) => (
              <div
                key={r.id}
                className="p-3.5 rounded-lg bg-[#F7F7F4] border border-[#E3E5DE] text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-semibold text-[#20231F]">
                    <span className="font-mono text-[#344B3B]">{r.id}</span>
                    <span>•</span>
                    <span className="font-mono text-[#62665F]">Re: {r.caseId}</span>
                  </div>
                  <span className="text-[10px] bg-[#E8F4EC] text-[#23734D] border border-[#23734D]/25 px-2 py-0.5 rounded font-semibold font-mono">
                    {r.status}
                  </span>
                </div>
                <p className="text-[#20231F] text-xs leading-relaxed italic line-clamp-2">
                  &quot;{r.statement}&quot;
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#62665F] pt-1 border-t border-[#E3E5DE] font-mono">
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
