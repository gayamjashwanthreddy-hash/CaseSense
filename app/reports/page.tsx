"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Building2,
  PieChart as PieIcon,
  TrendingUp,
  ShieldCheck,
  FileSpreadsheet,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CaseBridgeStore } from "@/lib/api/store";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useToast } from "@/lib/context/ToastContext";

export default function ReportsPage() {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<any>(null);

  const loadData = () => {
    setMetrics(CaseBridgeStore.getDashboardMetrics());
  };

  useEffect(() => {
    CaseBridgeStore.init();
    loadData();
    window.addEventListener("casebridge_store_updated", loadData);
    return () => window.removeEventListener("casebridge_store_updated", loadData);
  }, []);

  if (!metrics) {
    return <div className="py-12 text-center text-xs text-slate-500">Compiling analytical dossiers...</div>;
  }

  const categoryBreakdown = [
    { name: "Certificate Withholding", count: 7, color: "#1e40af" },
    { name: "Capitation Surcharges", count: 6, color: "#f59e0b" },
    { name: "Faculty / Biometric Discrepancy", count: 5, color: "#ef4444" },
    { name: "Infrastructure Deficit", count: 4, color: "#10b981" },
    { name: "Admission Irregularities", count: 3, color: "#8b5cf6" },
    { name: "Unapproved Courses", count: 3, color: "#06b6d4" },
  ];

  const monthlyTrend = [
    { month: "May 2026", intake: 14, resolved: 11 },
    { month: "Jun 2026", intake: 19, resolved: 15 },
    { month: "Jul 2026", intake: 22, resolved: 18 },
    { month: "Aug 2026", intake: 26, resolved: 21 },
    { month: "Sep 2026", intake: 28, resolved: 23 },
    { month: "Oct 2026", intake: 17, resolved: 14 },
  ];

  const handlePrint = () => {
    window.print();
  };

  const handleExportSummaryCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Metric,Value",
        `Total Active Complaints,${metrics.activeCount}`,
        `Pending Inter-Bureau Overlaps,${metrics.pendingOverlapsCount}`,
        `SLA Breached Cases,${metrics.overdueCount}`,
        `Joint Inter-Bureau Committees Formed,${metrics.jointCommitteesCount}`,
        `High-Risk Technical Colleges Flagged,${metrics.highRiskInstitutionsCount}`,
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AICTE_Performance_Summary_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Summary Report Exported",
      message: "AICTE executive governance summary exported.",
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <Breadcrumbs items={[{ label: "Reports & Analytics" }]} />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-700" />
            <span>AICTE Multi-Bureau Performance & Overlap Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inter-bureau efficiency audits, category recurrence patterns, and statutory SLA compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSummaryCSV}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium px-3 py-1.5 rounded shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Summary (CSV)</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-1.5 rounded shadow-sm transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier Briefing</span>
          </button>
        </div>
      </div>

      {/* High-level Operational Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Deduplication Accuracy
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">94.2%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Based on human referee confirmations</div>
        </div>

        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Avg Turnaround Time
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">21 Days</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Within 30-day statutory SLA</div>
        </div>

        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Redundant Work Eliminated
          </span>
          <div className="text-2xl font-bold text-blue-700 mt-1">~180 Hours</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Through joint hearings & merged files</div>
        </div>

        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Joint Inquiries Formed
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{metrics.jointCommitteesCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active inter-bureau coordination</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Intake vs Disposal */}
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Monthly Intake vs Resolution Volume
            </h2>
            <p className="text-xs text-slate-500">
              Comparative analysis of registered cases vs resolved inquiries across 2026.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
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
                <Bar dataKey="intake" name="Complaints Admitted" fill="#1e40af" radius={[3, 3, 0, 0]} />
                <Bar dataKey="resolved" name="Complaints Disposed" fill="#10b981" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Density Breakdown */}
        <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Case Density by AICTE Regional Office
            </h2>
            <p className="text-xs text-slate-500">
              Geographic distribution of active institution-related complaints.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.regionalData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} allowDecimals={false} />
                <YAxis dataKey="region" type="category" tick={{ fontSize: 11, fill: "#334155" }} width={90} />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" name="Active Inquiries" fill="#0f172a" radius={[0, 3, 3, 0]}>
                  {metrics.regionalData.map((_: any, index: number) => (
                    <Cell
                      key={`region-cell-${index}`}
                      fill={["#1e40af", "#4338ca", "#0891b2", "#d97706", "#be123c"][index % 5]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recurrence by Grievance Category */}
      <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Distribution by Grievance Violation Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categoryBreakdown.map((cat, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-xs font-medium text-slate-800">{cat.name}</span>
              </div>
              <span className="text-xs font-bold text-slate-900 font-mono">{cat.count} Cases</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
