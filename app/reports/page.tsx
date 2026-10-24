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
  CheckCircle2,
  Clock,
  Scale,
  Zap,
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
    return (
      <div className="py-20 text-center text-xs text-slate-500">
        Compiling AICTE analytical dossiers...
      </div>
    );
  }

  const categoryBreakdown = [
    { name: "Certificate Withholding", count: 7, color: "#1d4ed8" },
    { name: "Capitation Surcharges", count: 6, color: "#d97706" },
    { name: "Faculty / Biometric Discrepancy", count: 5, color: "#dc2626" },
    { name: "Infrastructure Deficit", count: 4, color: "#059669" },
    { name: "Admission Irregularities", count: 3, color: "#7c3aed" },
    { name: "Unapproved Courses", count: 3, color: "#0891b2" },
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
      message: "AICTE executive governance summary exported as CSV.",
      type: "success",
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header - Editorial Dark Strip */}
      <div className="bg-[#0A1626] text-white p-6 rounded-2xl border border-[#142C46] shadow-xl space-y-4">
        <Breadcrumbs items={[{ label: "Reports & Analytics" }]} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <span>AICTE Multi-Bureau Performance & Overlap Analytics</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Inter-bureau efficiency audits, recurrence classifications, deduplication accuracy metrics, and statutory SLA compliance.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportSummaryCSV}
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white border border-[#243B55] bg-[#0D1C2E] hover:bg-[#142C46] px-3.5 py-2 rounded-xl transition-colors font-semibold shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* High-level Operational Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Deduplication Accuracy
            </span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">94.2%</div>
          <div className="text-[11px] text-slate-500">Based on human referee confirmations</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Avg Turnaround Time
            </span>
            <div className="w-6 h-6 rounded-md bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">21 Days</div>
          <div className="text-[11px] text-emerald-700 font-semibold">Compliant with 30-day mandate</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Redundant Work Saved
            </span>
            <div className="w-6 h-6 rounded-md bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-blue-700 font-mono">~180 Hours</div>
          <div className="text-[11px] text-slate-500">Through unified hearings & merged files</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Joint Inquiries Formed
            </span>
            <div className="w-6 h-6 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Scale className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono">{metrics.jointCommitteesCount}</div>
          <div className="text-[11px] text-slate-500">Inter-bureau standing committees</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Intake vs Disposal */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Monthly Intake vs Resolution Volume
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparative analysis of registered cases vs resolved inquiries across 2026.
            </p>
          </div>

          <div className="h-64 w-full pt-2">
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
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
                <Bar dataKey="intake" name="Complaints Admitted" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Complaints Disposed" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Density Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Case Density by AICTE Regional Office
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Geographic distribution of active institution-related complaints.
            </p>
          </div>

          <div className="h-64 w-full pt-2">
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
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" name="Active Inquiries" fill="#0f172a" radius={[0, 4, 4, 0]}>
                  {metrics.regionalData.map((_: any, index: number) => (
                    <Cell
                      key={`region-cell-${index}`}
                      fill={["#1d4ed8", "#4338ca", "#0891b2", "#d97706", "#be123c"][index % 5]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recurrence by Grievance Category */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Distribution by Grievance Violation Category
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Recurrence patterns across active AICTE technical colleges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {categoryBreakdown.map((cat, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-xs font-semibold text-slate-800">{cat.name}</span>
              </div>
              <span className="text-xs font-bold text-slate-900 font-mono bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {cat.count} Cases
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
