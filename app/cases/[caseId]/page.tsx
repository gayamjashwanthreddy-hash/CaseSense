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
} from "lucide-react";
import { ComplaintCase, CaseStatus, AuditLogEntry, BureauType } from "@/lib/api/types";
import { CaseBridgeStore } from "@/lib/api/store";
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
      <div className="py-12 text-center text-slate-500 text-sm">
        <p>Loading case dossier...</p>
        <Link href="/cases" className="text-blue-700 underline mt-2 inline-block">
          Return to Case Register
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
      message: `Status transitioned to ${targetStatus.replace("_", " ")}.`,
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <Breadcrumbs
              items={[
                { label: "Case Register", href: "/cases" },
                { label: caseItem.id },
              ]}
            />
            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight font-mono">
                {caseItem.id}
              </h1>
              <BureauBadge bureau={caseItem.bureau} />
              <StatusBadge status={caseItem.status} />
              <PriorityBadge priority={caseItem.priority} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStatusModal(true)}
              className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-3 py-1.5 rounded shadow-sm transition-colors"
            >
              <span>Update Case Status</span>
            </button>
            <Link
              href="/cases"
              className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 rounded transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Register</span>
            </Link>
          </div>
        </div>

        {/* SLA and Institution Quick Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Target Institution */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Target Institution
            </span>
            <Link
              href={`/institutions/${caseItem.institutionId}`}
              className="font-semibold text-slate-900 hover:underline hover:text-blue-700 line-clamp-1 mt-0.5"
            >
              {caseItem.institutionName}
            </Link>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
              ID: {caseItem.institutionId} &bull; {caseItem.institutionState}
            </div>
          </div>

          {/* Statutory SLA Countdown */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              SLA Mandate (30 Days)
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-slate-800 font-mono">
                {formatDate(caseItem.slaDeadline)}
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                  daysLeft < 0
                    ? "bg-rose-100 text-rose-800 border border-rose-300"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d remaining`}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Filed: {formatDate(caseItem.receivedDate)} ({caseItem.daysOpen} days open)
            </div>
          </div>

          {/* Assigned Officer */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
              Investigating Authority
            </span>
            <div className="font-semibold text-slate-900 mt-0.5">{caseItem.assignedOfficer}</div>
            <div className="text-[11px] text-slate-500">{caseItem.assignedOfficerRole}</div>
          </div>
        </div>
      </div>

      {/* Cross-Bureau Overlap Link Warning if applicable */}
      {caseItem.hasOverlap && caseItem.overlapPairId && (
        <div className="p-4 bg-amber-50 border-l-4 border-l-amber-600 border border-amber-200 rounded-md shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-amber-900">
                  Cross-Bureau Overlap Candidate Detected
                </h3>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  This grievance has been correlated with active proceedings in another bureau. Review the side-by-side evidence to coordinate hearings or designate a lead bureau.
                </p>
              </div>
            </div>
            <Link
              href={`/overlap-review/${caseItem.overlapPairId}`}
              className="inline-flex items-center gap-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold px-3 py-1.5 rounded shadow-sm transition-colors shrink-0"
            >
              <span>Open Overlap Workspace</span>
              <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </Link>
          </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Grievance Dossier, Relevant Clauses, Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Grievance Statement */}
          <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Grievance Allegation Statement</span>
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Category: <strong className="text-slate-800">{caseItem.category.replace(/_/g, " ")}</strong>
              </span>
            </div>

            <div className="text-xs font-bold text-slate-900 leading-snug">
              {caseItem.subject}
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded border border-slate-200">
              {caseItem.description}
            </p>

            {/* Complainant Disclosure */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 bg-white rounded border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Complainant Identity</span>
                <div className="font-semibold text-slate-800 mt-0.5">{caseItem.complainantName}</div>
                <div className="text-slate-500 text-[11px]">{caseItem.complainantType}</div>
              </div>
              <div className="p-3 bg-white rounded border border-slate-200">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">Contact / Verification</span>
                <div className="font-mono text-slate-700 text-[11px] mt-0.5">
                  {caseItem.complainantEmail || "Protected under Whistleblower Protocol"}
                </div>
                <div className="text-slate-500 text-[11px] font-mono">{caseItem.complainantPhone || "—"}</div>
              </div>
            </div>
          </div>

          {/* Applicable AICTE Regulatory Framework */}
          <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-blue-700" />
              <span>Applicable AICTE Regulatory Framework & Clauses</span>
            </h2>

            <ul className="space-y-2 text-xs">
              {caseItem.relevantClauses.map((clause, idx) => (
                <li
                  key={idx}
                  className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-start gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <span className="text-slate-800 font-medium">{clause}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Uploaded Evidence & Artifacts */}
          <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Paperclip className="w-4 h-4 text-slate-500" />
              <span>Submitted Supporting Evidence & Affidavits</span>
            </h2>

            {caseItem.evidenceFiles.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded border border-slate-200">
                No electronic attachments were submitted with this filing.
              </div>
            ) : (
              <div className="space-y-2">
                {caseItem.evidenceFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 flex items-center justify-between transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileCheck2 className="w-4 h-4 text-blue-700" />
                      <div>
                        <div className="font-semibold text-slate-800">{file.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {file.size} &bull; Uploaded {formatDate(file.uploadedAt)}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        toast({
                          title: "File Download Simulated",
                          message: `Downloading ${file.name} for institutional review.`,
                          type: "info",
                        })
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 hover:text-blue-900 bg-white hover:bg-slate-50 border border-slate-300 px-2 py-1 rounded transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Institutional Counter-Affidavits & Formal Replies */}
          <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-700" />
                <span>Institutional Counter-Statements & Natural Justice Replies</span>
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                PID: {caseItem.institutionId}
              </span>
            </div>

            {(() => {
              const responses = CaseBridgeStore.getInstitutionResponses(caseItem.institutionId).filter(
                (r) => r.caseId === caseItem.id
              );
              if (responses.length === 0) {
                return (
                  <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded border border-slate-200 space-y-1">
                    <p>No formal counter-affidavit has been received from the institution yet.</p>
                    <p className="text-[10px] text-amber-700 font-medium">14-day SLA response period active.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-3">
                  {responses.map((resp) => (
                    <div
                      key={resp.id}
                      className="p-3.5 bg-amber-50/40 rounded border border-amber-200/80 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-mono font-bold text-slate-900">
                          <span className="text-blue-900">{resp.id}</span>
                          <span className="text-slate-400 font-normal">&bull;</span>
                          <span className="text-slate-600 font-normal text-[11px]">{resp.submittedAt}</span>
                        </div>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                          {resp.status}
                        </span>
                      </div>

                      <div className="font-semibold text-slate-800 text-[11px]">
                        Signatory: {resp.submittedBy} ({resp.officialDesignation})
                      </div>

                      <p className="text-slate-700 leading-relaxed bg-white p-3 rounded border border-amber-200/60 font-sans">
                        &quot;{resp.statement}&quot;
                      </p>

                      {resp.complianceDocuments && resp.complianceDocuments.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Attached Compliance Proofs:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {resp.complianceDocuments.map((doc, idx) => (
                              <span
                                key={idx}
                                className="bg-white border border-slate-300 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1.5"
                              >
                                <Paperclip className="w-3 h-3 text-slate-400" />
                                <span>{doc.name}</span>
                                <span className="text-slate-400">({doc.size})</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Right 1 Col: Chronological Audit Trail & Append Note */}
        <div className="space-y-6">
          {/* Append Procedural Note */}
          <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Append Official Procedural Note
            </h2>
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={3}
                placeholder="Log internal hearing minutes, notice dispatched, or inspection directive..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-400"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newNote.trim()}
                  className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-40 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>Commit Note</span>
                </button>
              </div>
            </form>
          </div>

          {/* Chronological Audit History */}
          <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-slate-500" />
                <span>Governance Audit Trail</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                {auditLogs.length} Events
              </span>
            </div>

            <div className="relative pl-4 space-y-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="relative">
                  <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-blue-700 ring-4 ring-white" />
                  <div>
                    <div className="font-semibold text-slate-900 text-xs">{log.action}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {formatDateTime(log.timestamp)} &bull; {log.performedBy} ({log.bureau})
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
                      {log.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Update Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-[2px] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 max-w-md w-full p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Update Case Regulatory Status
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Case: <strong className="font-mono">{caseItem.id}</strong>
              </p>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-slate-800">Target Procedural Status:</label>
              <select
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value as CaseStatus)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="UNDER_INVESTIGATION">Inquiry Ongoing (Under Scrutiny)</option>
                <option value="NOTICE_ISSUED">Show-Cause Notice Issued to Institution</option>
                <option value="HEARING_SCHEDULED">Standing Hearing Listed</option>
                <option value="JOINT_COMMITTEE">Joint Inter-Bureau Committee Formed</option>
                <option value="RESOLVED">Resolved / Compliance Ensured</option>
                <option value="ESCALATED">Escalated to Standing Appellate Committee</option>
              </select>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-slate-800">
                Mandatory Administrative Reason:
              </label>
              <textarea
                rows={3}
                value={statusRationale}
                onChange={(e) => setStatusRationale(e.target.value)}
                placeholder="State the decision grounds, notice reference number, or committee directive..."
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowStatusModal(false)}
                disabled={isUpdating}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                className="px-4 py-1.5 text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded shadow-sm transition-colors"
              >
                {isUpdating ? "Updating..." : "Commit Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
