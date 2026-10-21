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
} from "lucide-react";
import { OverlapPair, OverlapResolutionStatus } from "@/lib/api/types";
import { CaseBridgeStore } from "@/lib/api/store";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { formatDateTime } from "@/lib/utils";

export default function OverlapQueuePage() {
  const [overlaps, setOverlaps] = useState<OverlapPair[]>([]);
  const [activeTab, setActiveTab] = useState<OverlapResolutionStatus | "ALL">("PENDING_REVIEW");

  const loadData = () => {
    setOverlaps(CaseBridgeStore.getOverlaps());
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
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Coordination Required</span>
          </span>
        );
      case "CONFIRMED_LINKED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-300">
            <CheckCircle2 className="w-3 h-3 text-blue-600" />
            <span>Confirmed & Linked</span>
          </span>
        );
      case "MERGED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-300">
            <Scale className="w-3 h-3 text-purple-600" />
            <span>Merged into Lead Case</span>
          </span>
        );
      case "REJECTED_DISTINCT":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
            <span>Marked Distinct</span>
          </span>
        );
      case "DEFERRED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-orange-50 text-orange-800 border border-orange-200">
            <Clock className="w-3 h-3 text-orange-600" />
            <span>Clarification Deferred</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <Breadcrumbs items={[{ label: "Bureau Coordination Queue" }]} />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-700" />
            <span>Cross-Bureau Coordination & Overlap Triage Queue</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inter-departmental alignment desk to prevent conflicting or redundant proceedings across AICTE bureaus.
          </p>
        </div>
      </div>

      {/* Advisory Banner on Sovereign Human Judgment */}
      <div className="p-3.5 bg-white border-l-4 border-l-blue-700 border border-slate-200 rounded-md shadow-sm">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700 space-y-1">
            <div className="font-semibold text-slate-900">
              Human-in-the-Loop Regulatory Oversight Principle
            </div>
            <p className="text-slate-600 leading-relaxed">
              Multiple independent complaints regarding the same technical institution do <strong>not</strong> imply duplicate grievances. CaseBridge AI calculates textual similarity and entity matching as decision-support heuristics. Designated nodal officers must evaluate each case side-by-side to either coordinate proceedings, establish a lead investigation, or record them as distinct inquiries.
            </p>
          </div>
        </div>
      </div>

      {/* Coordination Status Tabs */}
      <div className="flex border-b border-slate-200 space-x-1 text-xs">
        <button
          onClick={() => setActiveTab("PENDING_REVIEW")}
          className={`px-3 py-2 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "PENDING_REVIEW"
              ? "border-amber-600 text-amber-900 font-semibold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>Pending Coordination</span>
          <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
            {overlaps.filter((o) => o.status === "PENDING_REVIEW").length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("CONFIRMED_LINKED")}
          className={`px-3 py-2 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "CONFIRMED_LINKED"
              ? "border-blue-700 text-blue-900 font-semibold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>Linked & Synchronized</span>
          <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.2 rounded">
            {overlaps.filter((o) => o.status === "CONFIRMED_LINKED").length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("MERGED")}
          className={`px-3 py-2 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "MERGED"
              ? "border-purple-700 text-purple-900 font-semibold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>Merged Investigations</span>
          <span className="bg-purple-100 text-purple-800 text-[10px] px-1.5 py-0.2 rounded">
            {overlaps.filter((o) => o.status === "MERGED").length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("REJECTED_DISTINCT")}
          className={`px-3 py-2 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "REJECTED_DISTINCT"
              ? "border-slate-800 text-slate-900 font-semibold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>Marked Distinct (False Positive)</span>
          <span className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.2 rounded">
            {overlaps.filter((o) => o.status === "REJECTED_DISTINCT").length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-3 py-2 font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
            activeTab === "ALL"
              ? "border-slate-800 text-slate-900 font-semibold"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>All Overlap Records ({overlaps.length})</span>
        </button>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-4">Alert ID</th>
                <th className="py-2.5 px-4">Institution Name & AICTE ID</th>
                <th className="py-2.5 px-4">Bureaus Involved</th>
                <th className="py-2.5 px-4">Similarity Match</th>
                <th className="py-2.5 px-4">Urgency</th>
                <th className="py-2.5 px-4">Detected At</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOverlaps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    No records found in this queue category.
                  </td>
                </tr>
              ) : (
                filteredOverlaps.map((pair) => (
                  <tr key={pair.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <Link
                        href={`/overlap-review/${pair.id}`}
                        className="text-blue-700 hover:underline font-mono"
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
                      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-800">
                        <span className="font-semibold text-blue-900">{pair.caseAId.split("/")[1]}</span>
                        <span className="text-slate-400">&harr;</span>
                        <span className="font-semibold text-indigo-900">{pair.caseBId.split("/")[1]}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                        {pair.caseAId} & {pair.caseBId}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
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
                        <span className="font-semibold text-slate-800 font-mono text-[11px]">
                          {pair.similarityScore}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {pair.rationale.commonKeywords.length} shared terms
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
                        className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-[11px] px-2.5 py-1 rounded font-semibold transition-colors shadow-sm"
                      >
                        <span>Open Workspace</span>
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
