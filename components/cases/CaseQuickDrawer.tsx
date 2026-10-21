"use client";

import React from "react";
import Link from "next/link";
import { X, ExternalLink, Calendar, User, Building2, AlertTriangle, FileText, Clock } from "lucide-react";
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-[1px] flex justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <BureauBadge bureau={caseItem.bureau} />
              <PriorityBadge priority={caseItem.priority} />
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">{caseItem.id}</h2>
            <div className="text-xs text-slate-500 font-mono">Ref: {caseItem.refNumber}</div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Overlap banner if present */}
          {caseItem.hasOverlap && caseItem.overlapPairId && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-center justify-between text-amber-900 font-semibold">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Cross-Bureau Overlap Flagged
                </span>
                <Link
                  href={`/overlap-review/${caseItem.overlapPairId}`}
                  className="text-amber-800 hover:underline text-[11px] font-bold"
                >
                  Review Overlap &rarr;
                </Link>
              </div>
              <p className="text-amber-800 mt-1 text-[11px] leading-relaxed">
                This grievance matches subject matter or entity records with active proceedings in another bureau.
              </p>
            </div>
          )}

          {/* Institution Info */}
          <div className="bg-slate-50 p-3 rounded-md border border-slate-200 space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Institution</span>
            </div>
            <div className="font-semibold text-slate-900 text-sm">{caseItem.institutionName}</div>
            <div className="flex items-center gap-4 text-slate-600">
              <span>AICTE ID: <strong className="text-slate-800 font-mono">{caseItem.institutionId}</strong></span>
              <span>Region: <strong className="text-slate-800">{caseItem.institutionRegion}</strong></span>
            </div>
          </div>

          {/* Subject & Description */}
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Grievance Allegation
            </div>
            <div className="font-semibold text-slate-900 text-xs mb-1.5 leading-snug">
              {caseItem.subject}
            </div>
            <div className="text-slate-700 bg-white p-3 rounded border border-slate-200 leading-relaxed">
              {caseItem.description}
            </div>
          </div>

          {/* Complainant & Scrutiny Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Complainant</div>
              <div className="font-semibold text-slate-800 mt-0.5">{caseItem.complainantName}</div>
              <div className="text-slate-500 text-[11px] mt-0.5">{caseItem.complainantType}</div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Current Status</div>
              <div className="mt-1">
                <StatusBadge status={caseItem.status} />
              </div>
              <div className="text-slate-500 text-[11px] mt-1">Days open: {caseItem.daysOpen} days</div>
            </div>
          </div>

          {/* Officers & SLA */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Assigned Nodal Officer:</span>
              <span className="font-medium text-slate-900">{caseItem.assignedOfficer}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Received Date:</span>
              <span className="font-medium text-slate-900">{formatDate(caseItem.receivedDate)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Statutory SLA Deadline:</span>
              <span className="font-semibold text-rose-700">{formatDate(caseItem.slaDeadline)}</span>
            </div>
          </div>

          {/* Last Action Taken */}
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Latest Procedural Action
            </div>
            <div className="p-2.5 bg-slate-100 rounded text-slate-800 border border-slate-200">
              <div className="text-[11px] text-slate-500 font-mono mb-0.5">{formatDate(caseItem.lastActionDate)}</div>
              <div>{caseItem.lastActionSummary}</div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-200 rounded font-medium transition-colors"
          >
            Close Preview
          </button>

          <Link
            href={`/cases/${encodeURIComponent(caseItem.id)}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded text-xs font-semibold shadow-sm transition-colors"
          >
            <span>Open Complete Case File</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
