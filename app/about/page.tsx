import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  GitCompare,
  Scale,
  Users,
  CheckCircle2,
  FileText,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Cpu,
  Layers,
  Lock,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-surface-primary text-charcoal-primary min-h-[calc(100vh-140px)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Header / Mission */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-olive-50 border border-olive-200 rounded-full text-olive-800 text-xs font-mono tracking-wide">
            <span>SMART INDIA HACKATHON 2026 • SIH26264</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-medium text-charcoal-primary tracking-tight leading-tight">
            Connecting Evidence. Safeguarding Accountability.
          </h1>
          <p className="text-charcoal-secondary text-base sm:text-lg leading-relaxed">
            CaseBridge AI is an integrated, explainable case-coordination architecture designed to monitor, track, and de-duplicate institution-related complaint cases across AICTE bureaus and regulatory cells.
          </p>
        </div>

        {/* The Core Challenge Section */}
        <section className="bg-white border border-charcoal-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-olive-50 border border-olive-200 text-olive-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-charcoal-primary font-serif">
                The Regulatory Coordination Challenge
              </h2>
              <p className="text-xs text-charcoal-muted">
                Navigating parallel complaint intake across 10,000+ technical institutions nationwide
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-charcoal-secondary leading-relaxed">
            The All India Council for Technical Education (AICTE) exercises oversight over polytechnics, engineering colleges, management institutes, and architecture colleges across India. Currently, multiple administrative cells process incoming grievances independently:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 pt-2">
            <div className="p-4 bg-surface-secondary rounded-xl border border-charcoal-200 space-y-1.5">
              <span className="font-mono text-xs font-bold text-olive-700 block">PGRC</span>
              <span className="text-[11px] text-charcoal-secondary leading-relaxed block">
                Public Grievance Redressal Cell for student, faculty, and parent complaints.
              </span>
            </div>
            <div className="p-4 bg-surface-secondary rounded-xl border border-charcoal-200 space-y-1.5">
              <span className="font-mono text-xs font-bold text-amber-700 block">Regulation Bureau</span>
              <span className="text-[11px] text-charcoal-secondary leading-relaxed block">
                Enforcement of fee norms, prohibition of capitation, and faculty rosters.
              </span>
            </div>
            <div className="p-4 bg-surface-secondary rounded-xl border border-charcoal-200 space-y-1.5">
              <span className="font-mono text-xs font-bold text-teal-700 block">Approval Bureau</span>
              <span className="text-[11px] text-charcoal-secondary leading-relaxed block">
                Extension of Approval (EOA), land-use compliance, and infrastructure deficit.
              </span>
            </div>
            <div className="p-4 bg-surface-secondary rounded-xl border border-charcoal-200 space-y-1.5">
              <span className="font-mono text-xs font-bold text-purple-700 block">Legal Cell</span>
              <span className="text-[11px] text-charcoal-secondary leading-relaxed block">
                High Court / Supreme Court writ petitions, status quo orders, and affidavits.
              </span>
            </div>
            <div className="p-4 bg-surface-secondary rounded-xl border border-charcoal-200 space-y-1.5">
              <span className="font-mono text-xs font-bold text-rose-700 block">CPGRAMS Desk</span>
              <span className="text-[11px] text-charcoal-secondary leading-relaxed block">
                Centralized DARPG / PMO referrals requiring prioritized statutory compliance.
              </span>
            </div>
            <div className="p-4 bg-surface-secondary rounded-xl border border-charcoal-200 space-y-1.5 flex flex-col justify-center">
              <span className="text-xs font-semibold text-charcoal-primary">The Administrative Cost</span>
              <span className="text-[11px] text-charcoal-muted">
                Uncoordinated parallel inquiries, conflicting deadlines, and duplicate inspections.
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-secondary border border-charcoal-200 text-xs text-charcoal-secondary leading-relaxed">
            When an institution withholds certificates or demands unapproved capitation, complainants lodge parallel petitions into PGRC, email the Regulation Bureau, and escalate through CPGRAMS. CaseBridge AI binds these fragmented signals into an explainable, unified dossier before uncoordinated action is taken.
          </div>
        </section>

        {/* Architectural Guardrails */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-bold text-charcoal-primary tracking-tight">
              Architectural Guardrails & Operational Principles
            </h2>
            <p className="text-charcoal-secondary text-xs sm:text-sm">
              Engineered specifically for government regulatory standards, institutional natural justice, and data integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 bg-white border border-charcoal-200 rounded-xl space-y-3 hover:border-olive-400 transition-all shadow-xs">
              <div className="flex items-center space-x-2 text-olive-800 font-bold text-sm">
                <GitCompare className="w-4 h-4 text-olive-600" />
                <span>Explainable Overlap Screening</span>
              </div>
              <p className="text-xs text-charcoal-secondary leading-relaxed">
                Overlaps are never black-box scores. Every match is justified with exact AICTE Permanent Institute ID (PID) alignment, cited Approval Process Handbook (APH 2025-26) clauses, and extracted key phrases.
              </p>
            </div>

            <div className="p-6 bg-white border border-charcoal-200 rounded-xl space-y-3 hover:border-amber-400 transition-all shadow-xs">
              <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
                <Scale className="w-4 h-4 text-amber-600" />
                <span>Sovereign Human Adjudication</span>
              </div>
              <p className="text-xs text-charcoal-secondary leading-relaxed">
                No complaint is merged automatically. Two cases regarding the same college can represent completely independent violations. An authorized bureau reviewer must compare evidence side-by-side and sign off with a mandatory justification.
              </p>
            </div>

            <div className="p-6 bg-white border border-charcoal-200 rounded-xl space-y-3 hover:border-teal-400 transition-all shadow-xs">
              <div className="flex items-center space-x-2 text-teal-800 font-bold text-sm">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>Institutional Natural Justice</span>
              </div>
              <p className="text-xs text-charcoal-secondary leading-relaxed">
                Respondent institutions receive structured electronic show-cause notices in their dedicated compliance portal. Deans and principals have official standing to file counter-affidavits and compliance evidence before committee hearings.
              </p>
            </div>

            <div className="p-6 bg-white border border-charcoal-200 rounded-xl space-y-3 hover:border-purple-400 transition-all shadow-xs">
              <div className="flex items-center space-x-2 text-purple-800 font-bold text-sm">
                <Lock className="w-4 h-4 text-purple-600" />
                <span>Anti-Enumeration Privacy Protection</span>
              </div>
              <p className="text-xs text-charcoal-secondary leading-relaxed">
                Public grievance tracking requires dual-factor verification (Reference Number + Tracking Token/Email). Public tracking displays safe administrative milestones without disclosing confidential official notes or whistleblower identities.
              </p>
            </div>
          </div>
        </section>

        {/* Project & Team Attribution */}
        <section className="bg-surface-secondary border border-charcoal-200 rounded-2xl p-6 sm:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-olive-800 bg-olive-100/70 px-2 py-0.5 rounded border border-olive-200 font-semibold">
                SIH 2026 Submission
              </span>
              <h3 className="text-xl font-bold text-charcoal-primary font-serif mt-1.5">
                Designed & Built by Team Code Ninja&apos;s
              </h3>
              <p className="text-xs text-charcoal-secondary mt-0.5">
                Problem Statement ID: SIH26264 • Ministry / Organization: AICTE
              </p>
            </div>
            <span className="font-mono text-xs bg-white text-olive-800 border border-charcoal-200 px-3 py-1.5 rounded-lg w-fit shadow-xs font-medium">
              Prototype Environment
            </span>
          </div>

          <p className="text-xs sm:text-sm text-charcoal-secondary leading-relaxed">
            This prototype demonstrates how modern enterprise software for government digital services can deliver rich information density, responsive micro-interactions, and rigorous workflow logic without relying on opaque automation or generic templates.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <Link
              href="/how-it-works"
              className="text-olive-700 hover:text-olive-900 hover:underline flex items-center space-x-1 font-semibold"
            >
              <span>Explore the 6-Stage Lifecycle</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-charcoal-300">•</span>
            <Link
              href="/dashboard"
              className="text-charcoal-secondary hover:text-charcoal-primary hover:underline flex items-center space-x-1"
            >
              <span>Launch Bureau Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
