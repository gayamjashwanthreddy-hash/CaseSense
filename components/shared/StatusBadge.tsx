import React from "react";
import { CaseStatus, OverlapResolutionStatus } from "@/lib/api/types";

export function StatusBadge({
  status,
  size = "md",
}: {
  status: CaseStatus | OverlapResolutionStatus;
  size?: "sm" | "md";
}) {
  const sizeClasses = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-0.5";

  switch (status) {
    case "OVERLAP_FLAGGED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-500/10 text-amber-900 border border-amber-500/30 font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
          <span>Overlap Flagged</span>
        </span>
      );
    case "JOINT_COMMITTEE":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-indigo-500/10 text-indigo-900 border border-indigo-500/30 font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
          <span>Joint Coordination</span>
        </span>
      );
    case "UNDER_INVESTIGATION":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-blue-500/10 text-blue-900 border border-blue-500/30 font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
          <span>Inquiry Ongoing</span>
        </span>
      );
    case "NOTICE_ISSUED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-purple-500/10 text-purple-900 border border-purple-500/30 font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
          <span>Notice Served</span>
        </span>
      );
    case "HEARING_SCHEDULED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-orange-500/10 text-orange-900 border border-orange-500/30 font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
          <span>Hearing Listed</span>
        </span>
      );
    case "RESOLVED":
    case "CONFIRMED_LINKED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-emerald-500/10 text-emerald-900 border border-emerald-500/30 font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
          <span>{status === "CONFIRMED_LINKED" ? "Confirmed & Linked" : "Resolved"}</span>
        </span>
      );
    case "MERGED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-purple-500/10 text-purple-900 border border-purple-500/30 font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
          <span>Consolidated (Merged)</span>
        </span>
      );
    case "REJECTED_DISTINCT":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-slate-500/10 text-slate-700 border border-slate-300 font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          <span>Marked Distinct</span>
        </span>
      );
    case "DEFERRED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-amber-500/10 text-amber-900 border border-amber-500/30 font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
          <span>Deferred for Evidence</span>
        </span>
      );
    case "PENDING_REVIEW":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-blue-500/10 text-blue-900 border border-blue-500/30 font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
          <span>Pending Review</span>
        </span>
      );
    case "ESCALATED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-rose-500/10 text-rose-900 border border-rose-500/30 font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
          <span>Escalated</span>
        </span>
      );
    case "NEW_INTAKE":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-slate-500/10 text-slate-800 border border-slate-300 font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          <span>New Intake</span>
        </span>
      );
  }
}
