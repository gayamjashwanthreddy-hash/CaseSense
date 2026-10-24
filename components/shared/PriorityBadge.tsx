import React from "react";
import { PriorityLevel } from "@/lib/api/types";

export function PriorityBadge({
  priority,
  size = "md",
}: {
  priority: PriorityLevel;
  size?: "sm" | "md";
}) {
  const sizeClasses = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-0.5";

  switch (priority) {
    case "CRITICAL":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded font-mono uppercase tracking-wider bg-[#FBEAEC] text-[#B42332] border border-[#F3C5CB] ${sizeClasses}`}
        >
          <span className="w-1 h-1 rounded-full bg-[#B42332]" />
          <span>Critical</span>
        </span>
      );
    case "HIGH":
      return (
        <span
          className={`inline-flex items-center gap-1 font-semibold rounded font-mono uppercase tracking-wider bg-[#FBF1DB] text-[#925C0B] border border-[#F0DCB0] ${sizeClasses}`}
        >
          <span className="w-1 h-1 rounded-full bg-[#925C0B]" />
          <span>High Priority</span>
        </span>
      );
    case "MEDIUM":
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded font-mono uppercase tracking-wider bg-[#EAF0F6] text-[#496785] border border-[#C5D5E4] ${sizeClasses}`}
        >
          <span>Medium</span>
        </span>
      );
    case "LOW":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 font-medium rounded font-mono uppercase tracking-wider bg-[#F0F1ED] text-[#62665F] border border-[#E3E5DE] ${sizeClasses}`}
        >
          <span>Routine</span>
        </span>
      );
  }
}
