"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  GitCompare,
  Building2,
  FilePlus2,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  Database,
  ExternalLink,
} from "lucide-react";
import { CaseBridgeStore } from "@/lib/api/store";

export function Sidebar() {
  const pathname = usePathname();
  const [pendingOverlapCount, setPendingOverlapCount] = useState(0);
  const [activeCasesCount, setActiveCasesCount] = useState(0);

  useEffect(() => {
    const updateCounts = () => {
      const metrics = CaseBridgeStore.getDashboardMetrics();
      setPendingOverlapCount(metrics.pendingOverlapsCount);
      setActiveCasesCount(metrics.activeCount);
    };

    updateCounts();
    window.addEventListener("casebridge_store_updated", updateCounts);
    return () => window.removeEventListener("casebridge_store_updated", updateCounts);
  }, []);

  const navItems = [
    {
      label: "Executive Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "Complaint Explorer",
      href: "/cases",
      icon: FolderKanban,
      badge: activeCasesCount > 0 ? activeCasesCount : null,
      badgeColor: "bg-slate-800 text-slate-300 border border-slate-700",
    },
    {
      label: "Bureau Coordination",
      href: "/overlap-review",
      icon: GitCompare,
      badge: pendingOverlapCount > 0 ? `${pendingOverlapCount}` : null,
      badgeColor:
        "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-semibold",
    },
    {
      label: "Institution Profiles",
      href: "/institutions",
      icon: Building2,
      badge: null,
    },
    {
      label: "Complaint Intake",
      href: "/intake",
      icon: FilePlus2,
      badge: null,
    },
    {
      label: "Reports & Analytics",
      href: "/reports",
      icon: BarChart3,
      badge: null,
    },
    {
      label: "Access & Governance",
      href: "/admin/access",
      icon: ShieldCheck,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-[#0A1626] border-r border-[#162942] flex flex-col justify-between shrink-0 select-none min-h-[calc(100vh-3.5rem)] text-[#E2E8F0]">
      <div className="py-4">
        <div className="px-4 mb-3 flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#7D8FA9]">
            Console Navigation
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE
          </span>
        </div>

        <nav className="space-y-1 px-2.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-lg transition-all duration-150 ${
                  isActive
                    ? "bg-[#162D4A] text-white shadow-xs border border-[#2A4973]/70 font-semibold"
                    : "text-[#94A3B8] hover:text-white hover:bg-[#12233A]/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? "text-[#58A6FF]"
                        : "text-[#64748B] group-hover:text-[#94A3B8]"
                    }`}
                  />
                  <span className="tracking-tight">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                        item.badgeColor || "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <div className="w-1 h-3.5 rounded-full bg-[#58A6FF]" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System Telemetry & Quick Navigation */}
      <div className="p-3.5 border-t border-[#162942] bg-[#070F1B] space-y-3">
        <div className="flex items-center justify-between text-[11px]">
          <Link
            href="/"
            className="text-[#58A6FF] hover:text-blue-300 transition-colors font-medium flex items-center gap-1 text-[11px]"
          >
            <span>Public Home</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
          <Link
            href="/institution/dashboard"
            className="text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-1 text-[11px]"
          >
            <span>College Desk</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="pt-2 border-t border-[#162942]/60">
          <div className="flex items-center justify-between text-[10px] text-[#7D8FA9] font-mono">
            <span className="flex items-center gap-1">
              <Database className="w-3 h-3 text-[#58A6FF]" />
              <span>SUPABASE RLS</span>
            </span>
            <span className="text-emerald-400 font-semibold">ENFORCED</span>
          </div>
          <div className="text-[10px] text-[#64748B] mt-1 font-mono">
            AICTE Cross-Bureau Overlap Engine
          </div>
        </div>
      </div>
    </aside>
  );
}
