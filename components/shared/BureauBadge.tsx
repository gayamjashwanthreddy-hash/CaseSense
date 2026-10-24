import React from "react";
import { BureauType } from "@/lib/api/types";

export function BureauBadge({
  bureau,
  size = "md",
}: {
  bureau: BureauType;
  size?: "sm" | "md";
}) {
  const sizeClasses = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-[11px] px-2 py-0.5";

  switch (bureau) {
    case "REGULATION":
      return (
        <span
          className={`inline-flex items-center font-semibold rounded bg-[#E8EEE7] text-[#344B3B] border border-[#D0DDD0] font-mono tracking-tight ${sizeClasses}`}
        >
          RB &bull; Regulation
        </span>
      );
    case "PGRC":
      return (
        <span
          className={`inline-flex items-center font-semibold rounded bg-[#EAF0F6] text-[#496785] border border-[#C5D5E4] font-mono tracking-tight ${sizeClasses}`}
        >
          PGRC Desk
        </span>
      );
    case "APPROVAL":
      return (
        <span
          className={`inline-flex items-center font-semibold rounded bg-[#F7F7F4] text-[#20231F] border border-[#E3E5DE] font-mono tracking-tight ${sizeClasses}`}
        >
          AB &bull; Approval
        </span>
      );
    case "LEGAL":
      return (
        <span
          className={`inline-flex items-center font-semibold rounded bg-[#FBF1DB] text-[#925C0B] border border-[#F0DCB0] font-mono tracking-tight ${sizeClasses}`}
        >
          Legal Cell
        </span>
      );
    case "CPGRAMS":
    default:
      return (
        <span
          className={`inline-flex items-center font-semibold rounded bg-[#F0F1ED] text-[#62665F] border border-[#E3E5DE] font-mono tracking-tight ${sizeClasses}`}
        >
          CPGRAMS Desk
        </span>
      );
  }
}
