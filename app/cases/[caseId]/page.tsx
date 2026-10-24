"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FileText,
  Building2,
  Calendar,
  Clock,
  User,
  ArrowLeft,
  AlertTriangle,
  GitMerge,
  ShieldCheck,
  FileCheck2,
  Download,
  Send,
  CheckCircle2,
  Paperclip,
  History,
  Scale,
  ExternalLink,
  ChevronRight,
  Shield,
  Printer,
} from "lucide-react";
import { ComplaintCase, CaseStatus, AuditLogEntry, BureauType } from "@/lib/api/types";
import { CaseBridgeStore } from "@/lib/api/store";
import { SupabaseDataService } from "@/lib/supabase/dataService";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BureauBadge } from "@/components/shared/BureauBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { formatDate, formatDateTime, getDaysRemaining } from "@/lib/utils";
import { useRole } from "@/lib/context/RoleContext";
import { useToast } from "@/lib/context/ToastContext";

export default function CaseDetailPage({
  params,
}: {
  params: { caseId: string };
}) {
  const router = useRouter();
  const caseIdRaw = params.caseId;
  const caseId = decodeURIComponent(caseIdRaw);
  const { currentUser } = useRole();
  const { toast } = useToast();

  const [caseItem, setCaseItem] = useState<ComplaintCase | null>(() => {
    return caseId ? CaseBridgeStore.getCaseById(caseId) || null : null;
  });
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    return caseId ? CaseBridgeStore.getAuditLogs(caseId) : [];
  });

  // Update Status Modal State
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState<CaseStatus>("UNDER_INVESTIGATION");
  const [statusRationale, setStatusRationale] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Add Note State
  const [newNote, setNewNote] = useState("");

  const loadData = () => {
    const c = CaseBridgeStore.getCaseById(caseId);
    if (c) {
      setCaseItem(c);
      setTargetStatus(c.status);
      const logs = CaseBridgeStore.getAuditLogs(c.id);
      setAuditLogs(logs);
    }
  };

  useEffect(() => {
    CaseBridgeStore.init();
    loadData();
    window.addEventListener("casebridge_store_updated", loadData);
    return () => window.removeEventListener("casebridge_store_updated", loadData);
  }, [caseId]);

  if (!caseItem) {
    return (
      <div className="py-20 text-center text-[#62665F] max-w-md mx-auto space-y-3">
        <div className="w-12 h-12 rounded-full bg-[#F0F1ED] flex items-center justify-center mx-auto text-[#62665F]">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-[#20231F]">Case Dossier Unavailable</h2>
        <p className="text-xs text-[#62665F] leading-relaxed">
          The requested complaint reference <strong className="font-mono text-[#20231F]">{caseId}</strong> was not found in the local or remote registry.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#344B3B] bg-[#E8EEE7] hover:bg-[#d8e3d6] px-4 py-2 rounded-md transition-colors font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Complaint Explorer</span>
        </Link>
      </div>
    );
  }

  const daysLeft = getDaysRemaining(caseItem.slaDeadline);

  const handleStatusUpdate = () => {
    if (!statusRationale.trim()) {
      alert("Please provide official rationale for this status update.");
      return;
    }

    setIsUpdating(true);
    CaseBridgeStore.updateCaseStatus(
      caseItem.id,
      targetStatus,
      `${currentUser.name} (${currentUser.designation})`,
      currentUser.bureau,
      statusRationale.trim()
    );

    setIsUpdating(false);
    setShowStatusModal(false);
    setStatusRationale("");

    toast({
      title: "Case Status Updated",
      message: `Status transitioned to ${targetStatus.replace(/_/g, " ")}.`,
      type: "success",
    });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    CaseBridgeStore.addAuditLog({
      id: `AUD-${Date.now()}`,
      caseId: caseItem.id,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      action: "Procedural Note Appended",
      performedBy: currentUser.name,
      role: currentUser.designation,
      bureau: currentUser.bureau,
      details: newNote.trim(),
    });

    setNewNote("");
    toast({
      title: "Procedural Note Saved",
      message: "Note appended to the governance audit trail.",
      type: "info",
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Dossier Header */}
      <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E3E5DE]">
          <div>
            <Breadcrumbs
              items={[
                { label: "Complaint Explorer", href: "/cases" },
                { label: caseItem.id },
              ]}
            />
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#20231F] tracking-tight font-mono">
                {caseItem.id}
              </h1>
              <BureauBadge bureau={caseItem.bureau} />
              <StatusBadge status={caseItem.status} />
              <PriorityBadge priority={caseItem.priority} />
            </div>
            <div className="text-[11px] text-[#62665F] font-mono mt-1">
              Internal Reference: <span className="text-[#20231F] font-semibold">{caseItem.refNumber}</span> &bull; Lodged: {formatDate(caseItem.receivedDate)}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowStatusModal(true)}
              className="inline-flex items-center gap-1.5 bg-[#344B3B] hover:bg-[#293D30] text-white text-xs font-semibold px-4 py-2 rounded-md shadow-xs transition-colors"
            >
              <span>Transition Status</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs text-[#20231F] hover:text-[#344B3B] border border-[#E3E5DE] bg-[#F7F7F4] hover:bg-[#E8EEE7] px-3.5 py-2 rounded-md transition-colors font-medium shadow-xs"
              title="Print Dossier"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <Link
              href="/cases"
              className="inline-flex items-center gap-1 text-xs text-[#20231F] hover:text-[#344B3B] border border-[#E3E5DE] bg-[#F7F7F4] hover:bg-[#E8EEE7] px-3.5 py-2 rounded-md transition-colors font-medium shadow-xs font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Explorer</span>
            </Link>
          </div>
        </div>

        {/* SLA and Institution Quick Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Target Institution */}
          <div className="p-4 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE]">
            <span className="text-[10px] font-bold text-[#62665F] uppercase tracking-widest block font-mono">
              Target Technical Institution
            </span>
            <Link
              href={`/institutions/${caseItem.institutionId}`}
              className="font-bold text-[#20231F] hover:text-[#344B3B] line-clamp-1 mt-1 text-sm tracking-tight transition-colors"
            >
              {caseItem.institutionName}
            </Link>
            <div className="text-[11px] text-[#62665F] font-mono mt-0.5">
              PID: {caseItem.institutionId} &bull; {caseItem.institutionRegion} ({caseItem.institutionState})
            </div>
          </div>

          {/* Statutory SLA Mandate */}
          <div className="p-4 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE]">
            <span className="text-[10px] font-bold text-[#62665F] uppercase tracking-widest block font-mono">
              Statutory 30-Day Mandate
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3.5 h-3.5 text-[#62665F]" />
              <span className="font-bold text-[#20231F] font-mono">
                {formatDate(caseItem.slaDeadline)}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-md font-bold font-mono ${
                  daysLeft < 0
                    ? "bg-[#FBEAEC] text-[#B42332] border border-[#B42332]/25"
                    : "bg-[#E8F4EC] text-[#23734D] border border-[#23734D]/25"
                }`}
              >
                {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
              </span>
            </div>
            <div className="text-[11px] text-[#62665F] font-mono mt-0.5">
              Total Age: <strong className="text-[#20231F]">{caseItem.daysOpen} days open</strong>
            </div>
          </div>

          {/* Assigned Officer */}
          <div className="p-4 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE]">
            <span className="text-[10px] font-bold text-[#62665F] uppercase tracking-widest block font-mono">
              Designated Bureau Officer
            </span>
            <div className="font-bold text-[#20231F] mt-1 text-sm">{caseItem.assignedOfficer}</div>
            <div className="text-[11px] text-[#62665F] font-mono">{caseItem.assignedOfficerRole}</div>
          </div>
        </div>
      </div>

      {/* Cross-Bureau Overlap Link Warning if applicable */}
      {caseItem.hasOverlap && caseItem.overlapPairId && (
        <div className="p-5 bg-[#FBF1DB] border-l-4 border-l-[#925C0B] border border-[#925C0B]/25 rounded-xl shadow-xs">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#925C0B] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-[#925C0B]">
                  Cross-Bureau Overlap Candidate Detected
                </h3>
                <p className="text-xs text-[#925C0B]/90 mt-1 leading-relaxed max-w-3xl">
                  This complaint shares entity identity or allegation patterns with active proceedings in another bureau. Inspect the side-by-side comparative workspace to coordinate inquiries.
                </p>
              </div>
            </div>
            <Link
              href={`/overlap-review/${caseItem.overlapPairId}`}
              className="inline-flex items-center gap-1.5 bg-[#925C0B] hover:bg-[#784c09] text-white text-xs font-semibold px-4 py-2 rounded-md shadow-xs transition-colors shrink-0 font-mono"
            >
              <span>Open Overlap Workspace</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Grievance Dossier, Relevant Clauses, Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Grievance Statement */}
          <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E5DE] flex-wrap gap-2">
              <h2 className="text-sm font-bold text-[#20231F] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#344B3B]" />
                <span>Grievance Allegation Statement</span>
              </h2>
              <span className="text-xs text-[#62665F] font-mono">
                Classification: <strong className="text-[#20231F]">{caseItem.category.replace(/_/g, " ")}</strong>
              </span>
            </div>

            <div className="text-sm font-bold text-[#20231F] leading-snug">
              {caseItem.subject}
            </div>

            <p className="text-xs text-[#20231F] leading-relaxed bg-[#F7F7F4] p-4 rounded-lg border border-[#E3E5DE] font-sans">
              {caseItem.description}
            </p>

            {/* Complainant Disclosure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3.5 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE]">
                <span className="text-[10px] font-bold text-[#62665F] uppercase tracking-wider font-mono">Complainant Identity</span>
                <div className="font-semibold text-[#20231F] mt-1">{caseItem.complainantName}</div>
                <div className="text-[#62665F] text-[11px] font-mono">{caseItem.complainantType}</div>
              </div>
              <div className="p-3.5 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE]">
                <span className="text-[10px] font-bold text-[#62665F] uppercase tracking-wider font-mono">Contact &amp; Verification</span>
                <div className="font-mono text-[#20231F] text-[11px] mt-1">
                  {caseItem.complainantEmail || "Protected under Whistleblower Protocol"}
                </div>
                <div className="text-[#62665F] text-[11px] font-mono">{caseItem.complainantPhone || "—"}</div>
              </div>
            </div>
          </div>

          {/* Applicable AICTE Regulatory Framework */}
          <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#20231F] flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#344B3B]" />
              <span>Applicable AICTE Regulatory Framework &amp; Approval Handbooks</span>
            </h2>

            <ul className="space-y-2.5 text-xs">
              {caseItem.relevantClauses.map((clause, idx) => (
                <li
                  key={idx}
                  className="p-3.5 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE] flex items-start gap-3"
                >
                  <ShieldCheck className="w-4 h-4 text-[#344B3B] shrink-0 mt-0.5" />
                  <span className="text-[#20231F] font-medium leading-relaxed">{clause}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Uploaded Evidence & Artifacts */}
          <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#20231F] flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-[#62665F]" />
              <span>Submitted Supporting Evidence &amp; Affidavits</span>
            </h2>

            {caseItem.evidenceFiles.length === 0 ? (
              <div className="p-6 text-center text-xs text-[#62665F] bg-[#F7F7F4] rounded-lg border border-[#E3E5DE] font-mono">
                No electronic attachments were submitted with this filing.
              </div>
            ) : (
              <div className="space-y-2.5">
                {caseItem.evidenceFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3.5 bg-[#F7F7F4] hover:bg-[#F0F1ED] rounded-lg border border-[#E3E5DE] flex items-center justify-between transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md bg-[#E8EEE7] border border-[#344B3B]/20 flex items-center justify-center text-[#344B3B] shrink-0">
                        <FileCheck2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[#20231F]">{file.name}</div>
                        <div className="text-[10px] text-[#62665F] font-mono">
                          {file.size} &bull; Uploaded {formatDate(file.uploadedAt)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        toast({
                          title: "Document Download Initialized",
                          message: `Downloading ${file.name} for official record.`,
                          type: "info",
                        })
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#344B3B] hover:text-[#202F25] bg-white hover:bg-[#F7F7F4] border border-[#E3E5DE] px-3 py-1.5 rounded-md transition-colors shadow-xs font-mono"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Institutional Counter-Affidavits & Formal Replies */}
          <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E5DE] flex-wrap gap-2">
              <h2 className="text-sm font-bold text-[#20231F] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#344B3B]" />
                <span>Institutional Counter-Statements &amp; Natural Justice Replies</span>
              </h2>
              <span className="text-xs font-mono text-[#62665F] bg-[#F7F7F4] px-2.5 py-1 rounded-md border border-[#E3E5DE]">
                PID: {caseItem.institutionId}
              </span>
            </div>

            {(() => {
              const responses = CaseBridgeStore.getInstitutionResponses(caseItem.institutionId).filter(
                (r) => r.caseId === caseItem.id
              );
              if (responses.length === 0) {
                return (
                  <div className="p-6 text-center text-xs text-[#62665F] bg-[#F7F7F4] rounded-lg border border-[#E3E5DE] space-y-1">
                    <p className="font-semibold text-[#20231F]">No formal counter-affidavit received yet.</p>
                    <p className="text-[11px] text-[#925C0B] font-mono">Active 14-day statutory response notice dispatched to the registrar.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {responses.map((resp) => (
                    <div
                      key={resp.id}
                      className="p-4 bg-[#FBF1DB]/40 rounded-lg border border-[#925C0B]/25 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-[#20231F]">{resp.submittedBy} ({resp.officialDesignation})</div>
                        <div className="text-[10px] text-[#62665F] font-mono">{formatDate(resp.submittedAt)}</div>
                      </div>
                      <p className="text-[#20231F] leading-relaxed font-sans">{resp.statement}</p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Right 1 Col: Audit Log & Notes */}
        <div className="space-y-6">
          {/* Audit Timeline */}
          <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E5DE]">
              <h2 className="text-sm font-bold text-[#20231F] flex items-center gap-2">
                <History className="w-4 h-4 text-[#62665F]" />
                <span>Governance Audit Trail</span>
              </h2>
              <span className="text-[11px] font-mono text-[#62665F]">
                {auditLogs.length} Records
              </span>
            </div>

            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {auditLogs.map((log, idx) => (
                <div key={log.id} className="relative pl-6 pb-4 border-l border-[#E3E5DE] last:border-0 last:pb-0">
                  <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-[#344B3B] border-2 border-white" />
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-[#85877F] font-mono">
                      <span>{formatDateTime(log.timestamp)}</span>
                      <span className="font-semibold text-[#344B3B]">{log.bureau}</span>
                    </div>
                    <div className="font-bold text-[#20231F]">{log.action}</div>
                    <p className="text-[#62665F] text-[11px] leading-relaxed bg-[#F7F7F4] p-2.5 rounded-md border border-[#E3E5DE]">
                      {log.details}
                    </p>
                    <div className="text-[10px] text-[#85877F] font-mono">
                      By <strong className="text-[#20231F]">{log.performedBy}</strong> ({log.role})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Append Procedural Note */}
          <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-[#20231F] flex items-center gap-2">
              <Send className="w-4 h-4 text-[#344B3B]" />
              <span>Append Procedural Note</span>
            </h2>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Record inquiry proceedings, hearing notices, or official comments..."
                className="w-full bg-[#F7F7F4] border border-[#E3E5DE] rounded-md p-3 text-xs text-[#20231F] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white placeholder-[#85877F] font-sans"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="w-full py-2 bg-[#344B3B] hover:bg-[#293D30] disabled:opacity-50 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
              >
                Save to Audit Trail
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Status Transition Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-[#E3E5DE] max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="border-b border-[#E3E5DE] pb-3">
              <h3 className="text-base font-bold text-[#20231F]">
                Update Complaint Case Status
              </h3>
              <p className="text-xs text-[#62665F] mt-1 font-mono">
                Transitioning status for case <strong className="font-mono text-[#20231F]">{caseItem.id}</strong>
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-[#20231F] block">
                Target Status:
              </label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as CaseStatus)}
                className="w-full bg-[#F7F7F4] border border-[#E3E5DE] rounded-md px-3 py-2 text-[#20231F] font-semibold focus:outline-none focus:ring-1 focus:ring-[#526B57]"
              >
                <option value="NEW">NEW (Awaiting Initial Scrutiny)</option>
                <option value="UNDER_INVESTIGATION">UNDER_INVESTIGATION (Inquiry Conducted)</option>
                <option value="HEARING_SCHEDULED">HEARING_SCHEDULED (Standing Committee Hearing)</option>
                <option value="REFERRED_TO_LEGAL">REFERRED_TO_LEGAL (Legal Bureau Review)</option>
                <option value="RESOLVED">RESOLVED (Formal Closure Order Issued)</option>
                <option value="DISMISSED">DISMISSED (Groundless or Baseless Allegation)</option>
              </select>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-[#20231F] block">
                Mandatory Administrative Rationale:
              </label>
              <textarea
                rows={4}
                value={statusRationale}
                onChange={(e) => setStatusRationale(e.target.value)}
                placeholder="State the committee order number, inspection findings, or resolution grounds..."
                className="w-full bg-[#F7F7F4] border border-[#E3E5DE] rounded-md p-3 text-[#20231F] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white placeholder-[#85877F] font-sans"
              />
            </div>

            <div className="p-3 bg-[#F7F7F4] rounded-md text-[11px] text-[#62665F] border border-[#E3E5DE] font-mono">
              Update will be stamped under{" "}
              <strong className="text-[#20231F]">{currentUser.name}</strong> ({currentUser.designation}) for bureau <strong>{currentUser.bureau}</strong>.
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E3E5DE]">
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={isUpdating}
                className="px-4 py-2 text-xs font-semibold text-[#62665F] hover:bg-[#F7F7F4] rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                className="px-5 py-2 text-xs font-bold bg-[#344B3B] hover:bg-[#293D30] text-white rounded-md shadow-xs transition-colors"
              >
                {isUpdating ? "Committing..." : "Commit Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
