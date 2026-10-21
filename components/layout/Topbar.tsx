"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bell,
  Shield,
  UserCheck,
  ChevronDown,
  Building2,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { useRole } from "@/lib/context/RoleContext";
import { UserRole } from "@/lib/api/types";

export function Topbar() {
  const router = useRouter();
  const { currentUser, setCurrentUser, availableUsers } = useRole();
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
        return "bg-slate-800 text-white";
      case "REGULATION_OFFICER":
        return "bg-blue-800 text-blue-50";
      case "PGRC_OFFICER":
        return "bg-indigo-800 text-indigo-50";
      case "APPROVAL_OFFICER":
        return "bg-cyan-800 text-cyan-50";
      case "REVIEWER":
        return "bg-amber-800 text-amber-50";
    }
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Branding */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-navy-900 flex items-center justify-center text-white font-bold text-xs tracking-wider shadow-sm border border-slate-700">
            AICTE
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>CaseBridge AI</span>
              <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-300">
                SIH26264
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium -mt-0.5">
              Cross-Bureau Grievance & Overlap Resolution
            </div>
          </div>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md mx-6">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by Case ID, AICTE Inst ID, College Name, or Complainant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-md pl-8 pr-3 py-1.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white transition-all"
          />
        </form>
      </div>

      {/* Right: Actions, Notifications & Role Switcher */}
      <div className="flex items-center gap-2.5">
        {/* Portal Switcher Quick Links */}
        <div className="hidden lg:flex items-center space-x-1.5 text-xs mr-2">
          <a
            href="/"
            className="text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 px-2 py-1 rounded text-[11px] font-medium transition-colors"
            title="Open Public Website"
          >
            Public Site
          </a>
          <a
            href="/institution/dashboard"
            className="text-slate-600 hover:text-amber-800 bg-slate-100 hover:bg-amber-50 px-2 py-1 rounded text-[11px] font-medium transition-colors"
            title="Open Institutional Compliance Desk"
          >
            Institution Desk
          </a>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleMenu(false);
            }}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-transparent hover:border-slate-200 relative transition-colors"
            title="Notifications & Alerts"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-md shadow-lg py-2 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-slate-100 font-semibold text-slate-900 flex items-center justify-between">
                <span>Recent System Advisories</span>
                <span className="text-[10px] text-amber-600 font-medium">3 Pending</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                <div
                  onClick={() => {
                    router.push("/overlap-review/OVL-2026-001");
                    setShowNotifications(false);
                  }}
                  className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Cross-Bureau Overlap Flagged</span>
                  </div>
                  <div className="text-slate-600 mt-1 line-clamp-2">
                    Pair OVL-2026-001: Apex Institute of Technology (PGRC & RB) requires lead coordination.
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">2 hours ago</div>
                </div>

                <div
                  onClick={() => {
                    router.push("/cases/AICTE/AB/2026/0199");
                    setShowNotifications(false);
                  }}
                  className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-1.5 text-rose-700 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Critical SLA Overdue Notice</span>
                  </div>
                  <div className="text-slate-600 mt-1 line-clamp-2">
                    Case AICTE/AB/2026/0199 has exceeded standard 30-day resolution timeline.
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Yesterday</div>
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
            className="flex items-center gap-2 px-2.5 py-1 rounded border border-slate-200 hover:bg-slate-50 transition-colors text-left"
          >
            <div className="w-6 h-6 rounded bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-[11px] text-slate-700">
              {currentUser.avatarInitials}
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                <span>{currentUser.name}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${getRoleBadge(currentUser.role)}`}>
                  {currentUser.role.replace("_", " ")}
                </span>
              </div>
              <div className="text-[10px] text-slate-500">{currentUser.bureau} Bureau</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-md shadow-lg py-1.5 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Switch Official Persona
              </div>
              <div className="py-1">
                {availableUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-start gap-2 hover:bg-slate-50 transition-colors ${
                      user.id === currentUser.id ? "bg-blue-50/50 font-medium text-blue-900" : "text-slate-700"
                    }`}
                  >
                    <div className="w-5 h-5 rounded bg-slate-200 flex items-center justify-center text-[10px] font-semibold text-slate-700 shrink-0 mt-0.5">
                      {user.avatarInitials}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900 flex items-center gap-1.5">
                        <span>{user.name}</span>
                        {user.id === currentUser.id && (
                          <span className="text-[9px] bg-blue-100 text-blue-700 px-1 rounded">Active</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500">{user.designation}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
