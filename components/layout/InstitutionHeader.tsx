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
    if (typeof window !== "undefined") {
      document.cookie = "casebridge_inst_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    router.push("/institution/login");
  };

  const navLinks = [
    { href: "/institution/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/institution/complaints", label: "Inquiries & Notices", icon: FileText },
    { href: "/institution/responses", label: "Compliance Responses", icon: Send },
    { href: "/institution/profile", label: "Institution Profile", icon: Building2 },
  ];

  return (
    <header className="bg-white border-b border-[#E3E5DE] sticky top-0 z-40 shadow-xs">
      {/* Top Banner: Institutional Verification Context */}
      <div className="bg-[#F7F7F4] text-[#62665F] px-4 py-1.5 text-[11px] font-medium border-b border-[#E3E5DE]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/branding/gov-india-emblem.png"
              alt="Government of India Emblem"
              className="h-5 sm:h-5.5 w-auto object-contain shrink-0"
            />
            <span className="font-semibold text-[#20231F] tracking-wide hidden sm:inline">
              GOVERNMENT OF INDIA
            </span>
            <span className="text-[#D4D8CF] hidden sm:inline">|</span>
            <span className="truncate">
              AICTE Compliance & Grievance Counter-Affidavit Gateway
            </span>
          </div>
          <div className="flex items-center space-x-3 text-[10px] text-[#85877F]">
            <span>SIH26264</span>
            <span className="bg-[#E8EEE7] text-[#344B3B] px-2 py-0.5 rounded font-mono font-medium">
              VERIFIED COLLEGE
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center border border-[#E3E5DE] shrink-0">
              <img
                src="/branding/aicte-logo.png"
                alt="AICTE Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif text-lg font-bold text-[#20231F]">CaseSense</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#E8EEE7] text-[#344B3B] font-semibold border border-[#D0DDD0]">
                  INSTITUTION PORTAL
                </span>
              </div>
              <div className="text-[11px] text-[#62665F] font-mono">
                {institution ? institution.institutionName : "Apex Institute of Technology, Pune"} &bull; PID: {institution ? institution.institutionId : "1-10492811"}
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    active
                      ? "bg-[#E8EEE7] text-[#344B3B] font-semibold"
                      : "text-[#62665F] hover:bg-[#F7F7F4] hover:text-[#20231F]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Account & Logout */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="text-right hidden sm:block">
              <div className="font-semibold text-[#20231F]">
                {institution?.contactPerson || "Dr. S. K. Deshmukh"}
              </div>
              <div className="text-[10px] text-[#85877F]">{institution?.designation || "Registrar"}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg border border-[#E3E5DE] text-[#62665F] hover:text-rose-700 hover:bg-rose-50 transition-colors"
              title="Sign Out Institution Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
