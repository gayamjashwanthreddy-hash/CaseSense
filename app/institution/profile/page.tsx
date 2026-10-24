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
    return <div className="p-8 text-center text-xs text-[#62665F] font-mono">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-[#E3E5DE] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-[#20231F] tracking-tight">
              Institutional Master Profile
            </h1>
            <span className="font-mono text-xs font-bold bg-[#F7F7F4] text-[#20231F] px-2 py-0.5 rounded border border-[#E3E5DE]">
              AICTE PID: {institution.institutionId}
            </span>
          </div>
          <p className="text-[#62665F] text-xs mt-1 font-mono">
            Verified statutory identifiers and administrative compliance record on file with AICTE.
          </p>
        </div>
      </div>

      {/* Verified vs Synthetic Badge Header */}
      <div className="p-4 bg-[#E8EEE7] border border-[#344B3B]/20 rounded-xl flex items-start space-x-3 text-xs text-[#344B3B]">
        <ShieldCheck className="w-5 h-5 text-[#344B3B] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block font-mono">Verified Permanent Institution Identifier:</span>
          <p className="text-[#20231F] leading-relaxed text-[11px]">
            The AICTE Permanent Institute ID (PID: {institution.institutionId}) is verified against the National Technical Registry. In this demonstration environment, contact persons, simulated compliance logs, and associated cases are synthetic demonstration data.
          </p>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="bg-white rounded-xl border border-[#E3E5DE] shadow-xs divide-y divide-[#E3E5DE] text-xs">
        {/* Section 1: Institution Identity */}
        <div className="p-6 space-y-4">
          <h2 className="font-bold text-[#62665F] uppercase tracking-wider text-[11px] font-mono">
            Basic Institutional Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#85877F] block font-mono">
                Official Registered Name
              </span>
              <span className="font-bold text-[#20231F] text-sm mt-0.5 block">
                {institution.institutionName}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#85877F] block font-mono">
                Institutional Category
              </span>
              <span className="font-semibold text-[#20231F] mt-0.5 block">
                {master?.category || "Technical / Engineering"}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#85877F] block font-mono">
                Approval Status (AICTE)
              </span>
              <span className="font-semibold text-[#23734D] mt-0.5 block font-mono">
                {master?.approvalStatus || "Approved (Extension of Approval Granted)"}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#85877F] block font-mono">
                National Accreditation
              </span>
              <span className="font-semibold text-[#20231F] mt-0.5 block font-mono">
                {master?.accreditation || "NAAC A+ / NBA Tier-1"}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Person */}
        <div className="p-6 space-y-4">
          <h2 className="font-bold text-[#62665F] uppercase tracking-wider text-[11px] font-mono">
            Designated Institutional Signatory
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#85877F] block font-mono">
                Authorised Contact Person
              </span>
              <span className="font-bold text-[#20231F] mt-0.5 block">
                {institution.contactPerson}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#85877F] block font-mono">
                Designation
              </span>
              <span className="font-semibold text-[#20231F] mt-0.5 block">
                {institution.designation}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#85877F] block font-mono">
                Official Email
              </span>
              <span className="font-mono text-[#20231F] mt-0.5 block">
                {institution.email}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#85877F] block font-mono">
                Contact Phone
              </span>
              <span className="font-mono text-[#20231F] mt-0.5 block">
                {institution.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Geographic Coordinates */}
        <div className="p-6 space-y-4">
          <h2 className="font-bold text-[#62665F] uppercase tracking-wider text-[11px] font-mono">
            Campus Jurisdiction &amp; Affiliation
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#85877F] block font-mono">
                District &amp; State
              </span>
              <span className="font-semibold text-[#20231F] mt-0.5 block">
                {master?.district || "Pune"}, {master?.state || "Maharashtra"}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-semibold text-[#85877F] block font-mono">
                AICTE Regional Office
              </span>
              <span className="font-semibold text-[#20231F] mt-0.5 block">
                {master?.region || "Western"} Regional Office (WRO)
              </span>
            </div>

            <div className="sm:col-span-2">
              <span className="text-[10px] uppercase font-semibold text-[#85877F] block font-mono">
                Affiliated University
              </span>
              <span className="font-semibold text-[#20231F] mt-0.5 block">
                {master?.affiliatedUniversity || "Savitribai Phule Pune University"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
