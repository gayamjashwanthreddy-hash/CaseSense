import React from "react";
import { PriorityLevel } from "@/lib/api/types";

export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  switch (priority) {
    case "CRITICAL":
      return (
        <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded border bg-rose-100 text-rose-800 border-rose-300">
          Critical
        </span>
      );
    case "HIGH":
      return (
        <span className="inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded border bg-orange-50 text-orange-800 border-orange-300">
          High
        </span>
      );
    case "MEDIUM":
      return (
        <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded border bg-slate-100 text-slate-700 border-slate-300">
          Medium
        </span>
      );
    case "LOW":
    default:
      return (
        <span className="inline-flex items-center text-[10px] font-normal px-1.5 py-0.5 rounded border bg-slate-50 text-slate-600 border-slate-200">
          Routine
        </span>
      );
  }
}
