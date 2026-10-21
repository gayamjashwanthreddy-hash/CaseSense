import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink, HelpCircle, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-[#050910] text-[#B4C0D0] border-t border-slate-800/80 text-xs">
      {/* Simulation & Disclaimer Notice Banner */}
      <div className="bg-[#080E18] border-b border-slate-800/60 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong className="text-slate-200">Demonstration Prototype Notice:</strong> CaseBridge AI is developed for the Smart India Hackathon 2026 (SIH26264). This website is a research & innovation submission and is not an official portal of the All India Council for Technical Education (AICTE). All institutional cases and complainant records are synthetic simulation data.
            </span>
          </div>
          <span className="font-mono text-slate-500 shrink-0 text-[10px]">
            Team Code Ninja&apos;s &bull; SIH26264
          </span>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand & Mandate */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-[#3678D4] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-base tracking-tight">
              CaseBridge <span className="text-[#6AA7FF]">AI</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Multi-bureau grievance deduplication, coordination, and tracking platform ensuring institutional transparency across technical education bureaus.
          </p>
          <div className="pt-2 text-[11px] text-slate-400">
            <div>AICTE Head Office, Nelson Mandela Marg,</div>
            <div>Vasant Kunj, New Delhi - 110070</div>
          </div>
        </div>

        {/* Col 2: Citizen & Student Services */}
        <div className="space-y-2.5">
          <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
            Public & Students
          </div>
          <ul className="space-y-2 text-[#B4C0D0]">
            <li>
              <Link href="/complaints/register" className="hover:text-white transition-colors">
                Lodge Grievance / Complaint
              </Link>
            </li>
            <li>
              <Link href="/track-complaint" className="hover:text-white transition-colors">
                Track Application / Reference Status
              </Link>
            </li>
            <li>
              <Link href="/how-it-works" className="hover:text-white transition-colors">
                Citizen Grievance Charter & SLAs
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:text-white transition-colors">
                Whistleblower Confidentiality Policy
              </Link>
            </li>
            <li>
              <Link href="/help#categories" className="hover:text-white transition-colors">
                Categorization & Evidence Guide
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Institutional Services */}
        <div className="space-y-2.5">
          <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
            Technical Institutions
          </div>
          <ul className="space-y-2 text-[#B4C0D0]">
            <li>
              <Link href="/institution/login" className="hover:text-white transition-colors flex items-center space-x-1">
                <span>Institution Compliance Login</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </Link>
            </li>
            <li>
              <Link href="/institution/dashboard" className="hover:text-white transition-colors">
                Institutional Dashboard Preview
              </Link>
            </li>
            <li>
              <Link href="/about#regulations" className="hover:text-white transition-colors">
                AICTE Approval Process Handbook (APH)
              </Link>
            </li>
            <li>
              <Link href="/help#institutions" className="hover:text-white transition-colors">
                Show Cause & Joint Hearing Guidelines
              </Link>
            </li>
            <li>
              <Link href="/institution/responses" className="hover:text-white transition-colors">
                Counter-Affidavit Submission Protocol
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Administrative & Governance */}
        <div className="space-y-2.5">
          <div className="font-semibold text-white uppercase tracking-wider text-[11px]">
            Inter-Bureau Portals
          </div>
          <ul className="space-y-2 text-[#B4C0D0]">
            <li>
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Executive Overview Console
              </Link>
            </li>
            <li>
              <Link href="/overlap-review" className="hover:text-white transition-colors">
                Cross-Bureau Overlap Triage Queue
              </Link>
            </li>
            <li>
              <Link href="/cases" className="hover:text-white transition-colors">
                Master Complaint Explorer
              </Link>
            </li>
            <li>
              <Link href="/institutions" className="hover:text-white transition-colors">
                Institution 360&deg; Directory
              </Link>
            </li>
            <li>
              <Link href="/admin/access" className="hover:text-white transition-colors">
                RBAC Access Control & Audit Ledger
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Accessibility */}
      <div className="border-t border-slate-800/80 bg-[#080E18] px-4 py-4 text-center text-slate-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            &copy; 2026 Smart India Hackathon Submission &mdash; Problem Statement SIH26264. Proposed platform for evaluation purposes only.
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <Link href="/about" className="hover:underline">About Project</Link>
            <span>&bull;</span>
            <Link href="/help" className="hover:underline">Privacy Charter</Link>
            <span>&bull;</span>
            <Link href="/login" className="hover:underline">Portals Directory</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
