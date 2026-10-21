"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GitCompare,
  Building2,
  FileText,
  Scale,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
  RefreshCw,
  HelpCircle,
  Sliders,
} from "lucide-react";

type ScenarioType = "correlated" | "distinct_same_inst" | "cross_campus";
type StepType = "stepA" | "stepB" | "stepC" | "stepD";
type DecisionType = "NONE" | "LINK" | "SEPARATE" | "DEFER";

interface SyntheticRecord {
  id: string;
  bureau: string;
  bureauColor: string;
  institution: string;
  pid: string;
  region: string;
  category: string;
  complainant: string;
  date: string;
  subject: string;
  statement: string;
  clause: string;
  evidence: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  reviewer: string;
  rationale: string;
}

export function CaseConnectionLab() {
  const [activeScenario, setActiveScenario] = useState<ScenarioType>("correlated");
  const [activeStep, setActiveStep] = useState<StepType>("stepA");
  const [selectedRecordIndex, setSelectedRecordIndex] = useState<number>(0);
  const [decision, setDecision] = useState<DecisionType>("NONE");
  const [reviewerNote, setReviewerNote] = useState<string>("");
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: "AUD-INIT-901",
      timestamp: "2026-03-12 10:14:02 IST",
      action: "RECORDS_INGESTED",
      reviewer: "Automated Desk Dispatcher",
      rationale: "Three synthetic dockets ingested across PGRC, Regulation Bureau, and Approval Cell.",
    },
  ]);

  // Synthetic complaint records for the scenarios
  const records: Record<ScenarioType, SyntheticRecord[]> = {
    correlated: [
      {
        id: "AICTE/PGRC/2026/0892",
        bureau: "PGRC Desk",
        bureauColor: "text-blue-400 bg-blue-950/80 border-blue-800",
        institution: "Apex Institute of Technology, Pune",
        pid: "1-10492811",
        region: "Western Region",
        category: "Certificate Retention & Exit Dues",
        complainant: "Rohit S. Verma (Final Year B.Tech Student)",
        date: "2026-03-12",
        subject: "Retention of Original Degree Certificates Pending Campus Placement Dues",
        statement:
          "The college administration is withholding my original 10th/12th mark sheets and B.Tech degree completion certificate, demanding an unapproved 'campus placement service levy' of ₹25,000 before issuing clearance.",
        clause: "APH 2025-26 Chapter VII Clause 7.1",
        evidence: "Student_Challan_Demand.pdf (1.2 MB)",
      },
      {
        id: "AICTE/REG/2026/0142",
        bureau: "Regulation Bureau",
        bureauColor: "text-purple-400 bg-purple-950/80 border-purple-800",
        institution: "Apex Institute of Technology, Pune",
        pid: "1-10492811",
        region: "Western Region",
        category: "Capitation & Excess Ancillary Fees",
        complainant: "Pune Engineering Parents Association",
        date: "2026-03-04",
        subject: "Inquiry into Systematic Unapproved Ancillary Levies & Capitation Demands",
        statement:
          "College trustees are levying arbitrary development donations and placement clearance charges outside the state-notified fee framework, conditioning certificate release upon settlement.",
        clause: "APH 2025-26 Chapter VII Clause 7.1 & 7.4",
        evidence: "Association_Fee_Bank_Passbook.pdf (3.4 MB)",
      },
      {
        id: "AICTE/APP/2026/0078",
        bureau: "Approval Bureau",
        bureauColor: "text-emerald-400 bg-emerald-950/80 border-emerald-800",
        institution: "Apex Institute of Technology, Pune",
        pid: "1-10492811",
        region: "Western Region",
        category: "Extension of Approval (EOA) Cadre Deficit",
        complainant: "Regional Office Standing Scrutiny",
        date: "2026-02-18",
        subject: "Routine EOA Scrutiny: Faculty Cadre Ratio & Cadre Deficiencies",
        statement:
          "Annual scrutiny noted student-faculty cadre ratio shortfalls in Computer Science Department (1:24 vs mandatory 1:15) and delayed biometric attendance integration.",
        clause: "APH 2025-26 Chapter II Clause 2.8",
        evidence: "EOA_Deficiency_Report_2026.pdf (4.8 MB)",
      },
    ],
    distinct_same_inst: [
      {
        id: "AICTE/REG/2026/0142",
        bureau: "Regulation Bureau",
        bureauColor: "text-purple-400 bg-purple-950/80 border-purple-800",
        institution: "Apex Institute of Technology, Pune",
        pid: "1-10492811",
        region: "Western Region",
        category: "Capitation & Excess Ancillary Fees",
        complainant: "Pune Engineering Parents Association",
        date: "2026-03-04",
        subject: "Inquiry into Systematic Unapproved Ancillary Levies & Capitation Demands",
        statement:
          "College trustees are levying arbitrary development donations and placement clearance charges outside the state-notified fee framework.",
        clause: "APH 2025-26 Chapter VII Clause 7.1",
        evidence: "Bank_Passbook_Extract.pdf (2.4 MB)",
      },
      {
        id: "AICTE/APP/2026/0078",
        bureau: "Approval Bureau",
        bureauColor: "text-emerald-400 bg-emerald-950/80 border-emerald-800",
        institution: "Apex Institute of Technology, Pune",
        pid: "1-10492811",
        region: "Western Region",
        category: "Infrastructure & Lab Deficit",
        complainant: "Regional Inspection Committee (Expert Visit)",
        date: "2026-02-18",
        subject: "Routine EOA Scrutiny: Advanced Heat Transfer Laboratory Deficit",
        statement:
          "Inspection team noted mechanical engineering laboratory apparatus uncalibrated, missing safety vent hoods, and delayed procurement of wind tunnel apparatus.",
        clause: "APH 2025-26 Chapter II Clause 2.14",
        evidence: "Lab_Deficiency_Report_2026.pdf (4.8 MB)",
      },
      {
        id: "AICTE/PGRC/2026/0914",
        bureau: "PGRC Desk",
        bureauColor: "text-blue-400 bg-blue-950/80 border-blue-800",
        institution: "Apex Institute of Technology, Pune",
        pid: "1-10492811",
        region: "Western Region",
        category: "Hostel Facilities & Hygiene",
        complainant: "Hostel Committee Representative",
        date: "2026-03-01",
        subject: "Water Filter Breakdown & Campus Cafeteria Cleanliness",
        statement:
          "Students reported RO water filtration plant in Boys Hostel Block B malfunctioning for two weeks, prompting maintenance delay petition.",
        clause: "APH 2025-26 Chapter VI Amenities",
        evidence: "Warden_Notice_Photo.pdf (0.8 MB)",
      },
    ],
    cross_campus: [
      {
        id: "AICTE/PGRC/2026/0892",
        bureau: "PGRC Desk",
        bureauColor: "text-blue-400 bg-blue-950/80 border-blue-800",
        institution: "Apex Institute of Technology, Pune",
        pid: "1-10492811",
        region: "Western Region",
        category: "Certificate Retention",
        complainant: "Rohit S. Verma",
        date: "2026-03-12",
        subject: "Retention of Original Mark Sheets",
        statement: "Withholding of original mark sheets by Pune campus registrar.",
        clause: "APH Clause 7.1",
        evidence: "Pune_Receipt.pdf",
      },
      {
        id: "AICTE/PGRC/2026/0995",
        bureau: "PGRC Desk",
        bureauColor: "text-blue-400 bg-blue-950/80 border-blue-800",
        institution: "Apex Institute of Management Studies, Mumbai",
        pid: "1-10928419",
        region: "Western Region",
        category: "Certificate Retention",
        complainant: "Pooja V. Kulkarni",
        date: "2026-03-15",
        subject: "MBA Original Migration Certificate Withheld",
        statement:
          "Mumbai MBA campus of Apex Trust withholding migration certificate. Distinct PID (1-10928419) and independent governance.",
        clause: "APH Clause 7.1",
        evidence: "Mumbai_Challan.pdf",
      },
      {
        id: "AICTE/REG/2026/0202",
        bureau: "Regulation Bureau",
        bureauColor: "text-purple-400 bg-purple-950/80 border-purple-800",
        institution: "Apex Polytechnic Institute, Nagpur",
        pid: "1-10887201",
        region: "Western Region",
        category: "Diploma Capitation",
        complainant: "Nagpur Student Union",
        date: "2026-03-10",
        subject: "Diploma Exam Hall Ticket Clearance Fee",
        statement: "Nagpur Polytechnic campus charging illegal exam clearance fees.",
        clause: "APH Clause 7.1",
        evidence: "Nagpur_Notice.pdf",
      },
    ],
  };

  const currentRecords = records[activeScenario];
  const recA = currentRecords[0];
  const recB = currentRecords[1];

  const handleDecision = (newDecision: DecisionType) => {
    setDecision(newDecision);
    const newLogId = `AUD-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 19) + " IST";

    let actionLabel = "";
    let rationale = "";

    if (newDecision === "LINK") {
      actionLabel = "OVERLAP_CONFIRMED_LINKED";
      rationale =
        reviewerNote.trim() ||
        (activeScenario === "correlated"
          ? "Confirmed cross-bureau correlation between PGRC and Regulation dockets on PID 1-10492811 under APH Clause 7.1. Cases linked to convene joint standing committee."
          : "Reviewer manually requested joinder of proceedings.");
    } else if (newDecision === "SEPARATE") {
      actionLabel = "OVERLAP_REJECTED_DISTINCT";
      rationale =
        reviewerNote.trim() ||
        (activeScenario === "distinct_same_inst"
          ? "Confirmed as FALSE POSITIVE candidate. Although filed against same PID 1-10492811, matters involve distinct scopes (Regulation Fee Norms vs Approval EOA Lab Apparatus). Kept on independent bureau tracks."
          : "Matters identified as structurally independent.");
    } else if (newDecision === "DEFER") {
      actionLabel = "DECISION_DEFERRED_PENDING_CLARIFICATION";
      rationale =
        reviewerNote.trim() ||
        "Review deferred. Formal notice dispatched to institution requiring official counter-affidavit within the 14-day SLA window.";
    }

    setAuditLogs((prev) => [
      {
        id: newLogId,
        timestamp: now,
        action: actionLabel,
        reviewer: "Smt. Anuradha Sen (Senior Inter-Bureau Adjudicator)",
        rationale,
      },
      ...prev,
    ]);
  };

  const resetLab = (scenario: ScenarioType) => {
    setActiveScenario(scenario);
    setActiveStep("stepA");
    setSelectedRecordIndex(0);
    setDecision("NONE");
    setReviewerNote("");
  };

  return (
    <div className="bg-[#10233D] rounded-2xl border border-slate-700/80 p-6 sm:p-8 shadow-2xl space-y-8 relative overflow-hidden text-slate-100">
      {/* Background radial lens */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-radial-lens pointer-events-none opacity-40" />

      {/* Lab Header & Scenario Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-700/80 gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#3678D4]/20 border border-[#3678D4]/40 text-[#8DBAFF] flex items-center justify-center">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-base font-bold text-white tracking-tight">
                  CASE CONNECTION LAB
                </span>
                <span className="text-[10px] font-mono text-[#3E9E96] bg-teal-950/80 border border-teal-800 px-2 py-0.5 rounded uppercase font-semibold">
                  Interactive Demo
                </span>
              </div>
              <p className="text-xs text-[#AEBBCD] mt-0.5">
                Explore synthetic complaints across bureaus, examine surfaced candidate overlaps, and record sovereign reviewer decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Scenario Toggle Pills */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center space-x-1">
            <Sliders className="w-3.5 h-3.5 text-[#8DBAFF]" />
            <span>Select Scenario:</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 p-1 bg-[#080E18] rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => resetLab("correlated")}
              className={`px-3 py-1.5 rounded text-left sm:text-center transition-all ${
                activeScenario === "correlated"
                  ? "bg-[#3678D4] text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              1. Correlated Overlap
            </button>
            <button
              type="button"
              onClick={() => resetLab("distinct_same_inst")}
              className={`px-3 py-1.5 rounded text-left sm:text-center transition-all ${
                activeScenario === "distinct_same_inst"
                  ? "bg-amber-600 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Same college, genuinely distinct issues - testing zero auto-merging"
            >
              2. Difficult Test (Distinct)
            </button>
            <button
              type="button"
              onClick={() => resetLab("cross_campus")}
              className={`px-3 py-1.5 rounded text-left sm:text-center transition-all ${
                activeScenario === "cross_campus"
                  ? "bg-purple-700 text-white font-semibold shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
              title="Disambiguating distinct campuses under same trust name"
            >
              3. PID Disambiguation
            </button>
          </div>
        </div>
      </div>

      {/* 4-Step Interactive Progression Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        {[
          { id: "stepA", stepNum: "A", title: "Separate Inflows", desc: "Inspect 3 isolated complaints" },
          { id: "stepB", stepNum: "B", title: "Surface Overlap", desc: "Candidate vector screening" },
          { id: "stepC", stepNum: "C", title: "Explain Evidence", desc: "Matches vs conflicting factors" },
          { id: "stepD", stepNum: "D", title: "Reviewer Decision", desc: "Sovereign human sign-off" },
        ].map((s) => {
          const isCurrent = activeStep === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveStep(s.id as StepType)}
              className={`p-3 rounded-lg border text-left transition-all flex items-start space-x-2.5 ${
                isCurrent
                  ? "bg-[#152236] border-[#3678D4] shadow-md shadow-blue-950/60 ring-1 ring-[#3678D4]/50"
                  : "bg-[#080E18]/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              <span
                className={`w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                  isCurrent ? "bg-[#3678D4] text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                {s.stepNum}
              </span>
              <div>
                <div className={`font-semibold ${isCurrent ? "text-white" : "text-slate-300"}`}>
                  {s.title}
                </div>
                <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{s.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          STEP A: DISPLAY SEPARATE COMPLAINTS
         ========================================================================= */}
      {activeStep === "stepA" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#8DBAFF]">
              STEP A &bull; DISPARATE INFLOW FEEDS FROM SEPARATE BUREAUS
            </span>
            <span className="text-xs text-slate-400">Click a record card to inspect full details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {currentRecords.map((rec, index) => {
              const isSelected = selectedRecordIndex === index;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRecordIndex(index)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-3 ${
                    isSelected
                      ? "bg-[#152236] border-[#8DBAFF] shadow-lg shadow-blue-950/60 ring-1 ring-[#8DBAFF]/40"
                      : "bg-[#080E18] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${rec.bureauColor}`}>
                      {rec.bureau}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{rec.date}</span>
                  </div>

                  <div>
                    <div className="font-mono text-xs font-bold text-white">{rec.id}</div>
                    <div className="text-xs font-semibold text-slate-200 mt-1 line-clamp-1">{rec.subject}</div>
                  </div>

                  <p className="text-[11px] text-[#AEBBCD] leading-relaxed line-clamp-2">
                    {rec.statement}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>PID: {rec.pid}</span>
                    <span className="text-emerald-400 font-semibold">{rec.clause}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Expanded Selected Record Inspection Box */}
          <div className="p-5 rounded-xl bg-[#080E18] border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-[#8DBAFF]" />
                <span className="font-mono text-xs font-bold text-white">
                  RAW RECORD DETAILS &bull; {currentRecords[selectedRecordIndex].id}
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded border ${currentRecords[selectedRecordIndex].bureauColor}`}>
                Originating Bureau: {currentRecords[selectedRecordIndex].bureau}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-400">Institution: </span>
                  <strong className="text-white">{currentRecords[selectedRecordIndex].institution}</strong>
                </div>
                <div>
                  <span className="text-slate-400">AICTE Permanent ID: </span>
                  <span className="font-mono text-[#8DBAFF] font-bold">{currentRecords[selectedRecordIndex].pid}</span>
                </div>
                <div>
                  <span className="text-slate-400">Complainant / Source: </span>
                  <span className="text-slate-200">{currentRecords[selectedRecordIndex].complainant}</span>
                </div>
                <div>
                  <span className="text-slate-400">Handbook Authority: </span>
                  <span className="text-emerald-400 font-mono font-medium">{currentRecords[selectedRecordIndex].clause}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-400">Grievance Category: </span>
                  <span className="text-amber-300 font-medium">{currentRecords[selectedRecordIndex].category}</span>
                </div>
                <div>
                  <span className="text-slate-400">Attached Documentary Proof: </span>
                  <span className="font-mono text-blue-300">{currentRecords[selectedRecordIndex].evidence}</span>
                </div>
                <div>
                  <span className="text-slate-400">Filing Date: </span>
                  <span className="font-mono text-slate-300">{currentRecords[selectedRecordIndex].date}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#152236] rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-1">Full Allegation Narrative:</strong>
              &quot;{currentRecords[selectedRecordIndex].statement}&quot;
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveStep("stepB")}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#3678D4] hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors"
              >
                <span>Proceed to Step B: Surface Candidate Overlap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP B: SURFACE A POSSIBLE OVERLAP
         ========================================================================= */}
      {activeStep === "stepB" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#3E9E96]">
              STEP B &bull; CANDIDATE RELATIONSHIP GENERATION
            </span>
            <span className="text-xs text-slate-400">Algorithmic Correlation Heuristic</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Matching Vectors Explanation */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-[#080E18] border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase font-mono">
                <Layers className="w-4 h-4 text-[#3E9E96]" />
                <span>Multi-Vector Matching Heuristic</span>
              </div>

              <div className="space-y-3 text-xs">
                {/* Vector 1 */}
                <div className="p-3 bg-[#152236] rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">1. Entity Permanent ID (PID)</span>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">
                      {activeScenario === "cross_campus" ? "0% (Distinct PIDs)" : "100% Deterministic"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Lookup against AICTE National Technical Registry matches verified institutional campus.
                  </p>
                </div>

                {/* Vector 2 */}
                <div className="p-3 bg-[#152236] rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">2. APH Regulatory Clause Alignment</span>
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">
                      {activeScenario === "correlated" ? "92% (Ch. VII Cl. 7.1)" : activeScenario === "distinct_same_inst" ? "24% (Ch. VII vs Ch. II)" : "85% (Both Cl. 7.1)"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Direct mapping to cited Approval Process Handbook chapters and statutory requirements.
                  </p>
                </div>

                {/* Vector 3 */}
                <div className="p-3 bg-[#152236] rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">3. Semantic Key Phrase Overlap</span>
                    <span className="font-mono text-[10px] text-[#8DBAFF] font-bold">
                      {activeScenario === "correlated" ? "88% Semantic Match" : activeScenario === "distinct_same_inst" ? "12% Independent" : "74% Related Topics"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Extracts correlated grievance subjects (e.g. &apos;withholding&apos;, &apos;capitation&apos;, &apos;ancillary levy&apos;).
                  </p>
                </div>
              </div>
            </div>

            {/* Candidate Pair Surfaced Card */}
            <div className="lg:col-span-7 p-6 rounded-xl bg-[#152236] border border-blue-700/80 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-white">
                      CANDIDATE PAIR SURFACED: {activeScenario === "correlated" ? "OVL-2026-001" : activeScenario === "distinct_same_inst" ? "OVL-2026-089" : "OVL-2026-104"}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded border ${
                      activeScenario === "correlated"
                        ? "text-emerald-400 bg-emerald-950/80 border-emerald-800"
                        : activeScenario === "distinct_same_inst"
                        ? "text-amber-400 bg-amber-950/80 border-amber-800"
                        : "text-blue-400 bg-blue-950/80 border-blue-800"
                    }`}
                  >
                    {activeScenario === "correlated"
                      ? "88% Overall Match"
                      : activeScenario === "distinct_same_inst"
                      ? "34% Weak Correlation"
                      : "42% Cross-Entity"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 bg-[#080E18] rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-blue-400 font-semibold uppercase">Case A</span>
                    <div className="font-mono text-xs font-bold text-white">{recA.id}</div>
                    <div className="text-slate-300 text-[11px] line-clamp-1">{recA.subject}</div>
                  </div>

                  <div className="p-3 bg-[#080E18] rounded-lg border border-slate-800 space-y-1">
                    <span className="text-[10px] font-mono text-purple-400 font-semibold uppercase">Case B</span>
                    <div className="font-mono text-xs font-bold text-white">{recB.id}</div>
                    <div className="text-slate-300 text-[11px] line-clamp-1">{recB.subject}</div>
                  </div>
                </div>

                {/* Important Distinction Banner */}
                <div
                  className={`p-3 rounded-lg border text-xs leading-relaxed ${
                    activeScenario === "distinct_same_inst"
                      ? "bg-amber-950/50 border-amber-800/80 text-amber-200"
                      : "bg-[#080E18] border-slate-800 text-slate-300"
                  }`}
                >
                  <strong className="block text-white mb-0.5">
                    {activeScenario === "distinct_same_inst"
                      ? "Critical System Rule Applied:"
                      : "Heuristic Rationale:"}
                  </strong>
                  {activeScenario === "distinct_same_inst"
                    ? "Shared college identity (PID 1-10492811) DOES NOT imply duplicate issues. Case A concerns financial capitation under Chapter VII, while Case B concerns laboratory equipment calibration under Chapter II. The system flags this as candidate for distinct tracks."
                    : activeScenario === "correlated"
                    ? "Both dockets challenge identical institutional fee mechanisms under Chapter VII Clause 7.1. A joint review standing committee is recommended."
                    : "Different Permanent Institute IDs (1-10492811 vs 1-10928419). Even though they share the 'Apex' trust banner, separate campus legal registrations prevent conflation."}
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveStep("stepC")}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#3678D4] hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors"
                >
                  <span>Proceed to Step C: Explain Evidence</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP C: EXPLAIN THE EVIDENCE
         ========================================================================= */}
      {activeStep === "stepC" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#8DBAFF]">
              STEP C &bull; EXPLAINABLE EVIDENCE COMPARISON
            </span>
            <span className="text-xs text-slate-400">Side-by-Side Attribute Comparison</span>
          </div>

          {/* Dual-Pane Comparison Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Left Case A */}
            <div className="p-5 rounded-xl bg-[#080E18] border border-blue-900/70 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="font-bold text-[#8DBAFF]">{recA.id}</span>
                  <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800">
                    {recA.bureau}
                  </span>
                </div>
                <span className="text-slate-500 font-mono text-[10px]">{recA.date}</span>
              </div>

              <h4 className="font-bold text-white text-sm">{recA.subject}</h4>

              <div className="p-3 bg-[#152236] rounded-lg border border-slate-800 text-slate-300 leading-relaxed font-sans text-xs">
                {activeScenario === "correlated" ? (
                  <span>
                    The college administration is <mark className="bg-blue-600/40 text-blue-200 px-1 rounded">withholding</mark> my original 10th/12th mark sheets and B.Tech degree completion certificate, demanding an unapproved <mark className="bg-amber-600/40 text-amber-200 px-1 rounded">campus placement service levy</mark> of ₹25,000 before issuing clearance.
                  </span>
                ) : (
                  <span>{recA.statement}</span>
                )}
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-400 pt-1">
                <div>Complainant: <span className="text-slate-200">{recA.complainant}</span></div>
                <div>Institution PID: <span className="text-white font-mono">{recA.pid}</span></div>
                <div>Statutory Clause: <span className="text-emerald-400 font-mono font-bold">{recA.clause}</span></div>
                <div>Attachment: <span className="text-[#8DBAFF] font-mono">{recA.evidence}</span></div>
              </div>
            </div>

            {/* Right Case B */}
            <div className="p-5 rounded-xl bg-[#080E18] border border-purple-900/70 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="font-bold text-purple-300">{recB.id}</span>
                  <span className="text-[10px] bg-purple-950 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800">
                    {recB.bureau}
                  </span>
                </div>
                <span className="text-slate-500 font-mono text-[10px]">{recB.date}</span>
              </div>

              <h4 className="font-bold text-white text-sm">{recB.subject}</h4>

              <div className="p-3 bg-[#152236] rounded-lg border border-slate-800 text-slate-300 leading-relaxed font-sans text-xs">
                {activeScenario === "correlated" ? (
                  <span>
                    College trustees are levying arbitrary development donations and <mark className="bg-amber-600/40 text-amber-200 px-1 rounded">placement clearance charges</mark> outside the state-notified fee framework, conditioning <mark className="bg-blue-600/40 text-blue-200 px-1 rounded">certificate release</mark> upon settlement.
                  </span>
                ) : (
                  <span>{recB.statement}</span>
                )}
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-400 pt-1">
                <div>Complainant: <span className="text-slate-200">{recB.complainant}</span></div>
                <div>Institution PID: <span className="text-white font-mono">{recB.pid}</span></div>
                <div>Statutory Clause: <span className="text-emerald-400 font-mono font-bold">{recB.clause}</span></div>
                <div>Attachment: <span className="text-purple-300 font-mono">{recB.evidence}</span></div>
              </div>
            </div>
          </div>

          {/* Evidence Synthesis & Contrast Summary */}
          <div className="p-4 rounded-xl bg-[#152236] border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white uppercase font-mono text-[11px]">
                Evidence Breakdown & Confidence Limits
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Matching Confidence Metric &ne; Automatic Decision
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#080E18] rounded-lg border border-slate-800 space-y-1.5">
                <span className="text-emerald-400 font-semibold block text-[11px]">
                  &bull; Shared Identifiers & Correlated Factors:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {activeScenario === "correlated"
                    ? "Both complaints cite PID 1-10492811, target the same campus administration, and allege retention of credentials conditional on placement fees under APH Clause 7.1."
                    : activeScenario === "distinct_same_inst"
                    ? "Both complaints cite PID 1-10492811, indicating same institutional respondent."
                    : "Both complaints relate to educational services under Apex Trust banner."}
                </p>
              </div>

              <div className="p-3 bg-[#080E18] rounded-lg border border-slate-800 space-y-1.5">
                <span className="text-amber-400 font-semibold block text-[11px]">
                  &bull; Conflicting Attributes & Meaningful Differences:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {activeScenario === "correlated"
                    ? "Case A is an individual student seeking immediate certificate return; Case B is a collective parent association contesting broader institutional fee structures."
                    : activeScenario === "distinct_same_inst"
                    ? "Entirely different administrative scopes: Case A is a fee violation handled by Regulation Bureau; Case B is an EOA laboratory hardware deficiency handled by Approval Bureau."
                    : "Different physical campuses (Pune vs Mumbai) with distinct AICTE PIDs and separate faculty rosters."}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setActiveStep("stepD")}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#3678D4] hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors"
              >
                <span>Proceed to Step D: Require Sovereign Reviewer Decision</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP D: REQUIRE AN EXPLICIT REVIEWER DECISION
         ========================================================================= */}
      {activeStep === "stepD" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono font-bold tracking-wider text-[#3E9E96]">
              STEP D &bull; SOVEREIGN HUMAN REVIEWER ADJUDICATION
            </span>
            <span className="text-xs text-slate-400 font-mono">Signatory: Smt. Anuradha Sen (Adjudicator)</span>
          </div>

          {/* Action Choice Group */}
          <div className="p-5 rounded-xl bg-[#080E18] border border-slate-800 space-y-4">
            <h4 className="font-bold text-white text-sm">
              Record Official Administrative Disposition:
            </h4>
            <p className="text-xs text-[#AEBBCD] leading-relaxed">
              Select one of three working actions. AICTE governance mandates that an authorized official record an explicit rationale before any dossier joinder or separation is committed.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleDecision("LINK")}
                className={`p-3.5 rounded-lg border text-left transition-all space-y-1.5 ${
                  decision === "LINK"
                    ? "bg-[#3678D4] border-blue-400 text-white shadow-lg shadow-blue-950/60 ring-1 ring-blue-400"
                    : "bg-[#152236] border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">1. Link as Related</span>
                  <CheckCircle2 className="w-4 h-4 text-blue-200" />
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  Unify proceedings into a joint standing committee. Sync notice deadlines across both bureaus.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleDecision("SEPARATE")}
                className={`p-3.5 rounded-lg border text-left transition-all space-y-1.5 ${
                  decision === "SEPARATE"
                    ? "bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-950/60 ring-1 ring-amber-400"
                    : "bg-[#152236] border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">2. Keep Separate</span>
                  <XCircle className="w-4 h-4 text-amber-200" />
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  Mark as distinct matters. Keep on independent bureau tracks without joinder.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleDecision("DEFER")}
                className={`p-3.5 rounded-lg border text-left transition-all space-y-1.5 ${
                  decision === "DEFER"
                    ? "bg-slate-700 border-slate-400 text-white shadow-lg ring-1 ring-slate-400"
                    : "bg-[#152236] border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">3. Defer Review</span>
                  <Clock className="w-4 h-4 text-slate-200" />
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  Pause joinder. Await receipt of respondent institution counter-affidavit within 14-day window.
                </p>
              </button>
            </div>

            {/* Custom Reviewer Justification Input */}
            <div className="space-y-1.5 pt-2">
              <label htmlFor="labReviewerNote" className="text-xs font-semibold text-slate-300 block">
                Official Reviewer Rationale (Appended to Permanent Governance Ledger):
              </label>
              <textarea
                id="labReviewerNote"
                rows={2}
                value={reviewerNote}
                onChange={(e) => setReviewerNote(e.target.value)}
                placeholder="Enter mandatory justification for audit trail (e.g., 'Confirmed cross-bureau overlap under APH Clause 7.1')..."
                className="w-full p-2.5 bg-[#152236] border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-[#3678D4]"
              />
            </div>

            {decision !== "NONE" && (
              <div className="p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Decision Recorded: <strong>{decision === "LINK" ? "LINK AS RELATED" : decision === "SEPARATE" ? "KEEP SEPARATE" : "DEFERRED"}</strong>
                  </span>
                </div>
                <span className="font-mono text-[10px] text-emerald-300">
                  Status: ADJUDICATION_COMMITTED
                </span>
              </div>
            )}
          </div>

          {/* Interactive Live Audit Trail */}
          <div className="p-5 rounded-xl bg-[#152236] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#8DBAFF]" />
                <span className="font-bold text-white text-xs font-mono uppercase">
                  SIMULATED GOVERNANCE AUDIT TRAIL
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {auditLogs.length} Events Logged
              </span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-[#080E18] rounded-lg border border-slate-800 text-xs space-y-1 font-mono"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#8DBAFF] font-bold">{log.id}</span>
                    <span className="text-slate-500">{log.timestamp}</span>
                  </div>
                  <div className="text-emerald-400 text-[11px] font-bold">{log.action}</div>
                  <div className="text-slate-300 font-sans text-xs">{log.rationale}</div>
                  <div className="text-slate-500 text-[10px]">Signatory: {log.reviewer}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lab Footer Disclaimer & Live Links */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Interactive demonstration mode. Uses local simulation state to safeguard production records.</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="/overlap-review/OVL-2026-001"
            className="text-[#8DBAFF] hover:underline font-semibold flex items-center space-x-1"
          >
            <span>Launch Live Bureau Overlap Workspace</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
