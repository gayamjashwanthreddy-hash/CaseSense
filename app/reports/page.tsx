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
      <div className="py-20 text-center text-xs text-[#62665F] font-mono">
        Compiling AICTE analytical dossiers...
      </div>
    );
  }

  const categoryBreakdown = [
    { name: "Certificate Withholding", count: 7, color: "#344B3B" },
    { name: "Capitation Surcharges", count: 6, color: "#925C0B" },
    { name: "Faculty / Biometric Discrepancy", count: 5, color: "#B42332" },
    { name: "Infrastructure Deficit", count: 4, color: "#8A9C85" },
    { name: "Admission Irregularities", count: 3, color: "#A77B51" },
    { name: "Unapproved Courses", count: 3, color: "#687B8D" },
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E3E5DE]">
        <div>
          <Breadcrumbs items={[{ label: "Reports & Analytics" }]} />
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#20231F] tracking-tight mt-1 flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-[#344B3B]" />
            <span>AICTE Multi-Bureau Performance &amp; Overlap Analytics</span>
          </h1>
          <p className="text-xs text-[#62665F] font-mono mt-1 max-w-2xl">
            Inter-bureau efficiency audits, recurrence classifications, deduplication accuracy metrics, and statutory SLA compliance.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportSummaryCSV}
            className="inline-flex items-center gap-1.5 text-xs text-[#20231F] hover:text-[#344B3B] border border-[#E3E5DE] bg-white hover:bg-[#F7F7F4] px-3.5 py-2 rounded-md transition-colors font-semibold shadow-xs font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-[#344B3B] hover:bg-[#293D30] text-white text-xs font-bold px-4 py-2 rounded-md shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* High-level Operational Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-5 rounded-xl border border-[#E3E5DE] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#62665F] uppercase tracking-widest font-mono">
              Deduplication Accuracy
            </span>
            <div className="w-6 h-6 rounded-md bg-[#E8F4EC] border border-[#23734D]/25 flex items-center justify-center text-[#23734D]">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#20231F] font-mono">94.2%</div>
          <div className="text-[11px] text-[#62665F]">Based on human referee confirmations</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E3E5DE] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#62665F] uppercase tracking-widest font-mono">
              Avg Turnaround Time
            </span>
            <div className="w-6 h-6 rounded-md bg-[#E8EEE7] border border-[#344B3B]/25 flex items-center justify-center text-[#344B3B]">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#20231F] font-mono">21 Days</div>
          <div className="text-[11px] text-[#23734D] font-semibold">Compliant with 30-day mandate</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E3E5DE] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#62665F] uppercase tracking-widest font-mono">
              Redundant Work Saved
            </span>
            <div className="w-6 h-6 rounded-md bg-[#EAF0F6] border border-[#496785]/25 flex items-center justify-center text-[#496785]">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#344B3B] font-mono">~180 Hours</div>
          <div className="text-[11px] text-[#62665F]">Through unified hearings &amp; merged files</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E3E5DE] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#62665F] uppercase tracking-widest font-mono">
              Joint Inquiries Formed
            </span>
            <div className="w-6 h-6 rounded-md bg-[#FBF1DB] border border-[#925C0B]/25 flex items-center justify-center text-[#925C0B]">
              <Scale className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-[#20231F] font-mono">{metrics.jointCommitteesCount}</div>
          <div className="text-[11px] text-[#62665F]">Inter-bureau standing committees</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Intake vs Disposal */}
        <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#20231F]">
              Monthly Intake vs Resolution Volume
            </h2>
            <p className="text-xs text-[#62665F] mt-0.5 font-mono">
              Comparative analysis of registered cases vs resolved inquiries across 2026.
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E5DE" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#62665F" }} />
                <YAxis tick={{ fontSize: 11, fill: "#62665F" }} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "#F7F7F4" }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#E3E5DE",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
                <Bar dataKey="intake" name="Complaints Admitted" fill="#344B3B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Complaints Disposed" fill="#8A9C85" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Density Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#20231F]">
              Case Density by AICTE Regional Office
            </h2>
            <p className="text-xs text-[#62665F] mt-0.5 font-mono">
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
                <CartesianGrid strokeDasharray="3 3" stroke="#E3E5DE" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#62665F" }} allowDecimals={false} />
                <YAxis dataKey="region" type="category" tick={{ fontSize: 11, fill: "#20231F" }} width={90} />
                <Tooltip
                  cursor={{ fill: "#F7F7F4" }}
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#E3E5DE",
                    borderRadius: "8px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" name="Active Inquiries" fill="#344B3B" radius={[0, 4, 4, 0]}>
                  {metrics.regionalData.map((_: any, index: number) => (
                    <Cell
                      key={`region-cell-${index}`}
                      fill={["#344B3B", "#8A9C85", "#A77B51", "#687B8D", "#925C0B"][index % 5]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recurrence by Grievance Category */}
      <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-[#20231F]">
            Distribution by Grievance Violation Category
          </h2>
          <p className="text-xs text-[#62665F] mt-0.5 font-mono">
            Recurrence patterns across active AICTE technical colleges.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {categoryBreakdown.map((cat, idx) => (
            <div
              key={idx}
              className="p-4 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE] flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-xs font-semibold text-[#20231F]">{cat.name}</span>
              </div>
              <span className="text-xs font-bold text-[#20231F] font-mono bg-white px-2 py-0.5 rounded border border-[#E3E5DE]">
                {cat.count} Cases
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
