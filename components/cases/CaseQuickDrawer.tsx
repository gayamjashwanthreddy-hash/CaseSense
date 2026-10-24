"use client";

import React from "react";
import Link from "next/link";
import {
  X,
  ExternalLink,
  Calendar,
  Building2,
  AlertTriangle,
  FileText,
  Clock,
  Shield,
  UserCheck,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { ComplaintCase } from "@/lib/api/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BureauBadge } from "@/components/shared/BureauBadge";
import { PriorityBadge } from "@/components/shared/PriorityBadge";
import { formatDate } from "@/lib/utils";

export function CaseQuickDrawer({
  caseItem,
  onClose,
}: {
  caseItem: ComplaintCase | null;
  onClose: () => void;
}) {
  if (!caseItem) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#08121E]/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header - Editorial Deep Navy */}
        <div className="p-5 bg-[#0A1626] text-white flex items-start justify-between border-b border-[#142C46]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BureauBadge bureau={caseItem.bureau} />
              <PriorityBadge priority={caseItem.priority} />
            </div>
            <div>
              <h2 className="text-lg font-bold font-mono text-white tracking-tight">
                {caseItem.id}
              </h2>
              <div className="text-[11px] text-slate-400 font-mono">
                Ref: {caseItem.refNumber} &bull; Received {formatDate(caseItem.receivedDate)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs bg-[#F8FAFC]">
          {/* Overlap banner if present */}
          {caseItem.hasOverlap && caseItem.overlapPairId && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-amber-900 font-semibold">
                <span className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  Cross-Bureau Overlap Flagged
                </span>
                <Link
                  href={`/overlap-review/${caseItem.overlapPairId}`}
                  className="inline-flex items-center gap-1 text-amber-900 hover:text-amber-950 font-bold text-[11px] bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-md transition-colors"
                >
                  <span>Review Workspace</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <p className="text-amber-900/80 text-[11px] leading-relaxed">
                This grievance matches entity identity or allegation patterns with active proceedings in another bureau. Review side-by-side evidence to prevent duplicate proceedings.
              </p>
            </div>
          )}

          {/* Institution Dossier Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                Target Technical Institution
              </span>
              <Link
                href={`/institutions/${caseItem.institutionId}`}
                className="text-blue-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <span>360° Profile</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="font-bold text-slate-900 text-sm leading-snug">
              {caseItem.institutionName}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[10px]">AICTE Permanent ID:</span>
                <span className="font-mono font-semibold text-slate-800">{caseItem.institutionId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Region / State:</span>
                <span className="font-semibold text-slate-800">{caseItem.institutionRegion} ({caseItem.institutionState})</span>
              </div>
            </div>
          </div>

          {/* Grievance Statement Card */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Grievance Allegation Statement
            </div>
            <div className="font-bold text-slate-900 text-xs leading-snug">
              {caseItem.subject}
            </div>
            <div className="text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 leading-relaxed font-normal">
              {caseItem.description}
            </div>
          </div>

          {/* Complainant & Officer Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-slate-400" />
                <span>Complainant</span>
              </div>
              <div className="font-semibold text-slate-900">{caseItem.complainantName}</div>
              <div className="text-slate-500 text-[11px]">{caseItem.complainantType}</div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Statutory SLA</span>
              </div>
              <div className="font-mono font-semibold text-slate-900">{formatDate(caseItem.slaDeadline)}</div>
              <div className="text-slate-500 text-[11px]">{caseItem.daysOpen} days open</div>
            </div>
          </div>

          {/* Investigating Authority */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Assigned Investigating Officer
            </div>
            <div className="font-semibold text-slate-900">{caseItem.assignedOfficer}</div>
            <div className="text-[11px] text-slate-500">{caseItem.assignedOfficerRole}</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close Drawer
          </button>
          <Link
            href={`/cases/${encodeURIComponent(caseItem.id)}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
          >
            <span>Open Complete Dossier</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
