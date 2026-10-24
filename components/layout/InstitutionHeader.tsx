"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  FileText,
  Send,
  UserCheck,
  LogOut,
  ShieldAlert,
  ChevronDown,
  LayoutDashboard,
  CheckCircle2,
} from "lucide-react";
import { CaseBridgeStore } from "@/lib/api/store";
import { InstitutionAccount } from "@/lib/api/types";

export function InstitutionHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [institution, setInstitution] = useState<InstitutionAccount | null>(null);

  const loadInstitution = () => {
    const current = CaseBridgeStore.getCurrentInstitution();
    setInstitution(current);
  };

  useEffect(() => {
    CaseBridgeStore.init();
    loadInstitution();
    window.addEventListener("casebridge_store_updated", loadInstitution);
    return () => window.removeEventListener("casebridge_store_updated", loadInstitution);
  }, []);

  const handleLogout = () => {
    CaseBridgeStore.logoutInstitution();
    router.push("/institution/login");
  };

  const navLinks = [
    { href: "/institution/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/institution/complaints", label: "Inquiries & Notices", icon: FileText },
    { href: "/institution/responses", label: "Compliance Responses", icon: Send },
    { href: "/institution/profile", label: "Institution Profile", icon: Building2 },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
      {/* Top Banner: Institutional Verification Context */}
      <div className="bg-slate-950 text-slate-300 px-4 py-1.5 text-[11px] font-medium border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/branding/gov-india-emblem.png"
              alt="Government of India Emblem"
              className="h-5 sm:h-5.5 w-auto object-contain shrink-0"
            />
            <span className="font-semibold text-white tracking-wide hidden sm:inline">
              GOVERNMENT OF INDIA
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="font-semibold text-slate-200 tracking-wide">
              AICTE INSTITUTIONAL COMPLIANCE PORTAL
            </span>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline truncate">
              Authorized Technical Institution Workspace
            </span>
          </div>
          <div className="flex items-center space-x-3 text-slate-400 text-[10px]">
            <span className="bg-amber-900/60 text-amber-200 border border-amber-700/60 px-2 py-0.5 rounded font-mono">
              SIMULATED SESSION
            </span>
            <Link
              href="/dashboard"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Switch to Bureau Official Console →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Institution Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Institution Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center shadow-xs border border-slate-200 p-0.5 shrink-0">
              <img
                src="/branding/aicte-logo.png"
                alt="AICTE Official Logo"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div className="h-7 w-px bg-slate-200 hidden sm:block" />
            <div className="w-9 h-9 rounded-md bg-blue-950 flex items-center justify-center text-white font-bold border border-blue-900 shrink-0">
              <Building2 className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-sm leading-tight">
                  {institution ? institution.institutionName : "Institutional Compliance Desk"}
                </span>
                {institution && (
                  <span className="font-mono text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-300 font-semibold">
                    PID: {institution.institutionId}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                <span>{institution ? institution.contactPerson : "Official Signatory"}</span>
                <span>•</span>
                <span className="text-blue-700 font-medium">{institution?.designation || "Authorized Representative"}</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    active
                      ? "bg-blue-50 text-blue-900 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Logout */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-red-700 hover:bg-red-50 rounded-md border border-slate-300 transition-colors"
              title="Sign out of institution session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
