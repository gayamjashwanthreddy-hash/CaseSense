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
  ChevronRight,
  ShieldCheck,
  Scale,
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
      <div className="py-20 text-center text-slate-500 max-w-md mx-auto space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Building2 className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Institution Not Found</h2>
        <p className="text-xs text-slate-500">
          Permanent ID <strong className="font-mono">{instId}</strong> does not match any enrolled institution records.
        </p>
        <Link
          href="/institutions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Registry</span>
        </Link>
      </div>
    );
  }

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold";
      case "HIGH":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold";
      case "MEDIUM":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40 font-medium";
      case "LOW":
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 360 Header - Dark Editorial Strip */}
      <div className="bg-[#0A1626] text-white p-6 rounded-2xl border border-[#142C46] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#142C46]/80">
          <div>
            <Breadcrumbs
              items={[
                { label: "Technical Institutions", href: "/institutions" },
                { label: institution.name },
              ]}
            />
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {institution.name}
              </h1>
              <span
                className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border font-mono ${getRiskBadge(
                  institution.riskLevel
                )}`}
              >
                {institution.riskLevel} Risk Tier
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-2 flex-wrap">
              <span>Permanent ID: <strong className="text-slate-200">{institution.id}</strong></span>
              <span>&bull;</span>
              <span>Status: <strong className="text-slate-200">{institution.approvalStatus}</strong></span>
              <span>&bull;</span>
              <span>Accreditation: <strong className="text-slate-200">{institution.accreditation}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/intake?institutionId=${encodeURIComponent(institution.id)}`}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              <span>Lodge Institution Complaint</span>
            </Link>
            <Link
              href="/institutions"
              className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white border border-[#243B55] bg-[#0D1C2E] hover:bg-[#142C46] px-3.5 py-2 rounded-xl transition-colors font-medium shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </Link>
          </div>
        </div>

        {/* Quick Identity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-[#0D1C2E] rounded-xl border border-[#1E3A5F]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Affiliated University</span>
            <span className="text-white font-semibold block mt-0.5 truncate">{institution.affiliatedUniversity}</span>
          </div>
          <div className="p-3.5 bg-[#0D1C2E] rounded-xl border border-[#1E3A5F]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Geographic Location</span>
            <span className="text-white font-semibold block mt-0.5">{institution.district}, {institution.state}</span>
          </div>
          <div className="p-3.5 bg-[#0D1C2E] rounded-xl border border-[#1E3A5F]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Contact Coordinates</span>
            <span className="text-white font-mono text-[11px] block mt-0.5 truncate">{institution.email}</span>
          </div>
          <div className="p-3.5 bg-[#0D1C2E] rounded-xl border border-[#1E3A5F]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Proceedings</span>
            <span className="text-white font-bold text-sm block mt-0.5 font-mono">{instCases.length} Registered Cases</span>
          </div>
        </div>
      </div>

      {/* Institution Cases Dossier Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-0">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-blue-700" />
              <span>Multi-Bureau Case History Across AICTE Cells</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive index of grievances lodged against PID <span className="font-mono font-semibold">{institution.id}</span>.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-md border border-slate-200">
            {instCases.length} Records
          </span>
        </div>

        {instCases.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No active complaint cases are currently registered against this institution.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px] font-bold">
                  <th className="py-3 px-4">Case ID</th>
                  <th className="py-3 px-4">Bureau / Cell</th>
                  <th className="py-3 px-4">Subject Allegation</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">SLA Due</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {instCases.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      <Link href={`/cases/${encodeURIComponent(c.id)}`} className="text-blue-700 hover:underline">
                        {c.id}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <BureauBadge bureau={c.bureau} />
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate" title={c.subject}>
                      {c.subject}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {formatDate(c.slaDeadline)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/cases/${encodeURIComponent(c.id)}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900"
                      >
                        <span>Dossier</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
