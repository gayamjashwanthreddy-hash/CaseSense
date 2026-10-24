import React from "react";
import { CaseStatus, OverlapResolutionStatus } from "@/lib/api/types";

export function StatusBadge({
  status,
  size = "md",
}: {
  status: CaseStatus | OverlapResolutionStatus;
  size?: "sm" | "md";
}) {
  const sizeClasses = size === "sm" ? "text-[10px] px-2 py-0.5" : "text-[11px] px-2.5 py-0.5";

  switch (status) {
    case "OVERLAP_FLAGGED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-[#FBF1DB] text-[#925C0B] border border-[#F0DCB0] font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#925C0B] animate-pulse shrink-0" />
          <span>Overlap Flagged</span>
        </span>
      );
    case "JOINT_COMMITTEE":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-[#E8EEE7] text-[#344B3B] border border-[#D0DDD0] font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#344B3B] shrink-0" />
          <span>Joint Coordination</span>
        </span>
      );
    case "UNDER_INVESTIGATION":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-[#EAF0F6] text-[#496785] border border-[#C5D5E4] font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#496785] shrink-0" />
          <span>Inquiry Ongoing</span>
        </span>
      );
    case "NOTICE_ISSUED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-[#FBF1DB] text-[#925C0B] border border-[#F0DCB0] font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#925C0B] shrink-0" />
          <span>Notice Served</span>
        </span>
      );
    case "HEARING_SCHEDULED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-[#FBF1DB] text-[#925C0B] border border-[#F0DCB0] font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#925C0B] shrink-0" />
          <span>Hearing Listed</span>
        </span>
      );
    case "RESOLVED":
    case "CONFIRMED_LINKED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-[#E8F4EC] text-[#23734D] border border-[#C2E3CD] font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#23734D] shrink-0" />
          <span>{status === "CONFIRMED_LINKED" ? "Confirmed & Linked" : "Resolved"}</span>
        </span>
      );
    case "MERGED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-[#E8EEE7] text-[#344B3B] border border-[#D0DDD0] font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#344B3B] shrink-0" />
          <span>Consolidated</span>
        </span>
      );
    case "REJECTED_DISTINCT":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-[#F0F1ED] text-[#62665F] border border-[#E3E5DE] font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#85877F] shrink-0" />
          <span>Marked Distinct</span>
        </span>
      );
    case "DEFERRED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-[#FBF1DB] text-[#925C0B] border border-[#F0DCB0] font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#925C0B] shrink-0" />
          <span>Deferred for Evidence</span>
        </span>
      );
    case "PENDING_REVIEW":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-[#EAF0F6] text-[#496785] border border-[#C5D5E4] font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#496785] animate-pulse shrink-0" />
          <span>Pending Review</span>
        </span>
      );
    case "ESCALATED":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-[#FBEAEC] text-[#B42332] border border-[#F3C5CB] font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#B42332] shrink-0" />
          <span>Escalated</span>
        </span>
      );
    case "NEW_INTAKE":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-md bg-[#F0F1ED] text-[#62665F] border border-[#E3E5DE] font-mono tracking-tight ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#85877F] shrink-0" />
          <span>New Intake</span>
        </span>
      );
  }
}
