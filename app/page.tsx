"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  Building2,
  GitCompare,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Scale,
  FileText,
  AlertTriangle,
  ChevronRight,
  Check,
  History,
  Activity,
  Sliders,
  FilePlus,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Sparkles,
} from "lucide-react";

export default function CinematicLandingPage() {
  const shouldReduceMotion = useReducedMotion();

  // Interactive Storytelling Lifecycle Phase State
  const [activePhase, setActivePhase] = useState<number>(1);

  // Interactive Scenario Lab State
  const [selectedScenario, setSelectedScenario] = useState<"scenario1" | "scenario2" | "scenario3">("scenario1");

  // Interactive Adjudication Simulator
  const [adjudicationChoice, setAdjudicationChoice] = useState<"NONE" | "CONFIRMED" | "DISTINCT" | "DEFERRED">("NONE");

  const scenarios = {
    scenario1: {
      title: "Inter-Bureau Fee Dispute Overlap",
      confidence: 88,
      status: "HIGH CONFIDENCE MATCH",
      statusColor: "text-[#925C0B] bg-[#FBF1DB] border-[#F0DCB0]",
      institution: "Apex Institute of Technology, Pune",
      pid: "1-10492811",
      caseA: {
        id: "AICTE/PGRC/2026/0811",
        bureau: "PGRC Desk",
        subject: "Unapproved fee escalation & refusal to refund caution deposit",
        complainant: "Student Council Rep",
      },
      caseB: {
        id: "AICTE/RB/2026/1190",
        bureau: "Regulation Bureau",
        subject: "Institutional audit flag: Non-compliance with fee ceiling norms",
        complainant: "Regional Inspection Officer",
      },
      factors: [
        { name: "Permanent Institute ID (PID)", weight: 40, score: 40, detail: "Exact Match (1-10492811)" },
        { name: "Category Classification", weight: 25, score: 25, detail: "Fee Ceiling Violation" },
        { name: "Narrative Lexical Match", weight: 25, score: 18, detail: "Keyword Similarity 72%" },
        { name: "Cross-Bureau Bonus", weight: 10, score: 10, detail: "PGRC ↔ Regulation Bureau" },
      ],
      recommendation: "Joint Inquiry Recommended. Lead Bureau: Regulation Bureau (RB).",
    },
    scenario2: {
      title: "Hostel Facility & Approval Discrepancy",
      confidence: 76,
      status: "MODERATE CORRELATION",
      statusColor: "text-[#496785] bg-[#EAF0F6] border-[#C5D5E4]",
      institution: "Bharatiya Engineering Academy, Bengaluru",
      pid: "1-20948172",
      caseA: {
        id: "AICTE/PGRC/2026/0412",
        bureau: "PGRC Desk",
        subject: "Sub-standard residential quarters & fire safety deficiencies",
        complainant: "Resident Student",
      },
      caseB: {
        id: "AICTE/AB/2026/0891",
        bureau: "Approval Bureau",
        subject: "Sanctioned intake expansion pending building completion certificate",
        complainant: "Approval Scrutiny Committee",
      },
      factors: [
        { name: "Permanent Institute ID (PID)", weight: 40, score: 40, detail: "Exact Match (1-20948172)" },
        { name: "Category Classification", weight: 25, score: 18, detail: "Infrastructure / Safety" },
        { name: "Narrative Lexical Match", weight: 25, score: 11, detail: "Keyword Similarity 44%" },
        { name: "Cross-Bureau Bonus", weight: 10, score: 7, detail: "PGRC ↔ Approval Bureau" },
      ],
      recommendation: "Cross-Bureau Tagging Required. Cases remain distinct with linked dossiers.",
    },
    scenario3: {
      title: "Distinct Institutional Complaints",
      confidence: 18,
      status: "NO OVERLAP (DISTINCT)",
      statusColor: "text-[#62665F] bg-[#F0F1ED] border-[#E3E5DE]",
      institution: "Multi-Campus Comparison",
      pid: "Independent PIDs",
      caseA: {
        id: "AICTE/PGRC/2026/0902",
        bureau: "PGRC Desk",
        subject: "Delay in issuance of final semester provisional marksheets",
        complainant: "Alumni Candidate",
      },
      caseB: {
        id: "AICTE/RB/2026/0319",
        bureau: "Regulation Bureau",
        subject: "Faculty-to-student cadre ratio deficit during annual inspection",
        complainant: "Academic Auditor",
      },
      factors: [
        { name: "Permanent Institute ID (PID)", weight: 40, score: 0, detail: "Mismatch (Distinct Colleges)" },
        { name: "Category Classification", weight: 25, score: 8, detail: "General Academic Affairs" },
        { name: "Narrative Lexical Match", weight: 25, score: 5, detail: "Minimal Keyword Match 12%" },
        { name: "Cross-Bureau Bonus", weight: 10, score: 5, detail: "Independent Cell Processing" },
      ],
      recommendation: "Standard Independent Queue. No inter-bureau intervention needed.",
    },
  };

  const currentScenario = scenarios[selectedScenario];

  return (
    <div className="flex flex-col min-h-screen bg-white text-[#20231F] font-sans antialiased selection:bg-[#E8EEE7] selection:text-[#344B3B]">
      {/* =========================================================================
          SECTION 1 — HERO: Editorial Asymmetric Composition (White / Olive)
         ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[#E3E5DE] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Column: Editorial Headline & Actions */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              {/* Category Eyebrow */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F0F3ED] border border-[#D4D8CF] text-[#344B3B] text-xs font-mono tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#344B3B] animate-pulse" />
                <span>AICTE GRIEVANCE INTELLIGENCE SYSTEM</span>
              </div>

              {/* Main Editorial Headline */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif text-[#20231F] leading-[1.12] tracking-tight">
                  Grievances should lead to action.
                </h1>
                <p className="text-base sm:text-lg text-[#62665F] max-w-2xl font-normal leading-relaxed">
                  CaseSense enables transparent oversight, cross-bureau coordination, and accountable resolution across institutional grievance workflows.
                </p>
              </div>

              {/* Primary Call to Action */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/complaints/register"
                  className="inline-flex items-center space-x-2 bg-[#344B3B] hover:bg-[#293D30] text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-xs"
                >
                  <FilePlus className="w-4 h-4" />
                  <span>Register a Complaint</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  href="/track-complaint"
                  className="inline-flex items-center space-x-2 bg-[#F0F3ED] hover:bg-[#E8EEE7] border border-[#D4D8CF] text-[#344B3B] px-5 py-3 rounded-lg text-sm font-semibold transition-all"
                >
                  <Search className="w-4 h-4 text-[#344B3B]" />
                  <span>Track Status</span>
                </Link>

                <Link
                  href="/login"
                  className="inline-flex items-center space-x-1.5 text-xs text-[#62665F] hover:text-[#20231F] px-3 py-2 font-medium transition-colors"
                >
                  <span>Reviewer Workspace &rarr;</span>
                </Link>
              </div>

              {/* Institutional Metrics Pill Bar */}
              <div className="pt-6 border-t border-[#E3E5DE] grid grid-cols-3 gap-6 text-left">
                <div>
                  <div className="text-2xl font-bold font-mono text-[#20231F]">14,280+</div>
                  <div className="text-[11px] text-[#85877F] mt-0.5">Enrolled Technical Colleges</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-[#344B3B]">5 Bureaus</div>
                  <div className="text-[11px] text-[#85877F] mt-0.5">Unified AICTE Cells</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-[#23734D]">100%</div>
                  <div className="text-[11px] text-[#85877F] mt-0.5">Audited Human Decisions</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: High-Quality Product Intelligence Card */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div className="bg-[#FFFFFF] border border-[#E3E5DE] rounded-xl overflow-hidden shadow-lg shadow-black/5 text-left">
                {/* Console Window Header */}
                <div className="bg-[#F7F7F4] px-4 py-3 border-b border-[#E3E5DE] flex items-center justify-between text-xs text-[#62665F]">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4D8CF]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4D8CF]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#344B3B]" />
                    <span className="font-mono text-[#20231F] font-semibold pl-1.5">RADAR: OVL-2026-001</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-[#FBF1DB] text-[#925C0B] border border-[#F0DCB0]">
                    88% SIMILARITY
                  </span>
                </div>

                {/* Overlap Summary Card */}
                <div className="p-5 space-y-4">
                  <div>
                    <div className="text-[10px] font-mono font-bold text-[#85877F] uppercase tracking-wider">
                      Target Entity Resolution
                    </div>
                    <div className="text-sm font-bold text-[#20231F] mt-0.5 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#344B3B]" />
                      <span>Apex Institute of Technology, Pune</span>
                    </div>
                    <div className="text-xs font-mono text-[#62665F] mt-0.5">
                      Permanent Institute ID: <span className="text-[#344B3B] font-semibold">1-10492811</span>
                    </div>
                  </div>

                  {/* Comparative Two-Cell Snapshot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div className="p-3 rounded-lg bg-[#F7F7F4] border border-[#E3E5DE] space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-[#EAF0F6] text-[#496785] border border-[#C5D5E4] font-semibold">
                          PGRC Desk
                        </span>
                        <span className="text-[#85877F]">Case A</span>
                      </div>
                      <div className="font-mono text-[11px] font-bold text-[#20231F]">
                        AICTE/PGRC/2026/0811
                      </div>
                      <p className="text-[11px] text-[#62665F] line-clamp-2 leading-relaxed">
                        Arbitrary fee escalation and withholding student caution money.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-[#F7F7F4] border border-[#E3E5DE] space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-[#E8EEE7] text-[#344B3B] border border-[#D0DDD0] font-semibold">
                          Regulation Bureau
                        </span>
                        <span className="text-[#85877F]">Case B</span>
                      </div>
                      <div className="font-mono text-[11px] font-bold text-[#20231F]">
                        AICTE/RB/2026/1190
                      </div>
                      <p className="text-[11px] text-[#62665F] line-clamp-2 leading-relaxed">
                        Audit alert: Violation of statutory state fee regulatory committee ceilings.
                      </p>
                    </div>
                  </div>

                  {/* Similarity Metrics Progress */}
                  <div className="pt-2 border-t border-[#E3E5DE] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#62665F]">Multi-Factor Match Score:</span>
                      <span className="font-mono font-bold text-[#344B3B]">88 / 100</span>
                    </div>
                    <div className="w-full bg-[#F0F1EB] rounded-full h-1.5 overflow-hidden">
                      <div className="bg-[#344B3B] h-1.5 rounded-full" style={{ width: "88%" }} />
                    </div>
                  </div>

                  {/* Sovereign Human Oversight Tag */}
                  <div className="p-2.5 rounded-lg bg-[#E8EEE7] border border-[#D0DDD0] flex items-center justify-between text-[11px] text-[#344B3B]">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Scale className="w-3.5 h-3.5 text-[#344B3B]" />
                      Zero Unilateral Merges Policy
                    </span>
                    <span className="text-[10px] font-mono font-semibold">HUMAN SOVEREIGN</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — THE 5-STAGE PROGRESSIVE GRIEVANCE LIFECYCLE
         ========================================================================= */}
      <section className="py-20 border-b border-[#E3E5DE] bg-[#F7F7F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Section Header */}
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center space-x-1.5 text-xs font-mono font-semibold text-[#344B3B]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#344B3B]" />
              <span>END-TO-END WORKFLOW</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#20231F] tracking-tight">
              From grievance filing to auditable resolution.
            </h2>
            <p className="text-sm text-[#62665F] leading-relaxed">
              Every complaint moves through five clear, accountable stages—ensuring institutional transparency, inter-bureau coordination, and zero lost files.
            </p>
          </div>

          {/* 5-Stage Interactive Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-[#E3E5DE] pb-2">
            {[
              { id: 1, title: "1. Intake & Scrubbing", sub: "Citizens & Whistleblowers" },
              { id: 2, title: "2. Identity Resolution", sub: "Permanent PID Linking" },
              { id: 3, title: "3. Cross-Bureau Match", sub: "Multi-Vector Analysis" },
              { id: 4, title: "4. Human Review", sub: "Sovereign Adjudication" },
              { id: 5, title: "5. Audited Action", sub: "Joint Inquiries & Notice" },
            ].map((phase) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`p-3 text-left rounded-lg transition-all ${
                  activePhase === phase.id
                    ? "bg-white border border-[#E3E5DE] shadow-xs"
                    : "hover:bg-white/60 text-[#62665F]"
                }`}
              >
                <div
                  className={`text-xs font-bold ${
                    activePhase === phase.id ? "text-[#344B3B]" : "text-[#20231F]"
                  }`}
                >
                  {phase.title}
                </div>
                <div className="text-[10px] text-[#85877F] mt-0.5 truncate">{phase.sub}</div>
              </button>
            ))}
          </div>

          {/* Active Phase Deep Dive Card */}
          <div className="bg-white border border-[#E3E5DE] rounded-xl p-8 shadow-xs">
            {activePhase === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-mono font-bold text-[#344B3B] bg-[#E8EEE7] px-2.5 py-1 rounded">
                    STAGE 01 &bull; GRIEVANCE INTAKE
                  </span>
                  <h3 className="text-2xl font-bold font-serif text-[#20231F]">
                    Multi-channel grievance admission with whistleblower identity protection.
                  </h3>
                  <p className="text-xs text-[#62665F] leading-relaxed">
                    Complaints enter CaseSense through web lodgment, CPGRAMS ingestion, or direct bureau referral. Sensitive complainant identities are cryptographically redacted before institutional notices are dispatched.
                  </p>
                  <ul className="space-y-2 text-xs text-[#20231F]">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#23734D]" />
                      <span>Dual-factor tracking codes (Ref Number + Secret Key)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#23734D]" />
                      <span>Automatic categorization across 7 regulatory complaint types</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#F7F7F4] border border-[#E3E5DE] rounded-xl p-6 space-y-3 font-mono text-xs">
                  <div className="text-[11px] text-[#85877F] uppercase tracking-wider">Lodged Grievance Snapshot</div>
                  <div className="p-3 bg-white rounded border border-[#E3E5DE]">
                    <span className="text-[#85877F] block text-[10px]">Reference:</span>
                    <strong className="text-[#20231F]">REF-2026-98124</strong>
                  </div>
                  <div className="p-3 bg-white rounded border border-[#E3E5DE]">
                    <span className="text-[#85877F] block text-[10px]">Status:</span>
                    <strong className="text-[#23734D]">Admitted & Under Scrutiny</strong>
                  </div>
                </div>
              </div>
            )}

            {activePhase === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-mono font-bold text-[#344B3B] bg-[#E8EEE7] px-2.5 py-1 rounded">
                    STAGE 02 &bull; ENTITY RESOLUTION
                  </span>
                  <h3 className="text-2xl font-bold font-serif text-[#20231F]">
                    Permanent Institute ID (PID) deterministic matching.
                  </h3>
                  <p className="text-xs text-[#62665F] leading-relaxed">
                    Institutions frequently appear under colloquial aliases or regional abbreviations. CaseSense resolves colleges against the central AICTE database using Permanent Institute IDs, accreditation status, and state coordinates.
                  </p>
                  <ul className="space-y-2 text-xs text-[#20231F]">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#23734D]" />
                      <span>Resolves colloquial names to verified AICTE PIDs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#23734D]" />
                      <span>Isolates institutions with strict multi-tenant boundaries</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#F7F7F4] border border-[#E3E5DE] rounded-xl p-6 space-y-3 text-xs">
                  <div className="text-[11px] font-mono text-[#85877F] uppercase tracking-wider">Entity Verification Card</div>
                  <div className="p-3 bg-white rounded border border-[#E3E5DE]">
                    <span className="text-[#85877F] block text-[10px]">Resolved Institution:</span>
                    <strong className="text-[#20231F]">Apex Institute of Technology, Pune</strong>
                    <div className="font-mono text-[11px] text-[#344B3B] mt-0.5">PID: 1-10492811 &bull; Approved (2025-2026)</div>
                  </div>
                </div>
              </div>
            )}

            {activePhase === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-mono font-bold text-[#344B3B] bg-[#E8EEE7] px-2.5 py-1 rounded">
                    STAGE 03 &bull; CROSS-BUREAU CORRELATION
                  </span>
                  <h3 className="text-2xl font-bold font-serif text-[#20231F]">
                    Multi-vector similarity analysis without data destruction.
                  </h3>
                  <p className="text-xs text-[#62665F] leading-relaxed">
                    CaseSense computes similarity across structured attributes (PID match, regulatory category) and unstructured allegation text (lexical overlap, handbooks cited) to flag hidden concurrent proceedings.
                  </p>
                  <ul className="space-y-2 text-xs text-[#20231F]">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#23734D]" />
                      <span>Transparent scoring: 40% Entity + 25% Category + 25% Text + 10% Cell</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#23734D]" />
                      <span>Shared PID alone never causes automated case consolidation</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#F7F7F4] border border-[#E3E5DE] rounded-xl p-6 space-y-3 text-xs">
                  <div className="text-[11px] font-mono text-[#85877F] uppercase tracking-wider">Multi-Factor Score Weights</div>
                  <div className="space-y-2 bg-white p-3 rounded border border-[#E3E5DE]">
                    <div className="flex justify-between text-[11px]">
                      <span>Entity PID Exact Match:</span>
                      <strong className="font-mono text-[#344B3B]">40 / 40</strong>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span>Category Classification:</span>
                      <strong className="font-mono text-[#344B3B]">25 / 25</strong>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span>Narrative Keyword Match:</span>
                      <strong className="font-mono text-[#344B3B]">18 / 25</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePhase === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-mono font-bold text-[#344B3B] bg-[#E8EEE7] px-2.5 py-1 rounded">
                    STAGE 04 &bull; HUMAN ADJUDICATION
                  </span>
                  <h3 className="text-2xl font-bold font-serif text-[#20231F]">
                    Authorized bureau officers retain sovereign decision authority.
                  </h3>
                  <p className="text-xs text-[#62665F] leading-relaxed">
                    No algorithm unilaterally closes or merges complaint files. Reviewers inspect side-by-side allegations and choose between four authorized determinations: Confirm & Link, Designate Lead & Merge, Mark as Distinct, or Defer for Evidence.
                  </p>
                  <ul className="space-y-2 text-xs text-[#20231F]">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#23734D]" />
                      <span>Mandatory administrative justification recorded for every determination</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#23734D]" />
                      <span>False positive dismissals actively train localized confidence thresholds</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#F7F7F4] border border-[#E3E5DE] rounded-xl p-6 space-y-2 text-xs">
                  <div className="text-[11px] font-mono text-[#85877F] uppercase tracking-wider">Four Sovereign Choices</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-white rounded border border-[#D0DDD0] text-[#344B3B] font-semibold text-[11px]">
                      1. Link Bureaus
                    </div>
                    <div className="p-2.5 bg-white rounded border border-[#E3E5DE] text-[#20231F] font-semibold text-[11px]">
                      2. Consolidate Lead
                    </div>
                    <div className="p-2.5 bg-white rounded border border-[#E3E5DE] text-[#62665F] font-semibold text-[11px]">
                      3. Mark Distinct
                    </div>
                    <div className="p-2.5 bg-white rounded border border-[#F0DCB0] text-[#925C0B] font-semibold text-[11px]">
                      4. Defer for Notice
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activePhase === 5 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="text-xs font-mono font-bold text-[#344B3B] bg-[#E8EEE7] px-2.5 py-1 rounded">
                    STAGE 05 &bull; AUDITABLE ACTION
                  </span>
                  <h3 className="text-2xl font-bold font-serif text-[#20231F]">
                    Joint inter-bureau inquiries and permanent accountability.
                  </h3>
                  <p className="text-xs text-[#62665F] leading-relaxed">
                    Once an overlap is confirmed, CaseSense forms a joint coordination desk, dispatches natural justice notices to the college registrar, and logs an immutable audit trail entry stamped with reviewer identity, bureau, and timestamp.
                  </p>
                  <ul className="space-y-2 text-xs text-[#20231F]">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#23734D]" />
                      <span>Statutory 30-day SLA countdown monitoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#23734D]" />
                      <span>College counter-affidavits visible directly to the investigating officer</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#F7F7F4] border border-[#E3E5DE] rounded-xl p-6 space-y-3 font-mono text-xs">
                  <div className="text-[11px] text-[#85877F] uppercase tracking-wider">Audit Log Receipt</div>
                  <div className="p-3 bg-white rounded border border-[#E3E5DE] space-y-1">
                    <div className="text-[#85877F] text-[10px]">AUDIT REFERENCE: AUD-1729851</div>
                    <div className="font-bold text-[#20231F]">Joint Inquiry Committee Constituted</div>
                    <div className="text-[#62665F] text-[10px]">Actor: S. R. Kulkarni (Director, RB)</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — INTERACTIVE CASE CORRELATION LAB (WHITE PALETTE)
         ========================================================================= */}
      <section className="py-20 border-b border-[#E3E5DE] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <span className="text-xs font-mono font-bold text-[#344B3B] bg-[#E8EEE7] px-2.5 py-1 rounded">
                SIMULATION LAB
              </span>
              <h2 className="text-3xl font-bold font-serif text-[#20231F]">
                Inspect cross-bureau overlap scenarios in real time.
              </h2>
              <p className="text-xs text-[#62665F]">
                Select a test scenario to evaluate how CaseSense calculates confidence, highlights evidence, and presents decisions to human reviewers.
              </p>
            </div>

            {/* Scenario Selector Buttons */}
            <div className="flex items-center gap-2 bg-[#F7F7F4] p-1.5 rounded-xl border border-[#E3E5DE]">
              <button
                onClick={() => {
                  setSelectedScenario("scenario1");
                  setAdjudicationChoice("NONE");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedScenario === "scenario1"
                    ? "bg-white text-[#344B3B] shadow-xs"
                    : "text-[#62665F] hover:text-[#20231F]"
                }`}
              >
                Fee Dispute (88%)
              </button>
              <button
                onClick={() => {
                  setSelectedScenario("scenario2");
                  setAdjudicationChoice("NONE");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedScenario === "scenario2"
                    ? "bg-white text-[#344B3B] shadow-xs"
                    : "text-[#62665F] hover:text-[#20231F]"
                }`}
              >
                Hostel Intake (76%)
              </button>
              <button
                onClick={() => {
                  setSelectedScenario("scenario3");
                  setAdjudicationChoice("NONE");
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedScenario === "scenario3"
                    ? "bg-white text-[#344B3B] shadow-xs"
                    : "text-[#62665F] hover:text-[#20231F]"
                }`}
              >
                Distinct (18%)
              </button>
            </div>
          </div>

          {/* Scenario Details Box */}
          <div className="bg-[#F7F7F4] border border-[#E3E5DE] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E3E5DE] gap-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#85877F] uppercase tracking-wider">
                  Test Case Pair: {currentScenario.title}
                </span>
                <div className="text-base font-bold text-[#20231F] mt-0.5">
                  {currentScenario.institution} ({currentScenario.pid})
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-mono font-bold border ${currentScenario.statusColor}`}
                >
                  {currentScenario.status}: {currentScenario.confidence}%
                </span>
              </div>
            </div>

            {/* Two Side-by-Side Inquiries */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white p-5 rounded-xl border border-[#E3E5DE] space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#EAF0F6] text-[#496785] font-semibold border border-[#C5D5E4]">
                    {currentScenario.caseA.bureau}
                  </span>
                  <span className="text-[#85877F]">{currentScenario.caseA.id}</span>
                </div>
                <div className="text-xs font-bold text-[#20231F] pt-1">
                  {currentScenario.caseA.subject}
                </div>
                <div className="text-[11px] text-[#62665F]">
                  Complainant: <strong>{currentScenario.caseA.complainant}</strong>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E3E5DE] space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#E8EEE7] text-[#344B3B] font-semibold border border-[#D0DDD0]">
                    {currentScenario.caseB.bureau}
                  </span>
                  <span className="text-[#85877F]">{currentScenario.caseB.id}</span>
                </div>
                <div className="text-xs font-bold text-[#20231F] pt-1">
                  {currentScenario.caseB.subject}
                </div>
                <div className="text-[11px] text-[#62665F]">
                  Complainant: <strong>{currentScenario.caseB.complainant}</strong>
                </div>
              </div>
            </div>

            {/* Score Factor Breakdown */}
            <div className="bg-white p-5 rounded-xl border border-[#E3E5DE] space-y-3">
              <div className="text-xs font-bold text-[#20231F] uppercase tracking-wider font-mono">
                Multi-Vector Feature Contributions
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                {currentScenario.factors.map((f, idx) => (
                  <div key={idx} className="p-3 bg-[#F7F7F4] rounded-lg border border-[#E3E5DE] space-y-1">
                    <div className="text-[10px] text-[#85877F] font-semibold truncate">{f.name}</div>
                    <div className="font-mono font-bold text-[#20231F] text-sm">
                      {f.score} / {f.weight} pts
                    </div>
                    <div className="text-[10px] text-[#62665F] truncate">{f.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sovereign Reviewer Interactive Action Bar */}
            <div className="pt-2 border-t border-[#E3E5DE] space-y-3">
              <div className="text-xs font-bold text-[#20231F]">
                Simulate Reviewer Sovereign Determination:
              </div>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => setAdjudicationChoice("CONFIRMED")}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    adjudicationChoice === "CONFIRMED"
                      ? "bg-[#344B3B] text-white shadow-xs"
                      : "bg-white hover:bg-[#E8EEE7] text-[#344B3B] border border-[#D0DDD0]"
                  }`}
                >
                  Confirm Overlap & Link Bureaus
                </button>
                <button
                  onClick={() => setAdjudicationChoice("DISTINCT")}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    adjudicationChoice === "DISTINCT"
                      ? "bg-[#20231F] text-white shadow-xs"
                      : "bg-white hover:bg-[#F7F7F4] text-[#62665F] border border-[#E3E5DE]"
                  }`}
                >
                  Mark as Distinct (False Positive)
                </button>
                <button
                  onClick={() => setAdjudicationChoice("DEFERRED")}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    adjudicationChoice === "DEFERRED"
                      ? "bg-[#925C0B] text-white shadow-xs"
                      : "bg-white hover:bg-[#FBF1DB] text-[#925C0B] border border-[#F0DCB0]"
                  }`}
                >
                  Defer for Institutional Affidavit
                </button>
              </div>

              {adjudicationChoice !== "NONE" && (
                <div className="p-3.5 bg-[#E8EEE7] rounded-xl text-xs text-[#344B3B] border border-[#D0DDD0]">
                  <strong>Action Recorded:</strong> Determination marked as{" "}
                  <span className="font-mono font-bold">{adjudicationChoice}</span>. Stamped under official reviewer credentials and appended to the AICTE Governance Audit Trail.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — STATUTORY ACCOUNTABILITY & REVIEWS
         ========================================================================= */}
      <section className="py-20 border-b border-[#E3E5DE] bg-[#F7F7F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono font-bold text-[#344B3B] bg-[#E8EEE7] px-2.5 py-1 rounded">
              GOVERNANCE PRINCIPLES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#20231F] tracking-tight">
              Designed for institutional integrity and due process.
            </h2>
            <p className="text-sm text-[#62665F] leading-relaxed">
              CaseSense complies with natural justice guidelines and AICTE administrative frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-[#E3E5DE] rounded-xl p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#E8EEE7] text-[#344B3B] flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#20231F]">Zero Unilateral Merges</h3>
              <p className="text-xs text-[#62665F] leading-relaxed">
                Cases sharing an institution ID are never merged automatically. Legal independence of distinct grievances is preserved until authorized reviewers verify commonality.
              </p>
            </div>

            <div className="bg-white border border-[#E3E5DE] rounded-xl p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#EAF0F6] text-[#496785] flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#20231F]">Natural Justice Protocol</h3>
              <p className="text-xs text-[#62665F] leading-relaxed">
                Colleges receive time-bound notices and submit formal counter-affidavits before joint inspections or disciplinary directives can be issued.
              </p>
            </div>

            <div className="bg-white border border-[#E3E5DE] rounded-xl p-6 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-[#FBF1DB] text-[#925C0B] flex items-center justify-center font-bold">
                <History className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#20231F]">Immutable Audit Trail</h3>
              <p className="text-xs text-[#62665F] leading-relaxed">
                Every overlap confirmation, status change, and notice issued generates an immutable audit record containing the reviewer&apos;s ID, bureau cell, timestamp, and justification notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — FINAL CALL TO ACTION
         ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#20231F] tracking-tight">
            Ready to track an institution or inspect an active case?
          </h2>
          <p className="text-sm text-[#62665F] max-w-xl mx-auto leading-relaxed">
            CaseSense coordinates grievances across all AICTE cells. Choose your portal below to lodge complaints, track status, or begin official inquiry review.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/complaints/register"
              className="px-6 py-3 bg-[#344B3B] hover:bg-[#293D30] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2"
            >
              <FilePlus className="w-4 h-4" />
              <span>Register Complaint</span>
            </Link>
            <Link
              href="/track-complaint"
              className="px-6 py-3 bg-[#F0F3ED] hover:bg-[#E8EEE7] text-[#344B3B] text-xs font-semibold rounded-lg border border-[#D4D8CF] transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Citizen Tracking Desk</span>
            </Link>
            <Link
              href="/login"
              className="px-6 py-3 bg-white hover:bg-[#F7F7F4] text-[#20231F] text-xs font-medium rounded-lg border border-[#E3E5DE] transition-colors"
            >
              Official Reviewer Workspace &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
