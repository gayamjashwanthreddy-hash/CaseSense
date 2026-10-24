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
    return <div className="p-8 text-center text-xs text-[#62665F] font-mono">Loading responses ledger...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E3E5DE] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#20231F] tracking-tight">
              Filed Compliance Statements &amp; Counter-Affidavits
            </h1>
            <span className="font-mono text-xs font-bold bg-[#F7F7F4] text-[#20231F] px-2 py-0.5 rounded border border-[#E3E5DE]">
              PID: {institution.institutionId}
            </span>
          </div>
          <p className="text-[#62665F] text-xs mt-1 font-mono">
            Historical legal record of institutional explanations submitted in response to AICTE notices.
          </p>
        </div>

        <Link
          href="/institution/complaints"
          className="px-3.5 py-1.5 bg-[#344B3B] hover:bg-[#293D30] text-white font-semibold text-xs rounded-md transition-colors inline-flex items-center space-x-1.5 font-mono"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Inquiries Requiring Reply</span>
        </Link>
      </div>

      {/* Responses List */}
      {responses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-[#E3E5DE] shadow-xs space-y-3 font-mono">
          <FileCheck className="w-8 h-8 text-[#85877F] mx-auto" />
          <h3 className="font-bold text-[#20231F] text-sm">No Statements on Record Yet</h3>
          <p className="text-xs text-[#62665F] max-w-md mx-auto">
            When your institution responds to an official inquiry or show-cause notice, a permanent copy of your counter-affidavit and attached proofs will be logged here.
          </p>
          <div className="pt-2">
            <Link
              href="/institution/complaints"
              className="px-4 py-2 bg-[#344B3B] text-white font-semibold text-xs rounded-md shadow-xs"
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
              className="bg-white p-5 rounded-xl border border-[#E3E5DE] shadow-xs space-y-3 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-mono font-bold text-[#20231F]">
                  <span className="text-[#344B3B]">{r.id}</span>
                  <span>•</span>
                  <span className="text-[#62665F] font-normal">Re: {r.caseId}</span>
                </div>
                <span className="text-[10px] font-semibold bg-[#E8F4EC] text-[#23734D] border border-[#23734D]/25 px-2 py-0.5 rounded font-mono">
                  {r.status}
                </span>
              </div>

              <p className="text-[#20231F] leading-relaxed font-sans text-xs bg-[#F7F7F4] p-3.5 rounded-lg border border-[#E3E5DE]">
                &quot;{r.statement}&quot;
              </p>

              {r.complianceDocuments && r.complianceDocuments.length > 0 && (
                <div className="pt-1">
                  <span className="text-[10px] font-semibold text-[#85877F] block mb-1 font-mono">
                    Submitted Evidence Attachments:
                  </span>
                  <div className="flex flex-wrap gap-1.5 font-mono">
                    {r.complianceDocuments.map((doc, idx) => (
                      <span
                        key={idx}
                        className="bg-[#F7F7F4] text-[#20231F] border border-[#E3E5DE] px-2 py-0.5 rounded text-[11px] flex items-center space-x-1"
                      >
                        <FileText className="w-3 h-3 text-[#85877F]" />
                        <span>{doc.name}</span>
                        <span className="text-[#85877F]">({doc.size})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-[#E3E5DE] text-[11px] text-[#62665F] flex items-center justify-between font-mono">
                <span>Signatory: {r.submittedBy} ({r.officialDesignation})</span>
                <span>Filed: {r.submittedAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
