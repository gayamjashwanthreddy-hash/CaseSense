import React from "react";
import { PriorityLevel } from "@/lib/api/types";

export function PriorityBadge({ priority }: { priority: PriorityLevel }) {
  switch (priority) {
    case "CRITICAL":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-600/10 text-rose-800 border border-rose-500/30 uppercase tracking-tight">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
          <span>Critical</span>
        </span>
      );
    case "HIGH":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-800 border border-amber-500/30 uppercase tracking-tight">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>High</span>
        </span>
      );
    case "MEDIUM":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 uppercase tracking-tight">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span>Medium</span>
        </span>
      );
    case "LOW":
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-normal px-1.5 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200 uppercase tracking-tight">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          <span>Routine</span>
        </span>
      );
  }
}
