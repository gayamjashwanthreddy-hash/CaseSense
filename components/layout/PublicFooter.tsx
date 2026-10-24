import React from "react";
import Link from "next/link";
import { ShieldCheck, ExternalLink } from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-[#F7F7F4] border-t border-[#E3E5DE] text-[#62665F] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Identity Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-white p-1 flex items-center justify-center border border-[#E3E5DE]">
                <img
                  src="/branding/aicte-logo.png"
                  alt="AICTE Emblem"
                  className="w-6 h-6 object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-[#20231F]">CaseSense</span>
                <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E8EEE7] text-[#344B3B] font-semibold">
                  SIH26264
                </span>
              </div>
            </div>
            <p className="text-xs text-[#62665F] max-w-md leading-relaxed">
              Integrated complaint intelligence and inter-bureau coordination platform for the All India Council for Technical Education (AICTE), enabling transparent grievance tracking, cross-cell correlation, and sovereign administrative resolution.
            </p>
            <div className="text-[11px] text-[#85877F]">
              Designed and developed for Smart India Hackathon 2026 by Team Code Ninja&apos;s.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#20231F] uppercase tracking-wider">Public Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/complaints/register" className="hover:text-[#344B3B] transition-colors">
                  Lodge Grievance
                </Link>
              </li>
              <li>
                <Link href="/track-complaint" className="hover:text-[#344B3B] transition-colors">
                  Track Complaint Status
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#344B3B] transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-[#344B3B] transition-colors">
                  Help & FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#20231F] uppercase tracking-wider">Institutional Desks</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-[#344B3B] transition-colors font-medium">
                  Official Reviewer Login
                </Link>
              </li>
              <li>
                <Link href="/institution/login" className="hover:text-[#344B3B] transition-colors">
                  Institution Portal Login
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#344B3B] transition-colors">
                  Statutory Mandate
                </Link>
              </li>
              <li>
                <a
                  href="https://www.aicte-india.org"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#344B3B] inline-flex items-center gap-1 transition-colors"
                >
                  <span>AICTE Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#E3E5DE] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#85877F]">
          <div>
            &copy; {new Date().getFullYear()} All India Council for Technical Education (AICTE). All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span>Whistleblower Identity Redaction Active</span>
            <span>&bull;</span>
            <span>Zero Unilateral Merges Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
