"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  FilePlus,
  Search,
  Building2,
  Users,
  GitCompare,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Lock,
  Scale,
  FileText,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Layers,
  ChevronRight,
  ArrowUpRight,
  Eye,
  Check,
  X,
  Compass,
  FileCheck2,
  History,
  Activity,
  Workflow,
  Network,
  Sliders,
  Sparkles,
} from "lucide-react";

export default function CinematicLandingPage() {
  // Scene 00 calibration state (brief, skippable)
  const [introDismissed, setIntroDismissed] = useState(false);

  // Scene 04 matching demonstration tab
  const [matchingTab, setMatchingTab] = useState<"duplicate" | "related" | "separate">("related");

  // Scene 05 human review interactive simulation
  const [reviewDecision, setReviewDecision] = useState<"NONE" | "CONFIRMED" | "DISTINCT" | "DEFERRED">("NONE");

  return (
    <div className="flex flex-col min-h-screen bg-[#0B1C2D] text-[#F5F3ED] font-sans antialiased selection:bg-[#1769AA] selection:text-white">
      {/* =========================================================================
          SCENE 00 — INTRODUCTION: Wordmark Calibration (Brief & Skippable)
         ========================================================================= */}
      {!introDismissed && (
        <aside
          aria-label="System calibration notice"
          className="relative bg-[#142C46] border-b border-[#D9E0E7]/20 py-2.5 px-4 text-xs text-[#EAF0F6] flex items-center justify-between"
        >
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="w-2 h-2 rounded-full bg-[#1769AA] animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#AEBBCD]">
                CASEBRIDGE AI • CALIBRATED INSTITUTIONAL PLATFORM
              </span>
              <span className="hidden sm:inline text-[#657386]">|</span>
              <span className="hidden sm:inline text-[#AEBBCD] text-[11px]">
                Smart India Hackathon 2026 (Problem Statement ID: SIH26264)
              </span>
            </div>
            <button
              onClick={() => setIntroDismissed(true)}
              className="text-[11px] font-mono text-[#AEBBCD] hover:text-white px-2 py-0.5 rounded border border-[#657386]/30 hover:border-slate-400 transition-colors"
            >
              Skip Intro [ESC]
            </button>
          </div>
        </aside>
      )}

      {/* =========================================================================
          SCENE 01 — HERO: Deep Navy Architectural Typographic Composition
         ========================================================================= */}
      <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-36 bg-[#0B1C2D] border-b border-[#142C46]">
        {/* Subtle Architectural Geometry Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#142C46_1px,transparent_1px),linear-gradient(to_bottom,#142C46_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Typographic Monument */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* National Institutional Emblems Banner */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 bg-[#142C46]/80 border border-[#657386]/30 px-3.5 py-2 rounded-lg backdrop-blur-xs">
                  <img
                    src="/branding/gov-india-emblem.png"
                    alt="Government of India Emblem"
                    className="h-7 sm:h-8 w-auto object-contain"
                  />
                  <div className="h-5 w-px bg-slate-700" />
                  <div className="w-8 h-8 rounded bg-white p-0.5 flex items-center justify-center shadow-xs">
                    <img
                      src="/branding/aicte-logo.png"
                      alt="AICTE Official Logo"
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#AEBBCD] hidden sm:inline">
                    Statutory AICTE Intelligence
                  </span>
                </div>
              </div>

              {/* Category Eyebrow */}
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#142C46] border border-[#657386]/40 text-[#EAF0F6] text-xs font-mono tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1769AA]" />
                <span>AICTE GRIEVANCE & DE-DUPLICATION DIRECTORY</span>
              </div>

              {/* Oversized Wordmark Composition */}
              <div className="font-extrabold tracking-tighter uppercase leading-[0.9] text-white">
                <div className="text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#FFFFFF]">
                  CASEBRIDGE
                </div>
                <div className="text-4xl sm:text-6xl lg:text-7xl text-[#1769AA] tracking-tight">
                  AI
                </div>
              </div>

              {/* Core Proposition Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F5F3ED] tracking-tight leading-snug">
                Different records. One institution. Clearer coordination.
              </h1>

              {/* Exact Mandated Supporting Copy */}
              <p className="text-base sm:text-lg text-[#AEBBCD] leading-relaxed max-w-2xl font-normal">
                Bring institution-related complaint records into a more coherent review workflow with explainable matching, human-controlled decisions, and an auditable history.
              </p>

              {/* CTA Action Group */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#scenes"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded bg-[#1769AA] hover:bg-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-950/40 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Compass className="w-4 h-4" />
                  <span>Explore the Platform</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>

                <Link
                  href="/login"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded bg-[#142C46] hover:bg-[#1a385a] text-[#F5F3ED] font-semibold text-sm border border-[#657386]/50 hover:border-slate-400 transition-all"
                >
                  <Lock className="w-4 h-4 text-[#8DBAFF]" />
                  <span>Sign In</span>
                </Link>
              </div>

              {/* Institutional Notice */}
              <div className="pt-3 flex items-center space-x-2 text-xs text-[#657386] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#657386]" />
                <span>Prototype designed for Smart India Hackathon 2026 • Problem Statement: SIH26264</span>
              </div>
            </div>

            {/* Right Column: Architectural Signature Convergence Visual */}
            <div className="lg:col-span-5 relative">
              <div className="p-0.5 rounded-xl bg-gradient-to-b from-[#142C46] via-[#10233D] to-[#0B1C2D] border border-[#657386]/30 shadow-2xl">
                <div className="bg-[#10233D] rounded-lg p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-[#142C46] pb-3 text-xs font-mono">
                    <span className="text-[#8DBAFF] font-bold uppercase tracking-wider">
                      ● Active Cross-Bureau Feeds
                    </span>
                    <span className="text-[10px] text-[#AEBBCD] bg-[#142C46] px-2 py-0.5 rounded">
                      PID: 1-10492811
                    </span>
                  </div>

                  {/* Illustrative records flowing in */}
                  <div className="space-y-2.5">
                    <div className="p-3 rounded bg-[#0B1C2D] border border-[#1769AA]/40 text-xs space-y-1">
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-[#8DBAFF] font-bold">AICTE/PGRC/2026/0892</span>
                        <span className="text-blue-300 font-semibold">PGRC Desk</span>
                      </div>
                      <div className="text-white font-medium text-xs">
                        Apex Inst of Tech • Original Degree Withheld
                      </div>
                    </div>

                    <div className="p-3 rounded bg-[#0B1C2D] border border-[#657386]/40 text-xs space-y-1">
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-amber-300 font-bold">AICTE/REG/2026/0142</span>
                        <span className="text-amber-400 font-semibold">Regulation Bureau</span>
                      </div>
                      <div className="text-white font-medium text-xs">
                        Apex Inst of Tech • Unapproved Ancillary Capitation Fee
                      </div>
                    </div>

                    <div className="p-3 rounded bg-[#0B1C2D] border border-[#657386]/40 text-xs space-y-1">
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-slate-300 font-bold">AICTE/APP/2026/0078</span>
                        <span className="text-slate-400 font-semibold">Approval Cell</span>
                      </div>
                      <div className="text-white font-medium text-xs">
                        Apex Inst of Tech • Faculty Cadre Ratio Shortfall
                      </div>
                    </div>
                  </div>

                  {/* Core Principle Badge */}
                  <div className="p-3 rounded bg-[#142C46] border border-[#1769AA]/30 text-center text-xs space-y-1">
                    <div className="font-mono text-[11px] text-[#8DBAFF] font-bold uppercase tracking-wider">
                      Explainable Correlation Engine
                    </div>
                    <div className="text-[11px] text-[#EAF0F6]">
                      Shared institution flagged for inquiry. Independent records preserved without destructive merge.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 02 — FRAGMENTED RECORDS: 3 Specific Illustrative Fictional Examples
         ========================================================================= */}
      <section id="scenes" className="py-24 bg-[#10233D] border-b border-[#142C46]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8DBAFF] font-mono">
              SCENE 02 • THE INTAKE FRAGMENTATION DILEMMA
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Three distinct complaints. One underlying institutional reality.
            </h2>
            <p className="text-sm sm:text-base text-[#AEBBCD] leading-relaxed">
              Different citizens use distinct wording to describe related grievances. When complaints enter disparate bureaus, lack of cross-cell visibility leads to duplicate hearings, conflicting notices, and administrative blind spots.
            </p>
          </div>

          {/* Three Mandated Fictional Examples */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Example 1 */}
            <div className="p-6 rounded-xl bg-[#0B1C2D] border border-[#D9E0E7]/20 space-y-4 hover:border-[#1769AA] transition-colors">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-[#142C46] text-[#8DBAFF] border border-[#1769AA]/40">
                  ILLUSTRATIVE RECORD A
                </span>
                <span className="text-slate-400">PGRC Desk</span>
              </div>
              <div className="space-y-1.5">
                <div className="text-lg font-bold text-white">
                  &ldquo;Insufficient teaching staff&rdquo;
                </div>
                <p className="text-xs text-[#AEBBCD] leading-relaxed">
                  Lodged by 3rd-year engineering students reporting canceled core laboratory sessions and absent senior lecturers in Electrical Engineering.
                </p>
              </div>
              <div className="pt-3 border-t border-[#142C46] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>PID: 1-10492811</span>
                <span>Ref: PGRC-2026-0892</span>
              </div>
            </div>

            {/* Example 2 */}
            <div className="p-6 rounded-xl bg-[#0B1C2D] border border-[#D9E0E7]/20 space-y-4 hover:border-[#1769AA] transition-colors">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-[#142C46] text-amber-300 border border-amber-500/40">
                  ILLUSTRATIVE RECORD B
                </span>
                <span className="text-slate-400">Regulation Bureau</span>
              </div>
              <div className="space-y-1.5">
                <div className="text-lg font-bold text-white">
                  &ldquo;Staff strength below approved norms&rdquo;
                </div>
                <p className="text-xs text-[#AEBBCD] leading-relaxed">
                  Formal representation by Faculty Association citing cadre ratio violations, delayed gratuities, and unapproved adjunct appointments.
                </p>
              </div>
              <div className="pt-3 border-t border-[#142C46] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>PID: 1-10492811</span>
                <span>Ref: REG-2026-0142</span>
              </div>
            </div>

            {/* Example 3 */}
            <div className="p-6 rounded-xl bg-[#0B1C2D] border border-[#D9E0E7]/20 space-y-4 hover:border-[#1769AA] transition-colors">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-[#142C46] text-teal-300 border border-teal-500/40">
                  ILLUSTRATIVE RECORD C
                </span>
                <span className="text-slate-400">Approval Bureau</span>
              </div>
              <div className="space-y-1.5">
                <div className="text-lg font-bold text-white">
                  &ldquo;Vacant faculty posts&rdquo;
                </div>
                <p className="text-xs text-[#AEBBCD] leading-relaxed">
                  Annual Extension of Approval (EOA) inspection observation reporting 18 unfilled Professor and Associate Professor posts.
                </p>
              </div>
              <div className="pt-3 border-t border-[#142C46] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>PID: 1-10492811</span>
                <span>Ref: APP-2026-0078</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-[#142C46] border border-[#657386]/30 text-xs text-[#AEBBCD] flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Crucial Safeguard:</strong> Sharing an institution context does NOT automatically merge these complaints. Each complaint retains its independent docket, complainant confidentiality, and legal jurisdiction.
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 03 — INSTITUTION IDENTITY RESOLUTION
         ========================================================================= */}
      <section className="py-24 bg-[#0B1C2D] border-b border-[#142C46]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8DBAFF] font-mono">
              SCENE 03 • INSTITUTION IDENTITY RESOLUTION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Resolving identity with verified statutory identifiers.
            </h2>
            <p className="text-sm sm:text-base text-[#AEBBCD] leading-relaxed">
              Institutional names often vary in informal submissions (&ldquo;Apex College&rdquo;, &ldquo;Apex Pune&rdquo;, &ldquo;Apex Tech Institute&rdquo;). CaseBridge AI grounds all correlation in the AICTE Permanent Institute ID (PID), while keeping ambiguous matches flagged for human disambiguation.
            </p>
          </div>

          {/* Architecture Resolution Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#142C46]/60 border border-[#D9E0E7]/20 rounded-xl p-6 sm:p-8">
            <div className="md:col-span-5 space-y-4">
              <div className="text-xs font-mono font-bold uppercase text-[#8DBAFF] tracking-wider">
                Identity Resolution Architecture
              </div>
              <h3 className="text-xl font-bold text-white">
                Never merge institutions on fuzzy name alone.
              </h3>
              <p className="text-xs text-[#AEBBCD] leading-relaxed">
                A common error in naive AI systems is treating similarly named colleges across different states as the same entity. CaseBridge AI enforces verified identity hierarchy:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded bg-[#0B1C2D] border border-emerald-500/30 flex items-center justify-between">
                  <span className="font-semibold text-white">1. Verified Permanent Institute ID</span>
                  <span className="text-emerald-400 font-mono text-[11px]">100% Certainty</span>
                </div>
                <div className="p-2.5 rounded bg-[#0B1C2D] border border-amber-500/30 flex items-center justify-between">
                  <span className="font-semibold text-white">2. Registered Institutional Alias</span>
                  <span className="text-amber-300 font-mono text-[11px]">Verified Registry</span>
                </div>
                <div className="p-2.5 rounded bg-[#0B1C2D] border border-rose-500/30 flex items-center justify-between">
                  <span className="font-semibold text-white">3. Ambiguous Text Submission</span>
                  <span className="text-rose-400 font-mono text-[11px]">Human Review Flagged</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 bg-[#0B1C2D] p-5 rounded-lg border border-[#142C46] space-y-4">
              <div className="flex items-center justify-between border-b border-[#142C46] pb-2 text-xs font-mono text-slate-400">
                <span>IDENTITY DISAMBIGUATION SCHEMATIC</span>
                <span className="text-emerald-400 font-semibold">PID: 1-10492811</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-[#142C46]/40 border border-[#D9E0E7]/10 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400">Official Registered Name</div>
                  <div className="font-semibold text-white">Apex Institute of Technology</div>
                </div>
                <div className="p-3 rounded bg-[#142C46]/40 border border-[#D9E0E7]/10 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400">State / Region</div>
                  <div className="font-semibold text-white">Maharashtra / Western</div>
                </div>
                <div className="p-3 rounded bg-[#142C46]/40 border border-[#D9E0E7]/10 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400">Affiliated University</div>
                  <div className="font-semibold text-white">Savitribai Phule Pune University</div>
                </div>
                <div className="p-3 rounded bg-[#142C46]/40 border border-[#D9E0E7]/10 space-y-1">
                  <div className="text-[10px] font-mono text-slate-400">Known Citizen Aliases</div>
                  <div className="font-semibold text-slate-300">Apex Pune, AIT Pune</div>
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#142C46] text-[11px] text-[#AEBBCD] font-mono text-center">
                Ambiguous records without verified PID trigger immediate officer identity reconciliation.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 04 — EVIDENCE-BASED MATCHING: Exact Duplicate vs Related vs Separate
         ========================================================================= */}
      <section className="py-24 bg-[#10233D] border-b border-[#142C46]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8DBAFF] font-mono">
              SCENE 04 • EVIDENCE-BASED MATCHING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Distinguishing exact duplicates, related cases, and separate complaints.
            </h2>
            <p className="text-sm sm:text-base text-[#AEBBCD] leading-relaxed">
              <strong>A shared institution does not automatically mean a shared case.</strong> CaseBridge AI evaluates multi-dimensional evidence before surfacing any proposed relationship.
            </p>
          </div>

          {/* Interactive Scenario Switcher */}
          <div className="flex border-b border-[#142C46] gap-2">
            <button
              onClick={() => setMatchingTab("duplicate")}
              className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
                matchingTab === "duplicate"
                  ? "border-[#1769AA] text-white"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              Category 1: Exact Duplicate Candidates (&ge;85% Score)
            </button>
            <button
              onClick={() => setMatchingTab("related")}
              className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
                matchingTab === "related"
                  ? "border-[#1769AA] text-white"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              Category 2: Potentially Related Complaints (65–84% Score)
            </button>
            <button
              onClick={() => setMatchingTab("separate")}
              className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
                matchingTab === "separate"
                  ? "border-[#1769AA] text-white"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              Category 3: Unrelated Complaints (&lt;65% Score)
            </button>
          </div>

          {/* Evidence Details Panel */}
          <div className="bg-[#0B1C2D] border border-[#D9E0E7]/20 rounded-xl p-6 sm:p-8 space-y-6">
            {matchingTab === "duplicate" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm font-bold text-white flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span>EXACT DUPLICATE CANDIDATE PATTERN</span>
                  </div>
                  <span className="px-3 py-1 rounded bg-rose-950/80 border border-rose-800 text-rose-300 font-mono text-xs font-bold">
                    Score: 92% (High Confidence)
                  </span>
                </div>
                <p className="text-xs text-[#AEBBCD]">
                  Identical complainant or identical incident text submitted across two different channels (e.g. CPGRAMS central portal and direct PGRC citizen portal) for the same grievance within 48 hours.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded bg-[#142C46]/50 border border-slate-700 space-y-1">
                    <div className="text-[10px] font-mono text-slate-400">Matching Dimensions</div>
                    <div className="text-white font-medium">Same PID (100%) + Same Category + High Lexical Jaccard (88%)</div>
                  </div>
                  <div className="p-3 rounded bg-[#142C46]/50 border border-slate-700 space-y-1">
                    <div className="text-[10px] font-mono text-slate-400">Recommended Action</div>
                    <div className="text-amber-300 font-medium">Designate single Lead Case; cross-reference secondary reference.</div>
                  </div>
                </div>
              </div>
            )}

            {matchingTab === "related" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm font-bold text-white flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span>POTENTIALLY RELATED INQUIRY PATTERN</span>
                  </div>
                  <span className="px-3 py-1 rounded bg-amber-950/80 border border-amber-800 text-amber-300 font-mono text-xs font-bold">
                    Score: 78% (Correlation Flagged)
                  </span>
                </div>
                <p className="text-xs text-[#AEBBCD]">
                  Different complainants targeting the same technical college across different bureaus (e.g. Student grievance on fee retention in PGRC vs Parent Association complaint on capitation dues in Regulation Bureau).
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded bg-[#142C46]/50 border border-slate-700 space-y-1">
                    <div className="text-[10px] font-mono text-slate-400">Matching Dimensions</div>
                    <div className="text-white font-medium">Same PID (100%) + Inter-Bureau Overlap + Shared Regulatory Clause 7.1</div>
                  </div>
                  <div className="p-3 rounded bg-[#142C46]/50 border border-slate-700 space-y-1">
                    <div className="text-[10px] font-mono text-slate-400">Recommended Action</div>
                    <div className="text-blue-300 font-medium">Joint Committee Coordination. Keep both dockets active.</div>
                  </div>
                </div>
              </div>
            )}

            {matchingTab === "separate" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-sm font-bold text-white flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>SEPARATE & DISTINCT COMPLAINTS</span>
                  </div>
                  <span className="px-3 py-1 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-mono text-xs font-bold">
                    Score: 42% (Clear / No Overlap)
                  </span>
                </div>
                <p className="text-xs text-[#AEBBCD]">
                  Complaints involving similar wording (&ldquo;attendance issues&rdquo;) targeting completely different institutions in different states. Zero correlation is inferred.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded bg-[#142C46]/50 border border-slate-700 space-y-1">
                    <div className="text-[10px] font-mono text-slate-400">Matching Dimensions</div>
                    <div className="text-white font-medium">Distinct PIDs + Different Jurisdictions + No Institution Match</div>
                  </div>
                  <div className="p-3 rounded bg-[#142C46]/50 border border-slate-700 space-y-1">
                    <div className="text-[10px] font-mono text-slate-400">Recommended Action</div>
                    <div className="text-emerald-300 font-medium">Process routinely within respective regional bureau.</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 05 — HUMAN REVIEW: Candidate -> Evidence -> Decision -> Audit
         ========================================================================= */}
      <section className="py-24 bg-[#0B1C2D] border-b border-[#142C46]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8DBAFF] font-mono">
              SCENE 05 • HUMAN REVIEW WORKSPACE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Human reviewers retain absolute decision-making authority.
            </h2>
            <p className="text-sm sm:text-base text-[#AEBBCD] leading-relaxed">
              No machine learning score ever closes a case, dismisses an inquiry, or overrides bureau officers. CaseBridge AI provides structured evidence to accelerate review, not replace human judgment.
            </p>
          </div>

          {/* Interactive Human Decision Simulator */}
          <div className="bg-[#142C46]/70 border border-[#D9E0E7]/20 rounded-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#657386]/30 gap-3">
              <div>
                <span className="text-xs font-mono uppercase text-[#8DBAFF]">Candidate Review Pair</span>
                <h3 className="text-lg font-bold text-white">OVL-2026-001 • Apex Institute of Technology</h3>
              </div>
              <div className="text-xs font-mono text-slate-300">
                PGRC (Case 0892) &harr; Regulation Bureau (Case 0142)
              </div>
            </div>

            {/* Decision Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setReviewDecision("CONFIRMED")}
                className={`p-4 rounded-lg border text-left transition-all ${
                  reviewDecision === "CONFIRMED"
                    ? "bg-[#1769AA]/40 border-[#1769AA] text-white shadow-md"
                    : "bg-[#0B1C2D] border-[#657386]/40 text-[#AEBBCD] hover:border-slate-300"
                }`}
              >
                <div className="font-bold text-white text-sm mb-1 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Confirm Joint Link</span>
                </div>
                <div className="text-xs leading-relaxed">
                  Affirm inter-bureau relationship and designate Joint Coordination Desk.
                </div>
              </button>

              <button
                onClick={() => setReviewDecision("DISTINCT")}
                className={`p-4 rounded-lg border text-left transition-all ${
                  reviewDecision === "DISTINCT"
                    ? "bg-rose-950/40 border-rose-600 text-white shadow-md"
                    : "bg-[#0B1C2D] border-[#657386]/40 text-[#AEBBCD] hover:border-slate-300"
                }`}
              >
                <div className="font-bold text-white text-sm mb-1 flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Mark as Distinct</span>
                </div>
                <div className="text-xs leading-relaxed">
                  Reject candidate relationship. Separate investigations continue independently.
                </div>
              </button>

              <button
                onClick={() => setReviewDecision("DEFERRED")}
                className={`p-4 rounded-lg border text-left transition-all ${
                  reviewDecision === "DEFERRED"
                    ? "bg-amber-950/40 border-amber-500 text-white shadow-md"
                    : "bg-[#0B1C2D] border-[#657386]/40 text-[#AEBBCD] hover:border-slate-300"
                }`}
              >
                <div className="font-bold text-white text-sm mb-1 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Defer Decision</span>
                </div>
                <div className="text-xs leading-relaxed">
                  Await formal institutional response before determining case relationship.
                </div>
              </button>
            </div>

            {/* Audit Persistence Simulator Feedback */}
            {reviewDecision !== "NONE" && (
              <div className="p-4 rounded bg-[#0B1C2D] border border-emerald-500/40 text-xs text-emerald-300 font-mono space-y-1">
                <div className="font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>AUDIT TRANSACTION COMMITTED</span>
                </div>
                <div>Action: {reviewDecision} • Reviewer: Authorized Official (PGRC Review Desk)</div>
                <div className="text-slate-400 text-[10px]">
                  Logged to permanent immutable audit ledger. Status synced to relational database.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 06 — INSTITUTIONAL COORDINATION: Editorial Warm Ivory Transition
         ========================================================================= */}
      <section className="py-24 bg-[#F5F3ED] text-[#0B1C2D] border-b border-[#D9E0E7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-[#1769AA] font-mono">
              SCENE 06 • INSTITUTIONAL COORDINATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1C2D] tracking-tight">
              A single source of truth across all AICTE administrative desks.
            </h2>
            <p className="text-sm sm:text-base text-[#657386] leading-relaxed">
              When cases are coordinated through CaseBridge AI, each administrative organ gains structured oversight without infringing upon statutory roles.
            </p>
          </div>

          {/* Structured Editorial 4-Pillar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg bg-white border border-[#D9E0E7] space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded bg-[#EAF0F6] text-[#1769AA] flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-bold text-base text-[#0B1C2D]">Cross-Bureau Visibility</h3>
              <p className="text-xs text-[#657386] leading-relaxed">
                PGRC, Regulation, Approval, and Legal desks see active concurrent inquiries targeting the same technical college instantly.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white border border-[#D9E0E7] space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded bg-[#EAF0F6] text-[#1769AA] flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-bold text-base text-[#0B1C2D]">Designated Case Lead</h3>
              <p className="text-xs text-[#657386] leading-relaxed">
                When relationships are confirmed, one bureau is designated Lead Coordinator, preventing overlapping or conflicting notices.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white border border-[#D9E0E7] space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded bg-[#EAF0F6] text-[#1769AA] flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-bold text-base text-[#0B1C2D]">Dual-Factor Verification</h3>
              <p className="text-xs text-[#657386] leading-relaxed">
                Citizens track progress using non-guessable reference numbers paired with confidential verification codes, protecting privacy.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white border border-[#D9E0E7] space-y-3 shadow-sm">
              <div className="w-10 h-10 rounded bg-[#EAF0F6] text-[#1769AA] flex items-center justify-center font-bold">
                04
              </div>
              <h3 className="font-bold text-base text-[#0B1C2D]">Sovereign Audit Trail</h3>
              <p className="text-xs text-[#657386] leading-relaxed">
                Every login, candidate match, reviewer decision, and status transition is recorded in an immutable chronological audit trail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 07 — CLIMAX: Clarity in Every Connection
         ========================================================================= */}
      <section className="py-28 bg-[#0B1C2D] text-center border-b border-[#142C46] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#142C46] text-[#8DBAFF] text-xs font-mono tracking-widest uppercase">
            <span>Sovereign Administrative Standard</span>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-tight">
              CLARITY IN EVERY CONNECTION.<br />
              <span className="text-[#1769AA]">ACCOUNTABILITY IN EVERY ACTION.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#AEBBCD] max-w-2xl mx-auto leading-relaxed">
              Transforming fragmented institutional grievances into an accountable, transparent, and coordinated national framework.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-center">
            <div className="w-16 h-1 bg-[#1769AA] rounded-full" />
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 08 — FINAL CTA: Bring Complaint Intelligence into Focus
         ========================================================================= */}
      <section className="py-24 bg-[#142C46] text-[#F5F3ED]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Bring complaint intelligence into focus.
          </h2>

          <p className="text-sm sm:text-base text-[#AEBBCD] max-w-xl mx-auto leading-relaxed">
            Explore a more structured approach to institution-level complaint review, explainable matching, and accountable coordination.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded bg-[#1769AA] hover:bg-blue-600 text-white font-semibold text-sm shadow-xl shadow-blue-950/40 transition-all hover:scale-[1.01]"
            >
              <LayoutDashboardIcon className="w-4 h-4" />
              <span>Open CaseBridge AI</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center space-x-2 px-6 py-3.5 rounded bg-[#0B1C2D] hover:bg-black text-[#F5F3ED] font-semibold text-sm border border-[#657386]/40 hover:border-slate-300 transition-all"
            >
              <Lock className="w-4 h-4 text-[#8DBAFF]" />
              <span>Sign In</span>
            </Link>
          </div>

          <div className="pt-6 border-t border-[#657386]/30 text-xs text-[#AEBBCD] font-mono">
            Smart India Hackathon 2026 • Team Code Ninja&apos;s • Problem Statement: SIH26264
          </div>
        </div>
      </section>
    </div>
  );
}

function LayoutDashboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="9" x="3" y="3" rx="1" />
      <rect width="7" height="5" x="14" y="3" rx="1" />
      <rect width="7" height="9" x="14" y="12" rx="1" />
      <rect width="7" height="5" x="3" y="16" rx="1" />
    </svg>
  );
}
