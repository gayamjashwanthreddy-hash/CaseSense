"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Lock,
  Mail,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { CaseBridgeStore } from "@/lib/api/store";
import { InstitutionAccount } from "@/lib/api/types";
import { useToast } from "@/lib/context/ToastContext";

export default function InstitutionLoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = CaseBridgeStore.getInstitutionAccounts();

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email.trim() || !accessKey.trim()) {
      setError("Please provide your registered institutional email and access credentials.");
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      CaseBridgeStore.init();
      const account = CaseBridgeStore.authenticateInstitution(email, accessKey);
      setIsLoading(false);
      if (account) {
        toast(`Signed in as ${account.contactPerson} (${account.institutionName})`, "success");
        router.push("/institution/dashboard");
      } else {
        setError("Invalid institutional credentials. Please select one of the demonstration accounts below.");
      }
    }, 300);
  };

  const handleQuickLogin = (acc: InstitutionAccount) => {
    setEmail(acc.email);
    setAccessKey("demo@2026");
    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      CaseBridgeStore.init();
      const authenticated = CaseBridgeStore.authenticateInstitution(acc.email, "demo@2026");
      setIsLoading(false);
      if (authenticated) {
        toast(`Signed in as ${acc.contactPerson} (${acc.institutionName})`, "success");
        router.push("/institution/dashboard");
      }
    }, 200);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-amber-900 text-amber-200 rounded-lg flex items-center justify-center mx-auto border border-amber-700 shadow-sm">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Institutional Compliance Portal
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Authorized workspace for AICTE-approved technical institutions to review formal grievance inquiries and file counter-affidavits.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-sm space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Registered Institutional Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. registrar@apextech-pune.ac.in"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Portal Access Passcode / Security Key *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Enter access key (minimum 4 characters)"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{isLoading ? "Authenticating Session..." : "Sign In to Institution Desk"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* 1-Click Demonstration Accounts */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700">Demonstration Seed Accounts (1-Click):</span>
            <span className="text-amber-700 font-medium">Select to test</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {demoAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleQuickLogin(acc)}
                className="w-full p-2.5 rounded border border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/50 text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-slate-900 text-xs group-hover:text-amber-950">
                    {acc.institutionName}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    PID: {acc.institutionId} • {acc.email}
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200 shrink-0">
                  Select
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Security notice */}
      <div className="p-4 rounded bg-slate-100 border border-slate-200 text-center text-xs text-slate-500">
        Demo Mode Notice: Passwords and access credentials in this demonstration are simulated for evaluation purposes. No real AICTE institutional credentials are required.
      </div>
    </div>
  );
}
