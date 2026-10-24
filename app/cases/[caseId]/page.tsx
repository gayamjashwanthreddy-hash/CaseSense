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
      <div className="py-20 text-center text-slate-500 max-w-md mx-auto space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <FileText className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Case Dossier Unavailable</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The requested complaint reference <strong className="font-mono">{caseId}</strong> was not found in the local or remote registry.
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl transition-colors"
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
      {/* Dossier Header - Dark Editorial Strip */}
      <div className="bg-[#0A1626] text-white p-6 rounded-2xl border border-[#142C46] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#142C46]/80">
          <div>
            <Breadcrumbs
              items={[
                { label: "Complaint Explorer", href: "/cases" },
                { label: caseItem.id },
              ]}
            />
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
                {caseItem.id}
              </h1>
              <BureauBadge bureau={caseItem.bureau} />
              <StatusBadge status={caseItem.status} />
              <PriorityBadge priority={caseItem.priority} />
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Internal Reference: <span className="text-slate-200">{caseItem.refNumber}</span> &bull; Lodged: {formatDate(caseItem.receivedDate)}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowStatusModal(true)}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors"
            >
              <span>Transition Status</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white border border-[#243B55] bg-[#0D1C2E] hover:bg-[#142C46] px-3.5 py-2 rounded-xl transition-colors font-medium shadow-sm"
              title="Print Dossier"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <Link
              href="/cases"
              className="inline-flex items-center gap-1 text-xs text-slate-300 hover:text-white border border-[#243B55] bg-[#0D1C2E] hover:bg-[#142C46] px-3.5 py-2 rounded-xl transition-colors font-medium shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Explorer</span>
            </Link>
          </div>
        </div>

        {/* SLA and Institution Quick Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Target Institution */}
          <div className="p-4 bg-[#0D1C2E] rounded-xl border border-[#1E3A5F]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Target Technical Institution
            </span>
            <Link
              href={`/institutions/${caseItem.institutionId}`}
              className="font-bold text-white hover:text-blue-400 line-clamp-1 mt-1 text-sm tracking-tight transition-colors"
            >
              {caseItem.institutionName}
            </Link>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              PID: {caseItem.institutionId} &bull; {caseItem.institutionRegion} ({caseItem.institutionState})
            </div>
          </div>

          {/* Statutory SLA Countdown */}
          <div className="p-4 bg-[#0D1C2E] rounded-xl border border-[#1E3A5F]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Statutory 30-Day Resolution Mandate
            </span>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-white font-mono">
                {formatDate(caseItem.slaDeadline)}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono ${
                  daysLeft < 0
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                }`}
              >
                {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Total Age: <strong className="text-slate-200">{caseItem.daysOpen} days open</strong>
            </div>
          </div>

          {/* Assigned Officer */}
          <div className="p-4 bg-[#0D1C2E] rounded-xl border border-[#1E3A5F]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Designated Bureau Officer
            </span>
            <div className="font-bold text-white mt-1 text-sm">{caseItem.assignedOfficer}</div>
            <div className="text-[11px] text-slate-400">{caseItem.assignedOfficerRole}</div>
          </div>
        </div>
      </div>

      {/* Cross-Bureau Overlap Link Warning if applicable */}
      {caseItem.hasOverlap && caseItem.overlapPairId && (
        <div className="p-5 bg-amber-500/10 border-l-4 border-l-amber-600 border border-amber-500/30 rounded-2xl shadow-sm">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  Cross-Bureau Overlap Candidate Detected
                </h3>
                <p className="text-xs text-amber-900/80 mt-1 leading-relaxed max-w-3xl">
                  This complaint shares entity identity or allegation patterns with active proceedings in another bureau. Inspect the side-by-side comparative workspace to consolidate inquiries.
                </p>
              </div>
            </div>
            <Link
              href={`/overlap-review/${caseItem.overlapPairId}`}
              className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors shrink-0"
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>Grievance Allegation Statement</span>
              </h2>
              <span className="text-xs text-slate-600 font-medium">
                Classification: <strong className="text-slate-900">{caseItem.category.replace(/_/g, " ")}</strong>
              </span>
            </div>

            <div className="text-sm font-bold text-slate-900 leading-snug">
              {caseItem.subject}
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-slate-200/80 font-sans">
              {caseItem.description}
            </p>

            {/* Complainant Disclosure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Complainant Identity</span>
                <div className="font-semibold text-slate-900 mt-1">{caseItem.complainantName}</div>
                <div className="text-slate-500 text-[11px]">{caseItem.complainantType}</div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Contact & Verification</span>
                <div className="font-mono text-slate-800 text-[11px] mt-1">
                  {caseItem.complainantEmail || "Protected under Whistleblower Protocol"}
                </div>
                <div className="text-slate-500 text-[11px] font-mono">{caseItem.complainantPhone || "—"}</div>
              </div>
            </div>
          </div>

          {/* Applicable AICTE Regulatory Framework */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-700" />
              <span>Applicable AICTE Regulatory Framework & Approval Handbooks</span>
            </h2>

            <ul className="space-y-2.5 text-xs">
              {caseItem.relevantClauses.map((clause, idx) => (
                <li
                  key={idx}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <span className="text-slate-800 font-medium leading-relaxed">{clause}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Uploaded Evidence & Artifacts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-slate-500" />
              <span>Submitted Supporting Evidence & Affidavits</span>
            </h2>

            {caseItem.evidenceFiles.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                No electronic attachments were submitted with this filing.
              </div>
            ) : (
              <div className="space-y-2.5">
                {caseItem.evidenceFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between transition-colors text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
                        <FileCheck2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{file.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
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
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors shadow-sm"
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-700" />
                <span>Institutional Counter-Statements & Natural Justice Replies</span>
              </h2>
              <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                PID: {caseItem.institutionId}
              </span>
            </div>

            {(() => {
              const responses = CaseBridgeStore.getInstitutionResponses(caseItem.institutionId).filter(
                (r) => r.caseId === caseItem.id
              );
              if (responses.length === 0) {
                return (
                  <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <p className="font-semibold text-slate-700">No formal counter-affidavit received yet.</p>
                    <p className="text-[11px] text-amber-700">Active 14-day statutory response notice dispatched to the registrar.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {responses.map((resp) => (
                    <div
                      key={resp.id}
                      className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-slate-900">{resp.submittedBy} ({resp.officialDesignation})</div>
                        <div className="text-[10px] text-slate-500 font-mono">{formatDate(resp.submittedAt)}</div>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-sans">{resp.statement}</p>
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-slate-500" />
                <span>Governance Audit Trail</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-400">
                {auditLogs.length} Records
              </span>
            </div>

            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
              {auditLogs.map((log, idx) => (
                <div key={log.id} className="relative pl-6 pb-4 border-l border-slate-200 last:border-0 last:pb-0">
                  <div className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-blue-600 border-2 border-white" />
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{formatDateTime(log.timestamp)}</span>
                      <span className="font-semibold text-slate-600">{log.bureau}</span>
                    </div>
                    <div className="font-bold text-slate-900">{log.action}</div>
                    <p className="text-slate-600 text-[11px] leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200/70">
                      {log.details}
                    </p>
                    <div className="text-[10px] text-slate-400">
                      By <strong className="text-slate-700">{log.performedBy}</strong> ({log.role})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Append Procedural Note */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-4 h-4 text-blue-700" />
              <span>Append Procedural Note</span>
            </h2>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                rows={3}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Record inquiry proceedings, hearing notices, or official comments..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!newNote.trim()}
                className="w-full py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm transition-colors"
              >
                Save to Audit Trail
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Status Transition Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Update Complaint Case Status
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Transitioning status for case <strong className="font-mono text-slate-800">{caseItem.id}</strong>
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-bold text-slate-800 block">
                Target Status:
              </label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as CaseStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
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
              <label className="font-bold text-slate-800 block">
                Mandatory Administrative Rationale:
              </label>
              <textarea
                rows={4}
                value={statusRationale}
                onChange={(e) => setStatusRationale(e.target.value)}
                placeholder="State the committee order number, inspection findings, or resolution grounds..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-slate-400"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-200">
              Update will be stamped under{" "}
              <strong>{currentUser.name}</strong> ({currentUser.designation}) for bureau <strong>{currentUser.bureau}</strong>.
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={isUpdating}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                className="px-5 py-2 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-sm transition-colors"
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
