import React from "react";
import { BureauType } from "@/lib/api/types";

export function BureauBadge({ bureau }: { bureau: BureauType }) {
  switch (bureau) {
    case "REGULATION":
      return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-900/10 text-blue-900 border border-blue-900/20">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-800" />
          <span>RB • Regulation</span>
        </span>
      );
    case "PGRC":
      return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-900/10 text-indigo-900 border border-indigo-900/20">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-700" />
          <span>PGRC Desk</span>
        </span>
      );
    case "APPROVAL":
      return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-teal-900/10 text-teal-900 border border-teal-900/20">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-700" />
          <span>AB • Approval</span>
        </span>
      );
    case "LEGAL":
      return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-900/10 text-slate-800 border border-slate-900/20">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
          <span>Legal Cell</span>
        </span>
      );
    case "CPGRAMS":
      return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-900/10 text-amber-900 border border-amber-900/20">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-700" />
          <span>CPGRAMS • MoE</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span>{bureau}</span>
        </span>
      );
  }
}
