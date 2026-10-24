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
      <div className="py-20 text-center text-[#62665F] max-w-md mx-auto space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#F0F1ED] flex items-center justify-center mx-auto text-[#62665F]">
          <Building2 className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-[#20231F]">Institution Not Found</h2>
        <p className="text-xs text-[#62665F]">
          Permanent ID <strong className="font-mono text-[#20231F]">{instId}</strong> does not match any enrolled institution records.
        </p>
        <Link
          href="/institutions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#344B3B] bg-[#E8EEE7] hover:bg-[#d8e3d6] px-4 py-2 rounded-md transition-colors font-mono"
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
        return "bg-[#FBEAEC] text-[#B42332] border-[#B42332]/25 font-bold";
      case "HIGH":
        return "bg-[#FBF1DB] text-[#925C0B] border-[#925C0B]/25 font-semibold";
      case "MEDIUM":
        return "bg-[#EAF0F6] text-[#496785] border-[#496785]/25 font-medium";
      case "LOW":
      default:
        return "bg-[#E8F4EC] text-[#23734D] border-[#23734D]/25 font-medium";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 360 Header */}
      <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E3E5DE]">
          <div>
            <Breadcrumbs
              items={[
                { label: "Technical Institutions", href: "/institutions" },
                { label: institution.name },
              ]}
            />
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#20231F] tracking-tight">
                {institution.name}
              </h1>
              <span
                className={`text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded border font-mono ${getRiskBadge(
                  institution.riskLevel
                )}`}
              >
                {institution.riskLevel} Risk Tier
              </span>
            </div>
            <div className="text-[11px] text-[#62665F] font-mono mt-1 flex items-center gap-2 flex-wrap">
              <span>Permanent ID: <strong className="text-[#20231F]">{institution.id}</strong></span>
              <span>&bull;</span>
              <span>Status: <strong className="text-[#20231F]">{institution.approvalStatus}</strong></span>
              <span>&bull;</span>
              <span>Accreditation: <strong className="text-[#20231F]">{institution.accreditation}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/intake?institutionId=${encodeURIComponent(institution.id)}`}
              className="inline-flex items-center gap-1.5 bg-[#344B3B] hover:bg-[#293D30] text-white text-xs font-semibold px-4 py-2 rounded-md shadow-xs transition-colors"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              <span>Lodge Institution Complaint</span>
            </Link>
            <Link
              href="/institutions"
              className="inline-flex items-center gap-1 text-xs text-[#20231F] hover:text-[#344B3B] border border-[#E3E5DE] bg-[#F7F7F4] hover:bg-[#E8EEE7] px-3.5 py-2 rounded-md transition-colors font-medium shadow-xs font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Directory</span>
            </Link>
          </div>
        </div>

        {/* Quick Identity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE]">
            <span className="text-[10px] font-bold text-[#62665F] uppercase tracking-widest block font-mono">Affiliated University</span>
            <span className="text-[#20231F] font-semibold block mt-0.5 truncate">{institution.affiliatedUniversity}</span>
          </div>
          <div className="p-3.5 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE]">
            <span className="text-[10px] font-bold text-[#62665F] uppercase tracking-widest block font-mono">Geographic Location</span>
            <span className="text-[#20231F] font-semibold block mt-0.5">{institution.district}, {institution.state}</span>
          </div>
          <div className="p-3.5 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE]">
            <span className="text-[10px] font-bold text-[#62665F] uppercase tracking-widest block font-mono">Contact Coordinates</span>
            <span className="text-[#20231F] font-mono text-[11px] block mt-0.5 truncate">{institution.email}</span>
          </div>
          <div className="p-3.5 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE]">
            <span className="text-[10px] font-bold text-[#62665F] uppercase tracking-widest block font-mono">Active Proceedings</span>
            <span className="text-[#20231F] font-bold text-sm block mt-0.5 font-mono">{instCases.length} Registered Cases</span>
          </div>
        </div>
      </div>

      {/* Institution Cases Dossier Table */}
      <div className="bg-white rounded-xl border border-[#E3E5DE] shadow-xs overflow-hidden space-y-0">
        <div className="p-5 border-b border-[#E3E5DE] flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#20231F] flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-[#344B3B]" />
              <span>Multi-Bureau Case History Across AICTE Cells</span>
            </h2>
            <p className="text-xs text-[#62665F] mt-0.5 font-mono">
              Comprehensive index of grievances lodged against PID <span className="font-mono font-semibold text-[#20231F]">{institution.id}</span>.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#62665F] bg-[#F7F7F4] px-3 py-1 rounded-md border border-[#E3E5DE]">
            {instCases.length} Records
          </span>
        </div>

        {instCases.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#62665F] font-mono">
            No active complaint cases are currently registered against this institution.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-[#F7F7F4] border-b border-[#E3E5DE] text-[#62665F] font-mono text-[11px] select-none">
                  <th className="py-3 px-4 font-semibold">Case ID</th>
                  <th className="py-3 px-4 font-semibold">Bureau / Cell</th>
                  <th className="py-3 px-4 font-semibold">Subject Allegation</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Priority</th>
                  <th className="py-3 px-4 font-semibold">SLA Due</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E5DE] font-sans">
                {instCases.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F7F7F4] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#20231F]">
                      <Link href={`/cases/${encodeURIComponent(c.id)}`} className="text-[#344B3B] hover:underline">
                        {c.id}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4">
                      <BureauBadge bureau={c.bureau} />
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#20231F] max-w-xs truncate" title={c.subject}>
                      {c.subject}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#62665F] text-[11px]">
                      {formatDate(c.slaDeadline)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/cases/${encodeURIComponent(c.id)}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#344B3B] hover:text-[#202F25] font-mono"
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
