"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  FilePlus2,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Upload,
  User,
  ShieldCheck,
  Search,
  Shield,
  Send,
  Info,
} from "lucide-react";
import { CaseBridgeStore } from "@/lib/api/store";
import { Institution, BureauType, ComplaintCategory, PriorityLevel } from "@/lib/api/types";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { useRole } from "@/lib/context/RoleContext";
import { useToast } from "@/lib/context/ToastContext";

const intakeSchema = z.object({
  institutionId: z.string().min(1, "Please select a technical institution"),
  bureau: z.enum(["PGRC", "REGULATION", "APPROVAL", "LEGAL", "CPGRAMS"]),
  category: z.enum([
    "CAPITATION_FEE",
    "CERTIFICATE_WITHHOLDING",
    "FACULTY_IRREGULARITIES",
    "INFRASTRUCTURE_DEFICIT",
    "ADMISSION_IRREGULARITIES",
    "UNAPPROVED_COURSES",
    "ACADEMIC_HARASSMENT",
  ]),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  subject: z.string().min(10, "Subject must be at least 10 characters"),
  description: z.string().min(30, "Allegation statement must be at least 30 characters for scrutiny"),
  complainantType: z.enum([
    "Student",
    "Faculty Member",
    "Parent Association",
    "Citizen / Public",
    "Institutional Officer",
    "Anonymous Whistleblower",
  ]),
  complainantName: z.string().optional(),
  complainantEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  complainantPhone: z.string().optional(),
  isAnonymous: z.boolean().default(false),
});

type IntakeFormValues = z.infer<typeof intakeSchema>;

function ComplaintIntakeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedInstId = searchParams.get("institutionId");
  const { currentUser } = useRole();
  const { toast } = useToast();

  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInst, setSelectedInst] = useState<Institution | null>(null);
  const [activeInstCasesCount, setActiveInstCasesCount] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<IntakeFormValues>({
    resolver: zodResolver(intakeSchema),
    defaultValues: {
      institutionId: preselectedInstId || "",
      bureau: currentUser.bureau || "PGRC",
      category: "CERTIFICATE_WITHHOLDING",
      priority: "HIGH",
      complainantType: "Student",
      complainantName: "",
      complainantEmail: "",
      complainantPhone: "",
      isAnonymous: false,
      subject: "",
      description: "",
    },
  });

  const watchedInstId = watch("institutionId");
  const isAnonymous = watch("isAnonymous");

  useEffect(() => {
    CaseBridgeStore.init();
    const insts = CaseBridgeStore.getInstitutions();
    setInstitutions(insts);

    if (preselectedInstId) {
      const match = insts.find((i) => i.id === preselectedInstId);
      if (match) {
        setSelectedInst(match);
        setValue("institutionId", match.id);
        const existing = CaseBridgeStore.getCases({ institutionId: match.id }).filter(
          (c) => c.status !== "RESOLVED"
        );
        setActiveInstCasesCount(existing.length);
      }
    }
  }, [preselectedInstId, setValue]);

  useEffect(() => {
    if (watchedInstId) {
      const match = institutions.find((i) => i.id === watchedInstId);
      if (match) {
        setSelectedInst(match);
        const existing = CaseBridgeStore.getCases({ institutionId: match.id }).filter(
          (c) => c.status !== "RESOLVED"
        );
        setActiveInstCasesCount(existing.length);
      }
    } else {
      setSelectedInst(null);
      setActiveInstCasesCount(0);
    }
  }, [watchedInstId, institutions]);

  const onSubmit = (data: IntakeFormValues) => {
    try {
      const createdCase = CaseBridgeStore.createCase({
        institutionId: data.institutionId,
        bureau: data.bureau,
        category: data.category,
        subject: data.subject,
        description: data.description,
        complainantName: data.isAnonymous ? "Anonymous Whistleblower" : data.complainantName || "Complainant",
        complainantType: data.isAnonymous ? "Anonymous Whistleblower" : data.complainantType,
        complainantEmail: data.complainantEmail || undefined,
        complainantPhone: data.complainantPhone || undefined,
        isAnonymous: data.isAnonymous,
        priority: data.priority,
        assignedOfficer: currentUser.name,
      });

      toast({
        title: "Complaint Intake Registered",
        message: `Generated Case ID ${createdCase.id}. Preliminary scrutiny initiated.`,
        type: "success",
      });

      router.push(`/cases/${encodeURIComponent(createdCase.id)}`);
    } catch (e) {
      console.error(e);
      toast({
        title: "Submission Error",
        message: "Failed to record complaint intake.",
        type: "error",
      });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header - Editorial Dark Strip */}
      <div className="bg-[#0A1626] text-white p-6 rounded-2xl border border-[#142C46] shadow-xl space-y-3">
        <Breadcrumbs items={[{ label: "Complaint Intake" }]} />
        <div className="pt-1">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FilePlus2 className="w-6 h-6 text-blue-400" />
            <span>AICTE Centralized Grievance Intake</span>
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Multi-bureau statutory intake protocol with instantaneous entity resolution and cross-cell overlap detection.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Target Institution Lookup */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-700" />
                <span>1. Institution Identification</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Select target technical college using permanent AICTE credentials.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">
              Select Institution from AICTE Registry: <span className="text-rose-600">*</span>
            </label>
            <select
              {...register("institutionId")}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans"
            >
              <option value="">— Select Registered Institution —</option>
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.id} &bull; {i.name} ({i.district}, {i.state})
                </option>
              ))}
            </select>
            {errors.institutionId && (
              <p className="text-rose-600 text-[11px] font-semibold mt-1">{errors.institutionId.message}</p>
            )}
          </div>

          {/* Autopopulated details if institution is selected */}
          {selectedInst && (
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Jurisdiction</span>
                <div className="font-bold text-slate-900 mt-0.5">
                  {selectedInst.district}, {selectedInst.state}
                </div>
                <div className="text-[11px] text-slate-500">{selectedInst.region} Region</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Affiliated Body</span>
                <div className="font-bold text-slate-900 mt-0.5 line-clamp-1">
                  {selectedInst.affiliatedUniversity}
                </div>
                <div className="text-[11px] text-slate-500">{selectedInst.category}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Approval Status</span>
                <div className="font-bold text-slate-900 mt-0.5">{selectedInst.approvalStatus}</div>
                <div className="text-[11px] text-slate-500 font-mono">{selectedInst.accreditation}</div>
              </div>
            </div>
          )}

          {/* Proactive Duplicate / Overlap Pre-screening Alert */}
          {activeInstCasesCount > 0 && (
            <div className="p-4 bg-amber-500/10 border-l-4 border-l-amber-600 border border-amber-500/30 rounded-xl text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Proactive Cross-Bureau Overlap Advisory</span>
              </div>
              <p className="text-amber-900/80 leading-relaxed text-[11px]">
                Notice: <strong>{activeInstCasesCount} active complaints</strong> are currently open against this institution in other AICTE bureaus. Registering this complaint will trigger an automated inter-bureau coordination candidate to prevent fragmented parallel inquiries.
              </p>
            </div>
          )}
        </div>

        {/* Section 2: Administrative Categorization */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              2. Bureau Categorization & Statutory Urgency
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Route to the competent AICTE regulatory cell and specify priority tier.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block">
                Receiving Bureau / Cell: <span className="text-rose-600">*</span>
              </label>
              <select
                {...register("bureau")}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="PGRC">Public Grievance Redressal (PGRC)</option>
                <option value="REGULATION">Regulation Bureau (RB)</option>
                <option value="APPROVAL">Approval Bureau (AB)</option>
                <option value="LEGAL">Legal Cell</option>
                <option value="CPGRAMS">CPGRAMS / PMO Desk</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block">
                Grievance Category: <span className="text-rose-600">*</span>
              </label>
              <select
                {...register("category")}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="CERTIFICATE_WITHHOLDING">Certificate / Transcript Withholding</option>
                <option value="CAPITATION_FEE">Capitation Fee & Unauthorized Surcharges</option>
                <option value="FACULTY_IRREGULARITIES">Faculty Pay / Biometric / Ghost Profiles</option>
                <option value="INFRASTRUCTURE_DEFICIT">Infrastructure Deficit / Lab Equipment</option>
                <option value="ADMISSION_IRREGULARITIES">Admissions Exceeding Sanctioned Intake</option>
                <option value="UNAPPROVED_COURSES">Unapproved Programs / Degrees</option>
                <option value="ACADEMIC_HARASSMENT">Academic Harassment / Inactive Cell</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 block">
                Priority Assessment: <span className="text-rose-600">*</span>
              </label>
              <select
                {...register("priority")}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="HIGH">High (30-Day Statutory SLA)</option>
                <option value="CRITICAL">Critical (Immediate Standing Order / Safety)</option>
                <option value="MEDIUM">Medium (Standard Procedural Review)</option>
                <option value="LOW">Routine Administration</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Grievance Narrative */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              3. Allegation Narrative & Evidentiary Statement
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Concise summary and comprehensive narrative for natural justice scrutiny.
            </p>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-800 block">
              Summary Subject of Complaint: <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Demanding mandatory Rs. 50,000 caution deposit before degree certificate issuance"
              {...register("subject")}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans"
            />
            {errors.subject && (
              <p className="text-rose-600 text-[11px] font-semibold mt-1">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-800 block">
              Detailed Allegations & Fact Narrative: <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="State the exact timeline, dates, departments, named officials, and specific regulatory violations..."
              {...register("description")}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans"
            />
            {errors.description && (
              <p className="text-rose-600 text-[11px] font-semibold mt-1">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Section 4: Complainant Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                4. Complainant Identification & Statutory Notice Details
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Maintain confidential records or whistleblower protections.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 cursor-pointer text-xs select-none bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                {...register("isAnonymous")}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span className="font-bold text-slate-800">Lodge as Confidential Whistleblower</span>
            </label>
          </div>

          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Complainant Category:</label>
                <select
                  {...register("complainantType")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans"
                >
                  <option value="Student">Enrolled Student</option>
                  <option value="Faculty Member">Faculty / Staff Member</option>
                  <option value="Parent Association">Parent Association / Guardian</option>
                  <option value="Citizen / Public">Citizen / General Public</option>
                  <option value="Institutional Officer">Institutional Officer / Inspector</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Full Name:</label>
                <input
                  type="text"
                  placeholder="Complainant Name"
                  {...register("complainantName")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">Email (for official notices):</label>
                <input
                  type="email"
                  placeholder="complainant@example.com"
                  {...register("complainantEmail")}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 font-sans"
                />
              </div>
            </div>
          )}

          {isAnonymous && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-950 text-xs flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Whistleblower Protection Active:</strong> Complainant personal details are redacted from public dossiers and institutional notice letters.
              </span>
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/cases")}
            className="px-5 py-2.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-bold bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-sm transition-colors flex items-center gap-2"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Registering..." : "Admit & Register Complaint"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ComplaintIntakePage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-xs text-slate-500">
          Loading AICTE complaint intake form...
        </div>
      }
    >
      <ComplaintIntakeContent />
    </Suspense>
  );
}
