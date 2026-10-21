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
  PieChart,
  Pie,
} from "recharts";
import { CaseBridgeStore } from "@/lib/api/store";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BureauBadge } from "@/components/shared/BureauBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<any>(() => CaseBridgeStore.getDashboardMetrics());

  const fetchMetrics = () => {
    setMetrics(CaseBridgeStore.getDashboardMetrics());
  };

  useEffect(() => {
    CaseBridgeStore.init();
    fetchMetrics();
    window.addEventListener("casebridge_store_updated", fetchMetrics);
    return () => window.removeEventListener("casebridge_store_updated", fetchMetrics);
  }, []);

  if (!metrics) {
    return (
      <div className="py-12 flex justify-center text-sm text-slate-500">
        Loading administrative metrics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Breadcrumbs items={[{ label: "Executive Overview" }]} />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            AICTE Inter-Bureau Monitoring & Tracking Console
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized complaint tracking, automated cross-bureau overlap detection, and SLA oversight.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/intake"
            className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium px-3 py-2 rounded-md shadow-sm transition-colors"
          >
            <span>Register New Complaint</span>
          </Link>
          <Link
            href="/overlap-review"
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium px-3 py-2 rounded-md shadow-sm transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Triage Overlaps ({metrics.pendingOverlapsCount})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Metric 1 */}
        <button
          onClick={() => router.push("/cases")}
          className="bg-white p-3.5 rounded-md border border-slate-200 hover:border-slate-300 shadow-sm text-left transition-all hover:bg-slate-50/50 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Active Cases
            </span>
            <FolderKanban className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.activeCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Across 5 Bureaus</span>
            <span className="text-blue-700 font-medium group-hover:underline inline-flex items-center">
              View <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Metric 2 */}
        <button
          onClick={() => router.push("/overlap-review")}
          className="bg-white p-3.5 rounded-md border border-amber-200 hover:border-amber-300 shadow-sm text-left transition-all hover:bg-amber-50/30 group ring-1 ring-amber-200/50"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
              Pending Overlaps
            </span>
            <GitCompare className="w-4 h-4 text-amber-600 group-hover:scale-105 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-amber-900 mt-1">{metrics.pendingOverlapsCount}</div>
          <div className="text-[11px] text-amber-700 mt-1 flex items-center justify-between font-medium">
            <span>Coordination Required</span>
            <span className="underline inline-flex items-center">
              Resolve <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Metric 3 */}
        <button
          onClick={() => router.push("/cases?status=OVERDUE")}
          className="bg-white p-3.5 rounded-md border border-rose-200 hover:border-rose-300 shadow-sm text-left transition-all hover:bg-rose-50/30 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider">
              SLA Breaches (&gt;30d)
            </span>
            <Clock className="w-4 h-4 text-rose-600 group-hover:scale-105 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-rose-900 mt-1">{metrics.overdueCount}</div>
          <div className="text-[11px] text-rose-700 mt-1 flex items-center justify-between font-medium">
            <span>Urgent Intervention</span>
            <span className="underline inline-flex items-center">
              Filter <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Metric 4 */}
        <button
          onClick={() => router.push("/cases?status=JOINT_COMMITTEE")}
          className="bg-white p-3.5 rounded-md border border-slate-200 hover:border-slate-300 shadow-sm text-left transition-all hover:bg-slate-50/50 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Joint Inquiries
            </span>
            <GitMerge className="w-4 h-4 text-indigo-600 group-hover:scale-105 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.jointCommitteesCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>Cross-Cell Teams</span>
            <span className="text-blue-700 font-medium group-hover:underline inline-flex items-center">
              Inspect <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </button>

        {/* Metric 5 */}
        <button
          onClick={() => router.push("/institutions")}
          className="bg-white p-3.5 rounded-md border border-slate-200 hover:border-slate-300 shadow-sm text-left transition-all hover:bg-slate-50/50 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Flagged Colleges
            </span>
            <Building2 className="w-4 h-4 text-slate-400 group-hover:text-blue-700 transition-colors" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.highRiskInstitutionsCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>High/Critical Risk</span>
            <span className="text-blue-700 font-medium group-hover:underline inline-flex items-center">
              Directory <ArrowRight className="w-3 h-3 ml-0.5" />
            </span>
          </div>
        </button>
      </div>

      {/* Operational Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bureau Workload Breakdown */}
        <div className="lg:col-span-2 bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Workload Distribution by Bureau / Cell
              </h2>
              <p className="text-xs text-slate-500">
                Click any bar to drill-down into specific departmental cases.
              </p>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
                <YAxis tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Bar dataKey="pending" name="Active / In Progress" fill="#1e40af" radius={[3, 3, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved / Disposed" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Complaint Ageing Profile */}
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-slate-900">
              Complaint Ageing Profile
            </h2>
            <p className="text-xs text-slate-500">
              Statutory 30-day mandate monitoring.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.ageingTiers}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                <YAxis
                  dataKey="tier"
                  type="category"
                  tick={{ fontSize: 11, fill: "#334155" }}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" name="Case Count" fill="#0f172a" radius={[0, 3, 3, 0]}>
                  {metrics.ageingTiers.map((entry: any, index: number) => {
                    const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Immediate Attention: Overdue & Critical Cases Desk */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h2 className="text-sm font-semibold text-slate-900">
                Immediate Attention: Overdue Inquiries & SLA Alerts
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Active regulatory cases requiring immediate review, committee constitution, or notice issuance.
            </p>
          </div>
          <Link
            href="/cases?status=OVERDUE"
            className="text-xs text-blue-700 hover:text-blue-900 font-medium inline-flex items-center gap-1"
          >
            <span>View All Overdue ({metrics.overdueCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-4">Case Reference</th>
                <th className="py-2.5 px-4">Institution</th>
                <th className="py-2.5 px-4">Bureau</th>
                <th className="py-2.5 px-4">Age / Days Open</th>
                <th className="py-2.5 px-4">SLA Deadline</th>
                <th className="py-2.5 px-4">Assigned Officer</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.overdueCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-slate-500">
                    No cases currently breaching SLA timeline.
                  </td>
                </tr>
              ) : (
                metrics.overdueCases.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      <Link href={`/cases/${encodeURIComponent(c.id)}`} className="text-blue-700 hover:underline">
                        {c.id}
                      </Link>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-medium text-slate-800 line-clamp-1">{c.institutionName}</div>
                      <div className="text-[10px] text-slate-400">ID: {c.institutionId}</div>
                    </td>
                    <td className="py-2.5 px-4">
                      <BureauBadge bureau={c.bureau} />
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="font-semibold text-rose-700">{c.daysOpen} days</span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">{formatDate(c.slaDeadline)}</td>
                    <td className="py-2.5 px-4 text-slate-700">{c.assignedOfficer}</td>
                    <td className="py-2.5 px-4">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <Link
                        href={`/cases/${encodeURIComponent(c.id)}`}
                        className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] px-2 py-1 rounded font-medium transition-colors"
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
