"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Download,
  AlertTriangle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  Building2,
  X,
  FileSpreadsheet,
} from "lucide-react";
import { ComplaintCase, BureauType, CaseStatus, PriorityLevel } from "@/lib/api/types";
import { CaseBridgeStore } from "@/lib/api/store";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BureauBadge } from "@/components/shared/BureauBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { CaseQuickDrawer } from "@/components/cases/CaseQuickDrawer";
import { formatDate } from "@/lib/utils";
import { Suspense } from "react";
import { useToast } from "@/lib/context/ToastContext";

function CasesExplorerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [cases, setCases] = useState<ComplaintCase[]>([]);
  const [selectedCaseForDrawer, setSelectedCaseForDrawer] = useState<ComplaintCase | null>(null);

  // Filters state initialized from query params if present
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [bureauFilter, setBureauFilter] = useState(searchParams.get("bureau") || "ALL");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [overlapOnly, setOverlapOnly] = useState(false);

  // Sorting and Pagination
  const [sortField, setSortField] = useState<"date" | "days">("days");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const loadData = () => {
    setCases(CaseBridgeStore.getCases());
  };

  useEffect(() => {
    CaseBridgeStore.init();
    loadData();
    window.addEventListener("casebridge_store_updated", loadData);
    return () => window.removeEventListener("casebridge_store_updated", loadData);
  }, []);

  // Update filters if searchParams change
  useEffect(() => {
    if (searchParams.get("search")) setSearch(searchParams.get("search") || "");
    if (searchParams.get("bureau")) setBureauFilter(searchParams.get("bureau") || "ALL");
    if (searchParams.get("status")) setStatusFilter(searchParams.get("status") || "ALL");
  }, [searchParams]);

  // Filtering Logic
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          c.id.toLowerCase().includes(q) ||
          c.refNumber.toLowerCase().includes(q) ||
          c.institutionName.toLowerCase().includes(q) ||
          c.institutionId.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.complainantName.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (bureauFilter !== "ALL" && c.bureau !== bureauFilter) {
        return false;
      }

      if (statusFilter !== "ALL") {
        if (statusFilter === "OVERDUE") {
          if (c.daysOpen <= 30 && new Date(c.slaDeadline) >= new Date()) return false;
        } else if (c.status !== statusFilter) {
          return false;
        }
      }

      if (priorityFilter !== "ALL" && c.priority !== priorityFilter) {
        return false;
      }

      if (overlapOnly && !c.hasOverlap) {
        return false;
      }

      return true;
    });
  }, [cases, search, bureauFilter, statusFilter, priorityFilter, overlapOnly]);

  // Sorting Logic
  const sortedCases = useMemo(() => {
    return [...filteredCases].sort((a, b) => {
      if (sortField === "days") {
        return sortOrder === "asc" ? a.daysOpen - b.daysOpen : b.daysOpen - a.daysOpen;
      } else {
        const dateA = new Date(a.receivedDate).getTime();
        const dateB = new Date(b.receivedDate).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
    });
  }, [filteredCases, sortField, sortOrder]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedCases.length / pageSize) || 1;
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCases.slice(start, start + pageSize);
  }, [sortedCases, currentPage, pageSize]);

  const handleExportCSV = () => {
    if (filteredCases.length === 0) {
      toast({ title: "No Records to Export", type: "warning" });
      return;
    }

    const headers = [
      "Case ID",
      "Reference",
      "Institution ID",
      "Institution Name",
      "Bureau",
      "Category",
      "Subject",
      "Complainant",
      "Received Date",
      "Status",
      "Priority",
      "Days Open",
      "SLA Deadline",
      "Assigned Officer",
      "Overlap Flagged",
    ];

    const rows = filteredCases.map((c) => [
      `"${c.id}"`,
      `"${c.refNumber}"`,
      `"${c.institutionId}"`,
      `"${c.institutionName.replace(/"/g, '""')}"`,
      `"${c.bureau}"`,
      `"${c.category}"`,
      `"${c.subject.replace(/"/g, '""')}"`,
      `"${c.complainantName.replace(/"/g, '""')}"`,
      `"${c.receivedDate}"`,
      `"${c.status}"`,
      `"${c.priority}"`,
      c.daysOpen,
      `"${c.slaDeadline}"`,
      `"${c.assignedOfficer}"`,
      c.hasOverlap ? "YES" : "NO",
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AICTE_Case_Register_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Generated",
      message: `Exported ${filteredCases.length} regulatory cases into CSV.`,
      type: "success",
    });
  };

  const clearFilters = () => {
    setSearch("");
    setBureauFilter("ALL");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setOverlapOnly(false);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <Breadcrumbs items={[{ label: "Complaint Explorer" }]} />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            AICTE Cross-Bureau Case Register
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, filter, inspect, and track proceedings across technical institutions nationwide.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium px-3 py-1.5 rounded-md shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Register (CSV)</span>
          </button>
          <Link
            href="/intake"
            className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-sm transition-colors"
          >
            <span>+ New Intake</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-md border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Global Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, Institution, Complainant, or Keywords..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md pl-8 pr-8 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Bureau Filter */}
          <div>
            <select
              value={bureauFilter}
              onChange={(e) => {
                setBureauFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">All Receiving Bureaus</option>
              <option value="PGRC">Public Grievance Redressal (PGRC)</option>
              <option value="REGULATION">Regulation Bureau (RB)</option>
              <option value="APPROVAL">Approval Bureau (AB)</option>
              <option value="LEGAL">Legal Cell</option>
              <option value="CPGRAMS">CPGRAMS / PMO Desk</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">All Statuses</option>
              <option value="OVERDUE">Overdue / SLA Breach</option>
              <option value="NEW_INTAKE">New Intake</option>
              <option value="UNDER_INVESTIGATION">Inquiry Ongoing</option>
              <option value="OVERLAP_FLAGGED">Overlap Flagged</option>
              <option value="JOINT_COMMITTEE">Joint Committee</option>
              <option value="NOTICE_ISSUED">Notice Issued</option>
              <option value="HEARING_SCHEDULED">Hearing Listed</option>
              <option value="RESOLVED">Resolved</option>
              <option value="ESCALATED">Escalated</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Urgency</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Routine</option>
            </select>
          </div>
        </div>

        {/* Second Row: Toggle and Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={overlapOnly}
                onChange={(e) => {
                  setOverlapOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span className="text-slate-700 font-medium">Show Only Overlapping / Multi-Bureau Inquiries</span>
            </label>

            {(search || bureauFilter !== "ALL" || statusFilter !== "ALL" || priorityFilter !== "ALL" || overlapOnly) && (
              <button
                onClick={clearFilters}
                className="text-blue-700 hover:text-blue-900 underline text-xs font-medium"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredCases.length}</strong> matching records
          </div>
        </div>
      </div>

      {/* Main Administrative Data Table */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold select-none">
                <th className="py-2.5 px-3.5">Case Reference</th>
                <th className="py-2.5 px-3.5">Institution Name & AICTE ID</th>
                <th className="py-2.5 px-3.5">Bureau</th>
                <th className="py-2.5 px-3.5">Subject Allegation</th>
                <th className="py-2.5 px-3.5">
                  <button
                    onClick={() => {
                      if (sortField === "days") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortField("days");
                        setSortOrder("desc");
                      }
                    }}
                    className="flex items-center gap-1 hover:text-slate-900 font-semibold"
                  >
                    <span>Days Open</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-2.5 px-3.5">Status</th>
                <th className="py-2.5 px-3.5">Overlap</th>
                <th className="py-2.5 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto space-y-1">
                      <div className="font-semibold text-slate-700">No matching cases found</div>
                      <div className="text-[11px] text-slate-400">
                        Try adjusting your keywords or clearing the active filters.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCases.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => setSelectedCaseForDrawer(c)}
                  >
                    {/* Case ID */}
                    <td className="py-2.5 px-3.5 font-semibold text-slate-900">
                      <div className="text-blue-700 group-hover:underline flex items-center gap-1">
                        <span>{c.id}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{formatDate(c.receivedDate)}</div>
                    </td>

                    {/* Institution */}
                    <td className="py-2.5 px-3.5 max-w-xs">
                      <div className="font-medium text-slate-900 truncate" title={c.institutionName}>
                        {c.institutionName}
                      </div>
                      <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono">{c.institutionId}</span>
                        <span>&bull;</span>
                        <span>{c.institutionState}</span>
                      </div>
                    </td>

                    {/* Bureau */}
                    <td className="py-2.5 px-3.5">
                      <BureauBadge bureau={c.bureau} />
                    </td>

                    {/* Subject */}
                    <td className="py-2.5 px-3.5 max-w-sm">
                      <div className="text-slate-800 line-clamp-1 font-medium" title={c.subject}>
                        {c.subject}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                        By {c.complainantName} ({c.complainantType})
                      </div>
                    </td>

                    {/* Days Open / SLA */}
                    <td className="py-2.5 px-3.5">
                      <div className={`font-semibold ${c.daysOpen > 30 ? "text-rose-700" : "text-slate-700"}`}>
                        {c.daysOpen} days
                      </div>
                      <div className="text-[10px] text-slate-400">Due {formatDate(c.slaDeadline)}</div>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3.5">
                      <StatusBadge status={c.status} />
                    </td>

                    {/* Overlap indicator */}
                    <td className="py-2.5 px-3.5" onClick={(e) => e.stopPropagation()}>
                      {c.hasOverlap && c.overlapPairId ? (
                        <Link
                          href={`/overlap-review/${c.overlapPairId}`}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded transition-colors"
                          title="Open Cross-Bureau Overlap Review Workspace"
                        >
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Flagged</span>
                        </Link>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-normal">None</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3.5 text-right space-x-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedCaseForDrawer(c)}
                        className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
                        title="Quick Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        href={`/cases/${encodeURIComponent(c.id)}`}
                        className="inline-flex items-center text-[11px] font-medium text-blue-700 hover:text-blue-900 px-2 py-0.5 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                      >
                        View Full
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 select-none">
          <div>
            Showing{" "}
            <strong>
              {filteredCases.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </strong>{" "}
            to{" "}
            <strong>
              {Math.min(currentPage * pageSize, filteredCases.length)}
            </strong>{" "}
            of <strong>{filteredCases.length}</strong> cases
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Quick Drawer */}
      <CaseQuickDrawer
        caseItem={selectedCaseForDrawer}
        onClose={() => setSelectedCaseForDrawer(null)}
      />
    </div>
  );
}

export default function CasesExplorerPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-slate-500">
          Loading AICTE case register...
        </div>
      }
    >
      <CasesExplorerContent />
    </Suspense>
  );
}
