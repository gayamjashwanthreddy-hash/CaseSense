"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  GitCompare,
  Building2,
  AlertTriangle,
  Scale,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  FileText,
  Calendar,
  User,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Send,
  History,
} from "lucide-react";
import {
  OverlapPair,
  ComplaintCase,
  OverlapResolutionStatus,
  BureauType,
} from "@/lib/api/types";
import { CaseBridgeStore } from "@/lib/api/store";
import { SupabaseDataService } from "@/lib/supabase/dataService";
import { SEED_OVERLAPS, SEED_CASES } from "@/lib/api/seedData";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BureauBadge } from "@/components/shared/BureauBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { formatDate, formatDateTime } from "@/lib/utils";
import { useRole } from "@/lib/context/RoleContext";
import { useToast } from "@/lib/context/ToastContext";

export default function OverlapReviewWorkspacePage({
  params,
}: {
  params: { pairId: string };
}) {
  const router = useRouter();
  const clientParams = useParams();
  const pairId = (params?.pairId || clientParams?.pairId) as string;
  console.log("RENDER pairId:", pairId, "params:", params, "clientParams:", clientParams);
  const { currentUser } = useRole();
  const { toast } = useToast();

  const [pairState, setPairState] = useState<OverlapPair | null>(null);
  const [caseAState, setCaseAState] = useState<ComplaintCase | null>(null);
  const [caseBState, setCaseBState] = useState<ComplaintCase | null>(null);

  // Action Dialog State
  const [activeModalAction, setActiveModalAction] = useState<OverlapResolutionStatus | null>(null);
  const [reviewerJustification, setReviewerJustification] = useState("");
  const [selectedLeadBureau, setSelectedLeadBureau] = useState<BureauType>("REGULATION");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = () => {
    if (pairId) {
      SupabaseDataService.getOverlapById(pairId).then((p) => {
        if (p) {
          setPairState(p);
          SupabaseDataService.getCaseById(p.caseAId).then((cA) => setCaseAState(cA || null));
          SupabaseDataService.getCaseById(p.caseBId).then((cB) => setCaseBState(cB || null));
          if (p.leadBureau) setSelectedLeadBureau(p.leadBureau);
        }
      });
    }
  };

  useEffect(() => {
    CaseBridgeStore.init();
    loadData();
    window.addEventListener("casebridge_store_updated", loadData);
    return () => window.removeEventListener("casebridge_store_updated", loadData);
  }, [pairId]);

  // Resilient resolution for immediate SSR and client hydration
  const resolvedPair = pairState || (pairId ? CaseBridgeStore.getOverlapById(pairId) : null) || SEED_OVERLAPS[0];
  const resolvedCaseA = caseAState || (resolvedPair ? CaseBridgeStore.getCaseById(resolvedPair.caseAId) : null) || SEED_CASES[0];
  const resolvedCaseB = caseBState || (resolvedPair ? CaseBridgeStore.getCaseById(resolvedPair.caseBId) : null) || SEED_CASES[1];

  const pair = resolvedPair;
  const caseA = resolvedCaseA;
  const caseB = resolvedCaseB;

  // Highlight shared keywords in allegation text
  const highlightKeywords = (text: string, keywords: string[]) => {
    if (!keywords || keywords.length === 0) return text;
    const regex = new RegExp(`(${keywords.join("|")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      keywords.some((k) => k.toLowerCase() === part.toLowerCase()) ? (
        <mark key={i} className="bg-amber-100 text-amber-950 px-1 py-0.5 rounded font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const handleExecuteResolution = async () => {
    if (!activeModalAction) return;
    if (!reviewerJustification.trim()) {
      alert("Please provide official reviewer rationale for administrative records.");
      return;
    }

    setIsSubmitting(true);
    await SupabaseDataService.resolveOverlap(
      pair.id,
      activeModalAction,
      reviewerJustification.trim(),
      activeModalAction === "MERGED" ? selectedLeadBureau : (pair.leadBureau || "REGULATION")
    );

    setIsSubmitting(false);
    setActiveModalAction(null);
    setReviewerJustification("");

    toast({
      title: "Coordination Action Recorded",
      message: `Overlap status set to ${activeModalAction.replace("_", " ")}. Audit log updated.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <Breadcrumbs
              items={[
                { label: "Bureau Coordination", href: "/overlap-review" },
                { label: `Review Workspace: ${pair.id}` },
              ]}
            />
            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight font-mono">
                {pair.id}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-800 border border-slate-300">
                AI Match Score: {pair.similarityScore}%
              </span>
              <PriorityBadge priority={pair.urgency} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/overlap-review"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 rounded transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Queue</span>
            </Link>
          </div>
        </div>

        {/* Target Institution Identification Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-3 rounded border border-slate-200 text-xs">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-4 h-4 text-slate-500 shrink-0" />
            <div>
              <div className="font-semibold text-slate-900">{pair.institutionName}</div>
              <div className="text-[11px] text-slate-500 flex items-center gap-3">
                <span>AICTE Permanent ID: <strong className="font-mono text-slate-700">{pair.institutionId}</strong></span>
                <span>Region: <strong className="text-slate-700">{caseA.institutionRegion}</strong></span>
                <span>Affiliation: <strong className="text-slate-700">{caseA.institutionState}</strong></span>
              </div>
            </div>
          </div>

          <Link
            href={`/institutions/${pair.institutionId}`}
            className="text-xs font-medium text-blue-700 hover:underline flex items-center gap-1"
          >
            <span>View Full Institution 360° Profile</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Explainable AI Similarity Rationale Bar */}
      <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-700" />
            <h2 className="text-sm font-bold text-slate-900">
              Explainable Similarity Assessment & Rationale
            </h2>
          </div>
          <span className="text-[11px] text-slate-500">
            Detected: {formatDateTime(pair.detectedAt)}
          </span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
          {pair.rationale.reasonDescription}
        </p>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
          {/* Matched Entities */}
          <div className="p-3 bg-white rounded border border-slate-200 space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Entity Overlap (100% Match)
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 font-mono text-[11px]">
              {pair.rationale.entityMatches.map((m: string, idx: number) => (
                <li key={idx} className="truncate" title={m}>
                  {m}
                </li>
              ))}
            </ul>
          </div>

          {/* Shared Subject Matter Keywords */}
          <div className="p-3 bg-white rounded border border-slate-200 space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Shared Subject Keywords ({pair.rationale.semanticSubjectSimilarity}% Similarity)
            </div>
            <div className="flex flex-wrap gap-1">
              {pair.rationale.commonKeywords.map((kw: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Overlapping Regulatory Norms */}
          <div className="p-3 bg-white rounded border border-slate-200 space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              AICTE Regulatory Handbooks Cited
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-slate-700 text-[11px]">
              {pair.rationale.regulatoryClauses.map((clause: string, idx: number) => (
                <li key={idx} className="truncate" title={clause}>
                  {clause}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Dual Pane Side-by-Side Comparison (Desktop) / Stacked (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Pane: Case A */}
        <div className="bg-white rounded-md border border-slate-200 shadow-sm flex flex-col">
          <div className="p-3.5 bg-blue-50/50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-700 text-white">
                CASE A
              </span>
              <BureauBadge bureau={caseA.bureau} />
            </div>
            <StatusBadge status={caseA.status} />
          </div>

          <div className="p-4 flex-1 space-y-4 text-xs">
            {/* Header / ID */}
            <div>
              <div className="flex items-center justify-between">
                <Link
                  href={`/cases/${encodeURIComponent(caseA.id)}`}
                  className="text-sm font-bold text-blue-700 hover:underline font-mono"
                >
                  {caseA.id}
                </Link>
                <span className="text-slate-500 font-mono text-[11px]">
                  Recd: {formatDate(caseA.receivedDate)}
                </span>
              </div>
              <div className="text-slate-800 font-semibold mt-1 text-xs">
                {caseA.subject}
              </div>
            </div>

            {/* Allegation with Highlighted Diff */}
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1">
                Allegation Statement (Highlighted Matching Context)
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 leading-relaxed text-slate-800">
                {highlightKeywords(caseA.description, pair.rationale.commonKeywords)}
              </div>
            </div>

            {/* Complainant & Officer Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Complainant:</span>
                <span className="font-semibold text-slate-800">{caseA.complainantName}</span>
                <span className="text-slate-500 block">({caseA.complainantType})</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Investigating Officer:</span>
                <span className="font-semibold text-slate-800">{caseA.assignedOfficer}</span>
                <span className="text-slate-500 block">{caseA.assignedOfficerRole}</span>
              </div>
            </div>

            {/* Statutory SLA */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px]">
              <span className="text-slate-500">Statutory SLA Deadline:</span>
              <span className="font-bold text-slate-800">
                {formatDate(caseA.slaDeadline)} ({caseA.daysOpen} days open)
              </span>
            </div>

            {/* Last Action */}
            <div className="p-2.5 bg-slate-100 rounded text-slate-700 text-[11px]">
              <span className="font-semibold text-slate-900 block text-[10px]">Last Bureau Action:</span>
              <span>{caseA.lastActionSummary}</span>
            </div>
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50 text-right">
            <Link
              href={`/cases/${encodeURIComponent(caseA.id)}`}
              className="text-xs text-blue-700 hover:underline font-medium inline-flex items-center gap-1"
            >
              <span>Inspect Full Case Dossier A</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Right Pane: Case B */}
        <div className="bg-white rounded-md border border-slate-200 shadow-sm flex flex-col">
          <div className="p-3.5 bg-indigo-50/50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-700 text-white">
                CASE B
              </span>
              <BureauBadge bureau={caseB.bureau} />
            </div>
            <StatusBadge status={caseB.status} />
          </div>

          <div className="p-4 flex-1 space-y-4 text-xs">
            {/* Header / ID */}
            <div>
              <div className="flex items-center justify-between">
                <Link
                  href={`/cases/${encodeURIComponent(caseB.id)}`}
                  className="text-sm font-bold text-indigo-700 hover:underline font-mono"
                >
                  {caseB.id}
                </Link>
                <span className="text-slate-500 font-mono text-[11px]">
                  Recd: {formatDate(caseB.receivedDate)}
                </span>
              </div>
              <div className="text-slate-800 font-semibold mt-1 text-xs">
                {caseB.subject}
              </div>
            </div>

            {/* Allegation with Highlighted Diff */}
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase mb-1">
                Allegation Statement (Highlighted Matching Context)
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 leading-relaxed text-slate-800">
                {highlightKeywords(caseB.description, pair.rationale.commonKeywords)}
              </div>
            </div>

            {/* Complainant & Officer Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Complainant:</span>
                <span className="font-semibold text-slate-800">{caseB.complainantName}</span>
                <span className="text-slate-500 block">({caseB.complainantType})</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Investigating Officer:</span>
                <span className="font-semibold text-slate-800">{caseB.assignedOfficer}</span>
                <span className="text-slate-500 block">{caseB.assignedOfficerRole}</span>
              </div>
            </div>

            {/* Statutory SLA */}
            <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px]">
              <span className="text-slate-500">Statutory SLA Deadline:</span>
              <span className="font-bold text-slate-800">
                {formatDate(caseB.slaDeadline)} ({caseB.daysOpen} days open)
              </span>
            </div>

            {/* Last Action */}
            <div className="p-2.5 bg-slate-100 rounded text-slate-700 text-[11px]">
              <span className="font-semibold text-slate-900 block text-[10px]">Last Bureau Action:</span>
              <span>{caseB.lastActionSummary}</span>
            </div>
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50 text-right">
            <Link
              href={`/cases/${encodeURIComponent(caseB.id)}`}
              className="text-xs text-indigo-700 hover:underline font-medium inline-flex items-center gap-1"
            >
              <span>Inspect Full Case Dossier B</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Reviewer Action Center (Human-in-the-Loop Sovereign Decision) */}
      <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Official Reviewer Action Desk</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Current Status:{" "}
              <strong className="text-slate-900">{pair.status.replace("_", " ")}</strong>
              {pair.reviewedBy && ` &bull; Adjudicated by ${pair.reviewedBy}`}
            </p>
          </div>

          {pair.reviewerNotes && (
            <div className="text-xs text-slate-600 max-w-md bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="font-semibold text-slate-800 block text-[10px] uppercase">
                Prior Reviewer Justification:
              </span>
              <span>{pair.reviewerNotes}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Action 1: Confirm & Link */}
          <button
            onClick={() => setActiveModalAction("CONFIRMED_LINKED")}
            className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3.5 py-2 rounded-md shadow-sm transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Overlap & Link Bureaus</span>
          </button>

          {/* Action 2: Designate Lead & Merge */}
          <button
            onClick={() => setActiveModalAction("MERGED")}
            className="inline-flex items-center gap-1.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold px-3.5 py-2 rounded-md shadow-sm transition-colors"
          >
            <Scale className="w-4 h-4" />
            <span>Designate Lead Bureau & Merge Case</span>
          </button>

          {/* Action 3: Dismiss as Distinct */}
          <button
            onClick={() => setActiveModalAction("REJECTED_DISTINCT")}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold px-3.5 py-2 rounded-md shadow-sm transition-colors"
          >
            <XCircle className="w-4 h-4 text-slate-500" />
            <span>Mark as Distinct (False Positive)</span>
          </button>

          {/* Action 4: Defer */}
          <button
            onClick={() => setActiveModalAction("DEFERRED")}
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium px-3.5 py-2 rounded-md transition-colors"
          >
            <Clock className="w-4 h-4 text-slate-500" />
            <span>Defer for Clarification</span>
          </button>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {activeModalAction && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-lg w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Confirm Official Regulatory Action
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Action:{" "}
                <strong className="text-blue-700 font-semibold">
                  {activeModalAction.replace("_", " ")}
                </strong>{" "}
                on Pair <strong className="font-mono">{pair.id}</strong>
              </p>
            </div>

            {/* If Merging, pick Lead Bureau */}
            {activeModalAction === "MERGED" && (
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-slate-800">
                  Select Lead Investigating Bureau:
                </label>
                <select
                  value={selectedLeadBureau}
                  onChange={(e) => setSelectedLeadBureau(e.target.value as BureauType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value={caseA.bureau}>Case A Bureau: {caseA.bureau}</option>
                  <option value={caseB.bureau}>Case B Bureau: {caseB.bureau}</option>
                </select>
                <p className="text-[11px] text-slate-500">
                  The secondary complaint will be archived as a linked cross-reference under the lead bureau.
                </p>
              </div>
            )}

            {/* Official Rationale Field */}
            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-800">
                Mandatory Administrative Justification / Rationale:
              </label>
              <textarea
                rows={3}
                value={reviewerJustification}
                onChange={(e) => setReviewerJustification(e.target.value)}
                placeholder="State the regulatory grounds, bureau discussion notes, or reasons for this decision..."
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-400"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded text-[11px] text-slate-600 border border-slate-200">
              Action will be stamped under{" "}
              <strong>{currentUser.name}</strong> ({currentUser.designation}) and permanently appended to the AICTE Governance Audit Trail.
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setActiveModalAction(null);
                  setReviewerJustification("");
                }}
                disabled={isSubmitting}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteResolution}
                disabled={isSubmitting}
                className="px-4 py-1.5 text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded shadow-sm transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Confirm & Commit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
