"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  Building2,
  Users,
  ShieldAlert,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export default function HelpAndFaqsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: "STUDENTS",
      q: "What documents should I attach when lodging a complaint regarding fee refund or certificate retention?",
      a: "Attach copies of: (1) Admission fee receipt or challan, (2) Written request previously submitted to the institution for original return or refund, (3) Formal written refusal or acknowledgement from the college, and (4) Your admission offer letter showing candidate roll number.",
    },
    {
      category: "STUDENTS",
      q: "Can the college take punitive action against me for lodging a grievance on CaseBridge AI?",
      a: "Under AICTE (Establishment of Mechanism for Grievance Redressal) Regulations, victimisation or adverse disciplinary action against a bonafide student complainant is strictly prohibited. You can also select 'Whistleblower Confidentiality' during Step 3 of registration to keep your name redacted from institutional notices.",
    },
    {
      category: "INSTITUTIONS",
      q: "How does an institution gain access to the Institutional Compliance Portal?",
      a: "Approved technical colleges receive an institutional access profile associated with their AICTE Permanent Institute ID. In this prototype, sample seeded credentials for Apex Institute, B.R. Ambedkar Institute, NIMS Lucknow, Kalinga Polytechnic, Vidyapeeth, and Himalayan Institute are provided on the login page for demonstration.",
    },
    {
      category: "INSTITUTIONS",
      q: "What is the timeline for an institution to submit a formal counter-statement?",
      a: "Technical institutions must respond within 14 calendar days from the date of electronic dispatch of the show-cause or grievance scrutiny notice. Failure to respond may result in ex-parte proceedings before the Standing Grievance Committee.",
    },
    {
      category: "BUREAU",
      q: "What happens when two bureaus confirm a cross-bureau overlap?",
      a: "When an overlap is confirmed (action: 'Confirm & Link'), both cases transition to 'JOINT_COMMITTEE' status. A lead coordinating bureau is designated, and subsequent hearing dates and notices are unified to prevent duplicated administrative effort.",
    },
    {
      category: "BUREAU",
      q: "Can a case be merged into an existing active inquiry?",
      a: "Yes. If an authorized reviewer determines that a new intake is an identical duplicate or secondary reference of an existing lead case, they can choose 'Designate Lead & Merge'. The secondary case is closed with an audit reference pointing to the primary lead docket.",
    },
    {
      category: "STUDENTS",
      q: "How do I securely track my complaint without exposing my identity to third parties?",
      a: "The CaseBridge AI public tracking gateway requires dual-factor verification: (1) Your unique Reference Number (e.g. PGRC-2026-0892), and (2) Your registered complainant email address, phone number, or 6-digit tracking code. This prevents automated enumeration attacks.",
    },
  ];

  const categories = [
    { id: "ALL", label: "All Questions" },
    { id: "STUDENTS", label: "Students & Complainants" },
    { id: "INSTITUTIONS", label: "Technical Institutions" },
    { id: "BUREAU", label: "AICTE Bureaus & Process" },
  ];

  const grievanceCategories = [
    { title: "Capitation & Excess Fee", code: "CAPITATION_FEE", desc: "Charging fees higher than state fee committee recommendations or compulsory capitation donations." },
    { title: "Original Certificate Withholding", code: "CERTIFICATE_WITHHOLDING", desc: "Refusal to return original degree or secondary school certificates upon completion or transfer." },
    { title: "Faculty Irregularities & Biometrics", code: "FACULTY_IRREGULARITIES", desc: "Phantom faculty rosters, salary underpayment, biometric attendance falsification, or unpaid stipends." },
    { title: "Infrastructure & Lab Deficit", code: "INFRASTRUCTURE_DEFICIT", desc: "Inadequate laboratories, missing fire safety certificates, library book shortages, or building deficiencies." },
    { title: "Admission & Seat Irregularities", code: "ADMISSION_IRREGULARITIES", desc: "Admissions beyond sanctioned intake capacity, unapproved lateral entry quotas, or quota violations." },
    { title: "Unapproved Programmes", code: "UNAPPROVED_COURSES", desc: "Running technical diploma or degree courses without mandatory AICTE Approval Process Handbook clearance." },
    { title: "Academic Harassment", code: "ACADEMIC_HARASSMENT", desc: "Hostile evaluation, denial of attendance, or victimization by institutional faculty or management." },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    if (activeCategory !== "ALL" && faq.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return faq.q.toLowerCase().includes(q) || faq.a.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="bg-brand-midnight text-brand-warm min-h-[calc(100vh-140px)] py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[300px] bg-brand-inst/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-[500px] h-[300px] bg-brand-teal/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-surface border border-brand-inst/30 rounded-full text-brand-ice text-xs font-mono tracking-wide">
            <span>REGULATORY ASSISTANCE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Help, Guidelines & FAQs
          </h1>
          <p className="text-brand-neutral text-base sm:text-lg leading-relaxed">
            Procedural rules, grievance classification standards, and operational guidelines for complainants, technical institutions, and administrative bureau officials.
          </p>

          {/* Search */}
          <div className="mt-4 max-w-md relative">
            <Search className="w-4 h-4 text-brand-neutral absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search FAQs by keyword (e.g. refund, SLA, notice)..."
              className="w-full pl-10 pr-4 py-2.5 text-xs border border-brand-surface rounded-xl bg-brand-deep text-brand-warm placeholder:text-brand-neutral/60 focus:outline-hidden focus:border-brand-ice"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-brand-surface pb-3">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeCategory === c.id
                  ? "bg-brand-inst text-white font-semibold"
                  : "bg-brand-surface text-brand-neutral hover:text-white hover:bg-brand-surface/80"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Accordion FAQs */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center text-brand-neutral bg-brand-deep/80 rounded-xl border border-brand-surface text-xs">
              No FAQs matching &quot;{searchQuery}&quot;. Try a different search term.
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isExpanded = expandedIndex === index;
              return (
                <div
                  key={index}
                  className="bg-brand-deep/80 rounded-xl border border-brand-surface overflow-hidden hover:border-brand-ice/30 transition-all"
                >
                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between hover:bg-brand-surface/30 transition-colors"
                  >
                    <span className="font-semibold text-white text-sm pr-4">
                      {faq.q}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-brand-ice shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-brand-neutral shrink-0" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 text-xs text-brand-neutral leading-relaxed border-t border-brand-surface/60 bg-brand-midnight/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Recognized AICTE Grievance Categories Guide */}
        <section id="categories" className="space-y-5 pt-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Recognized Grievance Categories
            </h2>
            <p className="text-brand-neutral text-xs mt-1">
              Standardized statutory classification under the AICTE Approval Process Handbook (APH 2025-26).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grievanceCategories.map((g) => (
              <div
                key={g.code}
                className="p-5 bg-brand-deep/80 rounded-xl border border-brand-surface space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white text-xs">{g.title}</h3>
                  <span className="font-mono text-[9px] bg-brand-surface text-brand-ice px-2 py-0.5 rounded border border-brand-surface font-medium">
                    {g.code}
                  </span>
                </div>
                <p className="text-xs text-brand-neutral leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Whistleblower Protection Notice */}
        <section className="p-6 rounded-2xl bg-brand-surface/50 border border-brand-inst/30 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-brand-ice" />
            <span>Whistleblower & Confidentiality Disclosure</span>
          </h3>
          <p className="text-xs text-brand-neutral leading-relaxed">
            CaseBridge AI enforces strict separation between public complainant metadata and institutional notice records. If you elect confidential reporting, your name and contact details are stored in an encrypted administrative enclave and never shared with the respondent college.
          </p>
        </section>
      </div>
    </div>
  );
}
