"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  FileText,
  User,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Search,
  Upload,
  Lock,
  Eye,
  Info,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { CaseBridgeStore } from "@/lib/api/store";
import { SupabaseDataService } from "@/lib/supabase/dataService";
import { Institution, ComplaintCategory, ComplainantType, ComplaintCase } from "@/lib/api/types";
import { useToast } from "@/lib/context/ToastContext";

const CATEGORIES: { label: string; value: ComplaintCategory; desc: string }[] = [
  { label: "Capitation & Excess Fee Collection", value: "CAPITATION_FEE", desc: "Charging fees above authorized regulatory thresholds or capitation fee demands." },
  { label: "Original Certificate Withholding", value: "CERTIFICATE_WITHHOLDING", desc: "Refusal to return original degree or mark sheets upon course completion or transfer." },
  { label: "Faculty Irregularities & Biometrics", value: "FACULTY_IRREGULARITIES", desc: "Ghost faculty rosters, salary non-disbursement, or forged biometric attendance." },
  { label: "Infrastructure & Lab Deficit", value: "INFRASTRUCTURE_DEFICIT", desc: "Non-existent laboratories, fire safety violations, or inadequate campus infrastructure." },
  { label: "Admission & Quota Irregularities", value: "ADMISSION_IRREGULARITIES", desc: "Admissions exceeding sanctioned seat intake or violations of reservation rules." },
  { label: "Unapproved Technical Courses", value: "UNAPPROVED_COURSES", desc: "Operating courses without mandatory AICTE Approval Process Handbook (APH) approval." },
  { label: "Academic Harassment", value: "ACADEMIC_HARASSMENT", desc: "Hostile evaluation, attendance tampering, or victimization by institutional staff." },
];

const COMPLAINANT_TYPES: ComplainantType[] = [
  "Student",
  "Faculty Member",
  "Parent Association",
  "Citizen / Public",
  "Anonymous Whistleblower",
];

