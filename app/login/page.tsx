"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Scale,
  Users,
  Search,
  KeyRound,
} from "lucide-react";
import { useRole } from "@/lib/context/RoleContext";
import { useToast } from "@/lib/context/ToastContext";
import { SEED_USERS } from "@/lib/api/seedData";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams ? searchParams.get("redirect") || "/dashboard" : "/dashboard";

  const { login, setCurrentUser } = useRole();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"official" | "institution">("official");
  const [email, setEmail] = useState("admin@aicte-india.org");
  const [password, setPassword] = useState("admin@2026");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Institution credentials state
  const [instEmail, setInstEmail] = useState("registrar@apextech-pune.ac.in");
  const [instKey, setInstKey] = useState("apex@compliance2026");
  const [showInstKey, setShowInstKey] = useState(false);

  const handleOfficialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please provide your official AICTE email and password.");
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const res = await login(email, password);
      setIsLoading(false);
      if (res.success) {
        toast("Authenticated successfully. Redirecting to CaseBridge workspace...", "success");
        router.push(redirectPath);
      } else {
        setError(res.error || "Incorrect credentials. Please verify your email and password.");
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err?.message || "An unexpected error occurred during authentication.");
    }
  };

  const handleQuickPersonaSelect = async (userEmail: string, pass: string) => {
    setEmail(userEmail);
    setPassword(pass);
    setError(null);
    setIsLoading(true);

    const res = await login(userEmail, pass);
    setIsLoading(false);
    if (res.success) {
      toast("Persona authenticated. Access granted.", "success");
      router.push(redirectPath);
    } else {
      // Find seed user for instant fallback
      const match = SEED_USERS.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
      if (match) {
        setCurrentUser(match);
        toast(`Signed in as ${match.name} (${match.role})`, "success");
        router.push(redirectPath);
      } else {
        setError(res.error || "Authentication failed.");
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#F7F7F4] text-[#20231F] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center">
      {/* Subtle Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#E3E5DE_1px,transparent_1px),linear-gradient(to_bottom,#E3E5DE_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full relative z-10 space-y-8">
        {/* Institutional Authority Bar */}
        <div className="text-center space-y-3">
          {/* Institutional Emblems Dual Bar */}
          <div className="flex items-center justify-center gap-5 pb-1">
            <img
              src="/branding/gov-india-emblem.png"
              alt="Government of India Emblem"
              className="h-10 w-auto object-contain"
            />
            <div className="h-6 w-px bg-[#D4D8CF]" />
            <div className="w-10 h-10 rounded-md bg-white p-1 flex items-center justify-center border border-[#E3E5DE] shadow-2xs">
              <img
                src="/branding/aicte-logo.png"
                alt="AICTE Official Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E8EEE7] border border-[#344B3B]/20 text-[#344B3B] text-[11px] font-mono tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#344B3B] animate-pulse" />
            <span>ALL INDIA COUNCIL FOR TECHNICAL EDUCATION • SIH 2026</span>
          </div>

          <div className="pt-1">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#20231F] tracking-tight">
              Institutional Access &amp; Case Verification
            </h1>
            <p className="text-xs text-[#62665F] font-mono mt-1">
              Integrated Multi-Bureau Grievance Redressal &amp; Regulatory Intelligence System
            </p>
          </div>
        </div>

        {/* Login Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Context & Public Portals */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E3E5DE] rounded-xl p-6 shadow-xs space-y-4">
              <h2 className="text-xs font-bold text-[#20231F] uppercase tracking-wider font-mono">
                Operational Authentication
              </h2>
              <p className="text-xs text-[#62665F] leading-relaxed">
                CaseSense restricts administrative case access to authorized bureau officers and verified technical institutions. Decisions are cryptographically audited and role-isolated.
              </p>

              <div className="pt-2 border-t border-[#E3E5DE] space-y-2.5 text-xs">
                <div className="flex items-start space-x-2 text-[#20231F]">
                  <CheckCircle2 className="w-4 h-4 text-[#23734D] shrink-0 mt-0.5" />
                  <span>Cross-Bureau Overlap Triage (PGRC, Regulation, Approval, Legal)</span>
                </div>
                <div className="flex items-start space-x-2 text-[#20231F]">
                  <CheckCircle2 className="w-4 h-4 text-[#23734D] shrink-0 mt-0.5" />
                  <span>Explainable Multi-Factor Scoring with Zero Unilateral Merges</span>
                </div>
                <div className="flex items-start space-x-2 text-[#20231F]">
                  <CheckCircle2 className="w-4 h-4 text-[#23734D] shrink-0 mt-0.5" />
                  <span>Permanent Institute ID (PID) Data Isolation</span>
                </div>
              </div>
            </div>

            {/* Public Grievance Shortcut */}
            <div className="bg-white border border-[#E3E5DE] rounded-xl p-5 shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#20231F]">
                <Users className="w-4 h-4 text-[#344B3B]" />
                <span>Citizen &amp; Student Access</span>
              </div>
              <p className="text-[11px] text-[#62665F]">
                Citizens and students do not require credentials to lodge or track complaints.
              </p>
              <div className="flex gap-2 pt-1 font-mono">
                <Link
                  href="/complaints/register"
                  className="flex-1 py-2 px-3 text-center bg-[#344B3B] hover:bg-[#293D30] text-white rounded-md text-xs font-semibold transition-colors"
                >
                  Lodge Complaint
                </Link>
                <Link
                  href="/track-complaint"
                  className="flex-1 py-2 px-3 text-center bg-[#F7F7F4] hover:bg-[#E8EEE7] border border-[#E3E5DE] text-[#20231F] rounded-md text-xs font-medium transition-colors"
                >
                  Track Status
                </Link>
              </div>
            </div>

            {/* Notice */}
            <div className="p-3 bg-[#F0F1ED] border border-[#E3E5DE] rounded-md text-[10px] text-[#62665F] font-mono leading-relaxed">
              [STATUTORY NOTICE] Official emblems of Government of India and AICTE are reserved for institutional statutory deployment. All demonstration data herein is synthetic.
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-7 bg-white text-[#20231F] rounded-xl shadow-xs border border-[#E3E5DE] p-6 sm:p-8 space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-[#E3E5DE]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("official");
                  setError(null);
                }}
                className={`flex-1 py-2.5 text-xs font-semibold border-b-2 text-center transition-colors font-mono ${
                  activeTab === "official"
                    ? "border-[#344B3B] text-[#344B3B]"
                    : "border-transparent text-[#62665F] hover:text-[#20231F]"
                }`}
              >
                AICTE Official / Reviewer
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("institution");
                  setError(null);
                }}
                className={`flex-1 py-2.5 text-xs font-semibold border-b-2 text-center transition-colors font-mono ${
                  activeTab === "institution"
                    ? "border-[#925C0B] text-[#925C0B]"
                    : "border-transparent text-[#62665F] hover:text-[#20231F]"
                }`}
              >
                Technical Institution
              </button>
            </div>

            {error && (
              <div className="p-3 bg-[#FBEAEC] border border-[#B42332]/25 rounded-md text-xs text-[#B42332] flex items-center space-x-2.5 font-mono">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#B42332]" />
                <span>{error}</span>
              </div>
            )}

            {activeTab === "official" ? (
              <form onSubmit={handleOfficialSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#20231F]">
                    Official Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#85877F] absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. admin@aicte-india.org"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-[#F7F7F4] border border-[#E3E5DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white text-[#20231F] font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#20231F]">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#85877F] absolute left-3 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full text-xs pl-9 pr-10 py-2.5 bg-[#F7F7F4] border border-[#E3E5DE] rounded-md focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white text-[#20231F] font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-[#85877F] hover:text-[#20231F]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#344B3B] hover:bg-[#293D30] text-white font-semibold text-xs rounded-md shadow-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In to Official Console</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Demonstration Persona Quick-Select */}
                <div className="pt-4 border-t border-[#E3E5DE] space-y-2">
                  <div className="text-[11px] font-mono text-[#62665F] uppercase tracking-wider">
                    Quick-Sign Demonstration Personas (SIH Evaluation):
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickPersonaSelect("admin@aicte-india.org", "admin@2026")}
                      className="text-left p-2.5 rounded-md border border-[#E3E5DE] hover:border-[#344B3B] hover:bg-[#E8EEE7] transition-colors text-[11px]"
                    >
                      <div className="font-semibold text-[#20231F]">Dr. Abhay Jere</div>
                      <div className="text-[#62665F] text-[10px] font-mono">Chief Vigilance (ADMIN)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickPersonaSelect("review.officer@aicte-india.org", "admin@2026")}
                      className="text-left p-2.5 rounded-md border border-[#E3E5DE] hover:border-[#344B3B] hover:bg-[#E8EEE7] transition-colors text-[11px]"
                    >
                      <div className="font-semibold text-[#20231F]">Smt. Meenakshi Rao</div>
                      <div className="text-[#62665F] text-[10px] font-mono">Joint Review (REVIEWER)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickPersonaSelect("pgrc.director@aicte-india.org", "admin@2026")}
                      className="text-left p-2.5 rounded-md border border-[#E3E5DE] hover:border-[#344B3B] hover:bg-[#E8EEE7] transition-colors text-[11px]"
                    >
                      <div className="font-semibold text-[#20231F]">Dr. Mamta Agarwal</div>
                      <div className="text-[#62665F] text-[10px] font-mono">Advisor (PGRC Bureau)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickPersonaSelect("regulation.cell@aicte-india.org", "admin@2026")}
                      className="text-left p-2.5 rounded-md border border-[#E3E5DE] hover:border-[#344B3B] hover:bg-[#E8EEE7] transition-colors text-[11px]"
                    >
                      <div className="font-semibold text-[#20231F]">Shri R. K. Srivastav</div>
                      <div className="text-[#62665F] text-[10px] font-mono">Dir. Regulation Bureau</div>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-[#FBF1DB] border border-[#925C0B]/25 rounded-md text-xs text-[#925C0B]">
                  Approved technical institutions must authenticate using their registered AICTE institute email and official access key.
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#20231F] mb-1">
                      Registered Institutional Email *
                    </label>
                    <input
                      type="email"
                      value={instEmail}
                      onChange={(e) => setInstEmail(e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#F7F7F4] border border-[#E3E5DE] rounded-md focus:ring-1 focus:ring-[#526B57] focus:bg-white text-[#20231F]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#20231F] mb-1">
                      Institutional Access Key *
                    </label>
                    <div className="relative">
                      <input
                        type={showInstKey ? "text" : "password"}
                        value={instKey}
                        onChange={(e) => setInstKey(e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#F7F7F4] border border-[#E3E5DE] rounded-md focus:ring-1 focus:ring-[#526B57] focus:bg-white text-[#20231F]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowInstKey(!showInstKey)}
                        className="absolute right-3 top-3 text-[#85877F] hover:text-[#20231F]"
                      >
                        {showInstKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Link
                    href={`/institution/dashboard?institution_id=1-10492811`}
                    className="w-full py-2.5 px-4 bg-[#344B3B] hover:bg-[#293D30] text-white font-semibold text-xs rounded-md shadow-xs flex items-center justify-center space-x-2 transition-colors font-mono"
                  >
                    <span>Sign In to Institutional Compliance Desk</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="text-center pt-2">
                    <Link
                      href="/institution/login"
                      className="text-xs text-[#344B3B] hover:underline font-medium font-mono"
                    >
                      Open Full Institutional Portal &amp; Account Switcher &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F7F4] flex items-center justify-center text-[#62665F] font-mono text-xs">Loading CaseSense Authentication...</div>}>
      <LoginForm />
    </Suspense>
  );
}
