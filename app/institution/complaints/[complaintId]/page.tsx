"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldAlert,
  Building2,
  FileText,
  Send,
  Upload,
  CheckCircle2,
  Clock,
  ArrowLeft,
  AlertTriangle,
  Lock,
  Download,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { CaseBridgeStore } from "@/lib/api/store";
import { SupabaseDataService } from "@/lib/supabase/dataService";
import { InstitutionAccount, ComplaintCase, InstitutionResponse } from "@/lib/api/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BureauBadge } from "@/components/shared/BureauBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/lib/context/ToastContext";

export default function InstitutionComplaintDetailPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = (params?.complaintId as string) || "";
  const decodedId = decodeURIComponent(rawId);
  const { toast } = useToast();

  const [institution, setInstitution] = useState<InstitutionAccount | null>(null);
  const [complaint, setComplaint] = useState<ComplaintCase | null>(null);
  const [isAccessDenied, setIsAccessDenied] = useState(false);

  // Response Form State
  const [statement, setStatement] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; type: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingResponses, setExistingResponses] = useState<InstitutionResponse[]>([]);

  const loadData = () => {
    CaseBridgeStore.init();
    const current = CaseBridgeStore.getCurrentInstitution();
    if (!current) {
      router.push("/institution/login");
      return;
    }
    setInstitution(current);

    const c = CaseBridgeStore.getCaseById(decodedId);
    if (!c) {
      setComplaint(null);
      return;
    }

    // STRICT SERVER-STYLE SCOPE CHECK: Cannot view other institutions' cases
    if (c.institutionId.toLowerCase() !== current.institutionId.toLowerCase()) {
      setIsAccessDenied(true);
      return;
    }

    setIsAccessDenied(false);
    setComplaint(c);

    // Load responses for this case
    const allResponses = CaseBridgeStore.getInstitutionResponses(current.institutionId);
    setExistingResponses(allResponses.filter((r) => r.caseId === c.id));
  };

  useEffect(() => {
    loadData();
    window.addEventListener("casebridge_store_updated", loadData);
    return () => window.removeEventListener("casebridge_store_updated", loadData);
  }, [decodedId]);

  if (!institution) {
    return <div className="p-8 text-center text-xs text-slate-500">Checking credentials...</div>;
  }

  // ACCESS DENIED VIEW
  if (isAccessDenied) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto border border-red-300">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-red-950">
          403 — Unauthorized Resource Access Denied
        </h1>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          Case docket <span className="font-mono font-bold text-slate-900">{decodedId}</span> belongs to another technical institution. Institutional access is strictly scoped to PID <strong>{institution.institutionId}</strong> ({institution.institutionName}).
        </p>
        <div className="pt-2">
          <Link
            href="/institution/complaints"
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded transition-colors inline-flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Permitted Complaints Ledger</span>
          </Link>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4 text-xs text-slate-500">
        <div>Case docket not found in registry.</div>
        <Link href="/institution/complaints" className="text-blue-700 hover:underline">
          Return to complaints list
        </Link>
      </div>
    );
  }

  const handleSimulatedDoc = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploadedFiles((prev) => [
      ...prev,
      {
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || "Document",
      },
    ]);
    toast(`Attached document ${file.name}`, "info");
  };

  const handleQuickPresetDoc = (name: string, size: string) => {
    setUploadedFiles((prev) => [...prev, { name, size, type: "PDF" }]);
    toast(`Attached sample proof: ${name}`, "info");
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statement.trim() || statement.trim().length < 20) {
      toast("Please provide a substantial counter-affidavit statement (minimum 20 characters).", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      await SupabaseDataService.submitInstitutionResponse({
        caseId: complaint.id,
        institutionId: institution.institutionId,
        submittedBy: institution.contactPerson,
        officialDesignation: institution.designation,
        statement,
        complianceDocuments: uploadedFiles,
      });

      setIsSubmitting(false);
      setStatement("");
      setUploadedFiles([]);
      toast("Formal response filed with AICTE registry.", "success");
    } catch {
      setIsSubmitting(false);
      toast("Error submitting response to database.", "error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/institution/complaints"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Inquiries Ledger</span>
        </Link>
      </div>

      {/* Case Header Dossier */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-base font-bold text-slate-900">
                {complaint.id}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                (Ref: {complaint.refNumber})
              </span>
            </div>
            <h1 className="text-base font-bold text-slate-900 mt-0.5">
              {complaint.subject}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <BureauBadge bureau={complaint.bureau} />
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
          </div>
        </div>

        {/* Key Inquiry Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-md bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Inquiry Bureau
            </span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              {complaint.assignedBureau} Desk
            </span>
            <span className="text-[11px] text-slate-500">Officer: {complaint.assignedOfficer}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Violation Category
            </span>
            <span className="font-semibold text-slate-800 mt-0.5 block">
              {complaint.category.replace(/_/g, " ")}
            </span>
            <span className="text-[11px] text-slate-500">Lodged: {formatDate(complaint.receivedDate)}</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Mandatory Reply Deadline
            </span>
            <span className="font-bold text-red-700 mt-0.5 block">
              {formatDate(complaint.nextActionDeadline)}
            </span>
            <span className="text-[11px] text-slate-500">14-Day Statutory Window</span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Complainant Standing
            </span>
            <span className="font-medium text-slate-700 mt-0.5 block">
              {complaint.complainantType}
            </span>
            <span className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Contact details redacted</span>
            </span>
          </div>
        </div>

        {/* Factual Allegation particulars */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Factual Allegation Description Dispatched by Bureau:
          </span>
          <div className="p-4 bg-slate-50 rounded border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans">
            {complaint.description}
          </div>
        </div>

        {/* Regulatory Clauses Cited */}
        {complaint.relevantClauses && complaint.relevantClauses.length > 0 && (
          <div className="pt-2">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">
              AICTE Regulatory Handbooks / Clauses Cited in Notice:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {complaint.relevantClauses.map((clause, idx) => (
                <span
                  key={idx}
                  className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-medium"
                >
                  {clause}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FORMAL COUNTER-AFFIDAVIT RESPONSE FORM */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Send className="w-4 h-4 text-amber-600" />
              <span>Submit Formal Institutional Counter-Statement & Proofs</span>
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Filed under the seal and signature of {institution.contactPerson} ({institution.designation}).
            </p>
          </div>
          <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-mono font-semibold">
            NATURAL JUSTICE DESK
          </span>
        </div>

        <form onSubmit={handleSubmitResponse} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Official Institutional Statement / Factual Clarification *
            </label>
            <textarea
              required
              rows={6}
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Detail your institutional rebuttal, committee resolutions, return receipts of original documents, or fee structure compliance certificates in response to the specific allegations..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-600"
            />
          </div>

          {/* Evidence Attachments */}
          <div className="space-y-2">
            <label className="block font-semibold text-slate-700">
              Attach Compliance Evidence Documents (PDF/Scanned Affidavits)
            </label>
            <input
              type="file"
              onChange={handleSimulatedDoc}
              className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-800 hover:file:bg-amber-100"
            />

            {/* Quick Demo Proof Attachments */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400">Quick Demo Attachments:</span>
              <button
                type="button"
                onClick={() =>
                  handleQuickPresetDoc("Board_of_Governors_Resolution_2026.pdf", "1.2 MB")
                }
                className="text-[10px] bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 px-2 py-0.5 rounded border border-slate-200"
              >
                + BOG Resolution (PDF)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickPresetDoc("Student_Receipt_Ledger_Signed.pdf", "2.4 MB")
                }
                className="text-[10px] bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-900 px-2 py-0.5 rounded border border-slate-200"
              >
                + Student Receipt Ledger (PDF)
              </button>
            </div>

            {/* Uploaded List */}
            {uploadedFiles.length > 0 && (
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1 mt-2">
                <div className="text-[11px] font-semibold text-slate-700">
                  Files ready to submit ({uploadedFiles.length}):
                </div>
                {uploadedFiles.map((f, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] bg-white p-2 rounded border border-slate-200">
                    <span className="font-mono">{f.name}</span>
                    <span className="font-mono text-slate-400">{f.size}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-md shadow-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Filing with AICTE..." : "Submit Formal Counter-Affidavit to AICTE"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* History of Filed Responses */}
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>Responses Filed for this Docket ({existingResponses.length})</span>
        </h2>

        {existingResponses.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded border border-slate-100">
            No previous statements on record for this specific case docket.
          </div>
        ) : (
          <div className="space-y-3">
            {existingResponses.map((resp) => (
              <div
                key={resp.id}
                className="p-4 rounded-md bg-slate-50 border border-slate-200 text-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-mono font-bold text-slate-900">
                    <span className="text-blue-900">{resp.id}</span>
                    <span>•</span>
                    <span className="text-slate-500 text-[11px] font-normal">{resp.submittedAt}</span>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                    {resp.status}
                  </span>
                </div>

                <p className="text-slate-800 leading-relaxed font-sans text-xs">
                  {resp.statement}
                </p>

                {resp.complianceDocuments && resp.complianceDocuments.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                      Submitted Compliance Documents:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {resp.complianceDocuments.map((doc, idx) => (
                        <span
                          key={idx}
                          className="bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[11px] font-mono flex items-center space-x-1"
                        >
                          <FileText className="w-3 h-3 text-slate-400" />
                          <span>{doc.name}</span>
                          <span className="text-slate-400">({doc.size})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Signatory: {resp.submittedBy} ({resp.officialDesignation})</span>
                  <span>Bureau Scrutiny Status: {resp.officialRemarks || "Pending Standing Review"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