export default function RegisterComplaintPage() {
  const router = useRouter();
  const { toast } = useToast();

  // Wizard Step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Available Institutions from Registry
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [instSearch, setInstSearch] = useState("");
  const [isUnlistedInstitution, setIsUnlistedInstitution] = useState(false);
  const [unlistedName, setUnlistedName] = useState("");
  const [unlistedCity, setUnlistedCity] = useState("");

  // Step 1: Selected Institution
  const [selectedInstId, setSelectedInstId] = useState<string>("");

  // Step 2: Complaint Details
  const [category, setCategory] = useState<ComplaintCategory>("CAPITATION_FEE");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [files, setFiles] = useState<{ id: string; name: string; size: string; type: string; uploadedAt: string }[]>([]);

  // Step 3: Complainant Details
  const [complainantName, setComplainantName] = useState("");
  const [complainantEmail, setComplainantEmail] = useState("");
  const [complainantPhone, setComplainantPhone] = useState("");
  const [complainantType, setComplainantType] = useState<ComplainantType>("Student");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);

  // Step 4: Overlap Screening State
  const [activeExistingCases, setActiveExistingCases] = useState<ComplaintCase[]>([]);
  const [screeningChecked, setScreeningChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    CaseBridgeStore.init();
    SupabaseDataService.getInstitutions().then((list) => {
      setInstitutions(list);
    });
  }, []);

  // Filtered institutions
  const filteredInstitutions = institutions.filter((inst) => {
    if (!instSearch.trim()) return true;
    const q = instSearch.toLowerCase();
    return (
      inst.name.toLowerCase().includes(q) ||
      inst.id.toLowerCase().includes(q) ||
      inst.state.toLowerCase().includes(q) ||
      inst.district.toLowerCase().includes(q)
    );
  });

  const selectedInst = institutions.find((i) => i.id === selectedInstId);

  // Validation per step
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!isUnlistedInstitution && !selectedInstId) {
        toast("Please select an institution from the registry or check the unlisted option.", "warning");
        return false;
      }
      if (isUnlistedInstitution && (!unlistedName.trim() || !unlistedCity.trim())) {
        toast("Please enter the name and location for the unlisted institution.", "warning");
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (!subject.trim()) {
        toast("Please provide a concise subject summarizing your grievance.", "warning");
        return false;
      }
      if (!description.trim() || description.trim().length < 25) {
        toast("Please provide a detailed factual description (at least 25 characters).", "warning");
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (!isAnonymous && !complainantName.trim()) {
        toast("Please enter your name or enable Whistleblower Confidentiality.", "warning");
        return false;
      }
      if (!complainantEmail.trim() || !complainantEmail.includes("@")) {
        toast("A valid email address is required to receive your tracking credentials.", "warning");
        return false;
      }
      if (!privacyConsent) {
        toast("You must acknowledge the verification and privacy declaration.", "warning");
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    // Moving into Step 4 (Screening): Check for active cases associated with selected institution
    if (currentStep === 3) {
      const targetInstId = isUnlistedInstitution ? "UNLISTED-INST" : selectedInstId;
      const allCases = CaseBridgeStore.getCases();
      const existing = allCases.filter(
        (c) => c.institutionId === targetInstId && c.status !== "RESOLVED"
      );
      setActiveExistingCases(existing);
      setScreeningChecked(true);
    }

    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Simulated File Upload
  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const newFile = {
      id: `DOC-${Date.now()}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || "Document",
      uploadedAt: new Date().toISOString().split("T")[0],
    };
    setFiles((prev) => [...prev, newFile]);
    toast(`Attached ${file.name} successfully.`, "info");
  };

  // Final Submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const targetInstId = isUnlistedInstitution ? "1-10492811" : selectedInstId; // fallback to seed inst for demo if unlisted

    try {
      const { newCase, trackingCode, refNumber } = await SupabaseDataService.createPublicComplaint({
        institutionId: targetInstId,
        category,
        subject,
        description,
        complainantName: isAnonymous ? "Confidential Complainant" : complainantName,
        complainantType,
        complainantEmail,
        complainantPhone,
        isAnonymous,
        evidenceFiles: files,
      });

      setIsSubmitting(false);
      toast("Grievance registered successfully in AICTE registry.", "success");
      router.push(
        `/complaints/confirmation?ref=${encodeURIComponent(refNumber)}&code=${encodeURIComponent(
          trackingCode
        )}&inst=${encodeURIComponent(newCase.institutionName)}`
      );
    } catch (e: any) {
      setIsSubmitting(false);
      toast("Submission could not be completed. Please check your inputs.", "error");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
          <span>Official Public Intake Service</span>
          <span>•</span>
          <span>SIH26264</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Lodge an Institution-Related Grievance
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
          Submit formal grievances regarding fee violations, certificate retention, or unapproved courses. All submissions are assigned a non-guessable reference code.
        </p>
      </div>

      {/* Progress Steps Header */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {[
            { step: 1, label: "Institution" },
            { step: 2, label: "Grievance" },
            { step: 3, label: "Complainant" },
            { step: 4, label: "De-Duplication" },
            { step: 5, label: "Review & File" },
          ].map((item) => {
            const isCurrent = currentStep === item.step;
            const isDone = currentStep > item.step;
            return (
              <div
                key={item.step}
                className={`flex flex-col items-center space-y-1.5 ${
                  isCurrent
                    ? "text-blue-900 font-bold"
                    : isDone
                    ? "text-emerald-700 font-semibold"
                    : "text-slate-400 font-medium"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                    isCurrent
                      ? "bg-blue-900 text-white"
                      : isDone
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                </div>
                <span className="text-[11px] hidden sm:inline">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Institution Identification */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
            <Building2 className="w-5 h-5 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900">
              Step 1: Select AICTE Approved Institution
            </h2>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled={isUnlistedInstitution}
                value={instSearch}
                onChange={(e) => setInstSearch(e.target.value)}
                placeholder="Search by Institution Name, AICTE Permanent ID (PID), or State/City..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600 disabled:bg-slate-100"
              />
            </div>

            {/* Registry List */}
            {!isUnlistedInstitution && (
              <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-200 rounded-md p-2 bg-slate-50/50">
                {filteredInstitutions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No matching institution found in demonstration registry.
                  </div>
                ) : (
                  filteredInstitutions.map((inst) => {
                    const isSelected = selectedInstId === inst.id;
                    return (
                      <div
                        key={inst.id}
                        onClick={() => setSelectedInstId(inst.id)}
                        className={`p-3 rounded-md border text-xs cursor-pointer transition-colors flex items-start justify-between ${
                          isSelected
                            ? "bg-blue-50 border-blue-500 text-blue-950 font-medium"
                            : "bg-white border-slate-200 hover:bg-slate-100 text-slate-800"
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-slate-900">{inst.name}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            AICTE PID: <span className="font-mono">{inst.id}</span> • {inst.district}, {inst.state} ({inst.category})
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="selectedInst"
                          checked={isSelected}
                          onChange={() => setSelectedInstId(inst.id)}
                          className="mt-1"
                        />
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Unlisted Institution Path */}
            <div className="pt-3 border-t border-slate-200 space-y-3">
              <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUnlistedInstitution}
                  onChange={(e) => {
                    setIsUnlistedInstitution(e.target.checked);
                    if (e.target.checked) setSelectedInstId("");
                  }}
                  className="rounded border-slate-300 text-blue-600"
                />
                <span className="font-semibold">
                  I cannot locate my institution in the registry (Unlisted or Autonomous College)
                </span>
              </label>

              {isUnlistedInstitution && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-md space-y-3 text-xs">
                  <div className="text-amber-900 font-semibold">
                    Provide Unlisted Institution Details:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        Institution Name *
                      </label>
                      <input
                        type="text"
                        value={unlistedName}
                        onChange={(e) => setUnlistedName(e.target.value)}
                        placeholder="e.g. Modern Institute of Technology"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-700 mb-1">
                        City / District & State *
                      </label>
                      <input
                        type="text"
                        value={unlistedCity}
                        onChange={(e) => setUnlistedCity(e.target.value)}
                        placeholder="e.g. Pune, Maharashtra"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Grievance Particulars */}
      {currentStep === 2 && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
            <FileText className="w-5 h-5 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900">
              Step 2: Grievance Details & Evidence
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {/* Category Selector */}
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Grievance Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 pt-0.5">
                {CATEGORIES.find((c) => c.value === category)?.desc}
              </p>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Summary Subject *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Non-refund of hostel caution deposit upon voluntary course withdrawal"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block font-semibold text-slate-700">
                Factual Allegation Description *
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail chronological events, names of officials contacted, specific clauses violated, amounts charged or withheld, and prior written communications..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              />
            </div>

            {/* Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Date of Incident / Refusal (Optional)
                </label>
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Document Upload */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Attach Supporting Documents (Receipts/Emails)
                </label>
                <input
                  type="file"
                  onChange={handleSimulatedUpload}
                  className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5">
                <div className="font-semibold text-slate-700 text-[11px]">
                  Attached Evidence ({files.length} items):
                </div>
                {files.map((f) => (
                  <div key={f.id} className="flex items-center justify-between text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200">
                    <span className="font-mono truncate">{f.name}</span>
                    <span className="text-slate-400 font-mono">{f.size}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: Complainant Details & Privacy */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
            <User className="w-5 h-5 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900">
              Step 3: Complainant Details & Confidentiality
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {/* Whistleblower Toggle */}
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg space-y-2">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-blue-400 text-blue-700 w-4 h-4"
                />
                <span className="font-bold text-blue-950 text-xs">
                  Enable Whistleblower Confidentiality (Identity Redacted from Institution)
                </span>
              </label>
              <p className="text-[11px] text-blue-900/80 pl-6 leading-relaxed">
                If checked, your name will not appear on official show-cause notices dispatched to the college. Only designated AICTE desk officers will inspect your verified credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Complainant Role / Standing *
                </label>
                <select
                  value={complainantType}
                  onChange={(e) => setComplainantType(e.target.value as ComplainantType)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                >
                  {COMPLAINANT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Full Name {isAnonymous ? "(Stored Securely)" : "*"}
                </label>
                <input
                  type="text"
                  value={complainantName}
                  onChange={(e) => setComplainantName(e.target.value)}
                  placeholder="e.g. Rohit S. Verma"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Email Address (For Reference & Dual-Factor Tracking) *
                </label>
                <input
                  type="email"
                  required
                  value={complainantEmail}
                  onChange={(e) => setComplainantEmail(e.target.value)}
                  placeholder="e.g. rohit.verma@example.com"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Contact Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  value={complainantPhone}
                  onChange={(e) => setComplainantPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            {/* Declaration & Consent */}
            <div className="pt-3 border-t border-slate-200">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600"
                />
                <span className="text-[11px] text-slate-600 leading-relaxed">
                  I solemnly declare that the facts stated above and attached documents are true and bonafide to the best of my knowledge. I understand that submitting false allegations may attract statutory penalties under the AICTE Act.
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Duplicate & Overlap Screening Advisory */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">
              Step 4: Proactive Duplicate & Overlap Advisory
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {activeExistingCases.length > 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-3">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>
                    Notice: Active Regulatory Inquiries Exist for This Institution ({activeExistingCases.length} records)
                  </span>
                </div>
                <p className="text-amber-950/80 leading-relaxed text-[11px]">
                  Our de-duplication screening detected that <strong>{selectedInst?.name}</strong> is currently subject to one or more ongoing inquiries in other AICTE bureaus.
                </p>

                {/* Safe Public-Level Summaries (Strictly No Personal Details of other complainants) */}
                <div className="space-y-2 pt-1">
                  {activeExistingCases.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white rounded border border-amber-200 text-[11px] space-y-1"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-900">
                        <span>Bureau Docket: {item.bureau} / Category: {item.category.replace(/_/g, " ")}</span>
                        <span className="font-mono text-slate-500 text-[10px]">Received: {item.receivedDate}</span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        Subject Area: {item.subject}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-white/70 rounded border border-amber-200 text-[11px] text-slate-700 leading-relaxed">
                  <strong>Non-Automatic Rejection Guarantee:</strong> Your grievance will <strong>not</strong> be automatically rejected. AICTE procedures allow you to file a distinct complaint, and designated bureau officers will review whether your grievance should be linked to the existing joint inquiry or handled as an independent docket.
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-2">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>No Active Parallel Inquiries Detected for this Institution</span>
                </div>
                <p className="text-emerald-950/80 text-[11px] leading-relaxed">
                  This institution currently has no open overlap flags. Your complaint will be routed directly to the Public Grievance Redressal Cell (PGRC) as a fresh primary intake.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 5: Final Review & Submission */}
      {currentStep === 5 && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-2xs space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-200">
            <CheckCircle2 className="w-5 h-5 text-blue-700" />
            <h2 className="text-base font-bold text-slate-900">
              Step 5: Review & Confirm Submission
            </h2>
          </div>

          <div className="space-y-4 text-xs divide-y divide-slate-100">
            {/* Institution Info */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Respondent Institution
              </span>
              <div className="font-bold text-slate-900 text-sm mt-0.5">
                {isUnlistedInstitution ? unlistedName : selectedInst?.name}
              </div>
              <div className="text-[11px] text-slate-500">
                {isUnlistedInstitution ? unlistedCity : `${selectedInst?.district}, ${selectedInst?.state} (PID: ${selectedInst?.id})`}
              </div>
            </div>

            {/* Grievance Summary */}
            <div className="pt-3">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Grievance Details
              </span>
              <div className="font-semibold text-slate-800 mt-0.5">
                {subject}
              </div>
              <div className="text-[11px] text-slate-600 mt-1 line-clamp-3">
                {description}
              </div>
              <div className="text-[11px] text-blue-700 font-medium mt-1">
                Category: {category.replace(/_/g, " ")} • {files.length} evidence files attached
              </div>
            </div>

            {/* Complainant Summary */}
            <div className="pt-3">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                Complainant Standing & Tracking
              </span>
              <div className="font-semibold text-slate-800 mt-0.5">
                {isAnonymous ? "Confidential Whistleblower" : complainantName} ({complainantType})
              </div>
              <div className="text-[11px] text-slate-500">
                Tracking verification will be linked to: <span className="font-mono">{complainantEmail}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1 || isSubmitting}
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-40 flex items-center space-x-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-md shadow-xs flex items-center space-x-1.5"
          >
            <span>Proceed to Step {currentStep + 1}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-md shadow-md flex items-center space-x-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting to AICTE Registry...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Lodge Grievance</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
