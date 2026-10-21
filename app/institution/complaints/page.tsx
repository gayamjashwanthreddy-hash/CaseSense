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
    const instCases = CaseBridgeStore.getCases({ institutionId: current.institutionId });
    setCases(instCases);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("casebridge_store_updated", loadData);
    return () => window.removeEventListener("casebridge_store_updated", loadData);
  }, []);

  if (!institution) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading inquiries...</div>;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Inquiries & Official Notices Ledger
            </h1>
            <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-300">
              PID: {institution.institutionId}
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Complaints and regulatory scrutiny proceedings active against {institution.institutionName}.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Docket ID, reference, or keyword..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW_INTAKE">New Intake</option>
            <option value="NOTICE_ISSUED">Notice Issued</option>
            <option value="OVERLAP_FLAGGED">Overlap Flagged</option>
            <option value="JOINT_COMMITTEE">Joint Committee</option>
            <option value="HEARING_SCHEDULED">Hearing Scheduled</option>
            <option value="RESOLVED">Resolved / Closed</option>
          </select>
        </div>

        <div className="md:col-span-4">
          <select
            value={bureauFilter}
            onChange={(e) => setBureauFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
          >
            <option value="ALL">All Inquiring Bureaus</option>
            <option value="PGRC">Public Grievance (PGRC)</option>
            <option value="REGULATION">Regulation Bureau</option>
            <option value="APPROVAL">Approval Bureau</option>
            <option value="LEGAL">Legal Cell</option>
            <option value="CPGRAMS">CPGRAMS Desk</option>
          </select>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        {filteredCases.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No inquiries match your filter criteria for {institution.institutionName}.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Docket ID & Ref</th>
                  <th className="px-4 py-3">Bureau</th>
                  <th className="px-4 py-3">Subject & Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date Lodged</th>
                  <th className="px-4 py-3">Response Due</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredCases.map((c) => {
                  const responses = CaseBridgeStore.getInstitutionResponses(institution.institutionId).filter(
                    (r) => r.caseId === c.id
                  );
                  const hasResponse = responses.length > 0;

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        <div>{c.id}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{c.refNumber}</div>
                      </td>

                      <td className="px-4 py-3">
                        <BureauBadge bureau={c.bureau} />
                      </td>

                      <td className="px-4 py-3 max-w-xs">
                        <div className="font-semibold text-slate-900 truncate" title={c.subject}>
                          {c.subject}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {c.category.replace(/_/g, " ")}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={c.status} />
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                        {formatDate(c.receivedDate)}
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px]">
                        <span className="text-red-700 font-semibold">{formatDate(c.nextActionDeadline)}</span>
                        {hasResponse && (
                          <span className="block text-[10px] text-emerald-700 font-medium">
                            ✓ Reply on Record
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/institution/complaints/${encodeURIComponent(c.id)}`}
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-[11px] rounded transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          <span>{hasResponse ? "View & Update" : "File Reply"}</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
