import React from "react";
import Link from "next/link";
import {
  FileText,
  GitCompare,
  Building2,
  Scale,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Users,
  Search,
} from "lucide-react";

export default function HowItWorksPage() {
  const lifecycleSteps = [
    {
      step: "01",
      title: "Grievance Intake & Entity Identification",
      desc: "Complainants select their institution from the registered AICTE directory (using AICTE Permanent ID, e.g. 1-10492811), choose one of 7 standardized violation categories, upload documentary proofs, and can elect Whistleblower Confidentiality.",
      sla: "Immediate / Real-Time",
      badge: "Public Gateway",
      badgeColor: "text-[#344B3B] border-[#344B3B]/20 bg-[#E8EEE7]",
    },
    {
      step: "02",
      title: "Candidate Duplicate & Overlap Screening",
      desc: "Before submission, the system evaluates active inquiries for the selected institution. If ongoing cases exist, the citizen is informed without disclosing confidential third-party details. Officials receive an explainable overlap advisory.",
      sla: "Sub-Second",
      badge: "Screening Engine",
      badgeColor: "text-[#23734D] border-[#23734D]/20 bg-[#E8F4EC]",
    },
    {
      step: "03",
      title: "Desk Scrutiny & Bureau Routing",
      desc: "The assigned Bureau Desk Officer (PGRC, Regulation, or Approval) examines the grievance for prima-facie validity and jurisdictional competence under the AICTE Approval Process Handbook (APH 2025-26).",
      sla: "7 Working Days",
      badge: "Bureau Scrutiny",
      badgeColor: "text-[#925C0B] border-[#925C0B]/20 bg-[#FBF1DB]",
    },
    {
      step: "04",
      title: "Cross-Bureau Overlap Triage (Signature Workflow)",
      desc: "If cases in different bureaus share institutional entities or related violation clauses, reviewers compare them side-by-side in the Overlap Workspace. Reviewers can Confirm & Link, Designate Lead & Merge, Mark Distinct, or Defer with mandatory justification.",
      sla: "3-5 Working Days",
      badge: "Inter-Bureau Review",
      badgeColor: "text-[#344B3B] border-[#344B3B]/20 bg-[#E8EEE7]",
    },
    {
      step: "05",
      title: "Institutional Natural Justice & Response",
      desc: "The respondent institution receives formal electronic notice in their Compliance Portal. The institution's authorized signatory reviews redacted grievance particulars and submits formal counter-affidavits and documentary proof.",
      sla: "14 Calendar Days",
      badge: "Institution Portal",
      badgeColor: "text-[#496785] border-[#496785]/20 bg-[#EAF0F6]",
    },
    {
      step: "06",
      title: "Joint Committee Adjudication & Order",
      desc: "Where multiple bureaus are involved, a Joint Inquiry Committee evaluates institutional counter-arguments and complainant evidence, rendering unified administrative directives (e.g. fee refund order, reduced intake, or compliance certificate).",
      sla: "30 Days Total Target",
      badge: "Official Resolution",
      badgeColor: "text-[#23734D] border-[#23734D]/20 bg-[#E8F4EC]",
    },
  ];

  return (
    <div className="bg-[#FFFFFF] text-[#20231F] min-h-[calc(100vh-140px)] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#E8EEE7] border border-[#344B3B]/20 rounded-full text-[#344B3B] text-xs font-mono tracking-wide">
            <span>PROCEDURAL FRAMEWORK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#20231F] tracking-tight leading-tight">
            How Complaint Tracking &amp; De-Duplication Works
          </h1>
          <p className="text-[#62665F] text-base sm:text-lg leading-relaxed font-sans">
            CaseSense replaces uncoordinated paper queues with a transparent, auditable 6-stage grievance coordination lifecycle rooted in AICTE regulations and statutory natural justice.
          </p>
        </div>

        {/* Lifecycle Steps */}
        <section className="space-y-5">
          <h2 className="text-2xl font-bold font-serif text-[#20231F] tracking-tight">
            The 6-Stage Case Redressal Architecture
          </h2>

          <div className="space-y-4">
            {lifecycleSteps.map((item) => (
              <div
                key={item.step}
                className="p-6 bg-white border border-[#E3E5DE] rounded-xl hover:border-[#344B3B]/40 transition-all grid grid-cols-1 md:grid-cols-12 gap-5 items-start shadow-xs"
              >
                <div className="md:col-span-1 flex items-center">
                  <span className="font-mono text-xl font-bold text-[#344B3B] bg-[#E8EEE7] w-11 h-11 rounded-md flex items-center justify-center border border-[#344B3B]/20">
                    {item.step}
                  </span>
                </div>

                <div className="md:col-span-8 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-[#20231F] text-base">{item.title}</h3>
                    <span className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#62665F] leading-relaxed font-sans">{item.desc}</p>
                </div>

                <div className="md:col-span-3 flex md:flex-col md:items-end justify-between text-xs text-[#62665F] pt-2 md:pt-0 border-t md:border-t-0 border-[#E3E5DE]">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#85877F]">Target SLA</span>
                  <span className="font-semibold text-[#20231F] flex items-center space-x-1 mt-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#344B3B]" />
                    <span>{item.sla}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cross-Bureau Overlap Logic Spotlight */}
        <section className="bg-[#F7F7F4] border border-[#E3E5DE] rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-2 text-[#344B3B] text-xs font-mono uppercase tracking-wider">
            <GitCompare className="w-4 h-4" />
            <span>Core Signature Mechanism</span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-[#20231F] tracking-tight">
            How Overlap Screening Operates in Practice
          </h2>
          <p className="text-xs sm:text-sm text-[#62665F] leading-relaxed max-w-3xl font-sans">
            Unlike generic text summarizers, CaseSense evaluates multi-factor evidence before creating an alert:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 bg-white rounded-lg border border-[#E3E5DE] space-y-2 shadow-xs">
              <span className="text-xs font-bold text-[#344B3B] block font-mono">1. Permanent Institute ID (PID)</span>
              <p className="text-xs text-[#62665F] leading-relaxed">
                Deterministic PID matching ensures distinct colleges under the same educational trust or campus are never mistakenly aggregated.
              </p>
            </div>

            <div className="p-5 bg-white rounded-lg border border-[#E3E5DE] space-y-2 shadow-xs">
              <span className="text-xs font-bold text-[#925C0B] block font-mono">2. APH Regulatory Mapping</span>
              <p className="text-xs text-[#62665F] leading-relaxed">
                Maps cited handbook clauses (e.g. Chapter VII Clause 7.1 fee norms vs Chapter II infrastructure norms).
              </p>
            </div>

            <div className="p-5 bg-white rounded-lg border border-[#E3E5DE] space-y-2 shadow-xs">
              <span className="text-xs font-bold text-[#23734D] block font-mono">3. Four Sovereign Actions</span>
              <p className="text-xs text-[#62665F] leading-relaxed">
                Reviewers choose: <strong>Confirm &amp; Link</strong>, <strong>Designate Lead &amp; Merge</strong>, <strong>Mark Distinct</strong>, or <strong>Defer</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Action Prompt */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-white border border-[#E3E5DE] rounded-xl gap-4 shadow-xs">
          <div>
            <h3 className="font-bold text-[#20231F] text-base font-serif">Test the Lifecycle in Real-Time</h3>
            <p className="text-xs text-[#62665F] mt-0.5 font-mono">
              Register a simulated citizen grievance or test cross-bureau overlap resolution in the admin console.
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0 font-mono">
            <Link
              href="/complaints/register"
              className="px-4 py-2 bg-[#344B3B] hover:bg-[#293D30] text-white text-xs font-semibold rounded-md shadow-xs transition-colors"
            >
              Register Complaint
            </Link>
            <Link
              href="/track-complaint"
              className="px-4 py-2 bg-[#F7F7F4] hover:bg-[#E8EEE7] text-[#20231F] border border-[#E3E5DE] text-xs font-medium rounded-md transition-colors"
            >
              Track Complaint
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
