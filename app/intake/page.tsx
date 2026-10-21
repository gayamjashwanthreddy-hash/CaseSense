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
      {/* Header */}
      <div className="pb-3 border-b border-slate-200">
        <Breadcrumbs items={[{ label: "Complaint Intake" }]} />
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <FilePlus2 className="w-5 h-5 text-blue-700" />
          <span>New Regulatory Grievance Registration</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          AICTE multi-bureau centralized intake protocol with proactive overlap screening.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Target Institution Lookup */}
        <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-700" />
              <span>1. Institution Identification</span>
            </h2>
            <p className="text-xs text-slate-500">
              Select or search target technical college using permanent AICTE credentials.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-800">
              Select Institution from AICTE Registry: <span className="text-rose-600">*</span>
            </label>
            <select
              {...register("institutionId")}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="">— Select Registered Institution —</option>
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.id} &bull; {i.name} ({i.district}, {i.state})
                </option>
              ))}
            </select>
            {errors.institutionId && (
              <p className="text-rose-600 text-[11px] font-medium">{errors.institutionId.message}</p>
            )}
          </div>

          {/* Autopopulated details if institution is selected */}
          {selectedInst && (
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Jurisdiction</span>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {selectedInst.district}, {selectedInst.state}
                </div>
                <div className="text-[11px] text-slate-500">{selectedInst.region}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Affiliated Body</span>
                <div className="font-semibold text-slate-800 mt-0.5 line-clamp-1">
                  {selectedInst.affiliatedUniversity}
                </div>
                <div className="text-[11px] text-slate-500">{selectedInst.category}</div>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Approval Status</span>
                <div className="font-semibold text-slate-800 mt-0.5">{selectedInst.approvalStatus}</div>
                <div className="text-[11px] text-slate-500">{selectedInst.accreditation}</div>
              </div>
            </div>
          )}

          {/* Proactive Duplicate / Overlap Pre-screening Alert */}
          {activeInstCasesCount > 0 && (
            <div className="p-3.5 bg-amber-50 border-l-4 border-l-amber-600 border border-amber-200 rounded text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Proactive Overlap Advisory</span>
              </div>
              <p className="text-amber-800 leading-relaxed text-[11px]">
                Notice: <strong>{activeInstCasesCount} active complaints</strong> are currently open against this institution in other AICTE bureaus. Submitting this complaint will automatically generate an inter-bureau coordination alert to prevent fragmented parallel inquiries.
              </p>
            </div>
          )}
        </div>

        {/* Section 2: Administrative Categorization */}
        <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900">
              2. Bureau Categorization & Urgency
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Receiving Bureau / Cell: <span className="text-rose-600">*</span>
              </label>
              <select
                {...register("bureau")}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="PGRC">Public Grievance Redressal (PGRC)</option>
                <option value="REGULATION">Regulation Bureau (RB)</option>
                <option value="APPROVAL">Approval Bureau (AB)</option>
                <option value="LEGAL">Legal Cell</option>
                <option value="CPGRAMS">CPGRAMS / PMO Desk</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Grievance Category: <span className="text-rose-600">*</span>
              </label>
              <select
                {...register("category")}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
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

            <div>
              <label className="font-semibold text-slate-800 block mb-1">
                Initial Priority Assessment: <span className="text-rose-600">*</span>
              </label>
              <select
                {...register("priority")}
                className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="HIGH">High (30 Day SLA)</option>
                <option value="CRITICAL">Critical (Court Directive / Immediate Safety)</option>
                <option value="MEDIUM">Medium (Standard Procedural)</option>
                <option value="LOW">Routine</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Grievance Narrative */}
        <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-900">
              3. Allegation Narrative & Evidence
            </h2>
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-800">
              Summary Subject of Complaint: <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Demanding mandatory Rs. 50,000 caution deposit before degree certificate issuance"
              {...register("subject")}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {errors.subject && (
              <p className="text-rose-600 text-[11px] font-medium">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-800">
              Detailed Allegations & Fact Narrative: <span className="text-rose-600">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="State the exact timeline, dates, departments, named officials, and specific violations..."
              {...register("description")}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {errors.description && (
              <p className="text-rose-600 text-[11px] font-medium">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Section 4: Complainant Details */}
        <div className="bg-white p-5 rounded-md border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              4. Complainant Identification
            </h2>

            <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                {...register("isAnonymous")}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
              />
              <span className="font-medium text-slate-700">Lodge as Confidential Whistleblower</span>
            </label>
          </div>

          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">Complainant Category:</label>
                <select
                  {...register("complainantType")}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <option value="Student">Enrolled Student</option>
                  <option value="Faculty Member">Faculty / Staff Member</option>
                  <option value="Parent Association">Parent Association / Guardian</option>
                  <option value="Citizen / Public">Citizen / General Public</option>
                  <option value="Institutional Officer">Institutional Officer / Inspector</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Full Name:</label>
                <input
                  type="text"
                  placeholder="Complainant Name"
                  {...register("complainantName")}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Email (for statutory notices):</label>
                <input
                  type="email"
                  placeholder="complainant@example.com"
                  {...register("complainantEmail")}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
          )}

          {isAnonymous && (
            <div className="p-3 bg-slate-100 rounded text-slate-700 text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Whistleblower Protection active: Identity fields will be masked across all public and institutional notice records.
              </span>
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => router.push("/cases")}
            className="px-4 py-2 text-xs text-slate-700 hover:bg-slate-200 rounded font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded-md shadow-sm transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Admit & Register Complaint"}
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
        <div className="py-12 text-center text-xs text-slate-500">
          Loading AICTE complaint intake form...
        </div>
      }
    >
      <ComplaintIntakeContent />
    </Suspense>
  );
}
