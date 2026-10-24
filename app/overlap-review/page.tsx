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
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-900 border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Coordination Required</span>
          </span>
        );
      case "CONFIRMED_LINKED":
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-900 border border-blue-500/30">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            <span>Linked &amp; Synchronized</span>
          </span>
        );
      case "MERGED":
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-900 border border-purple-500/30">
            <Scale className="w-3 h-3 text-purple-600" />
            <span>Lead Investigation</span>
          </span>
        );
      case "REJECTED_DISTINCT":
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-300">
            <span>Marked Distinct</span>
          </span>
        );
      case "DEFERRED":
        return (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-orange-50 text-orange-900 border border-orange-200">
            <Clock className="w-3 h-3 text-orange-600" />
            <span>Clarification Deferred</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200/90">
        <div>
          <Breadcrumbs items={[{ label: "Bureau Coordination Queue" }]} />
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#08121E] tracking-tight font-sans mt-0.5 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-[#1769AA]" />
            <span>Cross-Bureau Overlap Triage &amp; Alignment Queue</span>
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Algorithmic candidate pairing preventing duplicate, contradictory, or uncoordinated proceedings across AICTE bureaus.
          </p>
        </div>
      </div>

      {/* Advisory Banner on Sovereign Human Judgment */}
      <div className="p-4 bg-white border-l-4 border-l-[#1769AA] border border-slate-200/90 rounded-xl shadow-xs">
        <div className="flex items-start gap-3.5">
          <ShieldCheck className="w-5 h-5 text-[#1769AA] shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 space-y-1">
            <div className="font-bold text-slate-900 font-sans">
              Human-in-the-Loop Sovereign Oversight Protocol
            </div>
            <p className="text-slate-600 leading-relaxed font-sans">
              Sharing a Permanent Institute ID (PID) does <strong>not</strong> automatically merge complaints. CaseBridge AI computes lexical Jaccard tokens and entity correlation to present objective evidence. Authorized bureau officers retain sole decision-making authority to coordinate inquiries or declare them distinct.
            </p>
          </div>
        </div>
      </div>

      {/* Coordination Status Tabs */}
      <div className="flex flex-wrap border-b border-slate-200/90 space-x-1 text-xs font-mono">
        <button
          onClick={() => setActiveTab("PENDING_REVIEW")}
          className={`px-3.5 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "PENDING_REVIEW"
              ? "border-amber-600 text-amber-900 font-bold bg-amber-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>Pending Coordination</span>
          <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.2 rounded-md font-bold">
            {overlaps.filter((o) => o.status === "PENDING_REVIEW").length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("CONFIRMED_LINKED")}
          className={`px-3.5 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "CONFIRMED_LINKED"
              ? "border-[#1769AA] text-blue-900 font-bold bg-blue-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>Linked &amp; Synchronized</span>
          <span className="bg-blue-100 text-blue-900 text-[10px] px-1.5 py-0.2 rounded-md">
            {overlaps.filter((o) => o.status === "CONFIRMED_LINKED").length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("MERGED")}
          className={`px-3.5 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "MERGED"
              ? "border-purple-700 text-purple-900 font-bold bg-purple-50/50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>Lead Joint Inquiry</span>
          <span className="bg-purple-100 text-purple-900 text-[10px] px-1.5 py-0.2 rounded-md">
            {overlaps.filter((o) => o.status === "MERGED").length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("REJECTED_DISTINCT")}
          className={`px-3.5 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "REJECTED_DISTINCT"
              ? "border-slate-800 text-slate-900 font-bold bg-slate-100/50"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>Marked Distinct</span>
          <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.2 rounded-md">
            {overlaps.filter((o) => o.status === "REJECTED_DISTINCT").length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-3.5 py-2.5 font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "ALL"
              ? "border-slate-800 text-slate-900 font-bold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>All Pairs ({overlaps.length})</span>
        </button>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-slate-100/70 border-b border-slate-200/80 text-slate-600 font-mono text-[11px]">
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
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredOverlaps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-mono text-xs">
                    No records found in this queue category.
                  </td>
                </tr>
              ) : (
                filteredOverlaps.map((pair) => (
                  <tr key={pair.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold font-mono text-slate-900">
                      <Link
                        href={`/overlap-review/${pair.id}`}
                        className="text-[#1769AA] hover:underline"
                      >
                        {pair.id}
                      </Link>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-900 line-clamp-1">
                        {pair.institutionName}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        Permanent ID: {pair.institutionId}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-800">
                        <span className="font-semibold text-blue-900 px-1 py-0.2 rounded bg-blue-50 border border-blue-200">
                          {pair.caseAId.split("/")[1]}
                        </span>
                        <span className="text-slate-400">&harr;</span>
                        <span className="font-semibold text-indigo-900 px-1 py-0.2 rounded bg-indigo-50 border border-indigo-200">
                          {pair.caseBId.split("/")[1]}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5 line-clamp-1">
                        {pair.caseAId} &bull; {pair.caseBId}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full ${
                              pair.similarityScore >= 90
                                ? "bg-rose-600"
                                : pair.similarityScore >= 80
                                ? "bg-amber-500"
                                : "bg-blue-600"
                            }`}
                            style={{ width: `${pair.similarityScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-900 font-mono text-[11px]">
                          {pair.similarityScore}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {pair.rationale.commonKeywords.length} matching tokens
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <PriorityBadge priority={pair.urgency} />
                    </td>

                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {formatDateTime(pair.detectedAt)}
                    </td>

                    <td className="py-3 px-4">
                      {getStatusBadge(pair.status)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/overlap-review/${pair.id}`}
                        className="inline-flex items-center gap-1.5 bg-[#1769AA] hover:bg-[#1C7DD1] text-white text-[11px] px-3 py-1.5 rounded-md font-semibold transition-colors shadow-xs font-mono"
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
