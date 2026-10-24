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
    <div className="min-h-[calc(100vh-140px)] bg-[#0B1C2D] text-[#F5F3ED] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col justify-center">
      {/* Background Architectural Geometry */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#142C46_1px,transparent_1px),linear-gradient(to_bottom,#142C46_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full relative z-10 space-y-8">
        {/* Institutional Authority Bar */}
        <div className="text-center space-y-3">
          {/* Institutional Emblems Dual Bar */}
          <div className="flex items-center justify-center gap-6 pb-2">
            <div className="flex items-center gap-3">
              <img
                src="/branding/gov-india-emblem.png"
                alt="Government of India Emblem"
                className="h-9 w-auto object-contain"
              />
              <div className="h-6 w-px bg-slate-700/80" />
              <div className="w-10 h-10 rounded-md bg-white p-1 flex items-center justify-center shadow-md border border-slate-700">
                <img
                  src="/branding/aicte-logo.png"
                  alt="AICTE Official Logo"
                  className="w-8 h-8 object-contain"
                />
              </div>
            </div>
          </div>

          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#142C46] border border-[#657386]/40 text-[#EAF0F6] text-xs font-mono tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#1769AA] animate-pulse" />
            <span>ALL INDIA COUNCIL FOR TECHNICAL EDUCATION • SIH 2026</span>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-1">
            <div className="text-center">
              <div className="text-2xl font-extrabold tracking-tight text-white flex items-center justify-center space-x-2">
                <span>CaseBridge</span>
                <span className="text-[#1769AA]">AI</span>
                <span className="text-[10px] font-mono font-normal uppercase px-1.5 py-0.5 rounded bg-[#142C46] border border-[#657386]/40 text-[#AEBBCD]">
                  SIH26264
                </span>
              </div>
              <p className="text-xs text-[#AEBBCD] font-medium mt-1">
                Integrated Case Monitoring & Cross-Bureau Resolution Workspace
              </p>
            </div>
          </div>
        </div>

        {/* Login Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Context & Public Portals */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#142C46]/80 border border-[#D9E0E7]/20 rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-slate-300">
                Operational Authentication
              </h2>
              <p className="text-xs text-[#AEBBCD] leading-relaxed">
                CaseBridge AI restricts administrative case access to authorized bureau officers and verified technical institutions. Decisions are cryptographically audited and role-isolated.
              </p>

              <div className="pt-2 border-t border-[#657386]/30 space-y-2.5 text-xs">
                <div className="flex items-start space-x-2 text-[#F5F3ED]/90">
                  <CheckCircle2 className="w-4 h-4 text-[#287A55] shrink-0 mt-0.5" />
                  <span>Cross-Bureau Overlap Triage (PGRC, Regulation, Approval, Legal)</span>
                </div>
                <div className="flex items-start space-x-2 text-[#F5F3ED]/90">
                  <CheckCircle2 className="w-4 h-4 text-[#287A55] shrink-0 mt-0.5" />
                  <span>Explainable Multi-Factor Scoring with Zero Unilateral Merges</span>
                </div>
                <div className="flex items-start space-x-2 text-[#F5F3ED]/90">
                  <CheckCircle2 className="w-4 h-4 text-[#287A55] shrink-0 mt-0.5" />
                  <span>Permanent Institute ID (PID) Data Isolation</span>
                </div>
              </div>
            </div>

            {/* Public Grievance Shortcut */}
            <div className="bg-[#142C46]/40 border border-[#D9E0E7]/10 rounded-xl p-5 space-y-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-white">
                <Users className="w-4 h-4 text-[#8DBAFF]" />
                <span>Citizen & Student Access</span>
              </div>
              <p className="text-[11px] text-[#AEBBCD]">
                Citizens and students do not require credentials to lodge or track complaints.
              </p>
              <div className="flex gap-2 pt-1">
                <Link
                  href="/complaints/register"
                  className="flex-1 py-2 px-3 text-center bg-[#1769AA] hover:bg-blue-600 text-white rounded text-xs font-semibold transition-colors"
                >
                  Lodge Complaint
                </Link>
                <Link
                  href="/track-complaint"
                  className="flex-1 py-2 px-3 text-center bg-[#142C46] hover:bg-slate-700 border border-[#657386]/40 text-slate-200 rounded text-xs font-medium transition-colors"
                >
                  Track Status
                </Link>
              </div>
            </div>

            {/* Asset Dependency Notice */}
            <div className="p-3 bg-[#080E18]/60 border border-[#657386]/20 rounded-lg text-[10px] text-slate-400 font-mono leading-relaxed">
              [ASSET DEPENDENCY] Official emblems of Government of India and AICTE are reserved for production statutory deployment. All demonstration data herein is synthetic.
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-7 bg-[#FFFFFF] text-[#0B1C2D] rounded-xl shadow-2xl border border-[#D9E0E7] p-6 sm:p-8 space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-[#D9E0E7]">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("official");
                  setError(null);
                }}
                className={`flex-1 py-2.5 text-xs font-semibold border-b-2 text-center transition-colors ${
                  activeTab === "official"
                    ? "border-[#1769AA] text-[#1769AA]"
                    : "border-transparent text-slate-500 hover:text-slate-800"
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
                className={`flex-1 py-2.5 text-xs font-semibold border-b-2 text-center transition-colors ${
                  activeTab === "institution"
                    ? "border-amber-600 text-amber-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Technical Institution
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-[#B42332] flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#B42332]" />
                <span>{error}</span>
              </div>
            )}

            {activeTab === "official" ? (
              <form onSubmit={handleOfficialSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Official Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. admin@aicte-india.org"
                      className="w-full text-xs pl-9 pr-3 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1769AA] focus:border-[#1769AA]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full text-xs pl-9 pr-10 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1769AA] focus:border-[#1769AA]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-[#1769AA] hover:bg-blue-700 text-white font-semibold text-xs rounded-md shadow transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
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
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    Quick-Sign Demonstration Personas (SIH Evaluation):
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickPersonaSelect("admin@aicte-india.org", "admin@2026")}
                      className="text-left p-2 rounded border border-slate-200 hover:border-[#1769AA] hover:bg-blue-50 transition-colors text-[11px]"
                    >
                      <div className="font-semibold text-slate-900">Dr. Abhay Jere</div>
                      <div className="text-slate-500">Chief Vigilance (ADMIN)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickPersonaSelect("review.officer@aicte-india.org", "admin@2026")}
                      className="text-left p-2 rounded border border-slate-200 hover:border-[#1769AA] hover:bg-blue-50 transition-colors text-[11px]"
                    >
                      <div className="font-semibold text-slate-900">Smt. Meenakshi Rao</div>
                      <div className="text-slate-500">Joint Review (REVIEWER)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickPersonaSelect("pgrc.director@aicte-india.org", "admin@2026")}
                      className="text-left p-2 rounded border border-slate-200 hover:border-[#1769AA] hover:bg-blue-50 transition-colors text-[11px]"
                    >
                      <div className="font-semibold text-slate-900">Dr. Mamta Agarwal</div>
                      <div className="text-slate-500">Advisor (PGRC Bureau)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickPersonaSelect("regulation.cell@aicte-india.org", "admin@2026")}
                      className="text-left p-2 rounded border border-slate-200 hover:border-[#1769AA] hover:bg-blue-50 transition-colors text-[11px]"
                    >
                      <div className="font-semibold text-slate-900">Shri R. K. Srivastav</div>
                      <div className="text-slate-500">Dir. Regulation Bureau</div>
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
                  Approved technical institutions must authenticate using their registered AICTE institute email and official access key.
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Registered Institutional Email *
                    </label>
                    <input
                      type="email"
                      value={instEmail}
                      onChange={(e) => setInstEmail(e.target.value)}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Institutional Access Key *
                    </label>
                    <div className="relative">
                      <input
                        type={showInstKey ? "text" : "password"}
                        value={instKey}
                        onChange={(e) => setInstKey(e.target.value)}
                        className="w-full text-xs p-2.5 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowInstKey(!showInstKey)}
                        className="absolute right-3 top-3 text-slate-400"
                      >
                        {showInstKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Link
                    href={`/institution/dashboard?institution_id=1-10492811`}
                    className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-md shadow flex items-center justify-center space-x-2 transition-colors"
                  >
                    <span>Sign In to Institutional Compliance Desk</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="text-center pt-2">
                    <Link
                      href="/institution/login"
                      className="text-xs text-amber-700 hover:underline font-medium"
                    >
                      Open Full Institutional Portal & Account Switcher &rarr;
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
    <Suspense fallback={<div className="min-h-screen bg-[#0B1C2D] flex items-center justify-center text-white">Loading CaseBridge Authentication...</div>}>
      <LoginForm />
    </Suspense>
  );
}
