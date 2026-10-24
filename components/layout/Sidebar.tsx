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
  LifeBuoy,
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
      badgeColor: "bg-[#F0F1EB] text-[#20231F] border border-[#E3E5DE]",
    },
    {
      label: "Bureau Coordination",
      href: "/overlap-review",
      icon: GitCompare,
      badge: pendingOverlapCount > 0 ? `${pendingOverlapCount}` : null,
      badgeColor: "bg-[#FBF1DB] text-[#925C0B] border border-[#F0DCB0] font-mono font-bold",
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

  const isActive = (href: string) => {
    if (href === "/dashboard" && pathname === "/dashboard") return true;
    if (href !== "/dashboard" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E3E5DE] flex flex-col justify-between shrink-0 select-none hidden md:flex">
      {/* Primary Navigation Menu */}
      <div className="p-3.5 space-y-4">
        <div>
          <div className="text-[10px] font-bold text-[#85877F] uppercase tracking-wider px-3 mb-2 font-mono">
            Institutional Workspace
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors group ${
                    active
                      ? "bg-[#E8EEE7] text-[#344B3B] font-semibold"
                      : "text-[#62665F] hover:bg-[#F7F7F4] hover:text-[#20231F]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors shrink-0 ${
                        active
                          ? "text-[#344B3B]"
                          : "text-[#85877F] group-hover:text-[#20231F]"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                        item.badgeColor || "bg-[#F0F1EB] text-[#20231F]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Public Grievance Portal Link */}
        <div className="pt-2 border-t border-[#E3E5DE]">
          <div className="text-[10px] font-bold text-[#85877F] uppercase tracking-wider px-3 mb-2 font-mono">
            Public Gateway
          </div>
          <div className="space-y-1">
            <Link
              href="/"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#62665F] hover:bg-[#F7F7F4] hover:text-[#20231F] transition-colors"
            >
              <span>Public Landing Page</span>
              <ExternalLink className="w-3 h-3 text-[#85877F]" />
            </Link>
            <Link
              href="/track-complaint"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#62665F] hover:bg-[#F7F7F4] hover:text-[#20231F] transition-colors"
            >
              <span>Citizen Tracking Desk</span>
              <ExternalLink className="w-3 h-3 text-[#85877F]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-3 border-t border-[#E3E5DE] space-y-2 bg-[#F7F7F4]">
        <div className="p-2.5 rounded-lg border border-[#E3E5DE] bg-white text-[11px] space-y-1 text-[#62665F]">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#20231F] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#23734D]" />
              AICTE Grid Active
            </span>
            <span className="text-[9px] font-mono text-[#85877F]">v2.6</span>
          </div>
          <div className="text-[10px] text-[#85877F]">
            SIH26264 &bull; Code Ninja&apos;s
          </div>
        </div>
      </div>
    </aside>
  );
}
