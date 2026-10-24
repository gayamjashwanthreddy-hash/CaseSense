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
  ShieldCheck,
  Zap,
  ArrowRight,
  Info,
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

  // Resilient fallback resolution
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
        <mark key={i} className="bg-amber-200/80 text-amber-950 font-semibold px-1 py-0.5 rounded shadow-sm">
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
      message: `Overlap status updated to ${activeModalAction.replace("_", " ")}. Audit log committed.`,
      type: "success",
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Workspace Header - Dark Editorial Strip */}
      <div className="bg-[#0A1626] text-white p-6 rounded-2xl border border-[#142C46] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#142C46]/80">
          <div>
            <Breadcrumbs
              items={[
                { label: "Bureau Coordination Queue", href: "/overlap-review" },
                { label: `Pair ${pair.id}` },
              ]}
            />
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
                {pair.id}
              </h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-mono font-bold">
                <Zap className="w-3.5 h-3.5 text-blue-400" />
                <span>AI Confidence: {pair.similarityScore}%</span>
              </div>
              <PriorityBadge priority={pair.urgency} />
              <StatusBadge status={pair.status} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/overlap-review"
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white border border-[#243B55] bg-[#0D1C2E] hover:bg-[#142C46] px-3.5 py-2 rounded-xl transition-colors font-medium shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Queue</span>
            </Link>
          </div>
        </div>

        {/* Target Institution Identification Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0D1C2E] p-4 rounded-xl border border-[#1E3A5F] text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm tracking-tight">{pair.institutionName}</div>
              <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-0.5 flex-wrap">
                <span>Permanent ID: <strong className="font-mono text-slate-200">{pair.institutionId}</strong></span>
                <span>&bull;</span>
                <span>Region: <strong className="text-slate-200">{caseA.institutionRegion}</strong></span>
                <span>&bull;</span>
                <span>Affiliation: <strong className="text-slate-200">{caseA.institutionState}</strong></span>
              </div>
            </div>
          </div>

          <Link
            href={`/institutions/${pair.institutionId}`}
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 transition-colors"
          >
            <span>View Institution 360° Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Explainable AI Similarity Rationale Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Explainable Multi-Vector Similarity Assessment
              </h2>
              <p className="text-[11px] text-slate-500">
                Transparent feature contributions computed across structured entity identifiers and semantic vector spaces.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
            Detected: {formatDateTime(pair.detectedAt)}
          </span>
        </div>

        {/* AI Rationale Summary Note */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans">
          <strong className="text-slate-900 font-semibold block mb-1">Correlation Rationale:</strong>
          {pair.rationale.reasonDescription}
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
          {/* Matched Entities */}
          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Entity Identifier Matches</span>
              <span className="text-emerald-700 font-mono font-bold">100% Deterministic</span>
            </div>
            <ul className="space-y-1 text-slate-700 font-mono text-[11px]">
              {pair.rationale.entityMatches.map((m: string, idx: number) => (
                <li key={idx} className="flex items-center gap-1.5 truncate" title={m}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Shared Subject Matter Keywords */}
          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
              <span>Semantic Keywords</span>
              <span className="text-blue-700 font-mono font-bold">{pair.rationale.semanticSubjectSimilarity}% Vector Match</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pair.rationale.commonKeywords.map((kw: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-amber-100 text-amber-950 border border-amber-300 px-2 py-0.5 rounded-md text-[10px] font-semibold"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Overlapping Regulatory Norms */}
          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 space-y-2">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Statutory Norms Cited
            </div>
            <ul className="space-y-1 text-slate-700 text-[11px]">
              {pair.rationale.regulatoryClauses.map((clause: string, idx: number) => (
                <li key={idx} className="flex items-center gap-1.5 truncate" title={clause}>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span className="truncate">{clause}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Dual Pane Side-by-Side Comparison (Desktop) / Stacked (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Pane: Case A */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-600 text-white tracking-wider">
                PRIMARY CASE A
              </span>
              <BureauBadge bureau={caseA.bureau} />
            </div>
            <StatusBadge status={caseA.status} />
          </div>

          <div className="p-5 flex-1 space-y-4 text-xs bg-[#F8FAFC]">
            {/* Header / ID */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <Link
                  href={`/cases/${encodeURIComponent(caseA.id)}`}
                  className="text-base font-bold text-blue-700 hover:underline font-mono"
                >
                  {caseA.id}
                </Link>
                <span className="text-slate-500 font-mono text-[11px]">
                  Recd: {formatDate(caseA.receivedDate)}
                </span>
              </div>
              <div className="text-slate-900 font-semibold mt-1 text-xs">
                {caseA.subject}
              </div>
            </div>

            {/* Allegation with Highlighted Diff */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Allegation Statement (Highlighted Matching Context)
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 leading-relaxed text-slate-800">
                {highlightKeywords(caseA.description, pair.rationale.commonKeywords)}
              </div>
            </div>

            {/* Complainant & Officer Grid */}
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Complainant</span>
                <span className="font-semibold text-slate-900 block mt-0.5">{caseA.complainantName}</span>
                <span className="text-slate-500 block text-[10px]">({caseA.complainantType})</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Assigned Officer</span>
                <span className="font-semibold text-slate-900 block mt-0.5">{caseA.assignedOfficer}</span>
                <span className="text-slate-500 block text-[10px]">{caseA.assignedOfficerRole}</span>
              </div>
            </div>

            {/* Statutory SLA */}
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-[11px]">
              <span className="text-slate-500 font-medium">Statutory SLA Deadline:</span>
              <span className="font-bold text-slate-900 font-mono">
                {formatDate(caseA.slaDeadline)} ({caseA.daysOpen} days open)
              </span>
            </div>

            {/* Last Action */}
            <div className="p-3 bg-slate-100 rounded-xl text-slate-700 text-[11px] border border-slate-200/80">
              <span className="font-bold text-slate-900 block text-[10px] uppercase tracking-wider">Last Bureau Action:</span>
              <span className="mt-0.5 block">{caseA.lastActionSummary}</span>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-white text-right">
            <Link
              href={`/cases/${encodeURIComponent(caseA.id)}`}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold inline-flex items-center gap-1.5"
            >
              <span>Inspect Full Case Dossier A</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Pane: Case B */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-600 text-white tracking-wider">
                CORRELATED CASE B
              </span>
              <BureauBadge bureau={caseB.bureau} />
            </div>
            <StatusBadge status={caseB.status} />
          </div>

          <div className="p-5 flex-1 space-y-4 text-xs bg-[#F8FAFC]">
            {/* Header / ID */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <Link
                  href={`/cases/${encodeURIComponent(caseB.id)}`}
                  className="text-base font-bold text-indigo-700 hover:underline font-mono"
                >
                  {caseB.id}
                </Link>
                <span className="text-slate-500 font-mono text-[11px]">
                  Recd: {formatDate(caseB.receivedDate)}
                </span>
              </div>
              <div className="text-slate-900 font-semibold mt-1 text-xs">
                {caseB.subject}
              </div>
            </div>

            {/* Allegation with Highlighted Diff */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Allegation Statement (Highlighted Matching Context)
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/80 leading-relaxed text-slate-800">
                {highlightKeywords(caseB.description, pair.rationale.commonKeywords)}
              </div>
            </div>

            {/* Complainant & Officer Grid */}
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Complainant</span>
                <span className="font-semibold text-slate-900 block mt-0.5">{caseB.complainantName}</span>
                <span className="text-slate-500 block text-[10px]">({caseB.complainantType})</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-slate-400 block text-[10px] font-bold uppercase">Assigned Officer</span>
                <span className="font-semibold text-slate-900 block mt-0.5">{caseB.assignedOfficer}</span>
                <span className="text-slate-500 block text-[10px]">{caseB.assignedOfficerRole}</span>
              </div>
            </div>

            {/* Statutory SLA */}
            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-[11px]">
              <span className="text-slate-500 font-medium">Statutory SLA Deadline:</span>
              <span className="font-bold text-slate-900 font-mono">
                {formatDate(caseB.slaDeadline)} ({caseB.daysOpen} days open)
              </span>
            </div>

            {/* Last Action */}
            <div className="p-3 bg-slate-100 rounded-xl text-slate-700 text-[11px] border border-slate-200/80">
              <span className="font-bold text-slate-900 block text-[10px] uppercase tracking-wider">Last Bureau Action:</span>
              <span className="mt-0.5 block">{caseB.lastActionSummary}</span>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-white text-right">
            <Link
              href={`/cases/${encodeURIComponent(caseB.id)}`}
              className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold inline-flex items-center gap-1.5"
            >
              <span>Inspect Full Case Dossier B</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Reviewer Action Center (Human-in-the-Loop Sovereign Decision) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Sovereign Reviewer Action Desk</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Current Coordination Status:{" "}
              <strong className="text-slate-900 font-mono font-semibold">{pair.status.replace("_", " ")}</strong>
              {pair.reviewedBy && ` &bull; Adjudicated by ${pair.reviewedBy}`}
            </p>
          </div>

          {pair.reviewerNotes && (
            <div className="text-xs text-slate-700 max-w-md bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 block text-[10px] uppercase tracking-wider">
                Prior Reviewer Justification:
              </span>
              <span className="mt-0.5 block">{pair.reviewerNotes}</span>
            </div>
          )}
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Action 1: Confirm & Link */}
          <button
            onClick={() => setActiveModalAction("CONFIRMED_LINKED")}
            className="flex flex-col items-start p-4 rounded-xl border border-blue-600 bg-blue-50/50 hover:bg-blue-100/60 text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-blue-700 font-bold text-xs mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Link Bureaus</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Cross-reference both files. Both bureaus proceed with unified evidentiary notices.
            </p>
          </button>

          {/* Action 2: Designate Lead & Merge */}
          <button
            onClick={() => setActiveModalAction("MERGED")}
            className="flex flex-col items-start p-4 rounded-xl border border-purple-600 bg-purple-50/50 hover:bg-purple-100/60 text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-purple-700 font-bold text-xs mb-1">
              <Scale className="w-4 h-4" />
              <span>Consolidate Under Lead</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">
              Elect single lead bureau. The secondary case is linked under the lead investigation.
            </p>
          </button>

          {/* Action 3: Dismiss as Distinct */}
          <button
            onClick={() => setActiveModalAction("REJECTED_DISTINCT")}
            className="flex flex-col items-start p-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs mb-1">
              <XCircle className="w-4 h-4 text-slate-500" />
              <span>Mark as Distinct</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Acknowledge match as coincidental or unrelated. Cases remain independent.
            </p>
          </button>

          {/* Action 4: Defer */}
          <button
            onClick={() => setActiveModalAction("DEFERRED")}
            className="flex flex-col items-start p-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs mb-1">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Defer for Evidence</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Hold adjudication pending institution counter-affidavits or bureau inquiries.
            </p>
          </button>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {activeModalAction && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Confirm Official Regulatory Action
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Adjudication:{" "}
                <strong className="text-blue-700 font-semibold font-mono">
                  {activeModalAction.replace("_", " ")}
                </strong>{" "}
                on Pair <strong className="font-mono text-slate-800">{pair.id}</strong>
              </p>
            </div>

            {/* If Merging, pick Lead Bureau */}
            {activeModalAction === "MERGED" && (
              <div className="space-y-1.5 text-xs bg-purple-50/60 p-3.5 rounded-xl border border-purple-200">
                <label className="font-bold text-purple-900 block">
                  Select Lead Investigating Bureau:
                </label>
                <select
                  value={selectedLeadBureau}
                  onChange={(e) => setSelectedLeadBureau(e.target.value as BureauType)}
                  className="w-full bg-white border border-purple-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value={caseA.bureau}>Primary Bureau: {caseA.bureau}</option>
                  <option value={caseB.bureau}>Correlated Bureau: {caseB.bureau}</option>
                </select>
                <p className="text-[11px] text-purple-800/80 leading-relaxed">
                  The secondary complaint will be linked as a referenced proceedings sub-record under the lead bureau.
                </p>
              </div>
            )}

            {/* Official Rationale Field */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-800 block">
                Official Regulatory Rationale / Reviewer Justification:
              </label>
              <textarea
                rows={4}
                value={reviewerJustification}
                onChange={(e) => setReviewerJustification(e.target.value)}
                placeholder="State the statutory grounds, inter-bureau consultation details, or evidence rationale for this decision..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-slate-400 font-sans"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-200 leading-relaxed">
              Decision will be cryptographically attributed to{" "}
              <strong>{currentUser.name}</strong> ({currentUser.designation}) and permanently appended to the AICTE Governance Audit Trail.
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setActiveModalAction(null);
                  setReviewerJustification("");
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteResolution}
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-sm transition-colors"
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
