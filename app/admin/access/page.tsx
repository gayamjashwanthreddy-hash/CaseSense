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
      <div className="pb-3 border-b border-slate-200">
        <Breadcrumbs items={[{ label: "Access & Governance" }]} />
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-700" />
          <span>Role-Based Access Control & Master Governance Audit Trail</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Federated administrative authorization matrix and immutable procedural logging across AICTE cells.
        </p>
      </div>

      {/* Authorized Users & Persona Switcher Table */}
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCog className="w-4 h-4 text-blue-700" />
              <span>Authorized Administrative Officials</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click &quot;Switch to This Official&quot; to test scoped bureau perspectives and permission tiers.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Active: <strong className="text-blue-700">{currentUser.name}</strong> ({currentUser.role})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-4">Official Name</th>
                <th className="py-2.5 px-4">Designation & Department</th>
                <th className="py-2.5 px-4">Bureau Scope</th>
                <th className="py-2.5 px-4">Role Permission Tier</th>
                <th className="py-2.5 px-4">Official Email</th>
                <th className="py-2.5 px-4 text-right">Session Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {availableUsers.map((user) => {
                const isCurrent = user.id === currentUser.id;
                return (
                  <tr
                    key={user.id}
                    className={`transition-colors ${
                      isCurrent ? "bg-blue-50/40 font-medium" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700">
                        {user.avatarInitials}
                      </div>
                      <span>{user.name}</span>
                      {isCurrent && (
                        <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-bold">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-700">{user.designation}</td>
                    <td className="py-3 px-4">
                      <BureauBadge bureau={user.bureau} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-800 border border-slate-200">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">{user.email}</td>
                    <td className="py-3 px-4 text-right">
                      {isCurrent ? (
                        <span className="text-emerald-700 font-semibold text-xs inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Logged In</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSwitchUser(user)}
                          className="inline-flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs px-2.5 py-1 rounded font-medium shadow-sm transition-colors"
                        >
                          <RefreshCw className="w-3 h-3 text-slate-500" />
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
      <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-blue-700" />
              <span>Master Procedural Governance Log</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological log of all intake registrations, overlap resolutions, status changes, and notices.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {auditLogs.length} Records Cataloged
          </span>
        </div>

        <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Case ID</th>
                <th className="py-2.5 px-4">Procedural Action</th>
                <th className="py-2.5 px-4">Performed By & Bureau</th>
                <th className="py-2.5 px-4">Administrative Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-700">
                    {log.caseId}
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-slate-900">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-4 text-slate-700">
                    <span className="font-medium text-slate-900">{log.performedBy}</span>
                    <span className="text-[10px] text-slate-400 block">{log.role} ({log.bureau})</span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 max-w-md">
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
