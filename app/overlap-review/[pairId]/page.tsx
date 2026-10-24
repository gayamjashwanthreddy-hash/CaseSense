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
        <mark key={i} className="bg-[#FBF1DB] text-[#925C0B] font-semibold px-1 py-0.5 rounded border border-[#925C0B]/30">
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
      {/* Workspace Header */}
      <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E3E5DE]">
          <div>
            <Breadcrumbs
              items={[
                { label: "Bureau Coordination Queue", href: "/overlap-review" },
                { label: `Pair ${pair.id}` },
              ]}
            />
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#20231F] tracking-tight font-mono">
                {pair.id}
              </h1>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF1DB] text-[#925C0B] border border-[#925C0B]/25 text-xs font-mono font-bold">
                <Zap className="w-3.5 h-3.5 text-[#925C0B]" />
                <span>AI Confidence: {pair.similarityScore}%</span>
              </div>
              <PriorityBadge priority={pair.urgency} />
              <StatusBadge status={pair.status} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/overlap-review"
              className="inline-flex items-center gap-1.5 text-xs text-[#20231F] hover:text-[#344B3B] border border-[#E3E5DE] bg-[#F7F7F4] hover:bg-[#E8EEE7] px-3.5 py-2 rounded-md transition-colors font-medium shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Queue</span>
            </Link>
          </div>
        </div>

        {/* Target Institution Identification Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#F7F7F4] p-4 rounded-lg border border-[#E3E5DE] text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-[#E8EEE7] border border-[#344B3B]/20 flex items-center justify-center text-[#344B3B] shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-[#20231F] text-sm tracking-tight">{pair.institutionName}</div>
              <div className="text-[11px] text-[#62665F] flex items-center gap-3 mt-0.5 flex-wrap">
                <span>Permanent ID: <strong className="font-mono text-[#20231F]">{pair.institutionId}</strong></span>
                <span>&bull;</span>
                <span>Region: <strong className="text-[#20231F]">{caseA.institutionRegion}</strong></span>
                <span>&bull;</span>
                <span>State: <strong className="text-[#20231F]">{caseA.institutionState}</strong></span>
              </div>
            </div>
          </div>

          <Link
            href={`/institutions/${pair.institutionId}`}
            className="text-xs font-semibold text-[#344B3B] hover:text-[#202F25] flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#E8EEE7] border border-[#344B3B]/20 transition-colors"
          >
            <span>View Institution 360° Profile</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Explainable AI Similarity Rationale Bar */}
      <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#E8EEE7] border border-[#344B3B]/20 flex items-center justify-center text-[#344B3B]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#20231F] tracking-tight">
                Explainable Multi-Vector Similarity Assessment
              </h2>
              <p className="text-[11px] text-[#62665F]">
                Transparent feature contributions computed across structured entity identifiers and semantic vector spaces.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#62665F] bg-[#F7F7F4] px-2.5 py-1 rounded-md border border-[#E3E5DE]">
            Detected: {formatDateTime(pair.detectedAt)}
          </span>
        </div>

        {/* AI Rationale Summary Note */}
        <div className="p-4 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE] text-xs text-[#20231F] leading-relaxed font-sans">
          <strong className="text-[#20231F] font-semibold block mb-1">Correlation Rationale:</strong>
          {pair.rationale.reasonDescription}
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
          {/* Matched Entities */}
          <div className="p-4 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE] space-y-2">
            <div className="text-[10px] font-bold text-[#62665F] uppercase tracking-wider flex items-center justify-between">
              <span>Entity Identifier Matches</span>
              <span className="text-[#23734D] font-mono font-bold">100% Deterministic</span>
            </div>
            <ul className="space-y-1 text-[#20231F] font-mono text-[11px]">
              {pair.rationale.entityMatches.map((m: string, idx: number) => (
                <li key={idx} className="flex items-center gap-1.5 truncate" title={m}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#23734D] shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Shared Subject Matter Keywords */}
          <div className="p-4 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE] space-y-2">
            <div className="text-[10px] font-bold text-[#62665F] uppercase tracking-wider flex items-center justify-between">
              <span>Semantic Keywords</span>
              <span className="text-[#344B3B] font-mono font-bold">{pair.rationale.semanticSubjectSimilarity}% Vector Match</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {pair.rationale.commonKeywords.map((kw: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-[#FBF1DB] text-[#925C0B] border border-[#925C0B]/25 px-2 py-0.5 rounded text-[10px] font-semibold"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Overlapping Regulatory Norms */}
          <div className="p-4 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE] space-y-2">
            <div className="text-[10px] font-bold text-[#62665F] uppercase tracking-wider">
              Statutory Norms Cited
            </div>
            <ul className="space-y-1 text-[#20231F] text-[11px]">
              {pair.rationale.regulatoryClauses.map((clause: string, idx: number) => (
                <li key={idx} className="flex items-center gap-1.5 truncate" title={clause}>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#344B3B] shrink-0" />
                  <span className="truncate">{clause}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Dual Pane Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Pane: Case A */}
        <div className="bg-white rounded-xl border border-[#E3E5DE] shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 bg-[#F7F7F4] text-[#20231F] flex items-center justify-between border-b border-[#E3E5DE]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8EEE7] text-[#344B3B] border border-[#344B3B]/20 tracking-wider">
                PRIMARY CASE A
              </span>
              <BureauBadge bureau={caseA.bureau} />
            </div>
            <StatusBadge status={caseA.status} />
          </div>

          <div className="p-5 flex-1 space-y-4 text-xs bg-[#F7F7F4]/50">
            {/* Header / ID */}
            <div className="bg-white p-4 rounded-lg border border-[#E3E5DE] shadow-xs">
              <div className="flex items-center justify-between">
                <Link
                  href={`/cases/${encodeURIComponent(caseA.id)}`}
                  className="text-base font-bold text-[#344B3B] hover:underline font-mono"
                >
                  {caseA.id}
                </Link>
                <span className="text-[#62665F] font-mono text-[11px]">
                  Recd: {formatDate(caseA.receivedDate)}
                </span>
              </div>
              <div className="text-[#20231F] font-semibold mt-1 text-xs">
                {caseA.subject}
              </div>
            </div>

            {/* Allegation with Highlighted Diff */}
            <div className="bg-white p-4 rounded-lg border border-[#E3E5DE] shadow-xs space-y-1.5">
              <div className="text-[10px] font-bold text-[#62665F] uppercase tracking-widest font-mono">
                Allegation Statement (Highlighted Matching Context)
              </div>
              <div className="p-3.5 bg-[#F7F7F4] rounded-md border border-[#E3E5DE] leading-relaxed text-[#20231F]">
                {highlightKeywords(caseA.description, pair.rationale.commonKeywords)}
              </div>
            </div>

            {/* Complainant & Officer Grid */}
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 bg-white rounded-lg border border-[#E3E5DE] shadow-xs">
                <span className="text-[#62665F] block text-[10px] font-bold uppercase font-mono">Complainant</span>
                <span className="font-semibold text-[#20231F] block mt-0.5">{caseA.complainantName}</span>
                <span className="text-[#62665F] block text-[10px]">({caseA.complainantType})</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#E3E5DE] shadow-xs">
                <span className="text-[#62665F] block text-[10px] font-bold uppercase font-mono">Assigned Officer</span>
                <span className="font-semibold text-[#20231F] block mt-0.5">{caseA.assignedOfficer}</span>
                <span className="text-[#62665F] block text-[10px]">{caseA.assignedOfficerRole}</span>
              </div>
            </div>

            {/* Statutory SLA */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E3E5DE] shadow-xs text-[11px]">
              <span className="text-[#62665F] font-medium">Statutory SLA Deadline:</span>
              <span className="font-bold text-[#20231F] font-mono">
                {formatDate(caseA.slaDeadline)} ({caseA.daysOpen} days open)
              </span>
            </div>

            {/* Last Action */}
            <div className="p-3 bg-[#F0F1ED] rounded-lg text-[#20231F] text-[11px] border border-[#E3E5DE]">
              <span className="font-bold text-[#20231F] block text-[10px] uppercase tracking-wider font-mono">Last Bureau Action:</span>
              <span className="mt-0.5 block">{caseA.lastActionSummary}</span>
            </div>
          </div>

          <div className="p-4 border-t border-[#E3E5DE] bg-white text-right">
            <Link
              href={`/cases/${encodeURIComponent(caseA.id)}`}
              className="text-xs text-[#344B3B] hover:text-[#202F25] font-semibold inline-flex items-center gap-1.5 font-mono"
            >
              <span>Inspect Full Case Dossier A</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Pane: Case B */}
        <div className="bg-white rounded-xl border border-[#E3E5DE] shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 bg-[#F7F7F4] text-[#20231F] flex items-center justify-between border-b border-[#E3E5DE]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#EAF0F6] text-[#496785] border border-[#496785]/20 tracking-wider">
                CORRELATED CASE B
              </span>
              <BureauBadge bureau={caseB.bureau} />
            </div>
            <StatusBadge status={caseB.status} />
          </div>

          <div className="p-5 flex-1 space-y-4 text-xs bg-[#F7F7F4]/50">
            {/* Header / ID */}
            <div className="bg-white p-4 rounded-lg border border-[#E3E5DE] shadow-xs">
              <div className="flex items-center justify-between">
                <Link
                  href={`/cases/${encodeURIComponent(caseB.id)}`}
                  className="text-base font-bold text-[#496785] hover:underline font-mono"
                >
                  {caseB.id}
                </Link>
                <span className="text-[#62665F] font-mono text-[11px]">
                  Recd: {formatDate(caseB.receivedDate)}
                </span>
              </div>
              <div className="text-[#20231F] font-semibold mt-1 text-xs">
                {caseB.subject}
              </div>
            </div>

            {/* Allegation with Highlighted Diff */}
            <div className="bg-white p-4 rounded-lg border border-[#E3E5DE] shadow-xs space-y-1.5">
              <div className="text-[10px] font-bold text-[#62665F] uppercase tracking-widest font-mono">
                Allegation Statement (Highlighted Matching Context)
              </div>
              <div className="p-3.5 bg-[#F7F7F4] rounded-md border border-[#E3E5DE] leading-relaxed text-[#20231F]">
                {highlightKeywords(caseB.description, pair.rationale.commonKeywords)}
              </div>
            </div>

            {/* Complainant & Officer Grid */}
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="p-3 bg-white rounded-lg border border-[#E3E5DE] shadow-xs">
                <span className="text-[#62665F] block text-[10px] font-bold uppercase font-mono">Complainant</span>
                <span className="font-semibold text-[#20231F] block mt-0.5">{caseB.complainantName}</span>
                <span className="text-[#62665F] block text-[10px]">({caseB.complainantType})</span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-[#E3E5DE] shadow-xs">
                <span className="text-[#62665F] block text-[10px] font-bold uppercase font-mono">Assigned Officer</span>
                <span className="font-semibold text-[#20231F] block mt-0.5">{caseB.assignedOfficer}</span>
                <span className="text-[#62665F] block text-[10px]">{caseB.assignedOfficerRole}</span>
              </div>
            </div>

            {/* Statutory SLA */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#E3E5DE] shadow-xs text-[11px]">
              <span className="text-[#62665F] font-medium">Statutory SLA Deadline:</span>
              <span className="font-bold text-[#20231F] font-mono">
                {formatDate(caseB.slaDeadline)} ({caseB.daysOpen} days open)
              </span>
            </div>

            {/* Last Action */}
            <div className="p-3 bg-[#F0F1ED] rounded-lg text-[#20231F] text-[11px] border border-[#E3E5DE]">
              <span className="font-bold text-[#20231F] block text-[10px] uppercase tracking-wider font-mono">Last Bureau Action:</span>
              <span className="mt-0.5 block">{caseB.lastActionSummary}</span>
            </div>
          </div>

          <div className="p-4 border-t border-[#E3E5DE] bg-white text-right">
            <Link
              href={`/cases/${encodeURIComponent(caseB.id)}`}
              className="text-xs text-[#496785] hover:text-[#20231F] font-semibold inline-flex items-center gap-1.5 font-mono"
            >
              <span>Inspect Full Case Dossier B</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Reviewer Action Center (Human-in-the-Loop Sovereign Decision) */}
      <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-[#E3E5DE] flex-wrap gap-3">
          <div>
            <h2 className="text-base font-bold text-[#20231F] flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#23734D]" />
              <span>Sovereign Reviewer Action Desk</span>
            </h2>
            <p className="text-xs text-[#62665F] mt-1 font-mono">
              Current Coordination Status:{" "}
              <strong className="text-[#20231F] font-semibold">{pair.status.replace("_", " ")}</strong>
              {pair.reviewedBy && ` &bull; Adjudicated by ${pair.reviewedBy}`}
            </p>
          </div>

          {pair.reviewerNotes && (
            <div className="text-xs text-[#20231F] max-w-md bg-[#F7F7F4] p-3 rounded-md border border-[#E3E5DE]">
              <span className="font-bold text-[#20231F] block text-[10px] uppercase tracking-wider font-mono">
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
            className="flex flex-col items-start p-4 rounded-lg border border-[#496785] bg-[#EAF0F6]/50 hover:bg-[#EAF0F6] text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-[#496785] font-bold text-xs mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Link Bureaus</span>
            </div>
            <p className="text-[11px] text-[#62665F] leading-tight">
              Cross-reference both files. Both bureaus proceed with unified evidentiary notices.
            </p>
          </button>

          {/* Action 2: Designate Lead & Merge */}
          <button
            onClick={() => setActiveModalAction("MERGED")}
            className="flex flex-col items-start p-4 rounded-lg border border-[#344B3B] bg-[#E8EEE7]/60 hover:bg-[#E8EEE7] text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-[#344B3B] font-bold text-xs mb-1">
              <Scale className="w-4 h-4" />
              <span>Consolidate Under Lead</span>
            </div>
            <p className="text-[11px] text-[#62665F] leading-tight">
              Elect single lead bureau. The secondary case is linked under the lead investigation.
            </p>
          </button>

          {/* Action 3: Dismiss as Distinct */}
          <button
            onClick={() => setActiveModalAction("REJECTED_DISTINCT")}
            className="flex flex-col items-start p-4 rounded-lg border border-[#E3E5DE] bg-white hover:bg-[#F7F7F4] text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-[#20231F] font-bold text-xs mb-1">
              <XCircle className="w-4 h-4 text-[#62665F]" />
              <span>Mark as Distinct</span>
            </div>
            <p className="text-[11px] text-[#62665F] leading-tight">
              Acknowledge match as coincidental or unrelated. Cases remain independent.
            </p>
          </button>

          {/* Action 4: Defer */}
          <button
            onClick={() => setActiveModalAction("DEFERRED")}
            className="flex flex-col items-start p-4 rounded-lg border border-[#925C0B]/40 bg-[#FBF1DB]/40 hover:bg-[#FBF1DB] text-left transition-all group"
          >
            <div className="flex items-center gap-2 text-[#925C0B] font-bold text-xs mb-1">
              <Clock className="w-4 h-4 text-[#925C0B]" />
              <span>Defer for Evidence</span>
            </div>
            <p className="text-[11px] text-[#62665F] leading-tight">
              Hold adjudication pending institution counter-affidavits or bureau inquiries.
            </p>
          </button>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {activeModalAction && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-[#E3E5DE] max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="border-b border-[#E3E5DE] pb-3">
              <h3 className="text-base font-bold text-[#20231F]">
                Confirm Official Regulatory Action
              </h3>
              <p className="text-xs text-[#62665F] mt-1 font-mono">
                Adjudication:{" "}
                <strong className="text-[#344B3B] font-semibold">
                  {activeModalAction.replace("_", " ")}
                </strong>{" "}
                on Pair <strong className="font-mono text-[#20231F]">{pair.id}</strong>
              </p>
            </div>

            {/* If Merging, pick Lead Bureau */}
            {activeModalAction === "MERGED" && (
              <div className="space-y-1.5 text-xs bg-[#E8EEE7] p-3.5 rounded-lg border border-[#344B3B]/20">
                <label className="font-bold text-[#344B3B] block">
                  Select Lead Investigating Bureau:
                </label>
                <select
                  value={selectedLeadBureau}
                  onChange={(e) => setSelectedLeadBureau(e.target.value as BureauType)}
                  className="w-full bg-white border border-[#E3E5DE] rounded-md px-3 py-2 text-[#20231F] font-semibold focus:outline-none focus:ring-1 focus:ring-[#526B57]"
                >
                  <option value={caseA.bureau}>Primary Bureau: {caseA.bureau}</option>
                  <option value={caseB.bureau}>Correlated Bureau: {caseB.bureau}</option>
                </select>
                <p className="text-[11px] text-[#344B3B]/80 leading-relaxed">
                  The secondary complaint will be linked as a referenced proceedings sub-record under the lead bureau.
                </p>
              </div>
            )}

            {/* Official Rationale Field */}
            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-[#20231F] block">
                Official Regulatory Rationale / Reviewer Justification:
              </label>
              <textarea
                rows={4}
                value={reviewerJustification}
                onChange={(e) => setReviewerJustification(e.target.value)}
                placeholder="State the statutory grounds, inter-bureau consultation details, or evidence rationale for this decision..."
                className="w-full bg-[#F7F7F4] border border-[#E3E5DE] rounded-md p-3 text-[#20231F] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white placeholder-[#85877F] font-sans"
              />
            </div>

            <div className="p-3 bg-[#F7F7F4] rounded-md text-[11px] text-[#62665F] border border-[#E3E5DE] leading-relaxed font-mono">
              Decision will be cryptographically attributed to{" "}
              <strong className="text-[#20231F]">{currentUser.name}</strong> ({currentUser.designation}) and permanently appended to the AICTE Governance Audit Trail.
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E3E5DE]">
              <button
                onClick={() => {
                  setActiveModalAction(null);
                  setReviewerJustification("");
                }}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-[#62665F] hover:bg-[#F7F7F4] rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteResolution}
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold bg-[#344B3B] hover:bg-[#293D30] text-white rounded-md shadow-xs transition-colors"
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
