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
  ArrowLeft,
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
        <div className="w-12 h-12 bg-[#E8EEE7] text-[#344B3B] rounded-lg flex items-center justify-center mx-auto border border-[#344B3B]/20 shadow-xs">
          <Building2 className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold font-serif text-[#20231F] tracking-tight">
          Institutional Compliance Portal
        </h1>
        <p className="text-[#62665F] text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
          Authorized workspace for AICTE-approved technical institutions to review formal grievance inquiries and file counter-affidavits.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E3E5DE] shadow-xs space-y-6">
        {error && (
          <div className="p-3 bg-[#FBEAEC] border border-[#B42332]/25 rounded-md text-xs text-[#B42332] flex items-center space-x-2 font-mono">
            <AlertCircle className="w-4 h-4 text-[#B42332] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#20231F] mb-1">
              Registered Institutional Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#85877F] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. registrar@apextech-pune.ac.in"
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E3E5DE] rounded-md bg-[#F7F7F4] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white text-[#20231F]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#20231F] mb-1">
              Portal Access Passcode / Security Key *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-[#85877F] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                placeholder="Enter access key (minimum 4 characters)"
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E3E5DE] rounded-md bg-[#F7F7F4] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white text-[#20231F]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#344B3B] hover:bg-[#293D30] text-white font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 font-mono"
          >
            <span>{isLoading ? "Authenticating Session..." : "Sign In to Institution Desk"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* 1-Click Demonstration Accounts */}
        <div className="pt-4 border-t border-[#E3E5DE] space-y-3">
          <div className="flex items-center justify-between text-[11px] text-[#62665F]">
            <span className="font-semibold text-[#20231F] font-mono">Demonstration Seed Accounts (1-Click):</span>
            <span className="text-[#344B3B] font-medium font-mono">Select to test</span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {demoAccounts.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => handleQuickLogin(acc)}
                className="w-full p-2.5 rounded-md border border-[#E3E5DE] hover:border-[#344B3B] bg-[#F7F7F4] hover:bg-[#E8EEE7] text-left transition-colors flex items-center justify-between group"
              >
                <div>
                  <div className="font-semibold text-[#20231F] text-xs group-hover:text-[#344B3B]">
                    {acc.institutionName}
                  </div>
                  <div className="text-[10px] text-[#62665F] font-mono">
                    PID: {acc.institutionId} • {acc.email}
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-[#344B3B] bg-white px-2 py-0.5 rounded border border-[#E3E5DE] shrink-0 font-mono">
                  Select
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Security notice */}
      <div className="p-4 rounded-md bg-[#F0F1ED] border border-[#E3E5DE] text-center text-xs text-[#62665F] font-mono">
        Demo Mode Notice: Passwords and access credentials in this demonstration are simulated for evaluation purposes. No real AICTE institutional credentials are required.
      </div>
    </div>
  );
}
