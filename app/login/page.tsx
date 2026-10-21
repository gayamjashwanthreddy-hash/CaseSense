import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Building2,
  Users,
  Search,
  FilePlus,
  ArrowRight,
  Scale,
  KeyRound,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function PortalsDirectoryPage() {
  return (
    <div className="bg-brand-midnight text-brand-warm min-h-[calc(100vh-140px)] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-inst/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[300px] bg-brand-teal/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-surface border border-brand-inst/30 text-brand-ice text-xs font-mono tracking-wide">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-ice" />
            <span>CASEBRIDGE AI • ACCESS DIRECTORY</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Select Your Operational Workspace
          </h1>
          <p className="text-brand-neutral text-sm leading-relaxed">
            CaseBridge AI provides segregated, purpose-built workspaces for citizens, technical institutions, and government bureau officials.
          </p>
        </div>

        {/* 3 Portal Gateway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Public / Citizen */}
          <div className="bg-brand-deep/80 border border-brand-surface rounded-xl p-6 flex flex-col justify-between space-y-6 hover:border-brand-ice/40 hover:shadow-[0_0_24px_rgba(54,120,212,0.12)] transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-brand-surface border border-brand-inst/30 text-brand-ice flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-ice bg-brand-inst/15 px-2 py-0.5 rounded border border-brand-inst/30">
                  Citizen Gateway
                </span>
                <h2 className="text-lg font-bold text-white mt-2">
                  Public & Students
                </h2>
                <p className="text-xs text-brand-neutral mt-1.5 leading-relaxed">
                  For students, parents, faculty, and citizens lodging or tracking grievances. No account creation required.
                </p>
              </div>

              <div className="pt-2 border-t border-brand-surface/60 space-y-2">
                <div className="flex items-start space-x-2 text-xs text-brand-warm/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0 mt-0.5" />
                  <span>Lodge new verified complaint</span>
                </div>
                <div className="flex items-start space-x-2 text-xs text-brand-warm/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0 mt-0.5" />
                  <span>Dual-factor status tracking</span>
                </div>
                <div className="flex items-start space-x-2 text-xs text-brand-warm/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0 mt-0.5" />
                  <span>Whistleblower confidentiality protection</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-brand-surface">
              <Link
                href="/complaints/register"
                className="w-full py-2.5 px-3 bg-brand-inst hover:bg-blue-600 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-colors"
              >
                <FilePlus className="w-4 h-4" />
                <span>Register Complaint</span>
              </Link>
              <Link
                href="/track-complaint"
                className="w-full py-2.5 px-3 bg-brand-surface hover:bg-brand-surface/80 text-brand-warm border border-brand-surface font-medium text-xs rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Search className="w-4 h-4 text-brand-ice" />
                <span>Track Complaint Status</span>
              </Link>
            </div>
          </div>

          {/* Card 2: Institution Portal */}
          <div className="bg-brand-deep/80 border border-brand-surface rounded-xl p-6 flex flex-col justify-between space-y-6 hover:border-amber-400/40 hover:shadow-[0_0_24px_rgba(245,158,11,0.12)] transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-brand-surface border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                  Respondent Portal
                </span>
                <h2 className="text-lg font-bold text-white mt-2">
                  Approved Institutions
                </h2>
                <p className="text-xs text-brand-neutral mt-1.5 leading-relaxed">
                  For authorized technical institutions, principals, and deans to access show-cause notices and file counter-affidavits.
                </p>
              </div>

              <div className="pt-2 border-t border-brand-surface/60 space-y-2">
                <div className="flex items-start space-x-2 text-xs text-brand-warm/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>PID-scoped complaint queue</span>
                </div>
                <div className="flex items-start space-x-2 text-xs text-brand-warm/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Submit official compliance counter-replies</span>
                </div>
                <div className="flex items-start space-x-2 text-xs text-brand-warm/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>Pre-seeded demo credentials provided</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-surface">
              <Link
                href="/institution/login"
                className="w-full py-2.5 px-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center space-x-2 transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                <span>Institution Portal Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Card 3: AICTE Administrative Console */}
          <div className="bg-brand-deep/80 border border-brand-surface rounded-xl p-6 flex flex-col justify-between space-y-6 hover:border-brand-teal/40 hover:shadow-[0_0_24px_rgba(62,158,150,0.12)] transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-lg bg-brand-surface border border-brand-teal/30 text-brand-teal flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-teal bg-brand-teal/15 px-2 py-0.5 rounded border border-brand-teal/30">
                  Official Console
                </span>
                <h2 className="text-lg font-bold text-white mt-2">
                  Bureau Officials
                </h2>
                <p className="text-xs text-brand-neutral mt-1.5 leading-relaxed">
                  For designated AICTE officers across PGRC, Regulation, Approval, Legal, and Review desks.
                </p>
              </div>

              <div className="pt-2 border-t border-brand-surface/60 space-y-2">
                <div className="flex items-start space-x-2 text-xs text-brand-warm/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0 mt-0.5" />
                  <span>Executive workload & SLA dashboards</span>
                </div>
                <div className="flex items-start space-x-2 text-xs text-brand-warm/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0 mt-0.5" />
                  <span>Cross-Bureau overlap triage queue</span>
                </div>
                <div className="flex items-start space-x-2 text-xs text-brand-warm/90">
                  <CheckCircle2 className="w-3.5 h-3.5 text-brand-teal shrink-0 mt-0.5" />
                  <span>Live persona switcher in topbar</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-brand-surface">
              <Link
                href="/dashboard"
                className="w-full py-2.5 px-3 bg-brand-surface hover:bg-brand-surface/80 text-white font-semibold text-xs rounded-lg border border-brand-surface shadow-sm flex items-center justify-center space-x-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-brand-teal" />
                <span>Enter Bureau Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Prototype Notice */}
        <div className="p-4 rounded-xl bg-brand-deep/50 border border-brand-surface text-center text-xs text-brand-neutral max-w-2xl mx-auto">
          All login mechanisms and institutional records are part of a demonstration prototype for Smart India Hackathon 2026. No actual AICTE backend credentials are used or stored.
        </div>
      </div>
    </div>
  );
}
