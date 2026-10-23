"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  MapPin,
  GraduationCap,
  Mail,
  Phone,
  ShieldAlert,
  ArrowLeft,
  FilePlus2,
  FolderKanban,
  AlertTriangle,
  ExternalLink,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { Institution, ComplaintCase } from "@/lib/api/types";
import { CaseBridgeStore } from "@/lib/api/store";
import { SupabaseDataService } from "@/lib/supabase/dataService";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BureauBadge } from "@/components/shared/BureauBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { formatDate } from "@/lib/utils";

export default function InstitutionProfilePage({
  params,
}: {
  params: { instId: string };
}) {
  const router = useRouter();
  const instId = params.instId;

  const [institution, setInstitution] = useState<Institution | null>(() => {
    return instId ? CaseBridgeStore.getInstitutionById(instId) || null : null;
  });
  const [instCases, setInstCases] = useState<ComplaintCase[]>(() => {
    return instId ? CaseBridgeStore.getCases({ institutionId: instId }) : [];
  });

  const loadData = () => {
    SupabaseDataService.getInstitutionById(instId).then((inst) => {
      if (inst) {
        setInstitution(inst);
        SupabaseDataService.getCases({ institutionId: inst.id }).then((cases) => {
          setInstCases(cases);
        });
      }
    });
  };

  useEffect(() => {
    CaseBridgeStore.init();
    loadData();
    window.addEventListener("casebridge_store_updated", loadData);
    return () => window.removeEventListener("casebridge_store_updated", loadData);
  }, [instId]);

  if (!institution) {
    return (
      <div className="py-12 text-center text-slate-500 text-sm">
        <p>Loading institution 360 profile...</p>
        <Link href="/institutions" className="text-blue-700 underline mt-2 inline-block">
          Return to Directory
        </Link>
      </div>
    );
  }

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "bg-rose-100 text-rose-800 border-rose-300 font-bold";
      case "HIGH":
        return "bg-amber-100 text-amber-800 border-amber-300 font-semibold";
      case "MEDIUM":
        return "bg-blue-50 text-blue-800 border-blue-200 font-medium";
      case "LOW":
      default:
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <Breadcrumbs
              items={[
                { label: "Institutions", href: "/institutions" },
                { label: institution.name },
              ]}
            />
            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {institution.name}
              </h1>
              <span className={`text-[10px] px-2 py-0.5 rounded border ${getRiskBadge(institution.riskLevel)}`}>
                {institution.riskLevel} REGULATORY RISK
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              AICTE Permanent Institute ID: <strong>{institution.id}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/intake?institutionId=${institution.id}`}
              className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-1.5 rounded shadow-sm transition-colors"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              <span>Lodge New Complaint</span>
            </Link>
            <Link
              href="/institutions"
              className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 rounded transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Directory</span>
            </Link>
          </div>
        </div>

        {/* Master Details Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Jurisdiction & Region
            </span>
            <div className="font-semibold text-slate-800 mt-0.5">
              {institution.district}, {institution.state}
            </div>
            <div className="text-slate-500 text-[11px]">{institution.region}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Approval & Accreditation
            </span>
            <div className="font-semibold text-slate-800 mt-0.5">{institution.approvalStatus}</div>
            <div className="text-slate-500 text-[11px]">{institution.accreditation}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Affiliated University
            </span>
            <div className="font-semibold text-slate-800 mt-0.5 line-clamp-1" title={institution.affiliatedUniversity}>
              {institution.affiliatedUniversity}
            </div>
            <div className="text-slate-500 text-[11px]">{institution.category}</div>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Head of Institution
            </span>
            <div className="font-semibold text-slate-800 mt-0.5">{institution.headOfInstitution}</div>
            <div className="text-slate-500 text-[11px] font-mono truncate">{institution.email}</div>
          </div>
        </div>
      </div>

      {/* Recurrence Pattern / Risk Advisory Banner */}
      {instCases.length > 1 && (
        <div className="p-4 bg-slate-900 text-white rounded-md shadow-sm flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-semibold text-white">
              Multi-Bureau Grievance Cluster Detected
            </div>
            <p className="text-slate-300 leading-relaxed">
              This institution currently has <strong>{instCases.length} active regulatory proceedings</strong> registered across different AICTE divisions (e.g., Public Grievance Redressal Cell and Regulation Bureau). Review the consolidated ledger below to verify if pending matters warrant a joint committee inquiry.
            </p>
          </div>
        </div>
      )}

      {/* Consolidated Multi-Bureau Complaint History */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-blue-700" />
              <span>Consolidated Multi-Bureau Grievance Ledger</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive single-source-of-truth across all AICTE divisions for ID {institution.id}.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Total Inquiries: <strong className="text-slate-900">{instCases.length}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-4">Case ID</th>
                <th className="py-2.5 px-4">Receiving Bureau</th>
                <th className="py-2.5 px-4">Allegation Subject</th>
                <th className="py-2.5 px-4">Complainant</th>
                <th className="py-2.5 px-4">Received Date</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Overlap Coordination</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {instCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No active or historical complaints on record for this technical institution.
                  </td>
                </tr>
              ) : (
                instCases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                      <Link href={`/cases/${encodeURIComponent(c.id)}`} className="text-blue-700 hover:underline">
                        {c.id}
                      </Link>
                    </td>

                    <td className="py-3 px-4">
                      <BureauBadge bureau={c.bureau} />
                    </td>

                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-medium text-slate-900 line-clamp-1" title={c.subject}>
                        {c.subject}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{c.category.replace(/_/g, " ")}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{c.complainantName}</div>
                      <div className="text-[10px] text-slate-500">{c.complainantType}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {formatDate(c.receivedDate)}
                    </td>

                    <td className="py-3 px-4">
                      <StatusBadge status={c.status} />
                    </td>

                    <td className="py-3 px-4">
                      {c.hasOverlap && c.overlapPairId ? (
                        <Link
                          href={`/overlap-review/${c.overlapPairId}`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded transition-colors"
                        >
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Active Overlap</span>
                        </Link>
                      ) : (
                        <span className="text-[10px] text-slate-400">Independent</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/cases/${encodeURIComponent(c.id)}`}
                        className="inline-flex items-center gap-1 text-xs text-blue-700 hover:underline font-semibold"
                      >
                        <span>Inspect File</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
