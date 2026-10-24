"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Search,
  FilePlus,
  LogIn,
  Menu,
  X,
  HelpCircle,
  Building,
  Info,
  ExternalLink,
} from "lucide-react";

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/about", label: "About" },
    { href: "/help", label: "Help & FAQs" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-[#080E18]/95 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md shadow-lg shadow-black/20 text-[#F4F6FA]">
      {/* Top Ministerial / National Bar with Authentic Government of India Emblem */}
      <div className="bg-[#050910] text-[#B4C0D0] px-4 py-1.5 text-[11px] font-medium border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/branding/gov-india-emblem.png"
              alt="Government of India Emblem"
              className="h-5 sm:h-6 w-auto object-contain shrink-0"
            />
            <span className="font-semibold text-slate-200 tracking-wide hidden xs:inline">
              GOVERNMENT OF INDIA
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 truncate">
              Ministry of Education &bull; AICTE Grievance & Overlap Monitoring Desk
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-slate-400 text-[10px]">
            <span>SIH 2026 Problem Statement: SIH26264</span>
            <span className="bg-[#121B2A] text-[#6AA7FF] border border-blue-900/60 px-2 py-0.5 rounded font-mono">
              DEMO PROTOTYPE
            </span>
          </div>
        </div>
      </div>

      {/* Main Public Navigation Bar with Authentic AICTE Logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Emblem */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-md bg-white p-1 flex items-center justify-center shadow-xs border border-slate-700 group-hover:border-[#6AA7FF] transition-colors shrink-0">
              <img
                src="/branding/aicte-logo.png"
                alt="AICTE Official Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-white text-lg tracking-tight group-hover:text-[#6AA7FF] transition-colors">
                  CaseBridge <span className="text-[#3678D4] font-extrabold">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 bg-blue-950 text-[#6AA7FF] border border-blue-800 rounded">
                  AICTE
                </span>
              </div>
              <span className="text-[11px] text-[#B4C0D0] font-medium hidden xs:inline">
                Unified Multi-Bureau Grievance & Overlap Monitoring System
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-[#121B2A] text-[#6AA7FF] font-semibold border border-blue-900/60"
                    : "text-[#B4C0D0] hover:text-white hover:bg-slate-800/60"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center space-x-2.5">
            <Link
              href="/track-complaint"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-[#121B2A] border border-slate-700/80 rounded-md hover:bg-slate-800 hover:text-white transition-all shadow-xs"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Track Status</span>
            </Link>

            <Link
              href="/complaints/register"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#3678D4] hover:bg-[#2b64b3] rounded-md transition-all shadow-md shadow-blue-950/40"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Register Complaint</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-medium text-[#6AA7FF] hover:bg-blue-950/50 rounded-md border border-blue-900/60 transition-colors"
              title="Official and Institution Portal Login"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Portals</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#080E18] px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive(link.href)
                  ? "bg-[#121B2A] text-[#6AA7FF] font-semibold"
                  : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-800 flex flex-col space-y-2">
            <Link
              href="/track-complaint"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-slate-200 bg-[#121B2A] border border-slate-700 rounded-md"
            >
              <Search className="w-4 h-4" />
              <span>Track Existing Complaint</span>
            </Link>
            <Link
              href="/complaints/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-semibold text-white bg-[#3678D4] rounded-md"
            >
              <FilePlus className="w-4 h-4" />
              <span>Register New Complaint</span>
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-[#6AA7FF] bg-[#121B2A] border border-blue-900 rounded-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Access Institution & Admin Portals</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
