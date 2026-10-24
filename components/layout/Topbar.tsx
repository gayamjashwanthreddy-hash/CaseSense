"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Bell,
  Shield,
  UserCheck,
  ChevronDown,
  Building2,
  FileText,
  AlertTriangle,
  LogOut,
  ExternalLink,
  Command,
} from "lucide-react";
import { useRole } from "@/lib/context/RoleContext";
import { UserRole } from "@/lib/api/types";

export function Topbar() {
  const router = useRouter();
  const { currentUser, setCurrentUser, availableUsers, logout } = useRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/cases?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "ADMIN":
        return "bg-slate-900 text-slate-100 border-slate-700";
      case "REGULATION_OFFICER":
        return "bg-blue-900/10 text-blue-900 border-blue-900/30";
      case "PGRC_OFFICER":
        return "bg-indigo-900/10 text-indigo-900 border-indigo-900/30";
      case "APPROVAL_OFFICER":
        return "bg-teal-900/10 text-teal-900 border-teal-900/30";
      case "REVIEWER":
        return "bg-amber-900/10 text-amber-900 border-amber-900/30";
    }
  };

  return (
    <header className="h-14 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Left: Branding with Authentic AICTE Logo and GoI emblem */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center shadow-xs border border-slate-200 shrink-0 p-0.5">
            <img
              src="/branding/aicte-logo.png"
              alt="AICTE Official Logo"
              className="w-7 h-7 object-contain"
            />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold tracking-tight text-[#08121E] flex items-center gap-1.5 font-sans">
              <span>CaseBridge</span>
              <span className="text-[#1769AA] font-extrabold">AI</span>
              <span className="text-[9px] font-mono font-medium bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-300">
                SIH26264
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono -mt-0.5 hidden xs:block">
              AICTE Cross-Bureau Grievance & Overlap Resolution
            </div>
          </div>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md mx-4 lg:mx-8 hidden sm:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Case ID, AICTE PID, College Name, or Subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-12 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1769AA] focus:border-[#1769AA] focus:bg-white transition-all font-sans"
          />
          <div className="absolute right-2.5 top-2 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.2">
            ↵
          </div>
        </form>
      </div>

      {/* Right: Actions, Notifications & Role Switcher */}
      <div className="flex items-center gap-2">
        {/* Portal Switcher Quick Links */}
        <div className="hidden lg:flex items-center space-x-1 text-xs mr-2">
          <Link
            href="/"
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors"
            title="Open Public Website"
          >
            Public Site
          </Link>
          <Link
            href="/institution/dashboard"
            className="text-amber-800 hover:text-amber-900 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors"
            title="Open Institutional Compliance Desk"
          >
            College Desk
          </Link>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleMenu(false);
            }}
            className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative border border-transparent hover:border-slate-200"
            aria-label="System notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1 right-1 ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200/90 rounded-lg shadow-xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3.5 py-2 border-b border-slate-100 font-semibold text-slate-900 flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-700">
                  Operational Advisories
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-medium">
                  3 Pending
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                <div
                  onClick={() => {
                    router.push("/overlap-review/OVL-2026-001");
                    setShowNotifications(false);
                  }}
                  className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-amber-800 font-medium text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Cross-Bureau Overlap Flagged</span>
                  </div>
                  <div className="text-slate-600 mt-1 line-clamp-2 text-[11px]">
                    Pair OVL-2026-001: Apex Institute of Technology (PGRC & RB) requires lead coordination.
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">2 hours ago</div>
                </div>

                <div
                  onClick={() => {
                    router.push("/cases/AICTE/AB/2026/0199");
                    setShowNotifications(false);
                  }}
                  className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-rose-800 font-medium text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>Critical SLA Overdue Notice</span>
                  </div>
                  <div className="text-slate-600 mt-1 line-clamp-2 text-[11px]">
                    Case AICTE/AB/2026/0199 has exceeded standard 30-day resolution timeline.
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">Yesterday</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Role Persona Switcher */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all text-left"
          >
            <div className="w-6 h-6 rounded bg-[#0A1626] border border-[#162942] flex items-center justify-center font-bold text-[10px] text-white">
              {currentUser.avatarInitials}
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <span>{currentUser.name}</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${getRoleBadge(
                    currentUser.role
                  )}`}
                >
                  {currentUser.role.replace("_", " ")}
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono -mt-0.5">
                {currentUser.bureau} Bureau Desk
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200/90 rounded-lg shadow-xl py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                Switch Operational Persona
              </div>
              <div className="py-1">
                {availableUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                      user.id === currentUser.id
                        ? "bg-blue-50/60 font-medium text-blue-900 border-l-2 border-[#1769AA]"
                        : "text-slate-700"
                    }`}
                  >
                    <div className="w-6 h-6 rounded bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-semibold text-slate-800 shrink-0 mt-0.5">
                      {user.avatarInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 flex items-center justify-between">
                        <span className="truncate">{user.name}</span>
                        {user.id === currentUser.id && (
                          <span className="text-[9px] font-mono bg-blue-100 text-blue-700 px-1.5 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        {user.designation}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="pt-1 mt-1 border-t border-slate-100 px-2">
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setShowRoleMenu(false);
                    router.push("/login");
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-rose-700 hover:bg-rose-50 flex items-center space-x-2 font-medium transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out of Console</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
