"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CaseConnectionLab } from "@/components/landing/CaseConnectionLab";
import {
  ShieldCheck,
  FilePlus,
  Search,
  Building2,
  Users,
  GitCompare,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  Scale,
  FileText,
  AlertTriangle,
  HelpCircle,
  ExternalLink,
  Layers,
  Sparkles,
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
} from "lucide-react";

export default function CinematicLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#080E18] text-[#F4F6FA] selection:bg-[#3678D4] selection:text-white font-sans antialiased">
      {/* =========================================================================
          HERO SECTION: Asymmetric Editorial Composition & Live Correlation Flow
         ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 border-b border-slate-800/80 bg-[#080E18] bg-grid-pattern">
        {/* Subtle Atmospheric Lighting & Optical Lenses */}
        <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[700px] h-[550px] bg-radial-lens pointer-events-none" />
        <div className="absolute top-1/3 right-0 w-[600px] h-[550px] bg-radial-lens-teal pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Typographic Editorial Statement */}
            <div className="lg:col-span-5 space-y-6 text-left">
              {/* Eyebrow Label */}
              <div className="inline-flex items-center space-x-2.5 px-3 py-1 rounded-full bg-[#10233D]/90 border border-slate-700/80 text-[11px] text-[#AEBBCD] tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[#3E9E96] animate-pulse"></span>
                <span className="font-mono uppercase font-bold text-slate-200">
                  CASEBRIDGE AI &bull; INSTITUTIONAL CASE COORDINATION
                </span>
              </div>

              {/* Confident Large Headline with Deliberate Breaks */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-white leading-[1.1] text-balance">
                Every Case Connected.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8DBAFF] via-[#3678D4] to-[#3E9E96]">
                  Every Decision Accountable.
                </span>
              </h1>

              {/* Supporting Copy */}
              <p className="text-sm sm:text-base text-[#AEBBCD] leading-relaxed max-w-xl font-normal">
                Bring fragmented institutional complaints into one coordinated workspace. Identify potential overlaps, examine the evidence and record accountable review decisions across administrative bureaus.
              </p>

              {/* Primary & Secondary Action Group */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/complaints/register"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-md bg-[#3678D4] hover:bg-[#2c65b5] text-white font-semibold text-sm shadow-xl shadow-blue-950/50 transition-all hover:scale-[1.02] active:scale-[0.99]"
                >
                  <FilePlus className="w-4 h-4" />
                  <span>Register a Complaint</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </Link>

                <a
                  href="#scenes"
                  className="inline-flex items-center space-x-2 px-5 py-3.5 rounded-md bg-[#10233D] hover:bg-[#152236] text-slate-200 font-semibold text-sm border border-slate-700 hover:border-slate-500 transition-all"
                >
                  <Compass className="w-4 h-4 text-[#8DBAFF]" />
                  <span>Explore the Platform</span>
                </a>
              </div>

              {/* Trust Designation Notice */}
              <div className="pt-2 flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span>Proposed institutional platform for Smart India Hackathon 2026 (SIH26264)</span>
              </div>
            </div>

            {/* Right Column: Bespoke Animated Signature Visualization */}
            <div className="lg:col-span-7 relative">
              <div className="p-0.5 rounded-xl bg-gradient-to-b from-slate-700/60 via-slate-800/40 to-slate-900/90 shadow-2xl backdrop-blur-md">
                <div className="bg-[#10233D]/95 rounded-lg border border-slate-800 p-5 sm:p-6 space-y-5">
                  
                  {/* Top Bar of Visualization */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                    <div className="flex items-center space-x-2.5">
                      <Network className="w-4 h-4 text-[#8DBAFF]" />
                      <span className="font-mono font-bold text-slate-200 text-[11px] tracking-wider uppercase">
                        Active Correlation Engine &bull; Stream Synthesis
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#3E9E96] bg-teal-950/80 border border-teal-800 px-2 py-0.5 rounded">
                      ● Live Multi-Bureau Ingestion
                    </span>
                  </div>

                  {/* Convergence Diagram */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Left 3 Records */}
                    <div className="md:col-span-5 space-y-2.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Disparate Inflow Feeds
                      </div>

                      {/* Record 1: PGRC */}
                      <div className="p-2.5 rounded bg-[#080E18] border border-blue-900/60 hover:border-blue-700 transition-colors text-xs space-y-1">
                        <div className="flex items-center justify-between font-mono text-[10px]">
                          <span className="font-bold text-[#8DBAFF]">AICTE/PGRC/2026/0892</span>
                          <span className="text-blue-400 font-semibold">PGRC Desk</span>
                        </div>
                        <div className="text-white font-medium text-[11px] truncate">
                          Apex Inst of Tech &bull; Original Degree Withheld
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          PID: 1-10492811 &bull; Pune Campus
                        </div>
                      </div>

                      {/* Record 2: Regulation */}
                      <div className="p-2.5 rounded bg-[#080E18] border border-purple-900/60 hover:border-purple-700 transition-colors text-xs space-y-1">
                        <div className="flex items-center justify-between font-mono text-[10px]">
                          <span className="font-bold text-purple-300">AICTE/REG/2026/0142</span>
                          <span className="text-purple-400 font-semibold">Regulation</span>
                        </div>
                        <div className="text-white font-medium text-[11px] truncate">
                          Apex Inst of Tech &bull; Ancillary Capitation Fee
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          PID: 1-10492811 &bull; Pune Campus
                        </div>
                      </div>

                      {/* Record 3: Approval */}
                      <div className="p-2.5 rounded bg-[#080E18] border border-slate-800 hover:border-slate-700 transition-colors text-xs space-y-1">
                        <div className="flex items-center justify-between font-mono text-[10px]">
                          <span className="font-bold text-slate-300">AICTE/APP/2026/0078</span>
                          <span className="text-slate-400 font-semibold">Approval</span>
                        </div>
                        <div className="text-slate-300 font-medium text-[11px] truncate">
                          Apex Inst of Tech &bull; EOA Faculty Cadre Audit
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          PID: 1-10492811 &bull; Pune Campus
                        </div>
                      </div>
                    </div>

                    {/* Connecting SVG Path Tracing */}
                    <div className="md:col-span-2 hidden md:flex flex-col items-center justify-center space-y-2">
                      <div className="w-full relative flex items-center justify-center py-6">
                        <svg className="w-full h-24 overflow-visible" viewBox="0 0 100 80" fill="none">
                          <path
                            d="M 0 15 C 50 15, 50 40, 100 40"
                            stroke="#3678D4"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            className="animate-flow-line"
                          />
                          <path
                            d="M 0 40 C 40 40, 60 40, 100 40"
                            stroke="#8DBAFF"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            className="animate-flow-line"
                          />
                          <path
                            d="M 0 65 C 50 65, 50 40, 100 40"
                            stroke="#3E9E96"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            className="animate-flow-line"
                          />
                          <circle cx="100" cy="40" r="4" fill="#8DBAFF" className="animate-pulse" />
                        </svg>
                      </div>
                    </div>

                    {/* Central Overlap Comparison Workspace */}
                    <div className="md:col-span-5 p-3.5 rounded-lg bg-[#152236] border border-blue-700/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5 font-mono text-[11px] font-bold text-white">
                          <GitCompare className="w-3.5 h-3.5 text-[#8DBAFF]" />
                          <span>OVL-2026-001</span>
                        </div>
                        <span className="font-mono text-[10px] font-bold text-[#3E9E96] bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
                          88% Match
                        </span>
                      </div>

                      {/* Matching attributes highlight */}
                      <div className="space-y-1 text-[11px] bg-[#080E18] p-2.5 rounded border border-slate-800">
                        <span className="text-[9px] uppercase font-bold text-[#8DBAFF] tracking-wider block">
                          Correlated Entity & Regulatory Norms:
                        </span>
                        <div className="text-white font-semibold">
                          Apex Institute of Technology (PID: 1-10492811)
                        </div>
                        <div className="text-emerald-400 font-mono text-[10px]">
                          APH 2025-26 Clause 7.1 (Fee & Certificate Retention)
                        </div>
                      </div>

                      {/* Contrasting details */}
                      <div className="text-[10px] text-[#AEBBCD] flex items-center justify-between pt-1 border-t border-slate-800">
                        <span>Human Review:</span>
                        <span className="font-bold text-amber-300">Authorized Official Mandated</span>
                      </div>

                      <div className="p-1.5 rounded bg-blue-950/50 border border-blue-900 text-[10px] text-[#8DBAFF] text-center font-medium">
                        Zero Automatic Merges &bull; Sovereign Review Required
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 01 — THE FRAGMENTATION PROBLEM
         ========================================================================= */}
      <section id="scenes" className="py-24 bg-[#0D1420] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8DBAFF] font-mono">
              SCENE 01 &bull; THE ADMINISTRATIVE FRAGMENTATION PROBLEM
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight text-balance">
              The same institution. Different bureaus. Fragmented visibility.
            </h2>
            <p className="text-sm sm:text-base text-[#AEBBCD] mt-3 leading-relaxed">
              When grievances arrive through disconnected administrative doors, individual desk officers have no systematic visibility into concurrent inquiries targeting the same technical college.
            </p>
          </div>

          {/* Three Disconnected Record Panels with Fine Lines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Panel 1 */}
            <div className="p-6 rounded-lg bg-[#152236] border border-slate-800 space-y-3 relative hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                <span className="text-[#8DBAFF] font-bold">AICTE/PGRC/2026/0892</span>
                <span>PGRC Bureau</span>
              </div>
              <h3 className="font-bold text-white text-sm">
                Student Grievance on Withheld Certificates
              </h3>
              <p className="text-xs text-[#AEBBCD] leading-relaxed">
                Filing by individual candidate alleging college refused return of original 10th/12th mark sheets until placement fees were paid.
              </p>
              <div className="pt-2 text-[10px] text-slate-500 font-mono">
                Assigned: Sh. Rajesh Sharma (PGRC Desk)
              </div>
            </div>

            {/* Panel 2 */}
            <div className="p-6 rounded-lg bg-[#152236] border border-slate-800 space-y-3 relative hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                <span className="text-purple-300 font-bold">AICTE/REG/2026/0142</span>
                <span>Regulation Bureau</span>
              </div>
              <h3 className="font-bold text-white text-sm">
                Inquiry into Unauthorized Capitation Fees
              </h3>
              <p className="text-xs text-[#AEBBCD] leading-relaxed">
                Formal complaint by parent association alleging mandatory development levies charged outside the approved fee structure.
              </p>
              <div className="pt-2 text-[10px] text-slate-500 font-mono">
                Assigned: Dr. Meenakshi Sundaram (Regulation)
              </div>
            </div>

            {/* Panel 3 */}
            <div className="p-6 rounded-lg bg-[#152236] border border-slate-800 space-y-3 relative hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800 pb-2">
                <span className="text-emerald-300 font-bold">AICTE/APP/2026/0078</span>
                <span>Approval Bureau</span>
              </div>
              <h3 className="font-bold text-white text-sm">
                Extension of Approval (EOA) Deficit Audit
              </h3>
              <p className="text-xs text-[#AEBBCD] leading-relaxed">
                Routine annual inspection noting student-faculty ratio irregularities and missing laboratory equipment certificates.
              </p>
              <div className="pt-2 text-[10px] text-slate-500 font-mono">
                Assigned: Prof. K. Chandrasekhar (Approval)
              </div>
            </div>
          </div>

          {/* Editorial Callout */}
          <div className="mt-8 p-4 rounded-md bg-[#080E18] border border-slate-800 text-xs text-[#AEBBCD] flex items-center justify-between gap-4">
            <div className="flex items-center space-x-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>The Resulting Operational Blindspot:</strong> Three parallel notices, separate legal costs for the college, and no consolidated grievance ledger for AICTE leadership.
              </span>
            </div>
            <span className="font-mono text-[11px] text-[#8DBAFF] shrink-0 hidden sm:inline">
              Resolved by CaseBridge AI
            </span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 02 — THE TRANSFORMATION
         ========================================================================= */}
      <section className="py-24 bg-[#080E18] border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="text-xs uppercase font-bold tracking-wider text-[#3E9E96] font-mono">
              SCENE 02 &bull; THE DATA TRANSFORMATION
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight text-balance">
              From isolated records to explainable relationships.
            </h2>
            <p className="text-sm sm:text-base text-[#AEBBCD] mt-3 leading-relaxed">
              CaseBridge AI synthesizes fragmented records using three deterministic anchors: Permanent Institute IDs (PID), Approval Process Handbook clauses, and semantic key phrase correlation.
            </p>
          </div>

          {/* Transformation Anchor Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-[#10233D] border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-[#8DBAFF] block">
                ANCHOR 01 &bull; ENTITY IDENTIFIER
              </span>
              <h3 className="font-bold text-white text-base">Permanent Institute ID (PID)</h3>
              <p className="text-xs text-[#AEBBCD] leading-relaxed">
                Deterministic lookup against AICTE&apos;s National Technical Registry maps every case directly to the verified campus, eliminating confusion between colleges in the same educational trust.
              </p>
              <div className="pt-2 font-mono text-[11px] text-slate-400">
                Match Confidence: <span className="text-emerald-400 font-bold">100% Deterministic</span>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-[#10233D] border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-[#8DBAFF] block">
                ANCHOR 02 &bull; STATUTORY FRAMEWORK
              </span>
              <h3 className="font-bold text-white text-base">Regulatory Clause Mapping</h3>
              <p className="text-xs text-[#AEBBCD] leading-relaxed">
                Directly aligns cited violations against the AICTE Approval Process Handbook (APH 2025-26), identifying when separate complaints challenge the same statutory provision.
              </p>
              <div className="pt-2 font-mono text-[11px] text-slate-400">
                Clause Alignment: <span className="text-emerald-400 font-bold">APH Ch. VII Cl. 7.1</span>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-[#10233D] border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-bold text-[#3E9E96] block">
                ANCHOR 03 &bull; HUMAN ADJUDICATION
              </span>
              <h3 className="font-bold text-white text-base">Leads for Human Review</h3>
              <p className="text-xs text-[#AEBBCD] leading-relaxed">
                A flagged relationship is treated strictly as an investigation lead. Authorized bureau officers inspect the side-by-side evidence before signing off on any joint coordination.
              </p>
              <div className="pt-2 font-mono text-[11px] text-amber-300">
                Rule: <span className="font-bold">Zero Automatic Merges</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 03 — THE CASE CONNECTION LAB (SIGNATURE DEMONSTRATION)
         ========================================================================= */}
      <section id="connection-lab" className="py-24 bg-[#0D1420] border-b border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8DBAFF] font-mono">
              SCENE 03 &bull; SIGNATURE INNOVATION &bull; CASE CONNECTION LAB
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight text-balance">
              Evidence first. Decisions by authorized reviewers.
            </h2>
            <p className="text-sm sm:text-base text-[#AEBBCD] mt-2 leading-relaxed">
              Explore three synthetic complaint records from separate bureaus, witness candidate overlap screening, and execute working reviewer actions in an interactive demonstration environment.
            </p>
          </div>

          {/* Interactive Case Connection Lab Component */}
          <CaseConnectionLab />
        </div>
      </section>

      {/* =========================================================================
          SCENE 04 — THE COORDINATED WORKFLOW
         ========================================================================= */}
      <section className="py-24 bg-[#080E18] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="text-xs uppercase font-bold tracking-wider text-[#6AA7FF] font-mono">
              SCENE 04 &bull; END-TO-END LIFECYCLE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight text-balance">
              One process. Clear responsibility at every step.
            </h2>
            <p className="text-sm sm:text-base text-[#AEBBCD] mt-3 leading-relaxed">
              From the moment a student lodges a grievance to the final standing committee directive, every stage has defined timelines and verified ownership.
            </p>
          </div>

          {/* Horizontally Connected Process Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Step 1 */}
            <div className="p-5 rounded-lg bg-[#10233D] border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#8DBAFF] bg-blue-950 px-2 py-0.5 rounded border border-blue-900 inline-block mb-2">
                  01
                </span>
                <h3 className="font-bold text-white text-sm">Submission</h3>
                <p className="text-xs text-[#AEBBCD] mt-1 leading-relaxed">
                  Complainant selects verified AICTE institution, categorizes violation, and attaches documentary evidence.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                Unique Reference Issued
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-lg bg-[#10233D] border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#8DBAFF] bg-blue-950 px-2 py-0.5 rounded border border-blue-900 inline-block mb-2">
                  02
                </span>
                <h3 className="font-bold text-white text-sm">Validation</h3>
                <p className="text-xs text-[#AEBBCD] mt-1 leading-relaxed">
                  Desk officer examines prima-facie jurisdictional competence under APH 2025-26 within 7 working days.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                7-Day Scrutiny SLA
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-lg bg-[#10233D] border border-blue-900/60 bg-blue-950/20 space-y-3 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#8DBAFF] bg-blue-900 px-2 py-0.5 rounded border border-blue-700 inline-block mb-2">
                  03
                </span>
                <h3 className="font-bold text-white text-sm">Overlap Review</h3>
                <p className="text-xs text-[#AEBBCD] mt-1 leading-relaxed">
                  Correlation engine scans open dockets across PGRC, Regulation, and Approval for entity and norm overlaps.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-[#8DBAFF] font-mono">
                Candidate Flag Generated
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-lg bg-[#10233D] border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#8DBAFF] bg-blue-950 px-2 py-0.5 rounded border border-blue-900 inline-block mb-2">
                  04
                </span>
                <h3 className="font-bold text-white text-sm">Authorized Decision</h3>
                <p className="text-xs text-[#AEBBCD] mt-1 leading-relaxed">
                  Senior reviewer adjudicates linkage or designates lead bureau. College receives formal notice with 14-day reply window.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono">
                Institutional Natural Justice
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-5 rounded-lg bg-[#10233D] border border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#3E9E96] bg-teal-950 px-2 py-0.5 rounded border border-teal-800 inline-block mb-2">
                  05
                </span>
                <h3 className="font-bold text-white text-sm">Auditable Record</h3>
                <p className="text-xs text-[#AEBBCD] mt-1 leading-relaxed">
                  Final standing committee directive and compliance certificates are permanently archived in the governance ledger.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-mono">
                30-Day Closure Target
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 05 — DESIGNED FOR INSTITUTIONAL ACCOUNTABILITY
         ========================================================================= */}
      <section className="py-24 bg-[#0D1420] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="text-xs uppercase font-bold tracking-wider text-[#3E9E96] font-mono">
              SCENE 05 &bull; MULTI-STAKEHOLDER ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight text-balance">
              A clearer view for every authorized stakeholder.
            </h2>
            <p className="text-sm sm:text-base text-[#AEBBCD] mt-3 leading-relaxed">
              Three segregated workspaces deliver high operational density for officials, compliance clarity for colleges, and tamper-resistant tracking for citizens.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Complainant Card */}
            <div className="p-6 rounded-lg bg-[#152236] border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-md bg-blue-950 text-[#8DBAFF] flex items-center justify-center border border-blue-900">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Public Complainants</h3>
                <p className="text-xs text-[#AEBBCD] leading-relaxed">
                  Submit grievances against verified institutions, receive non-guessable reference codes, and track safe milestone events.
                </p>
                <div className="space-y-1.5 text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dual-factor authentication prevents tracking enumeration</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Whistleblower confidentiality protection</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Internal officer notes strictly withheld from public view</span>
                  </div>
                </div>
              </div>

              <Link
                href="/complaints/register"
                className="text-xs font-semibold text-[#8DBAFF] hover:underline inline-flex items-center space-x-1"
              >
                <span>File a Grievance</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Institution Card */}
            <div className="p-6 rounded-lg bg-[#152236] border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-md bg-amber-950 text-amber-400 flex items-center justify-center border border-amber-900">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Approved Institutions</h3>
                <p className="text-xs text-[#AEBBCD] leading-relaxed">
                  Authorized technical colleges inspect show-cause notices scoped strictly to their PID and submit formal counter-affidavits.
                </p>
                <div className="space-y-1.5 text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>14-day statutory reply SLA tracking</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Complainant personal contact details redacted</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Direct upload of BOG resolutions and refund ledgers</span>
                  </div>
                </div>
              </div>

              <Link
                href="/institution/login"
                className="text-xs font-semibold text-amber-400 hover:underline inline-flex items-center space-x-1"
              >
                <span>Institution Compliance Desk</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {/* Bureau Officer Card */}
            <div className="p-6 rounded-lg bg-[#152236] border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-md bg-teal-950 text-[#3E9E96] flex items-center justify-center border border-teal-900">
                  <Scale className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-base">Bureau Officials & Reviewers</h3>
                <p className="text-xs text-[#AEBBCD] leading-relaxed">
                  Executive overview across PGRC, Regulation, Approval, Legal, and CPGRAMS with side-by-side evidence triage tools.
                </p>
                <div className="space-y-1.5 text-[11px] text-slate-400 pt-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Cross-bureau overlap candidate queue</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Sovereign review with mandatory rationale logging</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Real-time workload distribution Recharts analytics</span>
                  </div>
                </div>
              </div>

              <Link
                href="/dashboard"
                className="text-xs font-semibold text-[#3E9E96] hover:underline inline-flex items-center space-x-1"
              >
                <span>Enter Bureau Console</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SCENE 06 — TRUST AND GOVERNANCE
         ========================================================================= */}
      <section className="py-24 bg-[#080E18] border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8DBAFF] font-mono">
              SCENE 06 &bull; GOVERNANCE & INTEGRITY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight text-balance">
              Connected information. Controlled access. Traceable decisions.
            </h2>
            <p className="text-sm sm:text-base text-[#AEBBCD] mt-3 leading-relaxed">
              CaseBridge AI guarantees institutional credibility through strict server-side scoping, zero automated merges, and immutable audit logs.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="p-5 rounded-lg bg-[#10233D] border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm">Role-Based Access Control</div>
              <p className="text-[#AEBBCD] leading-relaxed">
                Role tokens verify authorization before rendering case files or permitting procedural state updates.
              </p>
              <div className="text-[10px] text-emerald-400 font-mono font-semibold">Status: Implemented</div>
            </div>

            <div className="p-5 rounded-lg bg-[#10233D] border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm">PID-Scoped Isolation</div>
              <p className="text-[#AEBBCD] leading-relaxed">
                Institutions are restricted to dockets filed against their registered AICTE Permanent ID. Cross-institution access triggers 403 denial.
              </p>
              <div className="text-[10px] text-emerald-400 font-mono font-semibold">Status: Implemented</div>
            </div>

            <div className="p-5 rounded-lg bg-[#10233D] border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm">Human Adjudication Guarantee</div>
              <p className="text-[#AEBBCD] leading-relaxed">
                Overlap flags serve as advisories. No complaints are merged or linked without explicit confirmation by an authorized reviewer.
              </p>
              <div className="text-[10px] text-emerald-400 font-mono font-semibold">Status: Implemented</div>
            </div>

            <div className="p-5 rounded-lg bg-[#10233D] border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm">Immutable Audit Trail</div>
              <p className="text-[#AEBBCD] leading-relaxed">
                Status transitions, notes, and reviewer rationales are written with ISO timestamps and officer credentials to an immutable audit ledger.
              </p>
              <div className="text-[10px] text-emerald-400 font-mono font-semibold">Status: Implemented</div>
            </div>

            <div className="p-5 rounded-lg bg-[#10233D] border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm">Anti-Enumeration Tracking</div>
              <p className="text-[#AEBBCD] leading-relaxed">
                Public complaint tracking enforces dual-factor verification (Reference Number + registered contact token) to block sequential case harvesting.
              </p>
              <div className="text-[10px] text-emerald-400 font-mono font-semibold">Status: Implemented</div>
            </div>

            <div className="p-5 rounded-lg bg-[#10233D] border border-slate-800 space-y-2">
              <div className="font-bold text-white text-sm">Institutional Natural Justice</div>
              <p className="text-[#AEBBCD] leading-relaxed">
                Respondent technical institutions receive electronic notification with an enforceable 14-day window to file counter-affidavits before committee hearings.
              </p>
              <div className="text-[10px] text-emerald-400 font-mono font-semibold">Status: Implemented</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL SCENE — CLOSING STATEMENT & GATEWAYS
         ========================================================================= */}
      <section className="py-28 bg-[#080E18] relative overflow-hidden">
        <div className="absolute inset-0 bg-radial-lens pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10 relative z-10">
          <div className="space-y-3">
            <span className="text-xs uppercase font-bold tracking-wider text-[#8DBAFF] font-mono">
              CASEBRIDGE AI &bull; SMART INDIA HACKATHON 2026
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight text-balance">
              Better visibility begins with better coordination.
            </h2>
            <p className="text-sm sm:text-base text-[#AEBBCD] max-w-2xl mx-auto leading-relaxed">
              Experience the unified multi-bureau grievance coordination prototype engineered for Problem Statement SIH26264.
            </p>
          </div>

          {/* 4 Gateway Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left text-xs max-w-4xl mx-auto">
            <Link
              href="/complaints/register"
              className="p-5 rounded-lg bg-[#10233D] border border-slate-800 hover:border-[#3678D4] transition-all hover:scale-[1.02] flex flex-col justify-between space-y-4 group"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-[#8DBAFF] tracking-wider block">
                  Public Citizen
                </span>
                <span className="font-bold text-white text-sm group-hover:text-[#8DBAFF] transition-colors mt-0.5 block">
                  Register Complaint
                </span>
                <p className="text-[11px] text-[#AEBBCD] mt-1">
                  5-step guided intake with live AICTE institution lookup.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#8DBAFF] flex items-center space-x-1">
                <span>Start Filing</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/track-complaint"
              className="p-5 rounded-lg bg-[#10233D] border border-slate-800 hover:border-slate-600 transition-all hover:scale-[1.02] flex flex-col justify-between space-y-4 group"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Citizen Tracking
                </span>
                <span className="font-bold text-white text-sm group-hover:text-slate-200 transition-colors mt-0.5 block">
                  Track Complaint
                </span>
                <p className="text-[11px] text-[#AEBBCD] mt-1">
                  Dual-factor verified safe milestone timeline.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-slate-300 flex items-center space-x-1">
                <span>Check Status</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/institution/login"
              className="p-5 rounded-lg bg-[#10233D] border border-slate-800 hover:border-amber-500 transition-all hover:scale-[1.02] flex flex-col justify-between space-y-4 group"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                  Approved College
                </span>
                <span className="font-bold text-white text-sm group-hover:text-amber-300 transition-colors mt-0.5 block">
                  Institution Portal
                </span>
                <p className="text-[11px] text-[#AEBBCD] mt-1">
                  Review show-cause inquiries and file counter-affidavits.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-amber-400 flex items-center space-x-1">
                <span>Institution Login</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </Link>

            <Link
              href="/dashboard"
              className="p-5 rounded-lg bg-[#10233D] border border-slate-800 hover:border-[#3E9E96] transition-all hover:scale-[1.02] flex flex-col justify-between space-y-4 group"
            >
              <div>
                <span className="text-[10px] uppercase font-bold text-[#3E9E96] tracking-wider block">
                  Bureau Leadership
                </span>
                <span className="font-bold text-white text-sm group-hover:text-teal-300 transition-colors mt-0.5 block">
                  Bureau Console
                </span>
                <p className="text-[11px] text-[#AEBBCD] mt-1">
                  Multi-bureau triage, overlap queue, and SLA charts.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#3E9E96] flex items-center space-x-1">
                <span>Official Console</span>
                <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </div>

          {/* Transparent Simulation Notice */}
          <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 max-w-xl mx-auto leading-relaxed">
            CaseBridge AI is a demonstration prototype developed for Smart India Hackathon 2026 (SIH26264). Submitting complaints or responses stores simulated test records in your browser environment and does not transmit data to AICTE or any government ministry.
          </div>
        </div>
      </section>
    </div>
  );
}
