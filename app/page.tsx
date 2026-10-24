"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  Building2,
  GitCompare,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  Scale,
  FileText,
  AlertTriangle,
  Layers,
  ChevronRight,
  Eye,
  Check,
  X,
  History,
  Activity,
  Sparkles,
  ExternalLink,
  Database,
  ShieldAlert,
  Sliders,
  Users,
  FilePlus,
  ArrowUpRight,
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
      statusColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
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
        { name: "Narrative Lexical Jaccard", weight: 25, score: 18, detail: "Keyword Similarity 72%" },
        { name: "Cross-Bureau Bonus", weight: 10, score: 10, detail: "PGRC ↔ Regulation Bureau" },
      ],
      recommendation: "Joint Inquiry Recommended. Lead Bureau: Regulation Bureau (RB).",
    },
    scenario2: {
      title: "Hostel Facility & Approval Discrepancy",
      confidence: 76,
      status: "MODERATE CORRELATION",
      statusColor: "text-blue-400 bg-blue-500/10 border-blue-500/30",
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
        { name: "Narrative Lexical Jaccard", weight: 25, score: 11, detail: "Keyword Similarity 44%" },
        { name: "Cross-Bureau Bonus", weight: 10, score: 7, detail: "PGRC ↔ Approval Bureau" },
      ],
      recommendation: "Cross-Bureau Tagging Required. Cases remain distinct with linked dossiers.",
    },
    scenario3: {
      title: "Distinct Institutional Complaints",
      confidence: 18,
      status: "NO OVERLAP (DISTINCT)",
      statusColor: "text-slate-400 bg-slate-500/10 border-slate-500/30",
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
        { name: "Narrative Lexical Jaccard", weight: 25, score: 5, detail: "Minimal Keyword Match 12%" },
        { name: "Cross-Bureau Bonus", weight: 10, score: 5, detail: "Independent Cell Processing" },
      ],
      recommendation: "Standard Independent Queue. No inter-bureau intervention needed.",
    },
  };

  const currentScenario = scenarios[selectedScenario];

  return (
    <div className="flex flex-col min-h-screen bg-[#08121E] text-[#F5F3ED] font-sans antialiased selection:bg-[#1769AA] selection:text-white">
      {/* =========================================================================
          SECTION 1 — HERO: Editorial Asymmetric Composition with Live Intelligence
         ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 border-b border-[#162942]">
        {/* Subtle Architectural Geometry Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#162942_1px,transparent_1px),linear-gradient(to_bottom,#162942_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Typographic Monument */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              {/* National Institutional Emblems Banner */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 bg-[#0F2035]/90 border border-[#203D63] px-3.5 py-2 rounded-lg backdrop-blur-xs shadow-xs">
                  <img
                    src="/branding/gov-india-emblem.png"
                    alt="Government of India Emblem"
                    className="h-8 w-auto object-contain rounded-xs"
                  />
                  <div className="h-5 w-px bg-slate-700/80" />
                  <div className="w-8 h-8 rounded bg-white p-0.5 flex items-center justify-center shadow-xs">
                    <img
                      src="/branding/aicte-logo.png"
                      alt="AICTE Official Logo"
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-white font-semibold">
                      AICTE Statutory Oversight
                    </div>
                    <div className="text-[9px] font-mono text-[#8DA0B8]">
                      SIH 2026 Problem Statement ID: SIH26264
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Eyebrow */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0F2035] border border-[#203D63] text-[#EAF0F6] text-xs font-mono tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#1769AA] animate-pulse" />
                <span>INTER-BUREAU COMPLAINT INTELLIGENCE</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] font-sans">
                  Different records. <br />
                  <span className="text-[#58A6FF]">One institution.</span> <br />
                  Clearer coordination.
                </h1>
                <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl font-normal leading-relaxed pt-2">
                  CaseBridge AI triangulates student, faculty, and public grievances across AICTE bureaus—identifying hidden institutional overlaps between regulatory notices, approval queries, and cell petitions with explainable scoring and zero unilateral merges.
                </p>
              </div>

              {/* Primary Call to Action */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center space-x-2 bg-[#1769AA] hover:bg-[#1C7DD1] text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-md shadow-blue-950/40 hover:shadow-blue-900/60"
                >
                  <span>Launch Official Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/complaints/register"
                  className="inline-flex items-center space-x-2 bg-[#0F2035] hover:bg-[#162D4A] border border-[#203D63] hover:border-[#335C91] text-[#EAF0F6] px-5 py-3 rounded-lg text-sm font-medium transition-all"
                >
                  <FilePlus className="w-4 h-4 text-[#58A6FF]" />
                  <span>Lodge Grievance</span>
                </Link>

                <Link
                  href="/track-complaint"
                  className="inline-flex items-center space-x-1.5 text-xs text-[#8DA0B8] hover:text-white px-3 py-2 font-mono transition-colors"
                >
                  <span>Track Status</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Institutional Metrics Pill Bar */}
              <div className="pt-4 border-t border-[#162942] grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-white">14,280+</div>
                  <div className="text-[11px] text-[#8DA0B8] font-mono">Technical Institutes</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-[#58A6FF]">5 Bureaus</div>
                  <div className="text-[11px] text-[#8DA0B8] font-mono">Synchronized Cells</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">100%</div>
                  <div className="text-[11px] text-[#8DA0B8] font-mono">Audited Decisions</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Live Operational Intelligence Preview */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.96 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div className="bg-[#0D1C2E] border border-[#1E375B] rounded-xl overflow-hidden shadow-2xl shadow-black/60 text-left">
                {/* Console Window Header */}
                <div className="bg-[#08121E] px-4 py-2.5 border-b border-[#1E375B] flex items-center justify-between text-xs font-mono text-[#8DA0B8]">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-[#8DA0B8] pl-2">RADAR: OVL-2026-001</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    88% CONFIDENCE
                  </span>
                </div>

                {/* Overlap Summary Card */}
                <div className="p-5 space-y-4">
                  <div>
                    <div className="text-[11px] font-mono text-[#8DA0B8] uppercase tracking-wider">
                      Target Entity Resolution
                    </div>
                    <div className="text-base font-bold text-white mt-0.5 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#58A6FF]" />
                      <span>Apex Institute of Technology, Pune</span>
                    </div>
                    <div className="text-xs font-mono text-slate-400 mt-0.5">
                      AICTE Permanent Institute ID: <span className="text-[#58A6FF] font-semibold">1-10492811</span>
                    </div>
                  </div>

                  {/* Comparative Two-Cell Snapshot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div className="p-3 rounded-lg bg-[#112338] border border-[#203D63] space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          PGRC CELL
                        </span>
                        <span className="text-[#8DA0B8]">PGRC-2026-0811</span>
                      </div>
                      <div className="text-xs font-medium text-slate-200 line-clamp-2">
                        Unapproved fee escalation & withheld original marksheets
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-[#112338] border border-[#203D63] space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          REGULATION
                        </span>
                        <span className="text-[#8DA0B8]">RB-2026-1190</span>
                      </div>
                      <div className="text-xs font-medium text-slate-200 line-clamp-2">
                        Institutional audit flag: Non-compliance with fee ceiling
                      </div>
                    </div>
                  </div>

                  {/* Multi-Factor Rationale Bars */}
                  <div className="space-y-2 pt-2 border-t border-[#1E375B]/60 text-xs">
                    <div className="text-[10px] font-mono uppercase text-[#8DA0B8] tracking-wider">
                      Explainable Scoring Breakdown
                    </div>
                    <div className="space-y-1.5 text-[11px] font-mono">
                      <div className="flex justify-between items-center text-slate-300">
                        <span>PID Exact Verification</span>
                        <span className="text-emerald-400 font-bold">40 / 40 pts</span>
                      </div>
                      <div className="w-full bg-[#162D4A] rounded-full h-1.5">
                        <div className="bg-emerald-400 h-1.5 rounded-full w-full" />
                      </div>

                      <div className="flex justify-between items-center text-slate-300 pt-1">
                        <span>Category Semantic Match (Fee Dispute)</span>
                        <span className="text-[#58A6FF] font-bold">25 / 25 pts</span>
                      </div>
                      <div className="w-full bg-[#162D4A] rounded-full h-1.5">
                        <div className="bg-[#58A6FF] h-1.5 rounded-full w-full" />
                      </div>

                      <div className="flex justify-between items-center text-slate-300 pt-1">
                        <span>Lexical Token Jaccard Overlap</span>
                        <span className="text-amber-400 font-bold">18 / 25 pts</span>
                      </div>
                      <div className="w-full bg-[#162D4A] rounded-full h-1.5">
                        <div className="bg-amber-400 h-1.5 rounded-full w-[72%]" />
                      </div>
                    </div>
                  </div>

                  {/* Adjudication Interaction */}
                  <div className="pt-2 border-t border-[#1E375B]/60 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#8DA0B8] font-mono">
                      Prerogative: <span className="text-white font-medium">Reviewer Decision</span>
                    </span>
                    <Link
                      href="/overlap-review/OVL-2026-001"
                      className="text-xs font-medium text-[#58A6FF] hover:text-blue-300 transition-colors flex items-center gap-1 font-mono"
                    >
                      <span>Triage in Console</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — THE AICTE GRIEVANCE LIFECYCLE (Interactive 4-Phase Sequence)
         ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#0A1626] border-b border-[#162942]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0F2035] border border-[#203D63] text-xs font-mono text-[#58A6FF]">
              <Layers className="w-3.5 h-3.5" />
              <span>THE OPERATIONAL PIPELINE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              From Intake to Audited Resolution
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8]">
              Inspect how CaseBridge AI structures incoming cases, uncovers multi-cell overlaps, computes transparent scores, and empowers authorized human reviewers.
            </p>
          </div>

          {/* Phase Tabs */}
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {[
              { id: 1, title: "01. Intake & Identity Resolution" },
              { id: 2, title: "02. Cross-Bureau Triangulation" },
              { id: 3, title: "03. Explainable Scoring Matrix" },
              { id: 4, title: "04. Audited Human Resolution" },
            ].map((phase) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`px-4 py-2.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  activePhase === phase.id
                    ? "bg-[#1769AA] text-white shadow-md border border-blue-400/40"
                    : "bg-[#0D1C2E] text-[#8DA0B8] border border-[#1E375B] hover:text-white hover:bg-[#132740]"
                }`}
              >
                {phase.title}
              </button>
            ))}
          </div>

          {/* Active Phase Content Display */}
          <div className="mt-8 bg-[#0D1C2E] border border-[#1E375B] rounded-xl p-6 sm:p-10 max-w-4xl mx-auto text-left shadow-xl">
            {activePhase === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#1E375B] pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-[#58A6FF] uppercase">Phase 01</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      Permanent Institute ID (PID) Normalization
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/30">
                    Input & Sanitization
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Complaints arrive through various channels—student grievance portals, regional inspection notes, RTI applications, or ministry directives. Each record is parsed, validated against the official AICTE Institution Directory of 14,000+ approved technical colleges, and mapped to a unique Permanent Institute ID (PID).
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-[#112338] border border-[#203D63]">
                    <div className="text-[#8DA0B8] text-[10px]">RAW INPUT</div>
                    <div className="text-white font-semibold mt-1">Apex College Pune</div>
                    <div className="text-[10px] text-amber-400 mt-1">Unstructured Name</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#112338] border border-[#203D63]">
                    <div className="text-[#8DA0B8] text-[10px]">DIRECTORY MATCH</div>
                    <div className="text-emerald-400 font-semibold mt-1">Apex Institute of Tech</div>
                    <div className="text-[10px] text-emerald-300 mt-1">Verified AICTE Record</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#112338] border border-[#203D63]">
                    <div className="text-[#8DA0B8] text-[10px]">RESOLVED PID</div>
                    <div className="text-[#58A6FF] font-semibold mt-1">PID: 1-10492811</div>
                    <div className="text-[10px] text-blue-300 mt-1">Canonical Key</div>
                  </div>
                </div>
              </div>
            )}

            {activePhase === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#1E375B] pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-[#58A6FF] uppercase">Phase 02</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      Cross-Bureau Overlap Candidate Retrieval
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    Dual Canonical Pairing
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Instead of siloed complaint registries where the Regulation Bureau and the Public Grievance Redressal Cell work in isolation, CaseBridge AI automatically evaluates candidate pairs across cells. Cases sharing identical institute PIDs or matching high-severity categories are grouped into pairs with canonical ordering <code className="text-xs font-mono bg-[#162D4A] px-1.5 py-0.5 rounded text-blue-300">min(id1, id2), max(id1, id2)</code> to prevent reverse duplicate flags.
                </p>
                <div className="p-4 rounded-lg bg-[#112338] border border-[#203D63] text-xs font-mono space-y-2">
                  <div className="text-slate-400">DATABASE INTEGRITY ASSURANCE:</div>
                  <div className="text-emerald-400">
                    ✓ Unique Constraint <span className="text-white">uq_case_pair</span> Enforced
                  </div>
                  <div className="text-emerald-400">
                    ✓ Zero Unilateral Record Merges (Both cases retain statutory identity)
                  </div>
                  <div className="text-emerald-400">
                    ✓ Preserves Inter-Bureau Privacy & Role-Based Access Controls
                  </div>
                </div>
              </div>
            )}

            {activePhase === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#1E375B] pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-[#58A6FF] uppercase">Phase 03</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      Multi-Factor Explainable Scoring Algorithm
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                    Mathematical Rigor
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Every proposed relationship is grounded in an explainable mathematical formula rather than opaque black-box AI prompts. The overall correlation score combines four distinct dimensions:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-3 bg-[#112338] border border-[#203D63] rounded-lg">
                    <div className="text-[#58A6FF] font-bold text-lg">40%</div>
                    <div className="text-slate-200 mt-1 font-semibold">PID Match</div>
                    <div className="text-[10px] text-[#8DA0B8] mt-0.5">Institutional identity match</div>
                  </div>
                  <div className="p-3 bg-[#112338] border border-[#203D63] rounded-lg">
                    <div className="text-amber-400 font-bold text-lg">25%</div>
                    <div className="text-slate-200 mt-1 font-semibold">Category</div>
                    <div className="text-[10px] text-[#8DA0B8] mt-0.5">Subject classification</div>
                  </div>
                  <div className="p-3 bg-[#112338] border border-[#203D63] rounded-lg">
                    <div className="text-emerald-400 font-bold text-lg">25%</div>
                    <div className="text-slate-200 mt-1 font-semibold">Text Jaccard</div>
                    <div className="text-[10px] text-[#8DA0B8] mt-0.5">Lexical narrative tokens</div>
                  </div>
                  <div className="p-3 bg-[#112338] border border-[#203D63] rounded-lg">
                    <div className="text-purple-400 font-bold text-lg">10%</div>
                    <div className="text-slate-200 mt-1 font-semibold">Cell Bonus</div>
                    <div className="text-[10px] text-[#8DA0B8] mt-0.5">Inter-bureau synergy</div>
                  </div>
                </div>
              </div>
            )}

            {activePhase === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#1E375B] pb-4">
                  <div>
                    <span className="text-[11px] font-mono text-[#58A6FF] uppercase">Phase 04</span>
                    <h3 className="text-xl font-bold text-white mt-0.5">
                      Human Reviewer Adjudication & Cryptographic Audit
                    </h3>
                  </div>
                  <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    Human Prerogative
                  </span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Software highlights the evidence; authorized AICTE officials make the decisions. The reviewing bureau officer inspects the side-by-side dossier and chooses an audited action. Every decision appends an immutable entry to the audit log.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 bg-blue-950/40 border border-blue-800/40 rounded-lg">
                    <div className="text-[#58A6FF] font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Link</span>
                    </div>
                    <div className="text-slate-300 text-[11px] mt-1.5">
                      Flags cases as linked and designates a lead inquiry bureau without altering case IDs.
                    </div>
                  </div>
                  <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-lg">
                    <div className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" />
                      <span>Mark Distinct</span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-1.5">
                      Declares complaints unrelated despite common institute. Independent queues maintained.
                    </div>
                  </div>
                  <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-lg">
                    <div className="text-amber-400 font-semibold flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>Defer for Inquiry</span>
                    </div>
                    <div className="text-slate-300 text-[11px] mt-1.5">
                      Requests additional documentation from college compliance desk before concluding.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — INTERACTIVE SCENARIO LAB: Live Multi-Factor Matching Lab
         ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#08121E] border-b border-[#162942]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0F2035] border border-[#203D63] text-xs font-mono text-amber-400">
              <Sliders className="w-3.5 h-3.5" />
              <span>TEST ALGORITHM DIRECTLY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Interactive Case Correlation Lab
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8]">
              Select real synthetic case scenarios below to evaluate how the explainable scoring engine behaves under different complaint criteria.
            </p>
          </div>

          {/* Scenario Selector Pills */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {[
              { id: "scenario1", label: "Scenario A: High Confidence Fee Overlap (88%)" },
              { id: "scenario2", label: "Scenario B: Hostel Deficit Correlation (76%)" },
              { id: "scenario3", label: "Scenario C: Distinct Unrelated Matters (18%)" },
            ].map((sc) => (
              <button
                key={sc.id}
                onClick={() => {
                  setSelectedScenario(sc.id as any);
                  setAdjudicationChoice("NONE");
                }}
                className={`px-4 py-2.5 rounded-lg text-xs font-mono font-medium transition-all ${
                  selectedScenario === sc.id
                    ? "bg-[#162D4A] text-white border border-[#58A6FF] shadow-md"
                    : "bg-[#0D1C2E] text-[#8DA0B8] border border-[#1E375B] hover:text-white"
                }`}
              >
                {sc.label}
              </button>
            ))}
          </div>

          {/* Scenario Detailed Card */}
          <div className="mt-8 max-w-5xl mx-auto bg-[#0D1C2E] border border-[#1E375B] rounded-xl p-6 sm:p-8 text-left shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#1E375B] pb-4">
              <div>
                <span className="text-[11px] font-mono text-[#8DA0B8]">ACTIVE TEST CASE</span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  {currentScenario.title}
                </h3>
                <div className="text-xs font-mono text-slate-400 mt-0.5 flex items-center gap-2">
                  <span>{currentScenario.institution}</span>
                  <span>&bull;</span>
                  <span className="text-[#58A6FF]">PID: {currentScenario.pid}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-white">
                    {currentScenario.confidence}%
                  </div>
                  <div className="text-[10px] font-mono text-[#8DA0B8]">CORRELATION</div>
                </div>
                <span
                  className={`text-xs font-mono px-2.5 py-1 rounded border font-semibold ${currentScenario.statusColor}`}
                >
                  {currentScenario.status}
                </span>
              </div>
            </div>

            {/* Side-by-Side Comparison of Cases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Case A */}
              <div className="bg-[#112338] border border-[#203D63] rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                    {currentScenario.caseA.bureau}
                  </span>
                  <span className="text-slate-400">{currentScenario.caseA.id}</span>
                </div>
                <div className="text-sm font-semibold text-white">
                  {currentScenario.caseA.subject}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Originator: {currentScenario.caseA.complainant}
                </div>
              </div>

              {/* Case B */}
              <div className="bg-[#112338] border border-[#203D63] rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold">
                    {currentScenario.caseB.bureau}
                  </span>
                  <span className="text-slate-400">{currentScenario.caseB.id}</span>
                </div>
                <div className="text-sm font-semibold text-white">
                  {currentScenario.caseB.subject}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Originator: {currentScenario.caseB.complainant}
                </div>
              </div>
            </div>

            {/* Explainable Factor Breakdown Table */}
            <div className="mt-6 pt-5 border-t border-[#1E375B]">
              <div className="text-xs font-mono uppercase text-[#8DA0B8] mb-3 tracking-wider">
                Explainable Score Contributors
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                {currentScenario.factors.map((f, i) => (
                  <div key={i} className="p-3 bg-[#08121E] border border-[#162942] rounded-lg">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>{f.name}</span>
                      <span className="font-bold text-[#58A6FF]">
                        {f.score} / {f.weight} pts
                      </span>
                    </div>
                    <div className="text-[10px] text-[#8DA0B8] mt-1">{f.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation & Human Action Station */}
            <div className="mt-6 pt-5 border-t border-[#1E375B] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-xs">
                <span className="text-[#8DA0B8] font-mono">SYSTEM ADVICE:</span>
                <p className="text-slate-200 font-medium mt-0.5">{currentScenario.recommendation}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAdjudicationChoice("CONFIRMED")}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                    adjudicationChoice === "CONFIRMED"
                      ? "bg-blue-600 text-white"
                      : "bg-[#162D4A] text-slate-200 hover:bg-[#1E3E66]"
                  }`}
                >
                  Confirm Linked
                </button>
                <button
                  onClick={() => setAdjudicationChoice("DISTINCT")}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-colors ${
                    adjudicationChoice === "DISTINCT"
                      ? "bg-slate-700 text-white"
                      : "bg-[#162D4A] text-slate-200 hover:bg-[#1E3E66]"
                  }`}
                >
                  Mark Distinct
                </button>
              </div>
            </div>

            {adjudicationChoice !== "NONE" && (
              <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs font-mono text-emerald-300 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Simulated Action Recorded: Case pair status set to{" "}
                  <strong>{adjudicationChoice}</strong> with cryptographic audit entry.
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — ARCHITECTURE & STATUTORY GOVERNANCE
         ========================================================================= */}
      <section className="py-20 sm:py-28 bg-[#0A1626] border-b border-[#162942]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0F2035] border border-[#203D63] text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SECURITY & TRUST ARCHITECTURE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Engineered for Institutional Accountability
            </h2>
            <p className="text-sm sm:text-base text-[#94A3B8]">
              Built strictly to public sector standards with Row-Level Security, multi-tenant college isolation, and zero unilateral case merging.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-[#0D1C2E] border border-[#1E375B] rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#162D4A] border border-[#203D63] flex items-center justify-center text-[#58A6FF]">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Zero Unilateral Merges</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Cases originating from different bureaus retain their independent case IDs, jurisdiction, and timelines. Matching establishes auditable bidirectional linkages rather than destructive database overwrites.
              </p>
            </div>

            <div className="bg-[#0D1C2E] border border-[#1E375B] rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#162D4A] border border-[#203D63] flex items-center justify-center text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Row Level Security (RLS)</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Technical institutions can access only grievances filed against their own Permanent Institute ID (PID). Bureau officials are granted role-scoped access enforced directly at the PostgreSQL layer.
              </p>
            </div>

            <div className="bg-[#0D1C2E] border border-[#1E375B] rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#162D4A] border border-[#203D63] flex items-center justify-center text-amber-400">
                <History className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Immutable Audit Trail</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Every overlap confirmation, status change, and notice issued generates an immutable audit record containing the reviewer's ID, bureau cell, timestamp, and justification notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — FINAL CALL TO ACTION
         ========================================================================= */}
      <section className="py-20 sm:py-24 bg-[#08121E]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Explore the CaseBridge Workspace?
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl mx-auto">
            Experience the unified operational dashboard designed for AICTE officers, committee reviewers, and technical institute compliance desks.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 bg-[#1769AA] hover:bg-[#1C7DD1] text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all shadow-md"
            >
              <span>Access Executive Overview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center space-x-2 bg-[#0F2035] hover:bg-[#162D4A] border border-[#203D63] text-white px-6 py-3 rounded-lg text-sm font-medium transition-all"
            >
              <span>Official Login Portal</span>
            </Link>
          </div>

          <div className="pt-8 text-xs font-mono text-[#8DA0B8]">
            AICTE Problem Statement ID: SIH26264 &bull; Smart India Hackathon 2026 &bull; Team Code Ninja&apos;s
          </div>
        </div>
      </section>
    </div>
  );
}
