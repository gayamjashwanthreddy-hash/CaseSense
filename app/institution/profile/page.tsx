"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Scale,
  Award,
} from "lucide-react";
import { CaseBridgeStore } from "@/lib/api/store";
import { InstitutionAccount, Institution } from "@/lib/api/types";

export default function InstitutionProfilePage() {
  const router = useRouter();
  const [institution, setInstitution] = useState<InstitutionAccount | null>(null);
  const [master, setMaster] = useState<Institution | null>(null);

  useEffect(() => {
    CaseBridgeStore.init();
    const current = CaseBridgeStore.getCurrentInstitution();
    if (!current) {
      router.push("/institution/login");
      return;
    }
    setInstitution(current);
    const m = CaseBridgeStore.getInstitutionById(current.institutionId);
    setMaster(m || null);
  }, []);

  if (!institution) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Institutional Master Profile
            </h1>
            <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300">
              AICTE PID: {institution.institutionId}
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-1">
            Verified statutory identifiers and administrative compliance record on file with AICTE.
          </p>
        </div>
      </div>

      {/* Verified vs Synthetic Badge Header */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-3 text-xs text-blue-900">
        <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Verified Permanent Institution Identifier:</span>
          <p className="text-blue-950/80 leading-relaxed text-[11px]">
            The AICTE Permanent Institute ID (PID: {institution.institutionId}) is verified against the National Technical Registry. In this demonstration environment, contact persons, simulated compliance logs, and associated cases are synthetic demonstration data.
          </p>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs divide-y divide-slate-100 text-xs">
        {/* Section 1: Institution Identity */}
        <div className="p-6 space-y-4">
          <h2 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">
            Basic Institutional Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Official Registered Name
              </span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                {institution.institutionName}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Institutional Category
              </span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {master?.category || "Technical / Engineering"}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Approval Status (AICTE APH)
              </span>
              <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] inline-block mt-0.5">
                {master?.approvalStatus || "Approved (2025-2026)"}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Accreditation Status
              </span>
              <span className="font-bold text-blue-800 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px] inline-block mt-0.5">
                {master?.accreditation || "NBA / NAAC Accredited"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Jurisdiction & Affiliation */}
        <div className="p-6 space-y-4">
          <h2 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">
            Jurisdiction & University Affiliation
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Affiliated University
              </span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {master?.affiliatedUniversity || "State Technological University"}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Regional Administrative Bureau
              </span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {master?.region || "Western Regional Office"}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Campus Location
              </span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {master?.district}, {master?.state}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Compliance Risk Tier
              </span>
              <span
                className={`font-bold px-2 py-0.5 rounded text-[11px] inline-block mt-0.5 ${
                  master?.riskLevel === "CRITICAL"
                    ? "bg-red-100 text-red-900"
                    : master?.riskLevel === "HIGH"
                    ? "bg-amber-100 text-amber-900"
                    : "bg-slate-100 text-slate-800"
                }`}
              >
                {master?.riskLevel || "MEDIUM"} Risk Tier
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Authorized Signatory */}
        <div className="p-6 space-y-4">
          <h2 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] text-slate-400">
            Designated Institutional Signatory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Head of Institution / Signatory
              </span>
              <span className="font-bold text-slate-900 mt-0.5 block">
                {institution.contactPerson}
              </span>
              <span className="text-slate-500 text-[11px]">{institution.designation}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Official Registered Email
              </span>
              <span className="font-mono text-slate-800 mt-0.5 block">
                {institution.email}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Institutional Telephone
              </span>
              <span className="font-mono text-slate-800 mt-0.5 block">
                {institution.phone}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
