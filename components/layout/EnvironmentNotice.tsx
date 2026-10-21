"use client";

import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { CaseBridgeStore } from "@/lib/api/store";
import { useToast } from "@/lib/context/ToastContext";

export function EnvironmentNotice() {
  const { toast } = useToast();

  const handleReset = () => {
    if (confirm("Reset application data back to default AICTE seed dataset? All temporary modifications will be restored.")) {
      CaseBridgeStore.resetToDefaultSeed();
      toast({
        title: "Seed Data Restored",
        message: "Application re-initialized with benchmark AICTE multi-bureau records.",
        type: "info",
      });
    }
  };

  return (
    <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 border-b border-slate-800 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded text-[11px]">
          <AlertCircle className="w-3 h-3 text-amber-400" />
          SIMULATION ENVIRONMENT
        </span>
        <span className="text-slate-300 font-normal">
          SIH 2026 Problem SIH26264 &bull; Operating with synthesized multi-bureau technical institution records.
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded border border-slate-700 transition-colors"
          title="Restore baseline cases and overlaps"
        >
          <RotateCcw className="w-3 h-3" />
          Reset Demo Data
        </button>
      </div>
    </div>
  );
}
