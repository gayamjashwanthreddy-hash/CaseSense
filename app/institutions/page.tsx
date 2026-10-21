"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  Search,
  Filter,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  GraduationCap,
} from "lucide-react";
import { Institution } from "@/lib/api/types";
import { CaseBridgeStore } from "@/lib/api/store";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function InstitutionsDirectoryPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");

  const loadData = () => {
    setInstitutions(CaseBridgeStore.getInstitutions());
  };

  useEffect(() => {
    CaseBridgeStore.init();
    loadData();
    window.addEventListener("casebridge_store_updated", loadData);
    return () => window.removeEventListener("casebridge_store_updated", loadData);
  }, []);

  const filteredInstitutions = useMemo(() => {
    return institutions.filter((inst) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          inst.name.toLowerCase().includes(q) ||
          inst.id.toLowerCase().includes(q) ||
          inst.state.toLowerCase().includes(q) ||
          inst.district.toLowerCase().includes(q) ||
          inst.affiliatedUniversity.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (categoryFilter !== "ALL" && inst.category !== categoryFilter) return false;
      if (riskFilter !== "ALL" && inst.riskLevel !== riskFilter) return false;
      return true;
    });
  }, [institutions, search, categoryFilter, riskFilter]);

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "CRITICAL":
        return "bg-rose-100 text-rose-800 border-rose-300 font-bold";
      case "HIGH":
        return "bg-amber-100 text-amber-800 border-amber-300 font-semibold";
      case "MEDIUM":
        return "bg-blue-50 text-blue-800 border-blue-200 font-medium";
      case "LOW":
      default:
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <Breadcrumbs items={[{ label: "Institution Profiles" }]} />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-700" />
            <span>AICTE Technical Institution Directory</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Synchronized institutional records, permanent AICTE IDs, and consolidated cross-bureau complaint histories.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3.5 rounded-md border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by Institution Name, AICTE Permanent ID (e.g. 1-10492811), State, or University..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="ALL">All Categories</option>
            <option value="Technical / Engineering">Technical / Engineering</option>
            <option value="Management">Management</option>
            <option value="Polytechnic">Polytechnic</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="ALL">All Compliance Tiers</option>
            <option value="CRITICAL">Critical Non-Compliance</option>
            <option value="HIGH">High Inquiry Volume</option>
            <option value="MEDIUM">Moderate Risk</option>
            <option value="LOW">Low / Normal</option>
          </select>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInstitutions.map((inst) => (
          <div
            key={inst.id}
            className="bg-white rounded-md border border-slate-200 hover:border-slate-300 shadow-sm p-4 flex flex-col justify-between transition-all hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    ID: {inst.id}
                  </span>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">{inst.category}</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${getRiskBadge(inst.riskLevel)}`}>
                  {inst.riskLevel} RISK
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                  {inst.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {inst.district}, {inst.state} ({inst.region})
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Approval Status:</span>
                  <span className="font-medium text-slate-800">{inst.approvalStatus}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Affiliation:</span>
                  <span className="font-medium text-slate-800 truncate max-w-[170px]" title={inst.affiliatedUniversity}>
                    {inst.affiliatedUniversity}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer with Complaint Count */}
            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs">
                <span className="font-bold text-blue-700">{inst.activeCasesCount}</span>{" "}
                <span className="text-slate-500 text-[11px]">Active Cross-Bureau Inquiries</span>
              </div>

              <Link
                href={`/institutions/${inst.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900"
              >
                <span>360° Profile</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
