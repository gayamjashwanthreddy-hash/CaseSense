"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  UserCheck,
  History,
  Lock,
  Building2,
  CheckCircle2,
  UserCog,
  RefreshCw,
} from "lucide-react";
import { UserProfile, AuditLogEntry } from "@/lib/api/types";
import { CaseBridgeStore } from "@/lib/api/store";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { BureauBadge } from "@/components/shared/BureauBadge";
import { formatDateTime } from "@/lib/utils";
import { useRole } from "@/lib/context/RoleContext";
import { useToast } from "@/lib/context/ToastContext";

export default function AccessGovernancePage() {
  const { currentUser, setCurrentUser, availableUsers } = useRole();
  const { toast } = useToast();
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const loadData = () => {
    setAuditLogs(CaseBridgeStore.getAuditLogs());
  };

  useEffect(() => {
    CaseBridgeStore.init();
    loadData();
    window.addEventListener("casebridge_store_updated", loadData);
    return () => window.removeEventListener("casebridge_store_updated", loadData);
  }, []);

  const handleSwitchUser = (user: UserProfile) => {
    setCurrentUser(user);
    toast({
      title: "Persona Switched",
      message: `Active session now operating as ${user.name} (${user.designation}).`,
      type: "info",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-5 border-b border-[#E3E5DE]">
        <Breadcrumbs items={[{ label: "Access & Governance" }]} />
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#20231F] tracking-tight mt-1 flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-[#344B3B]" />
          <span>Role-Based Access Control &amp; Master Governance Audit Trail</span>
        </h1>
        <p className="text-xs text-[#62665F] font-mono mt-1">
          Federated administrative authorization matrix and immutable procedural logging across AICTE cells.
        </p>
      </div>

      {/* Authorized Users & Persona Switcher Table */}
      <div className="bg-white rounded-xl border border-[#E3E5DE] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E3E5DE] flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#20231F] flex items-center gap-2">
              <UserCog className="w-4 h-4 text-[#344B3B]" />
              <span>Authorized Administrative Officials</span>
            </h2>
            <p className="text-xs text-[#62665F] mt-0.5 font-mono">
              Click &quot;Switch to This Official&quot; to test scoped bureau perspectives and permission tiers.
            </p>
          </div>
          <span className="text-xs text-[#62665F] font-mono">
            Active: <strong className="text-[#344B3B]">{currentUser.name}</strong> ({currentUser.role})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="bg-[#F7F7F4] border-b border-[#E3E5DE] text-[#62665F] font-mono text-[11px] select-none">
                <th className="py-3 px-4 font-semibold">Official Name</th>
                <th className="py-3 px-4 font-semibold">Designation &amp; Department</th>
                <th className="py-3 px-4 font-semibold">Bureau Scope</th>
                <th className="py-3 px-4 font-semibold">Role Permission Tier</th>
                <th className="py-3 px-4 font-semibold">Official Email</th>
                <th className="py-3 px-4 font-semibold text-right">Session Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5DE]">
              {availableUsers.map((user) => {
                const isCurrent = user.id === currentUser.id;
                return (
                  <tr
                    key={user.id}
                    className={`transition-colors ${
                      isCurrent ? "bg-[#E8EEE7]/40 font-medium" : "hover:bg-[#F7F7F4]"
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-[#20231F] flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-[#E8EEE7] flex items-center justify-center font-bold text-[10px] text-[#344B3B] font-mono">
                        {user.avatarInitials}
                      </div>
                      <span>{user.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] bg-[#E8EEE7] text-[#344B3B] px-1.5 py-0.2 rounded font-bold font-mono">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#62665F]">{user.designation}</td>
                    <td className="py-3 px-4">
                      <BureauBadge bureau={user.bureau} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] bg-[#F7F7F4] px-2 py-0.5 rounded text-[#20231F] border border-[#E3E5DE]">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#62665F] text-[11px]">{user.email}</td>
                    <td className="py-3 px-4 text-right">
                      {isCurrent ? (
                        <span className="text-[#23734D] font-semibold text-xs inline-flex items-center gap-1 font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Logged In</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSwitchUser(user)}
                          className="inline-flex items-center gap-1 bg-white hover:bg-[#F7F7F4] border border-[#E3E5DE] text-[#20231F] text-xs px-2.5 py-1 rounded-md font-medium shadow-xs transition-colors font-mono"
                        >
                          <RefreshCw className="w-3 h-3 text-[#62665F]" />
                          <span>Switch to This Official</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Master Real-Time Governance Audit Trail */}
      <div className="bg-white rounded-xl border border-[#E3E5DE] shadow-xs overflow-hidden">
        <div className="p-4 border-b border-[#E3E5DE] flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-sm font-bold text-[#20231F] flex items-center gap-2">
              <History className="w-4 h-4 text-[#344B3B]" />
              <span>Master Procedural Governance Log</span>
            </h2>
            <p className="text-xs text-[#62665F] mt-0.5 font-mono">
              Chronological log of all intake registrations, overlap resolutions, status changes, and notices.
            </p>
          </div>
          <span className="text-xs text-[#62665F] font-mono">
            {auditLogs.length} Records Cataloged
          </span>
        </div>

        <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead className="sticky top-0 z-10 bg-[#F7F7F4] border-b border-[#E3E5DE] text-[#62665F] font-mono text-[11px] select-none">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Case ID</th>
                <th className="py-3 px-4 font-semibold">Procedural Action</th>
                <th className="py-3 px-4 font-semibold">Performed By &amp; Bureau</th>
                <th className="py-3 px-4 font-semibold">Administrative Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E5DE]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F7F7F4] transition-colors">
                  <td className="py-2.5 px-4 font-mono text-[11px] text-[#62665F] whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-[#344B3B]">
                    {log.caseId}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-[#20231F]">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-4 text-[#62665F]">
                    <span className="font-medium text-[#20231F]">{log.performedBy}</span>
                    <span className="text-[10px] text-[#85877F] block font-mono">{log.role} ({log.bureau})</span>
                  </td>
                  <td className="py-2.5 px-4 text-[#62665F] max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
