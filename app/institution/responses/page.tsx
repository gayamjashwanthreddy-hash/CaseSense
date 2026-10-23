"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Send,
  Building2,
  FileText,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Download,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { CaseBridgeStore } from "@/lib/api/store";
import { SupabaseDataService } from "@/lib/supabase/dataService";
import { InstitutionAccount, InstitutionResponse } from "@/lib/api/types";
import { formatDate } from "@/lib/utils";

export default function InstitutionResponsesLedgerPage() {
  const router = useRouter();
  const [institution, setInstitution] = useState<InstitutionAccount | null>(null);
  const [responses, setResponses] = useState<InstitutionResponse[]>([]);

  const loadData = () => {
    CaseBridgeStore.init();
    const current = CaseBridgeStore.getCurrentInstitution();
    if (!current) {
      router.push("/institution/login");
      return;
    }
    setInstitution(current);

    SupabaseDataService.getInstitutionResponses(current.institutionId).then((list) => {
      setResponses(list);
    });
  };

  useEffect(() => {
    loadData();
    window.addEventListener("casebridge_store_updated", loadData);
    return () => window.removeEventListener("casebridge_store_updated", loadData);
  }, []);

  if (!institution) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading responses ledger...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Filed Compliance Statements & Counter-Affidavits
            </h1>
            <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300">
              PID: {institution.institutionId}
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Historical legal record of institutional explanations submitted in response to AICTE notices.
          </p>
        </div>

        <Link
          href="/institution/complaints"
          className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs rounded transition-colors inline-flex items-center space-x-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Inquiries Requiring Reply</span>
        </Link>
      </div>

      {/* Responses List */}
      {responses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-slate-200 shadow-2xs space-y-3">
          <FileCheck className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-800 text-sm">No Statements on Record Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            When your institution responds to an official inquiry or show-cause notice, a permanent copy of your counter-affidavit and attached proofs will be logged here.
          </p>
          <div className="pt-2">
            <Link
              href="/institution/complaints"
              className="px-4 py-2 bg-blue-700 text-white font-semibold text-xs rounded shadow-xs"
            >
              Browse Open Inquiries
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {responses.map((r) => (
            <div
              key={r.id}
              className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-4 text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-blue-900 text-sm">{r.id}</span>
                  <span className="text-slate-300">|</span>
                  <Link
                    href={`/institution/complaints/${encodeURIComponent(r.caseId)}`}
                    className="font-mono font-semibold text-slate-800 hover:text-blue-700 transition-colors flex items-center space-x-1"
                  >
                    <span>Re: {r.caseId}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </Link>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[11px] text-slate-400">
                    Filed: {r.submittedAt}
                  </span>
                  <span className="font-semibold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded">
                    {r.status}
                  </span>
                </div>
              </div>

              {/* Statement Body */}
              <div className="p-4 bg-slate-50 rounded border border-slate-200 text-slate-800 leading-relaxed font-sans text-xs">
                &quot;{r.statement}&quot;
              </div>

              {/* Attached Compliance Proofs */}
              {r.complianceDocuments && r.complianceDocuments.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Attached Documentary Proofs:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {r.complianceDocuments.map((doc, idx) => (
                      <span
                        key={idx}
                        className="bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1 rounded text-[11px] font-mono flex items-center space-x-1.5"
                      >
                        <FileText className="w-3 h-3 text-slate-500" />
                        <span>{doc.name}</span>
                        <span className="text-slate-400">({doc.size})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Signatory & Scrutiny Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-2">
                <div>
                  Signatory: <strong className="text-slate-800">{r.submittedBy}</strong> ({r.officialDesignation})
                </div>
                <div>
                  Standing Committee Status: <span className="font-medium text-slate-700">{r.officialRemarks || "Pending Examination"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
