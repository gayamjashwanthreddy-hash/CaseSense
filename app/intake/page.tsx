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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[#E3E5DE]">
        <div>
          <Breadcrumbs items={[{ label: "Complaint Intake" }]} />
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#20231F] tracking-tight mt-1 flex items-center gap-2.5">
            <FilePlus2 className="w-6 h-6 text-[#344B3B]" />
            <span>AICTE Centralized Grievance Intake</span>
          </h1>
          <p className="text-xs text-[#62665F] font-mono mt-1 max-w-2xl">
            Multi-bureau statutory intake protocol with instantaneous entity resolution and cross-cell overlap detection.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section 1: Target Institution Lookup */}
        <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-4">
          <div className="border-b border-[#E3E5DE] pb-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-bold text-[#20231F] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#344B3B]" />
                <span>1. Institution Identification</span>
              </h2>
              <p className="text-xs text-[#62665F] mt-0.5 font-mono">
                Select target technical college using permanent AICTE credentials.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#20231F] block">
              Select Institution from AICTE Registry: <span className="text-[#B42332]">*</span>
            </label>
            <select
              {...register("institutionId")}
              className="w-full text-xs bg-[#F7F7F4] border border-[#E3E5DE] rounded-md px-3.5 py-2.5 text-[#20231F] font-semibold focus:outline-none focus:ring-1 focus:ring-[#526B57] font-sans"
            >
              <option value="">— Select Registered Institution —</option>
              {institutions.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.id} &bull; {i.name} ({i.district}, {i.state})
                </option>
              ))}
            </select>
            {errors.institutionId && (
              <p className="text-[#B42332] text-[11px] font-semibold mt-1 font-mono">{errors.institutionId.message}</p>
            )}
          </div>

          {/* Autopopulated details if institution is selected */}
          {selectedInst && (
            <div className="bg-[#F7F7F4] p-4 rounded-lg border border-[#E3E5DE] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-[#62665F] uppercase font-bold tracking-wider font-mono">Jurisdiction</span>
                <div className="font-bold text-[#20231F] mt-0.5">
                  {selectedInst.district}, {selectedInst.state}
                </div>
                <div className="text-[11px] text-[#62665F]">{selectedInst.region} Region</div>
              </div>
              <div>
                <span className="text-[10px] text-[#62665F] uppercase font-bold tracking-wider font-mono">Affiliated Body</span>
                <div className="font-bold text-[#20231F] mt-0.5 line-clamp-1">
                  {selectedInst.affiliatedUniversity}
                </div>
                <div className="text-[11px] text-[#62665F]">{selectedInst.category}</div>
              </div>
              <div>
                <span className="text-[10px] text-[#62665F] uppercase font-bold tracking-wider font-mono">Approval Status</span>
                <div className="font-bold text-[#20231F] mt-0.5">{selectedInst.approvalStatus}</div>
                <div className="text-[11px] text-[#62665F] font-mono">{selectedInst.accreditation}</div>
              </div>
            </div>
          )}

          {/* Proactive Duplicate / Overlap Pre-screening Alert */}
          {activeInstCasesCount > 0 && (
            <div className="p-4 bg-[#FBF1DB] border-l-4 border-l-[#925C0B] border border-[#925C0B]/25 rounded-md text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#925C0B]">
                <AlertTriangle className="w-4 h-4 text-[#925C0B]" />
                <span>Proactive Cross-Bureau Overlap Advisory</span>
              </div>
              <p className="text-[#925C0B]/90 leading-relaxed text-[11px]">
                Notice: <strong>{activeInstCasesCount} active complaints</strong> are currently open against this institution in other AICTE bureaus. Registering this complaint will trigger an automated inter-bureau coordination candidate to prevent fragmented parallel inquiries.
              </p>
            </div>
          )}
        </div>

        {/* Section 2: Administrative Categorization */}
        <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-4">
          <div className="border-b border-[#E3E5DE] pb-3">
            <h2 className="text-sm font-bold text-[#20231F]">
              2. Bureau Categorization &amp; Statutory Urgency
            </h2>
            <p className="text-xs text-[#62665F] mt-0.5 font-mono">
              Route to the competent AICTE regulatory cell and specify priority tier.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-[#20231F] block">
                Receiving Bureau / Cell: <span className="text-[#B42332]">*</span>
              </label>
              <select
                {...register("bureau")}
                className="w-full bg-[#F7F7F4] border border-[#E3E5DE] rounded-md px-3 py-2 text-[#20231F] font-semibold focus:outline-none focus:ring-1 focus:ring-[#526B57]"
              >
                <option value="PGRC">Public Grievance Redressal (PGRC)</option>
                <option value="REGULATION">Regulation Bureau (RB)</option>
                <option value="APPROVAL">Approval Bureau (AB)</option>
                <option value="LEGAL">Legal Cell</option>
                <option value="CPGRAMS">CPGRAMS / PMO Desk</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#20231F] block">
                Grievance Category: <span className="text-[#B42332]">*</span>
              </label>
              <select
                {...register("category")}
                className="w-full bg-[#F7F7F4] border border-[#E3E5DE] rounded-md px-3 py-2 text-[#20231F] font-semibold focus:outline-none focus:ring-1 focus:ring-[#526B57]"
              >
                <option value="CERTIFICATE_WITHHOLDING">Certificate / Transcript Withholding</option>
                <option value="CAPITATION_FEE">Capitation Fee &amp; Unauthorized Surcharges</option>
                <option value="FACULTY_IRREGULARITIES">Faculty Pay / Biometric / Ghost Profiles</option>
                <option value="INFRASTRUCTURE_DEFICIT">Infrastructure Deficit / Lab Equipment</option>
                <option value="ADMISSION_IRREGULARITIES">Admissions Exceeding Sanctioned Intake</option>
                <option value="UNAPPROVED_COURSES">Unapproved Programs / Degrees</option>
                <option value="ACADEMIC_HARASSMENT">Academic Harassment / Inactive Cell</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#20231F] block">
                Priority Assessment: <span className="text-[#B42332]">*</span>
              </label>
              <select
                {...register("priority")}
                className="w-full bg-[#F7F7F4] border border-[#E3E5DE] rounded-md px-3 py-2 text-[#20231F] font-semibold focus:outline-none focus:ring-1 focus:ring-[#526B57]"
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
        <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-4">
          <div className="border-b border-[#E3E5DE] pb-3">
            <h2 className="text-sm font-bold text-[#20231F]">
              3. Allegation Narrative &amp; Evidentiary Statement
            </h2>
            <p className="text-xs text-[#62665F] mt-0.5 font-mono">
              Concise summary and comprehensive narrative for natural justice scrutiny.
            </p>
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-[#20231F] block">
              Summary Subject of Complaint: <span className="text-[#B42332]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Demanding mandatory Rs. 50,000 caution deposit before degree certificate issuance"
              {...register("subject")}
              className="w-full bg-[#F7F7F4] border border-[#E3E5DE] rounded-md px-3.5 py-2.5 text-[#20231F] font-semibold focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white font-sans"
            />
            {errors.subject && (
              <p className="text-[#B42332] text-[11px] font-semibold mt-1 font-mono">{errors.subject.message}</p>
            )}
          </div>

          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-[#20231F] block">
              Detailed Allegations &amp; Fact Narrative: <span className="text-[#B42332]">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="State the exact timeline, dates, departments, named officials, and specific regulatory violations..."
              {...register("description")}
              className="w-full bg-[#F7F7F4] border border-[#E3E5DE] rounded-md p-3.5 text-[#20231F] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white font-sans"
            />
            {errors.description && (
              <p className="text-[#B42332] text-[11px] font-semibold mt-1 font-mono">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Section 4: Complainant Details */}
        <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-4">
          <div className="border-b border-[#E3E5DE] pb-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-bold text-[#20231F]">
                4. Complainant Identification &amp; Statutory Notice Details
              </h2>
              <p className="text-xs text-[#62665F] mt-0.5 font-mono">
                Maintain confidential records or whistleblower protections.
              </p>
            </div>

            <label className="inline-flex items-center gap-2 cursor-pointer text-xs select-none bg-[#F7F7F4] px-3 py-1.5 rounded-md border border-[#E3E5DE]">
              <input
                type="checkbox"
                {...register("isAnonymous")}
                className="rounded border-[#E3E5DE] text-[#344B3B] focus:ring-[#526B57] w-4 h-4 accent-[#344B3B]"
              />
              <span className="font-bold text-[#20231F]">Lodge as Confidential Whistleblower</span>
            </label>
          </div>

          {!isAnonymous && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#20231F] block">Complainant Category:</label>
                <select
                  {...register("complainantType")}
                  className="w-full bg-[#F7F7F4] border border-[#E3E5DE] rounded-md px-3 py-2 text-[#20231F] focus:outline-none focus:ring-1 focus:ring-[#526B57] font-sans"
                >
                  <option value="Student">Enrolled Student</option>
                  <option value="Faculty Member">Faculty / Staff Member</option>
                  <option value="Parent Association">Parent Association / Guardian</option>
                  <option value="Citizen / Public">Citizen / General Public</option>
                  <option value="Institutional Officer">Institutional Officer / Inspector</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#20231F] block">Full Name:</label>
                <input
                  type="text"
                  placeholder="Complainant Name"
                  {...register("complainantName")}
                  className="w-full bg-[#F7F7F4] border border-[#E3E5DE] rounded-md px-3 py-2 text-[#20231F] focus:outline-none focus:ring-1 focus:ring-[#526B57] font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#20231F] block">Email (for official notices):</label>
                <input
                  type="email"
                  placeholder="complainant@example.com"
                  {...register("complainantEmail")}
                  className="w-full bg-[#F7F7F4] border border-[#E3E5DE] rounded-md px-3 py-2 text-[#20231F] focus:outline-none focus:ring-1 focus:ring-[#526B57] font-sans"
                />
              </div>
            </div>
          )}

          {isAnonymous && (
            <div className="p-4 bg-[#E8F4EC] border border-[#23734D]/25 rounded-md text-[#23734D] text-xs flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#23734D] shrink-0" />
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
            className="px-5 py-2.5 text-xs text-[#62665F] hover:text-[#20231F] hover:bg-[#F7F7F4] rounded-md font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-bold bg-[#344B3B] hover:bg-[#293D30] text-white rounded-md shadow-xs transition-colors flex items-center gap-2"
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
        <div className="py-20 text-center text-xs text-[#62665F] font-mono">
          Loading AICTE complaint intake form...
        </div>
      }
    >
      <ComplaintIntakeContent />
    </Suspense>
  );
}
