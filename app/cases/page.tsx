"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
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
  RotateCcw,
  ShieldAlert,
  ArrowRight,
  FileSpreadsheet,
} from "lucide-react";
import { ComplaintCase, BureauType, CaseStatus, PriorityLevel } from "@/lib/api/types";
import { CaseBridgeStore } from "@/lib/api/store";
import { SupabaseDataService } from "@/lib/supabase/dataService";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BureauBadge } from "@/components/shared/BureauBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { CaseQuickDrawer } from "@/components/cases/CaseQuickDrawer";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/lib/context/ToastContext";

function CasesExplorerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [cases, setCases] = useState<ComplaintCase[]>([]);
  const [selectedCaseForDrawer, setSelectedCaseForDrawer] = useState<ComplaintCase | null>(null);

  // Filters state initialized from query params if present
  const [search, setSearch] = useState(searchParams ? searchParams.get("search") || "" : "");
  const [bureauFilter, setBureauFilter] = useState(searchParams ? searchParams.get("bureau") || "ALL" : "ALL");
  const [statusFilter, setStatusFilter] = useState(searchParams ? searchParams.get("status") || "ALL" : "ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [overlapOnly, setOverlapOnly] = useState(false);

  // Sorting and Pagination
  const [sortField, setSortField] = useState<"date" | "days">("days");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const loadData = () => {
    SupabaseDataService.getCases().then((data) => {
      setCases(data);
    });
  };

  useEffect(() => {
    CaseBridgeStore.init();
    loadData();
    window.addEventListener("casebridge_store_updated", loadData);
    return () => window.removeEventListener("casebridge_store_updated", loadData);
  }, []);

  // Update filters if searchParams change
  useEffect(() => {
    if (searchParams) {
      if (searchParams.get("search")) setSearch(searchParams.get("search") || "");
      if (searchParams.get("bureau")) setBureauFilter(searchParams.get("bureau") || "ALL");
      if (searchParams.get("status")) setStatusFilter(searchParams.get("status") || "ALL");
    }
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
        const timeA = new Date(a.receivedDate).getTime();
        const timeB = new Date(b.receivedDate).getTime();
        return sortOrder === "asc" ? timeA - timeB : timeB - timeA;
      }
    });
  }, [filteredCases, sortField, sortOrder]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(sortedCases.length / pageSize));
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCases.slice(start, start + pageSize);
  }, [sortedCases, currentPage, pageSize]);

  const clearFilters = () => {
    setSearch("");
    setBureauFilter("ALL");
    setStatusFilter("ALL");
    setPriorityFilter("ALL");
    setOverlapOnly(false);
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = [
      "Case ID",
      "Reference Number",
      "PID",
      "Institution Name",
      "Bureau",
      "Subject",
      "Status",
      "Priority",
      "Days Open",
      "SLA Deadline",
      "Complainant",
      "Has Overlap",
    ];

    const rows = filteredCases.map((c) => [
      c.id,
      c.refNumber,
      c.institutionId,
      `"${c.institutionName.replace(/"/g, '""')}"`,
      c.bureau,
      `"${c.subject.replace(/"/g, '""')}"`,
      c.status,
      c.priority,
      c.daysOpen,
      c.slaDeadline,
      `"${c.complainantName}"`,
      c.hasOverlap ? "YES" : "NO",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AICTE_Case_Register_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    toast(`Exported ${filteredCases.length} records to CSV`, "info");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E3E5DE]">
        <div>
          <Breadcrumbs items={[{ label: "Complaint Register" }]} />
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#20231F] tracking-tight mt-1">
            Administrative Complaint Register
          </h1>
          <p className="text-xs text-[#62665F] font-mono mt-1">
            Multi-bureau grievance logs, SLA monitoring, and cross-cell jurisdiction tracking across AICTE technical institutions.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-[#F7F7F4] text-[#20231F] border border-[#E3E5DE] text-xs font-medium px-3.5 py-2 rounded-md shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#62665F]" />
            <span>Export CSV</span>
          </button>
          <Link
            href="/intake"
            className="inline-flex items-center gap-1.5 bg-[#344B3B] hover:bg-[#293D30] text-white text-xs font-semibold px-4 py-2 rounded-md shadow-xs transition-colors"
          >
            <span>+ Register Complaint</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E3E5DE] shadow-xs space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Global Search */}
          <div className="lg:col-span-2 relative">
            <Search className="w-3.5 h-3.5 text-[#85877F] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Case ID, PID, College Name, or Allegation..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs bg-[#F7F7F4] border border-[#E3E5DE] rounded-md pl-8 pr-8 py-2 text-[#20231F] placeholder-[#85877F] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:border-[#526B57] focus:bg-white font-sans transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2.5 text-[#85877F] hover:text-[#20231F] p-0.5"
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
              className="w-full text-xs bg-[#F7F7F4] border border-[#E3E5DE] rounded-md px-3 py-2 text-[#20231F] focus:outline-none focus:ring-1 focus:ring-[#526B57] font-sans"
            >
              <option value="ALL">All Bureaus / Cells</option>
              <option value="PGRC">Public Grievance Redressal (PGRC)</option>
              <option value="REGULATION">Regulation Bureau (RB)</option>
              <option value="APPROVAL">Approval Bureau (AB)</option>
              <option value="LEGAL">Legal Cell</option>
              <option value="CPGRAMS">CPGRAMS / MoE Desk</option>
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
              className="w-full text-xs bg-[#F7F7F4] border border-[#E3E5DE] rounded-md px-3 py-2 text-[#20231F] focus:outline-none focus:ring-1 focus:ring-[#526B57] font-sans"
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
              className="w-full text-xs bg-[#F7F7F4] border border-[#E3E5DE] rounded-md px-3 py-2 text-[#20231F] focus:outline-none focus:ring-1 focus:ring-[#526B57] font-sans"
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2.5 border-t border-[#E3E5DE] text-xs">
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={overlapOnly}
                onChange={(e) => {
                  setOverlapOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded border-[#E3E5DE] text-[#344B3B] focus:ring-[#526B57] w-3.5 h-3.5 accent-[#344B3B]"
              />
              <span className="text-[#20231F] font-medium font-sans">
                Show Only Overlapping / Multi-Bureau Inquiries
              </span>
            </label>

            {(search ||
              bureauFilter !== "ALL" ||
              statusFilter !== "ALL" ||
              priorityFilter !== "ALL" ||
              overlapOnly) && (
              <button
                onClick={clearFilters}
                className="text-[#344B3B] hover:text-[#202F25] text-xs font-semibold inline-flex items-center gap-1 font-mono"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          <div className="text-[#62665F] font-mono text-xs">
            Showing <strong className="text-[#20231F]">{filteredCases.length}</strong> matching records
          </div>
        </div>
      </div>

      {/* Main Administrative Data Table */}
      <div className="bg-white rounded-xl border border-[#E3E5DE] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-[#F7F7F4] border-b border-[#E3E5DE] text-[#62665F] font-mono text-[11px] select-none">
                <th className="py-3 px-4 font-semibold">Case Reference</th>
                <th className="py-3 px-4 font-semibold">Institution Name &amp; PID</th>
                <th className="py-3 px-4 font-semibold">Bureau</th>
                <th className="py-3 px-4 font-semibold">Subject Matter</th>
                <th className="py-3 px-4 font-semibold">
                  <button
                    onClick={() => {
                      if (sortField === "days") {
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                      } else {
                        setSortField("days");
                        setSortOrder("desc");
                      }
                    }}
                    className="flex items-center gap-1 hover:text-[#20231F] font-semibold"
                  >
                    <span>Days Open</span>
                    <ArrowUpDown className="w-3 h-3 text-[#85877F]" />
                  </button>
                </th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Overlap Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5DE] font-sans">
              {paginatedCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#62665F] font-mono text-xs">
                    <div className="max-w-xs mx-auto space-y-1">
                      <div className="font-semibold text-[#20231F]">No matching cases found</div>
                      <div className="text-[11px] text-[#85877F]">
                        Try adjusting your keywords or clearing the active filters.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCases.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-[#F7F7F4] transition-colors group cursor-pointer"
                    onClick={() => setSelectedCaseForDrawer(c)}
                  >
                    {/* Case ID */}
                    <td className="py-3 px-4 font-mono font-bold text-[#20231F]">
                      <div className="text-[#344B3B] group-hover:underline flex items-center gap-1">
                        <span>{c.id}</span>
                      </div>
                      <div className="text-[10px] text-[#85877F] font-mono mt-0.5">
                        {formatDate(c.receivedDate)}
                      </div>
                    </td>

                    {/* Institution */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-[#20231F] truncate" title={c.institutionName}>
                        {c.institutionName}
                      </div>
                      <div className="text-[10px] text-[#62665F] font-mono flex items-center gap-2 mt-0.5">
                        <span>PID: {c.institutionId}</span>
                        <span>&bull;</span>
                        <span>{c.institutionState}</span>
                      </div>
                    </td>

                    {/* Bureau */}
                    <td className="py-3 px-4">
                      <BureauBadge bureau={c.bureau} />
                    </td>

                    {/* Subject */}
                    <td className="py-3 px-4 max-w-sm">
                      <div className="text-[#20231F] line-clamp-1 font-medium" title={c.subject}>
                        {c.subject}
                      </div>
                      <div className="text-[10px] text-[#85877F] mt-0.5 truncate font-mono">
                        By {c.complainantName} ({c.complainantType})
                      </div>
                    </td>

                    {/* Days Open / SLA */}
                    <td className="py-3 px-4 font-mono">
                      <div className={`font-bold ${c.daysOpen > 30 ? "text-[#B42332]" : "text-[#20231F]"}`}>
                        {c.daysOpen} days
                      </div>
                      <div className="text-[10px] text-[#85877F]">Due {formatDate(c.slaDeadline)}</div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <StatusBadge status={c.status} size="sm" />
                    </td>

                    {/* Overlap indicator */}
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      {c.hasOverlap && c.overlapPairId ? (
                        <Link
                          href={`/overlap-review/${c.overlapPairId}`}
                          className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold text-[#925C0B] bg-[#FBF1DB] hover:bg-[#f6e6c2] border border-[#925C0B]/25 px-2 py-0.5 rounded-md transition-colors"
                          title="Open Cross-Bureau Overlap Review Workspace"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#925C0B] animate-pulse" />
                          <span>Flagged</span>
                        </Link>
                      ) : (
                        <span className="inline-flex items-center text-[10px] text-[#62665F] bg-[#F0F1ED] px-2 py-0.5 rounded font-mono">
                          Isolated
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedCaseForDrawer(c)}
                        className="p-1 rounded-md text-[#85877F] hover:text-[#20231F] hover:bg-[#E8EEE7] transition-colors"
                        title="Quick Preview Drawer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <Link
                        href={`/cases/${encodeURIComponent(c.id)}`}
                        className="inline-flex items-center text-[11px] font-semibold text-[#344B3B] hover:text-[#202F25] px-2 py-0.5 bg-[#E8EEE7] hover:bg-[#d8e3d6] rounded-md transition-colors font-mono"
                      >
                        Full Dossier
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-3.5 bg-[#F7F7F4] border-t border-[#E3E5DE] flex items-center justify-between text-xs text-[#62665F] font-mono select-none">
          <div>
            Showing{" "}
            <strong className="text-[#20231F]">
              {filteredCases.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            </strong>{" "}
            to{" "}
            <strong className="text-[#20231F]">
              {Math.min(currentPage * pageSize, filteredCases.length)}
            </strong>{" "}
            of <strong className="text-[#20231F]">{filteredCases.length}</strong> cases
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-[#E3E5DE] bg-white hover:bg-[#F7F7F4] disabled:opacity-40 disabled:cursor-not-allowed text-[#20231F]"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md border border-[#E3E5DE] bg-white hover:bg-[#F7F7F4] disabled:opacity-40 disabled:cursor-not-allowed text-[#20231F]"
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
        <div className="py-20 text-center font-mono text-xs text-[#62665F]">
          Loading AICTE case register...
        </div>
      }
    >
      <CasesExplorerContent />
    </Suspense>
  );
}
