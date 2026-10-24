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
  UserCheck,
  ChevronRight,
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
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/30 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-[#E3E5DE] animate-in slide-in-from-right duration-200">
        {/* Header - Clean White */}
        <div className="p-5 bg-white text-[#20231F] flex items-start justify-between border-b border-[#E3E5DE]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BureauBadge bureau={caseItem.bureau} />
              <PriorityBadge priority={caseItem.priority} />
            </div>
            <div>
              <h2 className="text-base font-bold font-mono text-[#20231F] tracking-tight">
                {caseItem.id}
              </h2>
              <div className="text-[11px] text-[#85877F] font-mono">
                Ref: {caseItem.refNumber} &bull; Received {formatDate(caseItem.receivedDate)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#85877F] hover:text-[#20231F] hover:bg-[#F7F7F4] transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs bg-[#F7F7F4]">
          {/* Overlap banner if present */}
          {caseItem.hasOverlap && caseItem.overlapPairId && (
            <div className="p-4 bg-[#FBF1DB] border border-[#F0DCB0] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[#925C0B] font-semibold">
                <span className="flex items-center gap-2 text-xs font-bold text-[#925C0B]">
                  <AlertTriangle className="w-4 h-4 text-[#925C0B] shrink-0" />
                  Cross-Bureau Overlap Flagged
                </span>
                <Link
                  href={`/overlap-review/${caseItem.overlapPairId}`}
                  className="inline-flex items-center gap-1 text-[#925C0B] hover:underline font-bold text-[11px] bg-white px-2.5 py-1 rounded-md border border-[#F0DCB0] transition-colors"
                >
                  <span>Review Workspace</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <p className="text-[#925C0B] text-[11px] leading-relaxed">
                This grievance matches entity identity or allegation patterns with active proceedings in another bureau. Review side-by-side evidence to prevent duplicate proceedings.
              </p>
            </div>
          )}

          {/* Institution Dossier Card */}
          <div className="bg-white p-4 rounded-xl border border-[#E3E5DE] shadow-xs space-y-2.5">
            <div className="text-[10px] font-bold text-[#85877F] uppercase tracking-widest flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#344B3B]" />
                Target Technical Institution
              </span>
              <Link
                href={`/institutions/${caseItem.institutionId}`}
                className="text-[#344B3B] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>360° Profile</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="font-bold text-[#20231F] text-sm leading-snug">
              {caseItem.institutionName}
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#E3E5DE] text-[11px]">
              <div>
                <span className="text-[#85877F] block text-[10px]">AICTE Permanent ID:</span>
                <span className="font-mono font-semibold text-[#20231F]">{caseItem.institutionId}</span>
              </div>
              <div>
                <span className="text-[#85877F] block text-[10px]">Region / State:</span>
                <span className="font-semibold text-[#20231F]">{caseItem.institutionRegion} ({caseItem.institutionState})</span>
              </div>
            </div>
          </div>

          {/* Grievance Statement Card */}
          <div className="bg-white p-4 rounded-xl border border-[#E3E5DE] shadow-xs space-y-2">
            <div className="text-[10px] font-bold text-[#85877F] uppercase tracking-widest">
              Grievance Allegation Statement
            </div>
            <div className="font-bold text-[#20231F] text-xs leading-snug">
              {caseItem.subject}
            </div>
            <div className="text-[#62665F] bg-[#F7F7F4] p-3.5 rounded-lg border border-[#E3E5DE] leading-relaxed font-normal">
              {caseItem.description}
            </div>
          </div>

          {/* Complainant & Officer Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-white rounded-xl border border-[#E3E5DE] shadow-xs space-y-1">
              <div className="text-[10px] font-bold text-[#85877F] uppercase tracking-wider flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-[#85877F]" />
                <span>Complainant</span>
              </div>
              <div className="font-semibold text-[#20231F]">{caseItem.complainantName}</div>
              <div className="text-[#62665F] text-[11px]">{caseItem.complainantType}</div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-[#E3E5DE] shadow-xs space-y-1">
              <div className="text-[10px] font-bold text-[#85877F] uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#85877F]" />
                <span>Statutory SLA</span>
              </div>
              <div className="font-mono font-semibold text-[#20231F]">{formatDate(caseItem.slaDeadline)}</div>
              <div className="text-[#62665F] text-[11px]">{caseItem.daysOpen} days open</div>
            </div>
          </div>

          {/* Investigating Authority */}
          <div className="p-3.5 bg-white rounded-xl border border-[#E3E5DE] shadow-xs space-y-1">
            <div className="text-[10px] font-bold text-[#85877F] uppercase tracking-wider">
              Assigned Investigating Officer
            </div>
            <div className="font-semibold text-[#20231F]">{caseItem.assignedOfficer}</div>
            <div className="text-[11px] text-[#62665F]">{caseItem.assignedOfficerRole}</div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-[#E3E5DE] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#62665F] hover:text-[#20231F] hover:bg-[#F7F7F4] rounded-lg transition-colors"
          >
            Close Drawer
          </button>
          <Link
            href={`/cases/${encodeURIComponent(caseItem.id)}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#344B3B] hover:bg-[#293D30] rounded-lg shadow-xs transition-colors"
          >
            <span>Open Complete Dossier</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
