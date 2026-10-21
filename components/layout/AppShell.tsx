"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { EnvironmentNotice } from "@/components/layout/EnvironmentNotice";
import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { InstitutionHeader } from "@/components/layout/InstitutionHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Institution Portal (/institution/*)
  if (pathname.startsWith("/institution")) {
    const isLogin = pathname === "/institution/login";
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <EnvironmentNotice />
        {!isLogin && <InstitutionHeader />}
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-slate-900 text-slate-400 text-center py-4 text-xs border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>AICTE Institutional Compliance Portal • Prototype for SIH 2026 (SIH26264)</span>
            <div className="space-x-4 text-[11px]">
              <a href="/dashboard" className="text-blue-400 hover:underline">Official Admin Console</a>
              <span>•</span>
              <a href="/" className="text-slate-400 hover:underline">Public Homepage</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Administrative Console Routes
  const isAdmin =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/cases") ||
    pathname.startsWith("/institutions") ||
    pathname.startsWith("/overlap-review") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/admin") ||
    pathname === "/intake";

  if (isAdmin) {
    return (
      <div className="flex flex-col min-h-screen">
        <EnvironmentNotice />
        <Topbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  // Public Experience Routes (/, /about, /how-it-works, /help, /track-complaint, /login, /complaints/*)
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <EnvironmentNotice />
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
