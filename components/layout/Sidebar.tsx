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
      badgeColor: "bg-slate-200 text-slate-700",
    },
    {
      label: "Bureau Coordination",
      href: "/overlap-review",
      icon: GitCompare,
      badge: pendingOverlapCount > 0 ? `${pendingOverlapCount} Pending` : null,
      badgeColor: "bg-amber-100 text-amber-800 border border-amber-300 font-semibold",
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
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col justify-between shrink-0 select-none min-h-[calc(100vh-3.5rem)]">
      <div className="py-4">
        <div className="px-4 mb-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Administrative Modules
        </div>

        <nav className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? "bg-slate-200/80 text-slate-900 font-semibold border-l-2 border-blue-700"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-blue-700" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      item.badgeColor || "bg-slate-200 text-slate-700"
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

      {/* Footer Info: AICTE Reference & Portal Links */}
      <div className="p-3 border-t border-slate-200 text-[11px] text-slate-500 bg-white/50 space-y-2">
        <div className="flex items-center justify-between text-[10px]">
          <a href="/" className="text-blue-700 hover:underline font-medium">
            ← Public Website
          </a>
          <a href="/institution/dashboard" className="text-amber-800 hover:underline font-medium">
            Institution Portal →
          </a>
        </div>
        <div className="pt-1 border-t border-slate-100">
          <div className="font-semibold text-slate-700">AICTE Coordination Protocol</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Regulation Bureau &bull; PGRC &bull; Approval Bureau &bull; Legal Cell
          </div>
        </div>
      </div>
    </aside>
  );
}
