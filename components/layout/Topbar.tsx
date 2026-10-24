"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Bell,
  UserCheck,
  ChevronDown,
  Building2,
  FileText,
  AlertTriangle,
  LogOut,
  ExternalLink,
  Shield,
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
        return "bg-[#F0F1EB] text-[#20231F] border-[#D4D8CF]";
      case "REGULATION_OFFICER":
        return "bg-[#E8EEE7] text-[#344B3B] border-[#D0DDD0]";
      case "PGRC_OFFICER":
        return "bg-[#EAF0F6] text-[#496785] border-[#C5D5E4]";
      case "APPROVAL_OFFICER":
        return "bg-[#E8F4EC] text-[#23734D] border-[#C2E3CD]";
      case "REVIEWER":
        return "bg-[#FBF1DB] text-[#925C0B] border-[#F0DCB0]";
    }
  };

  return (
    <header className="h-14 bg-white border-b border-[#E3E5DE] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Left: Branding with Authentic AICTE Logo and GoI emblem */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-[#E3E5DE] shrink-0 p-0.5">
            <img
              src="/branding/aicte-logo.png"
              alt="AICTE Official Logo"
              className="w-7 h-7 object-contain"
            />
          </div>
          <div>
            <div className="text-xs sm:text-sm font-bold tracking-tight text-[#20231F] flex items-center gap-1.5 font-serif">
              <span>CaseSense</span>
              <span className="text-[10px] font-mono font-medium bg-[#E8EEE7] text-[#344B3B] px-1.5 py-0.2 rounded border border-[#D0DDD0]">
                AICTE
              </span>
            </div>
            <div className="text-[10px] text-[#62665F] font-mono -mt-0.5 hidden xs:block">
              Multi-Bureau Grievance & Overlap Resolution
            </div>
          </div>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="flex-1 max-w-md mx-4 lg:mx-8 hidden sm:block">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-3.5 h-3.5 text-[#85877F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search complaints, AICTE Permanent ID (1-...), institution, or keyword..."
            className="w-full pl-9 pr-10 py-1.5 text-xs bg-[#F7F7F4] border border-[#E3E5DE] rounded-lg text-[#20231F] placeholder-[#85877F] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white transition-all font-sans"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-white border border-[#E3E5DE] px-1.5 py-0.2 rounded text-[#85877F]">
            Ctrl+K
          </kbd>
        </form>
      </div>

      {/* Right: Actions, Persona Switcher, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Quick Portal Switcher to Institution View */}
        <Link
          href="/institution/dashboard"
          className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium text-[#62665F] hover:text-[#344B3B] px-2.5 py-1 rounded-lg hover:bg-[#F7F7F4] border border-transparent hover:border-[#E3E5DE] transition-colors"
          title="Switch to College / Institute View"
        >
          <Building2 className="w-3.5 h-3.5 text-[#62665F]" />
          <span>Institute Portal</span>
          <ExternalLink className="w-2.5 h-2.5 text-[#85877F]" />
        </Link>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 text-[#62665F] hover:text-[#20231F] hover:bg-[#F7F7F4] rounded-lg transition-colors border border-[#E3E5DE]"
            aria-label="Pending notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#925C0B]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-[#E3E5DE] p-3 text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 border-b border-[#E3E5DE]">
                <span className="font-bold text-[#20231F]">Cross-Bureau Alerts</span>
                <span className="text-[10px] font-mono bg-[#FBF1DB] text-[#925C0B] px-1.5 py-0.5 rounded font-semibold">
                  3 Overlaps
                </span>
              </div>
              <div className="divide-y divide-[#E3E5DE] py-1">
                <Link
                  href="/overlap-review/OVL-2026-001"
                  onClick={() => setShowNotifications(false)}
                  className="block py-2 hover:bg-[#F7F7F4] px-1 rounded transition-colors"
                >
                  <div className="font-semibold text-[#20231F]">Apex Institute of Tech</div>
                  <div className="text-[11px] text-[#62665F] mt-0.5">
                    94% match between PGRC and Regulation files.
                  </div>
                </Link>
                <Link
                  href="/overlap-review/OVL-2026-002"
                  onClick={() => setShowNotifications(false)}
                  className="block py-2 hover:bg-[#F7F7F4] px-1 rounded transition-colors"
                >
                  <div className="font-semibold text-[#20231F]">Saraswati College of Eng</div>
                  <div className="text-[11px] text-[#62665F] mt-0.5">
                    88% match: Ghost faculty / bio-attendance conflict.
                  </div>
                </Link>
              </div>
              <div className="pt-2 border-t border-[#E3E5DE] text-center">
                <Link
                  href="/overlap-review"
                  onClick={() => setShowNotifications(false)}
                  className="text-[11px] text-[#344B3B] font-semibold hover:underline"
                >
                  View All Pending Overlaps &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Persona Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 p-1 pl-2 text-left rounded-lg hover:bg-[#F7F7F4] border border-[#E3E5DE] transition-colors"
          >
            <div className="w-6 h-6 rounded-md bg-[#E8EEE7] text-[#344B3B] font-bold text-xs flex items-center justify-center font-mono shrink-0">
              {currentUser.avatarInitials}
            </div>
            <div className="hidden md:block leading-tight pr-1">
              <div className="text-xs font-bold text-[#20231F] flex items-center gap-1.5">
                <span>{currentUser.name}</span>
                <span
                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded border font-semibold ${getRoleBadge(
                    currentUser.role
                  )}`}
                >
                  {currentUser.role.replace("_OFFICER", "")}
                </span>
              </div>
              <div className="text-[10px] text-[#62665F] truncate max-w-[170px]">
                {currentUser.designation}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#85877F] shrink-0" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-[#E3E5DE] p-2 text-xs z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1.5 border-b border-[#E3E5DE]">
                <div className="font-bold text-[#20231F]">AICTE Persona Switcher</div>
                <div className="text-[11px] text-[#85877F]">
                  Switch between statutory bureau cell reviewer accounts
                </div>
              </div>
              <div className="py-1">
                {availableUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => {
                      setCurrentUser(user);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                      currentUser.id === user.id
                        ? "bg-[#E8EEE7] text-[#344B3B] font-semibold"
                        : "text-[#62665F] hover:bg-[#F7F7F4] hover:text-[#20231F]"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-semibold">{user.name}</div>
                      <div className="text-[10px] text-[#85877F]">
                        {user.bureau} &bull; {user.role.replace("_OFFICER", "")}
                      </div>
                    </div>
                    {currentUser.id === user.id && (
                      <span className="w-2 h-2 rounded-full bg-[#344B3B]" />
                    )}
                  </button>
                ))}
              </div>
              <div className="pt-1.5 border-t border-[#E3E5DE]">
                <button
                  onClick={() => {
                    logout();
                    setShowRoleMenu(false);
                    router.push("/login");
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-700 hover:bg-rose-50 flex items-center gap-1.5 transition-colors font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out Session</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
