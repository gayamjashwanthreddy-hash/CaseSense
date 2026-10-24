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
      <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-slate-900 font-sans antialiased">
        <EnvironmentNotice />
        {!isLogin && <InstitutionHeader />}
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-[#0A1626] text-slate-400 text-center py-4 text-xs border-t border-[#162942]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-mono text-[11px] text-slate-400">
              AICTE Institutional Compliance Portal &bull; Prototype for SIH 2026 (SIH26264)
            </span>
            <div className="space-x-3 text-[11px] font-mono">
              <a href="/dashboard" className="text-[#58A6FF] hover:underline">
                Official Admin Console
              </a>
              <span className="text-slate-600">&bull;</span>
              <a href="/" className="text-slate-400 hover:underline">
                Public Gateway
              </a>
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
      <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
        <EnvironmentNotice />
        <Topbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-[#F7F9FC] p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  // Public Experience Routes (/, /about, /how-it-works, /help, /track-complaint, /login, /complaints/*)
  return (
    <div className="min-h-screen flex flex-col bg-[#08121E] text-[#F5F3ED] font-sans antialiased selection:bg-[#1769AA] selection:text-white">
      <EnvironmentNotice />
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
