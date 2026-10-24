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
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Institution } from "@/lib/api/types";
import { CaseBridgeStore } from "@/lib/api/store";
import { SupabaseDataService } from "@/lib/supabase/dataService";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export default function InstitutionsDirectoryPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");

  const loadData = () => {
    SupabaseDataService.getInstitutions().then((data) => {
      setInstitutions(data);
    });
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
        return "bg-rose-50 text-rose-700 border-rose-200 font-bold";
      case "HIGH":
        return "bg-amber-50 text-amber-800 border-amber-200 font-semibold";
      case "MEDIUM":
        return "bg-blue-50 text-blue-700 border-blue-200 font-medium";
      case "LOW":
      default:
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header - Editorial Dark Strip */}
      <div className="bg-[#0A1626] text-white p-6 rounded-2xl border border-[#142C46] shadow-xl space-y-3">
        <Breadcrumbs items={[{ label: "Technical Institutions" }]} />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <Building2 className="w-6 h-6 text-blue-400" />
              <span>AICTE Technical Institution Registry</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Permanent Institute ID (PID) records, historical compliance ratings, and active multi-bureau grievance dossiers.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-[#0D1C2E] border border-[#1E3A5F] text-xs font-mono">
              <span className="text-slate-400">Total Enrolled: </span>
              <strong className="text-white">{institutions.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by institution name, AICTE Permanent ID (1-...), state, or affiliated university..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all font-sans"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">All Categories</option>
            <option value="ENGINEERING">Engineering</option>
            <option value="MANAGEMENT">Management</option>
            <option value="PHARMACY">Pharmacy</option>
            <option value="ARCHITECTURE">Architecture</option>
          </select>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInstitutions.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
            No technical institutions found matching your search criteria.
          </div>
        ) : (
          filteredInstitutions.map((inst) => (
            <div
              key={inst.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all p-5 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                    {inst.id}
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRiskBadge(
                      inst.riskLevel
                    )}`}
                  >
                    {inst.riskLevel} Risk
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-700 transition-colors leading-snug">
                    {inst.name}
                  </h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{inst.district}, {inst.state}</span>
                  </div>
                </div>

                <div className="space-y-1 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="font-semibold text-slate-800">{inst.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Approval Status:</span>
                    <span className="font-medium text-slate-800">{inst.approvalStatus}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Affiliation:</span>
                    <span className="text-slate-800 truncate max-w-[180px]" title={inst.affiliatedUniversity}>
                      {inst.affiliatedUniversity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  <strong className="text-slate-900 font-mono font-bold">{inst.activeCasesCount}</strong> Active Cases
                </div>
                <Link
                  href={`/institutions/${inst.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 group-hover:text-blue-800 group-hover:underline"
                >
                  <span>360° Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
