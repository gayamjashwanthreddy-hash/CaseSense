"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Topbar } from "@/components/layout/Topbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { InstitutionHeader } from "@/components/layout/InstitutionHeader";
import { useRole } from "@/lib/context/RoleContext";
import { Lock, ShieldAlert, ArrowRight } from "lucide-react";
import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoadingAuth } = useRole();
  const [instAuthed, setInstAuthed] = useState<boolean | null>(null);

  // Institution Portal (/institution/*)
  const isInstitutionRoute = pathname.startsWith("/institution");
  const isInstitutionLogin = pathname === "/institution/login";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("casebridge_inst_token") || localStorage.getItem("casebridge_jwt_token");
      setInstAuthed(Boolean(token));
    }
  }, [pathname]);

  // Administrative Console Routes
  const isAdmin =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/cases") ||
    pathname.startsWith("/institutions") ||
    pathname.startsWith("/overlap-review") ||
    pathname.startsWith("/reports") ||
    pathname.startsWith("/admin") ||
    pathname === "/intake";

  // Handle client-side redirect for unauthenticated admin access
  useEffect(() => {
    if (!isLoadingAuth && isAdmin && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAdmin, isAuthenticated, isLoadingAuth, pathname, router]);

  // Handle client-side redirect for unauthenticated institution access
  useEffect(() => {
    if (isInstitutionRoute && !isInstitutionLogin && instAuthed === false) {
      router.replace(`/institution/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isInstitutionRoute, isInstitutionLogin, instAuthed, pathname, router]);

  // Render Institution Portal Layout
  if (isInstitutionRoute) {
    if (!isInstitutionLogin && instAuthed === false) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#F7F7F4] border border-[#E3E5DE] rounded-xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#E8EEE7] text-[#344B3B] flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#20231F] font-serif">Institution Portal Restricted</h2>
            <p className="text-xs text-[#62665F] leading-relaxed">
              Institutional records are isolated and require verified permanent institute credentials.
            </p>
            <Link
              href={`/institution/login?redirect=${encodeURIComponent(pathname)}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#344B3B] hover:bg-[#293D30] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <span>Go to Institution Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex flex-col bg-white text-[#20231F] font-sans antialiased">
        {!isInstitutionLogin && <InstitutionHeader />}
        <main className="flex-1 bg-[#F7F7F4]">
          {children}
        </main>
        <footer className="bg-white border-t border-[#E3E5DE] text-[#62665F] text-center py-4 text-xs">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[11px] font-mono text-[#85877F]">
              AICTE Institutional Compliance & Grievance Portal &bull; SIH26264
            </span>
            <div className="space-x-4 text-[11px]">
              <Link href="/dashboard" className="text-[#344B3B] hover:underline font-medium">
                Official Admin Workspace
              </Link>
              <span className="text-[#D4D8CF]">&bull;</span>
              <Link href="/" className="text-[#62665F] hover:underline">
                Public Gateway
              </Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Render Administrative Console Layout
  if (isAdmin) {
    if (!isLoadingAuth && !isAuthenticated) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-[#F7F7F4] border border-[#E3E5DE] rounded-xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#E8EEE7] text-[#344B3B] flex items-center justify-center mx-auto">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#20231F] font-serif">Authentication Required</h2>
            <p className="text-xs text-[#62665F] leading-relaxed">
              CaseSense executive oversight dashboards are restricted to authorized AICTE bureau reviewers and officers.
            </p>
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#344B3B] hover:bg-[#293D30] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <span>Authenticate Official Session</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col min-h-screen bg-white text-[#20231F] font-sans antialiased">
        <Topbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-[#F7F7F4] p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    );
  }

  // Public Experience Routes (/, /about, /how-it-works, /help, /track-complaint, /login, /complaints/*)
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#20231F] font-sans antialiased">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
