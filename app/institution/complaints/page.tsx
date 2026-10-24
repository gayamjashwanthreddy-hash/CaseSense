"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Search,
  Filter,
  ArrowRight,
  Send,
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { CaseBridgeStore } from "@/lib/api/store";
import { SupabaseDataService } from "@/lib/supabase/dataService";
import { InstitutionAccount, ComplaintCase, CaseStatus, BureauType } from "@/lib/api/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BureauBadge } from "@/components/shared/BureauBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { formatDate } from "@/lib/utils";

export default function InstitutionComplaintsPage() {
  const router = useRouter();
  const [institution, setInstitution] = useState<InstitutionAccount | null>(null);
  const [cases, setCases] = useState<ComplaintCase[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [bureauFilter, setBureauFilter] = useState<string>("ALL");

  const loadData = () => {
    CaseBridgeStore.init();
    const current = CaseBridgeStore.getCurrentInstitution();
    if (!current) {
      router.push("/institution/login");
      return;
    }
    setInstitution(current);

    // Scoped strictly to current institution's PID
    SupabaseDataService.getCases({ institutionId: current.institutionId }).then((instCases) => {
      setCases(instCases);
    });
  };

  useEffect(() => {
    loadData();
    window.addEventListener("casebridge_store_updated", loadData);
    return () => window.removeEventListener("casebridge_store_updated", loadData);
  }, []);

  if (!institution) {
    return <div className="p-8 text-center text-xs text-[#62665F] font-mono">Loading inquiries...</div>;
  }

  // Filter cases
  const filteredCases = cases.filter((c) => {
    if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
    if (bureauFilter !== "ALL" && c.bureau !== bureauFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.refNumber.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E3E5DE] gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#20231F] tracking-tight">
              Inquiries &amp; Official Notices Ledger
            </h1>
            <span className="font-mono text-xs font-bold bg-[#F7F7F4] text-[#20231F] px-2 py-0.5 rounded border border-[#E3E5DE]">
              PID: {institution.institutionId}
            </span>
          </div>
          <p className="text-[#62665F] text-xs mt-1 font-mono">
            Complaints and regulatory scrutiny proceedings active against {institution.institutionName}.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E3E5DE] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-[#85877F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inquiries by Reference ID, Keywords, or Allegation..."
            className="w-full pl-9 pr-3 py-2 bg-[#F7F7F4] border border-[#E3E5DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white text-[#20231F] placeholder-[#85877F] font-sans"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={bureauFilter}
            onChange={(e) => setBureauFilter(e.target.value)}
            className="w-full py-2 px-3 bg-[#F7F7F4] border border-[#E3E5DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#526B57] text-[#20231F]"
          >
            <option value="ALL">All AICTE Bureaus</option>
            <option value="PGRC">Public Grievance Redressal (PGRC)</option>
            <option value="REGULATION">Regulation Bureau</option>
            <option value="APPROVAL">Approval Bureau</option>
            <option value="LEGAL">Legal Cell</option>
            <option value="CPGRAMS">CPGRAMS Desk</option>
          </select>
        </div>

        <div className="md:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 bg-[#F7F7F4] border border-[#E3E5DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#526B57] text-[#20231F]"
          >
            <option value="ALL">All Inquiry Statuses</option>
            <option value="NOTICE_ISSUED">Notice Issued (Action Required)</option>
            <option value="UNDER_INVESTIGATION">Under Investigation</option>
            <option value="OVERLAP_FLAGGED">Overlap Flagged</option>
            <option value="JOINT_COMMITTEE">Joint Committee Review</option>
            <option value="HEARING_SCHEDULED">Hearing Scheduled</option>
            <option value="RESOLVED">Resolved / Closed</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-[#E3E5DE] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-[#F7F7F4] border-b border-[#E3E5DE] text-[#62665F] font-mono text-[11px] select-none">
                <th className="py-3 px-4 font-semibold">Inquiry Ref &amp; Date</th>
                <th className="py-3 px-4 font-semibold">Bureau</th>
                <th className="py-3 px-4 font-semibold">Subject Matter &amp; Category</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Priority</th>
                <th className="py-3 px-4 font-semibold">Statutory SLA</th>
                <th className="py-3 px-4 font-semibold text-right">Institution Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5DE]">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#62665F] font-mono text-xs">
                    No matching inquiries found for this institution.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F7F7F4] transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-[#20231F]">{c.id}</div>
                      <div className="text-[10px] text-[#85877F] mt-0.5">{formatDate(c.receivedDate)}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <BureauBadge bureau={c.bureau} />
                    </td>

                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-[#20231F] line-clamp-1">{c.subject}</div>
                      <div className="text-[10px] text-[#62665F] font-mono mt-0.5">
                        {c.category.replace(/_/g, " ")}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={c.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={c.priority} />
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div className="text-[#20231F] font-bold">Due {formatDate(c.nextActionDeadline)}</div>
                      <div className="text-[10px] text-[#85877F]">{c.daysOpen} days active</div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/institution/complaints/${encodeURIComponent(c.id)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#344B3B] hover:bg-[#293D30] text-white font-semibold text-xs rounded-md shadow-xs transition-colors font-mono"
                      >
                        <Send className="w-3 h-3" />
                        <span>Inspect &amp; Reply</span>
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
