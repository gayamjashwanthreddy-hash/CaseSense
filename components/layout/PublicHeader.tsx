"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  FilePlus,
  LogIn,
  Menu,
  X,
  HelpCircle,
  Building,
  Info,
  ExternalLink,
  Shield,
  ArrowRight,
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
    <header className="bg-white border-b border-[#E3E5DE] sticky top-0 z-40 shadow-xs">
      {/* Top Ministerial / National Bar */}
      <div className="bg-[#F7F7F4] text-[#62665F] px-4 py-1.5 text-[11px] font-medium border-b border-[#E3E5DE]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/branding/gov-india-emblem.png"
              alt="Government of India Emblem"
              className="h-5 sm:h-5.5 w-auto object-contain shrink-0"
            />
            <span className="font-semibold text-[#20231F] tracking-wide hidden xs:inline">
              GOVERNMENT OF INDIA
            </span>
            <span className="text-[#D4D8CF] hidden sm:inline">|</span>
            <span className="text-[#62665F] truncate">
              Ministry of Education &bull; AICTE Multi-Bureau Grievance Intelligence
            </span>
          </div>
          <div className="hidden sm:flex items-center space-x-3 text-[#85877F] text-[10px]">
            <span>SIH 2026 Problem Statement: SIH26264</span>
            <span className="bg-[#E8EEE7] text-[#344B3B] px-2 py-0.5 rounded font-mono font-medium">
              OFFICIAL SYSTEM
            </span>
          </div>
        </div>
      </div>

      {/* Main Public Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Emblem */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center border border-[#E3E5DE] shadow-xs group-hover:border-[#344B3B] transition-colors shrink-0">
              <img
                src="/branding/aicte-logo.png"
                alt="AICTE Official Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-serif text-xl font-bold text-[#20231F] tracking-tight group-hover:text-[#344B3B] transition-colors">
                  CaseSense
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-[#E8EEE7] text-[#344B3B] border border-[#D0DDD0] rounded">
                  AICTE
                </span>
              </div>
              <span className="text-[11px] text-[#62665F] font-medium hidden xs:inline">
                Institutional Grievance Oversight & Inter-Bureau Coordination
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-[#E8EEE7] text-[#344B3B] font-semibold"
                    : "text-[#62665F] hover:text-[#20231F] hover:bg-[#F7F7F4]"
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#344B3B] bg-[#F0F3ED] hover:bg-[#E8EEE7] border border-[#D4D8CF] transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-[#344B3B]" />
              <span>Track Status</span>
            </Link>

            <Link
              href="/complaints/register"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#344B3B] hover:bg-[#293D30] transition-colors shadow-xs"
            >
              <FilePlus className="w-3.5 h-3.5" />
              <span>Register Complaint</span>
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#62665F] hover:text-[#20231F] hover:bg-[#F7F7F4] transition-colors"
              title="Official & Bureau Reviewer Authentication"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <Link
              href="/login"
              className="p-1.5 rounded-lg text-[#62665F] hover:text-[#20231F] hover:bg-[#F7F7F4]"
            >
              <LogIn className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-[#62665F] hover:text-[#20231F] hover:bg-[#F7F7F4]"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E3E5DE] bg-white px-4 pt-3 pb-5 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-xs font-medium ${
                  isActive(link.href)
                    ? "bg-[#E8EEE7] text-[#344B3B] font-semibold"
                    : "text-[#62665F] hover:bg-[#F7F7F4] hover:text-[#20231F]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-[#E3E5DE] flex flex-col gap-2">
            <Link
              href="/track-complaint"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 rounded-lg text-xs font-semibold text-[#344B3B] bg-[#F0F3ED] border border-[#D4D8CF]"
            >
              Track Complaint Status
            </Link>
            <Link
              href="/complaints/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 rounded-lg text-xs font-semibold text-white bg-[#344B3B]"
            >
              Register New Grievance
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 px-3 rounded-lg text-xs font-medium text-[#62665F] hover:bg-[#F7F7F4]"
            >
              Official Reviewer Workspace &rarr;
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
