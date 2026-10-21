import React from "react";
import { CaseStatus } from "@/lib/api/types";
import { AlertTriangle, Clock, CheckCircle2, ShieldAlert, GitMerge, FileText } from "lucide-react";

export function StatusBadge({ status }: { status: CaseStatus }) {
  switch (status) {
    case "OVERLAP_FLAGGED":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border bg-amber-50 text-amber-800 border-amber-300">
          <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
          <span>Overlap Flagged</span>
        </span>
      );
    case "JOINT_COMMITTEE":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border bg-indigo-50 text-indigo-800 border-indigo-200">
          <GitMerge className="w-3 h-3 text-indigo-600 shrink-0" />
          <span>Joint Coordination</span>
        </span>
      );
    case "UNDER_INVESTIGATION":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border bg-blue-50 text-blue-800 border-blue-200">
          <Clock className="w-3 h-3 text-blue-600 shrink-0" />
          <span>Inquiry Ongoing</span>
        </span>
      );
    case "NOTICE_ISSUED":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border bg-purple-50 text-purple-800 border-purple-200">
          <FileText className="w-3 h-3 text-purple-600 shrink-0" />
          <span>Notice Served</span>
        </span>
      );
    case "HEARING_SCHEDULED":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border bg-orange-50 text-orange-800 border-orange-200">
          <Clock className="w-3 h-3 text-orange-600 shrink-0" />
          <span>Hearing Listed</span>
        </span>
      );
    case "RESOLVED":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border bg-emerald-50 text-emerald-800 border-emerald-200">
          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>Resolved</span>
        </span>
      );
    case "ESCALATED":
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded border bg-rose-50 text-rose-800 border-rose-300">
          <ShieldAlert className="w-3 h-3 text-rose-600 shrink-0" />
          <span>Escalated</span>
        </span>
      );
    case "NEW_INTAKE":
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border bg-slate-100 text-slate-800 border-slate-300">
          <span>New Intake</span>
        </span>
      );
  }
}
