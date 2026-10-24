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
        return "bg-[#FBEAEC] text-[#B42332] border-[#B42332]/25 font-bold";
      case "HIGH":
        return "bg-[#FBF1DB] text-[#925C0B] border-[#925C0B]/25 font-semibold";
      case "MEDIUM":
        return "bg-[#EAF0F6] text-[#496785] border-[#496785]/25 font-medium";
      case "LOW":
      default:
        return "bg-[#E8F4EC] text-[#23734D] border-[#23734D]/25 font-medium";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E3E5DE]">
        <div>
          <Breadcrumbs items={[{ label: "Technical Institutions" }]} />
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#20231F] tracking-tight mt-1 flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-[#344B3B]" />
            <span>AICTE Technical Institution Registry</span>
          </h1>
          <p className="text-xs text-[#62665F] font-mono mt-1 max-w-2xl">
            Permanent Institute ID (PID) records, historical compliance ratings, and active multi-bureau grievance dossiers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-md bg-[#F7F7F4] border border-[#E3E5DE] text-xs font-mono">
            <span className="text-[#62665F]">Total Enrolled: </span>
            <strong className="text-[#20231F]">{institutions.length}</strong>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-[#E3E5DE] shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#85877F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by institution name, AICTE Permanent ID (1-...), state, or affiliated university..."
            className="w-full pl-9 pr-4 py-2 bg-[#F7F7F4] border border-[#E3E5DE] rounded-md text-[#20231F] placeholder-[#85877F] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white transition-all font-sans"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#F7F7F4] border border-[#E3E5DE] rounded-md text-[#20231F] font-medium focus:outline-none focus:ring-1 focus:ring-[#526B57]"
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
            className="px-3 py-2 bg-[#F7F7F4] border border-[#E3E5DE] rounded-md text-[#20231F] font-medium focus:outline-none focus:ring-1 focus:ring-[#526B57]"
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
          <div className="col-span-full py-16 text-center text-[#62665F] text-xs bg-white rounded-xl border border-[#E3E5DE] font-mono">
            No technical institutions found matching your search criteria.
          </div>
        ) : (
          filteredInstitutions.map((inst) => (
            <div
              key={inst.id}
              className="bg-white rounded-xl border border-[#E3E5DE] shadow-xs hover:border-[#344B3B]/40 transition-all p-5 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold text-[#20231F] bg-[#F7F7F4] px-2 py-0.5 rounded border border-[#E3E5DE]">
                    {inst.id}
                  </span>
                  <span
                    className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border font-mono ${getRiskBadge(
                      inst.riskLevel
                    )}`}
                  >
                    {inst.riskLevel} Risk
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-[#20231F] text-sm group-hover:text-[#344B3B] transition-colors leading-snug">
                    {inst.name}
                  </h3>
                  <div className="text-[11px] text-[#62665F] flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#85877F] shrink-0" />
                    <span>{inst.district}, {inst.state}</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#E3E5DE] text-[11px] text-[#62665F]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#85877F]">Category:</span>
                    <span className="font-semibold text-[#20231F]">{inst.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#85877F]">Approval Status:</span>
                    <span className="font-medium text-[#20231F]">{inst.approvalStatus}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#85877F]">Affiliation:</span>
                    <span className="text-[#20231F] truncate max-w-[180px]" title={inst.affiliatedUniversity}>
                      {inst.affiliatedUniversity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E3E5DE] flex items-center justify-between">
                <div className="text-[11px] text-[#62665F] font-mono">
                  <strong className="text-[#20231F] font-bold">{inst.activeCasesCount}</strong> Active Cases
                </div>
                <Link
                  href={`/institutions/${inst.id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#344B3B] group-hover:text-[#202F25] font-mono"
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
