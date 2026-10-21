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
      badgeColor: "text-brand-ice border-brand-inst/30 bg-brand-inst/10",
    },
    {
      step: "02",
      title: "Candidate Duplicate & Overlap Screening",
      desc: "Before submission, the system evaluates active inquiries for the selected institution. If ongoing cases exist, the citizen is informed without disclosing confidential third-party details. Officials receive an explainable overlap advisory.",
      sla: "Sub-Second",
      badge: "Screening Engine",
      badgeColor: "text-brand-teal border-brand-teal/30 bg-brand-teal/10",
    },
    {
      step: "03",
      title: "Desk Scrutiny & Bureau Routing",
      desc: "The assigned Bureau Desk Officer (PGRC, Regulation, or Approval) examines the grievance for prima-facie validity and jurisdictional competence under the AICTE Approval Process Handbook (APH 2025-26).",
      sla: "7 Working Days",
      badge: "Bureau Scrutiny",
      badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
    {
      step: "04",
      title: "Cross-Bureau Overlap Triage (Signature Workflow)",
      desc: "If cases in different bureaus share institutional entities or related violation clauses, reviewers compare them side-by-side in the Overlap Workspace. Reviewers can Confirm & Link, Designate Lead & Merge, Mark Distinct, or Defer with mandatory justification.",
      sla: "3-5 Working Days",
      badge: "Inter-Bureau Review",
      badgeColor: "text-brand-ice border-brand-inst/30 bg-brand-inst/10",
    },
    {
      step: "05",
      title: "Institutional Natural Justice & Response",
      desc: "The respondent institution receives formal electronic notice in their Compliance Portal. The institution's authorized signatory reviews redacted grievance particulars and submits formal counter-affidavits and documentary proof.",
      sla: "14 Calendar Days",
      badge: "Institution Portal",
      badgeColor: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    },
    {
      step: "06",
      title: "Joint Committee Adjudication & Order",
      desc: "Where multiple bureaus are involved, a Joint Inquiry Committee evaluates institutional counter-arguments and complainant evidence, rendering unified administrative directives (e.g. fee refund order, reduced intake, or compliance certificate).",
      sla: "30 Days Total Target",
      badge: "Official Resolution",
      badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
  ];

  return (
    <div className="bg-brand-midnight text-brand-warm min-h-[calc(100vh-140px)] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[300px] bg-brand-inst/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-[500px] h-[300px] bg-brand-teal/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-16 relative z-10">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-surface border border-brand-inst/30 rounded-full text-brand-ice text-xs font-mono tracking-wide">
            <span>PROCEDURAL FRAMEWORK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            How Complaint Tracking & De-Duplication Works
          </h1>
          <p className="text-brand-neutral text-base sm:text-lg leading-relaxed">
            CaseBridge AI replaces uncoordinated paper queues with a transparent, auditable 6-stage grievance coordination lifecycle rooted in AICTE regulations and statutory natural justice.
          </p>
        </div>

        {/* Lifecycle Steps */}
        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            The 6-Stage Case Redressal Architecture
          </h2>

          <div className="space-y-4">
            {lifecycleSteps.map((item) => (
              <div
                key={item.step}
                className="p-6 bg-brand-deep/80 border border-brand-surface rounded-xl hover:border-brand-ice/40 hover:shadow-[0_0_20px_rgba(54,120,212,0.1)] transition-all grid grid-cols-1 md:grid-cols-12 gap-5 items-start"
              >
                <div className="md:col-span-1 flex items-center">
                  <span className="font-mono text-xl font-extrabold text-brand-ice bg-brand-surface w-11 h-11 rounded-lg flex items-center justify-center border border-brand-surface">
                    {item.step}
                  </span>
                </div>

                <div className="md:col-span-8 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-white text-base">{item.title}</h3>
                    <span className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-brand-neutral leading-relaxed">{item.desc}</p>
                </div>

                <div className="md:col-span-3 flex md:flex-col md:items-end justify-between text-xs text-brand-neutral pt-2 md:pt-0 border-t md:border-t-0 border-brand-surface">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-brand-neutral/70">Target SLA</span>
                  <span className="font-semibold text-white flex items-center space-x-1 mt-1">
                    <Clock className="w-3.5 h-3.5 text-brand-ice" />
                    <span>{item.sla}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cross-Bureau Overlap Logic Spotlight */}
        <section className="bg-brand-deep/90 border border-brand-surface rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-2 text-brand-ice text-xs font-mono uppercase tracking-wider">
            <GitCompare className="w-4 h-4" />
            <span>Core Signature Mechanism</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            How Overlap Screening Operates in Practice
          </h2>
          <p className="text-xs sm:text-sm text-brand-neutral leading-relaxed max-w-3xl">
            Unlike generic text summarizers, CaseBridge AI evaluates multi-factor evidence before creating an alert:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 bg-brand-surface/60 rounded-xl border border-brand-surface space-y-2">
              <span className="text-xs font-bold text-brand-ice block">1. Permanent Institute ID (PID)</span>
              <p className="text-xs text-brand-neutral leading-relaxed">
                Deterministic PID matching ensures distinct colleges under the same educational trust or campus are never mistakenly aggregated.
              </p>
            </div>

            <div className="p-5 bg-brand-surface/60 rounded-xl border border-brand-surface space-y-2">
              <span className="text-xs font-bold text-amber-400 block">2. APH Regulatory Mapping</span>
              <p className="text-xs text-brand-neutral leading-relaxed">
                Maps cited handbook clauses (e.g. Chapter VII Clause 7.1 fee norms vs Chapter II infrastructure norms).
              </p>
            </div>

            <div className="p-5 bg-brand-surface/60 rounded-xl border border-brand-surface space-y-2">
              <span className="text-xs font-bold text-brand-teal block">3. Four Sovereign Actions</span>
              <p className="text-xs text-brand-neutral leading-relaxed">
                Reviewers choose: <strong>Confirm & Link</strong>, <strong>Designate Lead & Merge</strong>, <strong>Mark Distinct</strong>, or <strong>Defer</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Action Prompt */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-brand-surface/50 border border-brand-surface rounded-2xl gap-4">
          <div>
            <h3 className="font-bold text-white text-base">Test the Lifecycle in Real-Time</h3>
            <p className="text-xs text-brand-neutral mt-0.5">
              Register a simulated citizen grievance or test cross-bureau overlap resolution in the admin console.
            </p>
          </div>
          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href="/complaints/register"
              className="px-4 py-2 bg-brand-inst hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Register Complaint
            </Link>
            <Link
              href="/track-complaint"
              className="px-4 py-2 bg-brand-surface hover:bg-brand-surface/80 text-brand-warm border border-brand-surface text-xs font-medium rounded-lg transition-colors"
            >
              Track Complaint
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
