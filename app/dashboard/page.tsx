"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderKanban,
  GitCompare,
  Clock,
  GitMerge,
  Building2,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  Calendar,
  Layers,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  FilePlus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { CaseBridgeStore } from "@/lib/api/store";
import { SupabaseDataService } from "@/lib/supabase/dataService";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BureauBadge } from "@/components/shared/BureauBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(() => CaseBridgeStore.getDashboardMetrics());

  const fetchMetrics = () => {
    SupabaseDataService.getDashboardMetrics().then((data) => {
      setMetrics(data);
    });
  };

  useEffect(() => {
    CaseBridgeStore.init();
    fetchMetrics();
    window.addEventListener("casebridge_store_updated", fetchMetrics);
    return () => window.removeEventListener("casebridge_store_updated", fetchMetrics);
  }, []);

  if (!metrics) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3 text-[#62665F] font-mono text-xs">
        <div className="w-5 h-5 border-2 border-[#344B3B] border-t-transparent rounded-full animate-spin" />
        <span>Loading AICTE Institutional Telemetry...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Editorial Header / Operational Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E3E5DE]">
        <div>
          <Breadcrumbs items={[{ label: "Executive Overview" }]} />
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#20231F] tracking-tight mt-0.5">
            Inter-Bureau Oversight & Grievance Tracking Matrix
          </h1>
          <p className="text-xs text-[#62665F] mt-1 flex items-center gap-2">
            <span>AICTE Statutory Oversight</span>
            <span>&bull;</span>
            <span className="text-[#23734D] font-medium">5 Bureaus Synchronized</span>
            <span>&bull;</span>
            <span>Multi-Factor Candidate Overlap Detection</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/intake"
            className="inline-flex items-center gap-1.5 bg-[#F0F3ED] hover:bg-[#E8EEE7] text-[#344B3B] border border-[#D4D8CF] text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-xs"
          >
            <FilePlus className="w-3.5 h-3.5" />
            <span>Register Complaint</span>
          </Link>
          <Link
            href="/overlap-review"
            className="inline-flex items-center gap-1.5 bg-[#344B3B] hover:bg-[#293D30] text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Triage Overlaps ({metrics.pendingOverlapsCount})</span>
          </Link>
        </div>
      </div>

      {/* 5 Enterprise Metric Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Metric 1 */}
        <button
          onClick={() => router.push("/cases")}
          className="bg-white p-4 rounded-xl border border-[#E3E5DE] hover:border-[#344B3B] shadow-xs text-left transition-all hover:shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#85877F] uppercase tracking-wider">
              Active Inquiries
            </span>
            <FolderKanban className="w-4 h-4 text-[#85877F] group-hover:text-[#344B3B] transition-colors" />
          </div>
          <div className="text-2xl font-bold text-[#20231F] mt-2 font-mono">
            {metrics.activeCount}
          </div>
          <div className="text-[11px] text-[#62665F] mt-1.5 flex items-center justify-between">
            <span>5 Bureaus Active</span>
            <span className="text-[#344B3B] font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center text-xs">
              View <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Metric 2: Pending Overlaps */}
        <button
          onClick={() => router.push("/overlap-review")}
          className="bg-white p-4 rounded-xl border border-[#F0DCB0] hover:border-[#925C0B] shadow-xs text-left transition-all hover:shadow-sm group bg-[#FBF1DB]/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#925C0B] uppercase tracking-wider">
              Candidate Overlaps
            </span>
            <div className="w-2 h-2 rounded-full bg-[#925C0B] animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-[#925C0B] mt-2 font-mono">
            {metrics.pendingOverlapsCount}
          </div>
          <div className="text-[11px] text-[#925C0B] mt-1.5 flex items-center justify-between font-medium">
            <span>Coordination Required</span>
            <span className="font-semibold inline-flex items-center text-xs">
              Resolve <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Metric 3: SLA Breaches */}
        <button
          onClick={() => router.push("/cases?status=OVERDUE")}
          className="bg-white p-4 rounded-xl border border-[#F3C5CB] hover:border-[#B42332] shadow-xs text-left transition-all hover:shadow-sm group bg-[#FBEAEC]/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#B42332] uppercase tracking-wider">
              SLA Breaches (&gt;30d)
            </span>
            <Clock className="w-4 h-4 text-[#B42332]" />
          </div>
          <div className="text-2xl font-bold text-[#B42332] mt-2 font-mono">
            {metrics.overdueCount}
          </div>
          <div className="text-[11px] text-[#B42332] mt-1.5 flex items-center justify-between font-medium">
            <span>Statutory Timeline</span>
            <span className="font-semibold inline-flex items-center text-xs">
              Filter <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Metric 4: Joint Inquiries */}
        <button
          onClick={() => router.push("/cases?status=JOINT_COMMITTEE")}
          className="bg-white p-4 rounded-xl border border-[#E3E5DE] hover:border-[#344B3B] shadow-xs text-left transition-all hover:shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#85877F] uppercase tracking-wider">
              Joint Inquiries
            </span>
            <GitMerge className="w-4 h-4 text-[#344B3B]" />
          </div>
          <div className="text-2xl font-bold text-[#20231F] mt-2 font-mono">
            {metrics.jointCommitteesCount}
          </div>
          <div className="text-[11px] text-[#62665F] mt-1.5 flex items-center justify-between">
            <span>Multi-Cell Teams</span>
            <span className="text-[#344B3B] font-semibold inline-flex items-center text-xs">
              Inspect <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Metric 5: Flagged Colleges */}
        <button
          onClick={() => router.push("/institutions")}
          className="bg-white p-4 rounded-xl border border-[#E3E5DE] hover:border-[#344B3B] shadow-xs text-left transition-all hover:shadow-sm group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#85877F] uppercase tracking-wider">
              Flagged Colleges
            </span>
            <Building2 className="w-4 h-4 text-[#85877F] group-hover:text-[#344B3B] transition-colors" />
          </div>
          <div className="text-2xl font-bold text-[#20231F] mt-2 font-mono">
            {metrics.highRiskInstitutionsCount}
          </div>
          <div className="text-[11px] text-[#62665F] mt-1.5 flex items-center justify-between">
            <span>High/Critical Risk</span>
            <span className="text-[#344B3B] font-semibold inline-flex items-center text-xs">
              Directory <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </button>
      </div>

      {/* Operational Analytical Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bureau Workload Breakdown */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-[#E3E5DE] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#20231F]">
                Active Inquiries by Bureau / Cell
              </h2>
              <p className="text-xs text-[#62665F] mt-0.5">
                Click any departmental bar to inspect assigned complaints.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#62665F]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#344B3B]" /> Active
              </span>
              <span className="flex items-center gap-1.5 text-[#62665F]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#8A9C85]" /> Resolved
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.bureauWorkload}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                onClick={(e) => {
                  if (e && e.activePayload && e.activePayload.length) {
                    const bureau = e.activePayload[0].payload.bureau;
                    router.push(`/cases?bureau=${bureau}`);
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E5DE" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#62665F", fontFamily: "sans-serif" }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#62665F", fontFamily: "sans-serif" }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "#F7F7F4" }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E3E5DE",
                    color: "#20231F",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  }}
                />
                <Bar dataKey="pending" name="Active Inquiries" fill="#344B3B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved Cases" fill="#8A9C85" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaint Ageing Profile */}
        <div className="bg-white p-5 rounded-xl border border-[#E3E5DE] shadow-xs">
          <div className="mb-4">
            <h2 className="text-sm font-bold text-[#20231F]">
              Statutory 30-Day Ageing Profile
            </h2>
            <p className="text-xs text-[#62665F] mt-0.5">
              Strict resolution velocity oversight.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.ageingTiers}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E5DE" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11, fill: "#62665F", fontFamily: "sans-serif" }}
                  allowDecimals={false}
                />
                <YAxis
                  dataKey="tier"
                  type="category"
                  tick={{ fontSize: 11, fill: "#20231F", fontFamily: "sans-serif" }}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: "#F7F7F4" }}
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E3E5DE",
                    color: "#20231F",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  }}
                />
                <Bar dataKey="count" name="Case Count" radius={[0, 4, 4, 0]}>
                  {metrics.ageingTiers.map((entry: any, index: number) => {
                    const colors = ["#23734D", "#344B3B", "#925C0B", "#B42332"];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Immediate Attention: Overdue & Critical Cases Desk */}
      <div className="bg-white rounded-xl border border-[#E3E5DE] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E3E5DE] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#F7F7F4]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B42332] animate-pulse shrink-0" />
              <h2 className="text-sm font-bold text-[#20231F]">
                Immediate Attention: SLA Breaches & Urgent Inquiries
              </h2>
            </div>
            <p className="text-xs text-[#62665F] mt-0.5">
              Complaints exceeding statutory resolution window requiring urgent bureau notice or committee hearing.
            </p>
          </div>
          <Link
            href="/cases?status=OVERDUE"
            className="text-xs font-semibold text-[#344B3B] hover:underline inline-flex items-center gap-1 font-mono"
          >
            <span>View All Breaches ({metrics.overdueCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F7F7F4] border-b border-[#E3E5DE] text-[#62665F] font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold">Case Reference</th>
                <th className="py-3 px-4 font-semibold">Institution Name & PID</th>
                <th className="py-3 px-4 font-semibold">Assigned Bureau</th>
                <th className="py-3 px-4 font-semibold">Days Open</th>
                <th className="py-3 px-4 font-semibold">SLA Target</th>
                <th className="py-3 px-4 font-semibold">Responsible Officer</th>
                <th className="py-3 px-4 font-semibold">Current State</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5DE]">
              {metrics.overdueCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#85877F] font-mono text-xs">
                    No cases currently breaching SLA timeline. All operational queues compliant.
                  </td>
                </tr>
              ) : (
                metrics.overdueCases.map((c: any) => (
                  <tr key={c.id} className="hover:bg-[#F7F7F4] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#20231F]">
                      <Link
                        href={`/cases/${encodeURIComponent(c.id)}`}
                        className="text-[#344B3B] hover:underline"
                      >
                        {c.id}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#20231F] line-clamp-1">
                        {c.institutionName}
                      </div>
                      <div className="text-[10px] text-[#85877F] font-mono">
                        PID: {c.institutionId}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <BureauBadge bureau={c.bureau} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[#B42332] bg-[#FBEAEC] border border-[#F3C5CB] px-1.5 py-0.5 rounded text-[11px]">
                        {c.daysOpen} days
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#62665F]">
                      {formatDate(c.slaDeadline)}
                    </td>
                    <td className="py-3 px-4 text-[#20231F] font-medium">
                      {c.assignedOfficer}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={c.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/cases/${encodeURIComponent(c.id)}`}
                        className="inline-flex items-center gap-1 bg-[#F0F3ED] hover:bg-[#E8EEE7] text-[#344B3B] text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors font-mono border border-[#D4D8CF]"
                      >
                        Inspect
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
