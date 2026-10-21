import React from "react";
import { BureauType } from "@/lib/api/types";

export function BureauBadge({ bureau }: { bureau: BureauType }) {
  switch (bureau) {
    case "REGULATION":
      return (
        <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded border bg-blue-50 text-blue-900 border-blue-200">
          Regulation Bureau (RB)
        </span>
      );
    case "PGRC":
      return (
        <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded border bg-indigo-50 text-indigo-900 border-indigo-200">
          PGRC Desk
        </span>
      );
    case "APPROVAL":
      return (
        <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded border bg-cyan-50 text-cyan-900 border-cyan-200">
          Approval Bureau (AB)
        </span>
      );
    case "LEGAL":
      return (
        <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded border bg-slate-100 text-slate-800 border-slate-300">
          Legal Cell
        </span>
      );
    case "CPGRAMS":
      return (
        <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded border bg-amber-50 text-amber-900 border-amber-200">
          CPGRAMS / MoE
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded border bg-slate-50 text-slate-700 border-slate-200">
          {bureau}
        </span>
      );
  }
}
