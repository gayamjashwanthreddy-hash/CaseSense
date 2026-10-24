"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GitCompare,
  AlertTriangle,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Scale,
  Clock,
  Filter,
  Layers,
} from "lucide-react";
import { OverlapPair, OverlapResolutionStatus } from "@/lib/api/types";
import { CaseBridgeStore } from "@/lib/api/store";
import { SupabaseDataService } from "@/lib/supabase/dataService";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { formatDateTime } from "@/lib/utils";

export default function OverlapQueuePage() {
  const [overlaps, setOverlaps] = useState<OverlapPair[]>([]);
  const [activeTab, setActiveTab] = useState<OverlapResolutionStatus | "ALL">("PENDING_REVIEW");

  const loadData = () => {
    SupabaseDataService.getOverlaps().then((data) => {
      setOverlaps(data);
    });
  };

  useEffect(() => {
    CaseBridgeStore.init();
    loadData();
    window.addEventListener("casebridge_store_updated", loadData);
    return () => window.removeEventListener("casebridge_store_updated", loadData);
  }, []);

  const filteredOverlaps = overlaps.filter((o) => {
    if (activeTab === "ALL") return true;
    return o.status === activeTab;
  });

  const getStatusBadge = (status: OverlapResolutionStatus) => {
    switch (status) {
      case "PENDING_REVIEW":
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#FBF1DB] text-[#925C0B] border border-[#925C0B]/25">
            <span className="w-1.5 h-1.5 rounded-full bg-[#925C0B] animate-pulse" />
            <span>Coordination Required</span>
          </span>
        );
      case "CONFIRMED_LINKED":
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#EAF0F6] text-[#496785] border border-[#496785]/25">
            <CheckCircle2 className="w-3 h-3 text-[#496785]" />
            <span>Linked &amp; Synchronized</span>
          </span>
        );
      case "MERGED":
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#E8EEE7] text-[#344B3B] border border-[#344B3B]/25">
            <Scale className="w-3 h-3 text-[#344B3B]" />
            <span>Lead Joint Inquiry</span>
          </span>
        );
      case "REJECTED_DISTINCT":
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#F0F1ED] text-[#62665F] border border-[#E3E5DE]">
            <span>Marked Distinct</span>
          </span>
        );
      case "DEFERRED":
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#FBF1DB] text-[#925C0B] border border-[#925C0B]/25">
            <Clock className="w-3 h-3 text-[#925C0B]" />
            <span>Clarification Deferred</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E3E5DE]">
        <div>
          <Breadcrumbs items={[{ label: "Bureau Coordination Queue" }]} />
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#20231F] tracking-tight mt-1 flex items-center gap-2.5">
            <GitCompare className="w-6 h-6 text-[#344B3B]" />
            <span>Cross-Bureau Overlap Triage &amp; Alignment Queue</span>
          </h1>
          <p className="text-xs text-[#62665F] font-mono mt-1">
            Algorithmic candidate pairing preventing duplicate, contradictory, or uncoordinated proceedings across AICTE bureaus.
          </p>
        </div>
      </div>

      {/* Advisory Banner on Sovereign Human Judgment */}
      <div className="p-4 bg-white border-l-4 border-l-[#344B3B] border border-[#E3E5DE] rounded-xl shadow-xs">
        <div className="flex items-start gap-3.5">
          <ShieldCheck className="w-5 h-5 text-[#344B3B] shrink-0 mt-0.5" />
          <div className="text-xs text-[#20231F] space-y-1">
            <div className="font-bold text-[#20231F] font-sans">
              Human-in-the-Loop Sovereign Oversight Protocol
            </div>
            <p className="text-[#62665F] leading-relaxed font-sans">
              Sharing a Permanent Institute ID (PID) does <strong>not</strong> automatically merge complaints. CaseBridge AI computes lexical Jaccard tokens and entity correlation to present objective evidence. Authorized bureau officers retain sole decision-making authority to coordinate inquiries or declare them distinct.
            </p>
          </div>
        </div>
      </div>

      {/* Coordination Status Tabs */}
      <div className="flex flex-wrap border-b border-[#E3E5DE] space-x-1 text-xs font-mono">
        <button
          onClick={() => setActiveTab("PENDING_REVIEW")}
          className={`px-3.5 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "PENDING_REVIEW"
              ? "border-[#925C0B] text-[#925C0B] font-bold bg-[#FBF1DB]/40"
              : "border-transparent text-[#62665F] hover:text-[#20231F]"
          }`}
        >
          <span>Pending Coordination</span>
          <span className="bg-[#FBF1DB] text-[#925C0B] text-[10px] px-1.5 py-0.2 rounded-md font-bold border border-[#925C0B]/20">
            {overlaps.filter((o) => o.status === "PENDING_REVIEW").length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("CONFIRMED_LINKED")}
          className={`px-3.5 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "CONFIRMED_LINKED"
              ? "border-[#496785] text-[#496785] font-bold bg-[#EAF0F6]/40"
              : "border-transparent text-[#62665F] hover:text-[#20231F]"
          }`}
        >
          <span>Linked &amp; Synchronized</span>
          <span className="bg-[#EAF0F6] text-[#496785] text-[10px] px-1.5 py-0.2 rounded-md border border-[#496785]/20">
            {overlaps.filter((o) => o.status === "CONFIRMED_LINKED").length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("MERGED")}
          className={`px-3.5 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "MERGED"
              ? "border-[#344B3B] text-[#344B3B] font-bold bg-[#E8EEE7]"
              : "border-transparent text-[#62665F] hover:text-[#20231F]"
          }`}
        >
          <span>Lead Joint Inquiry</span>
          <span className="bg-[#E8EEE7] text-[#344B3B] text-[10px] px-1.5 py-0.2 rounded-md border border-[#344B3B]/20">
            {overlaps.filter((o) => o.status === "MERGED").length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("REJECTED_DISTINCT")}
          className={`px-3.5 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "REJECTED_DISTINCT"
              ? "border-[#20231F] text-[#20231F] font-bold bg-[#F0F1ED]"
              : "border-transparent text-[#62665F] hover:text-[#20231F]"
          }`}
        >
          <span>Marked Distinct</span>
          <span className="bg-[#F0F1ED] text-[#62665F] text-[10px] px-1.5 py-0.2 rounded-md border border-[#E3E5DE]">
            {overlaps.filter((o) => o.status === "REJECTED_DISTINCT").length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-3.5 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "ALL"
              ? "border-[#20231F] text-[#20231F] font-bold"
              : "border-transparent text-[#62665F] hover:text-[#20231F]"
          }`}
        >
          <span>All Pairs ({overlaps.length})</span>
        </button>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-xl border border-[#E3E5DE] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-[#F7F7F4] border-b border-[#E3E5DE] text-[#62665F] font-mono text-[11px]">
                <th className="py-3 px-4 font-semibold">Candidate Alert ID</th>
                <th className="py-3 px-4 font-semibold">Target College &amp; PID</th>
                <th className="py-3 px-4 font-semibold">Bureaus Involved</th>
                <th className="py-3 px-4 font-semibold">Correlation Score</th>
                <th className="py-3 px-4 font-semibold">Urgency</th>
                <th className="py-3 px-4 font-semibold">Detected At</th>
                <th className="py-3 px-4 font-semibold">Review State</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5DE] font-sans">
              {filteredOverlaps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#62665F] font-mono text-xs">
                    No records found in this queue category.
                  </td>
                </tr>
              ) : (
                filteredOverlaps.map((pair) => (
                  <tr key={pair.id} className="hover:bg-[#F7F7F4] transition-colors">
                    <td className="py-3 px-4 font-bold font-mono text-[#20231F]">
                      <Link
                        href={`/overlap-review/${pair.id}`}
                        className="text-[#344B3B] hover:underline"
                      >
                        {pair.id}
                      </Link>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-[#20231F] line-clamp-1">
                        {pair.institutionName}
                      </div>
                      <div className="text-[10px] text-[#62665F] font-mono mt-0.5">
                        Permanent ID: {pair.institutionId}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#20231F]">
                        <span className="font-semibold text-[#344B3B] px-1.5 py-0.5 rounded bg-[#E8EEE7] border border-[#344B3B]/20">
                          {pair.caseAId.split("/")[1]}
                        </span>
                        <span className="text-[#85877F]">&harr;</span>
                        <span className="font-semibold text-[#496785] px-1.5 py-0.5 rounded bg-[#EAF0F6] border border-[#496785]/20">
                          {pair.caseBId.split("/")[1]}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#85877F] font-mono mt-0.5 line-clamp-1">
                        {pair.caseAId} &bull; {pair.caseBId}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 bg-[#F0F1ED] rounded-full h-2 overflow-hidden border border-[#E3E5DE]">
                          <div
                            className={`h-full rounded-full ${
                              pair.similarityScore >= 90
                                ? "bg-[#B42332]"
                                : pair.similarityScore >= 80
                                ? "bg-[#925C0B]"
                                : "bg-[#344B3B]"
                            }`}
                            style={{ width: `${pair.similarityScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-[#20231F] font-mono text-[11px]">
                          {pair.similarityScore}%
                        </span>
                      </div>
                      <div className="text-[10px] text-[#62665F] font-mono mt-0.5">
                        {pair.rationale.commonKeywords.length} matching tokens
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <PriorityBadge priority={pair.urgency} />
                    </td>

                    <td className="py-3 px-4 text-[#62665F] font-mono text-[11px]">
                      {formatDateTime(pair.detectedAt)}
                    </td>

                    <td className="py-3 px-4">
                      {getStatusBadge(pair.status)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/overlap-review/${pair.id}`}
                        className="inline-flex items-center gap-1.5 bg-[#344B3B] hover:bg-[#293D30] text-white text-[11px] px-3 py-1.5 rounded-md font-semibold transition-colors shadow-xs font-mono"
                      >
                        <span>Inspect Pair</span>
                        <ArrowRight className="w-3 h-3" />
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
