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
    const targetInstId = isUnlistedInstitution ? "1-10492811" : selectedInstId;

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
      <div className="border-b border-[#E3E5DE] pb-5">
        <div className="flex items-center space-x-2 text-xs font-semibold text-[#344B3B] uppercase tracking-wider mb-1 font-mono">
          <span>Official Public Intake Service</span>
          <span>•</span>
          <span>SIH26264</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#20231F] tracking-tight">
          Lodge an Institution-Related Grievance
        </h1>
        <p className="text-[#62665F] text-xs sm:text-sm mt-1 leading-relaxed font-mono">
          Submit formal grievances regarding fee violations, certificate retention, or unapproved courses. All submissions are assigned a non-guessable reference code.
        </p>
      </div>

      {/* Progress Steps Header */}
      <div className="bg-white p-4 rounded-xl border border-[#E3E5DE] shadow-xs">
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
                    ? "text-[#344B3B] font-bold"
                    : isDone
                    ? "text-[#23734D] font-semibold"
                    : "text-[#85877F] font-medium"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono ${
                    isCurrent
                      ? "bg-[#344B3B] text-white"
                      : isDone
                      ? "bg-[#E8F4EC] text-[#23734D] border border-[#23734D]/30"
                      : "bg-[#F7F7F4] text-[#85877F] border border-[#E3E5DE]"
                  }`}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                </div>
                <span className="text-[11px] hidden sm:inline font-mono">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Institution Identification */}
      {currentStep === 1 && (
        <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#E3E5DE]">
            <Building2 className="w-5 h-5 text-[#344B3B]" />
            <h2 className="text-base font-bold text-[#20231F]">
              Step 1: Select AICTE Approved Institution
            </h2>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-[#85877F] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                disabled={isUnlistedInstitution}
                value={instSearch}
                onChange={(e) => setInstSearch(e.target.value)}
                placeholder="Search by Institution Name, AICTE Permanent ID (PID), or State/City..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#E3E5DE] rounded-md bg-[#F7F7F4] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white text-[#20231F] disabled:bg-[#F0F1ED] font-sans"
              />
            </div>

            {/* Registry List */}
            {!isUnlistedInstitution && (
              <div className="max-h-64 overflow-y-auto space-y-2 border border-[#E3E5DE] rounded-md p-2 bg-[#F7F7F4]">
                {filteredInstitutions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-[#62665F] font-mono">
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
                            ? "bg-[#E8EEE7] border-[#344B3B] text-[#20231F] font-medium"
                            : "bg-white border-[#E3E5DE] hover:bg-[#F0F1ED] text-[#20231F]"
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-[#20231F]">{inst.name}</div>
                          <div className="text-[11px] text-[#62665F] font-mono mt-0.5">
                            AICTE PID: <span>{inst.id}</span> • {inst.district}, {inst.state} ({inst.category})
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="selectedInst"
                          checked={isSelected}
                          onChange={() => setSelectedInstId(inst.id)}
                          className="mt-1 accent-[#344B3B]"
                        />
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Unlisted Institution Path */}
            <div className="pt-3 border-t border-[#E3E5DE] space-y-3">
              <label className="flex items-center space-x-2 text-xs text-[#20231F] cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUnlistedInstitution}
                  onChange={(e) => {
                    setIsUnlistedInstitution(e.target.checked);
                    if (e.target.checked) setSelectedInstId("");
                  }}
                  className="rounded border-[#E3E5DE] text-[#344B3B] accent-[#344B3B]"
                />
                <span className="font-semibold">
                  I cannot locate my institution in the registry (Unlisted or Autonomous College)
                </span>
              </label>

              {isUnlistedInstitution && (
                <div className="p-4 bg-[#FBF1DB] border border-[#925C0B]/25 rounded-md space-y-3 text-xs">
                  <div className="text-[#925C0B] font-semibold font-mono">
                    Provide Unlisted Institution Details:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-[#20231F] mb-1 font-mono">
                        Institution Name *
                      </label>
                      <input
                        type="text"
                        value={unlistedName}
                        onChange={(e) => setUnlistedName(e.target.value)}
                        placeholder="e.g. Modern Institute of Technology"
                        className="w-full px-2.5 py-1.5 text-xs border border-[#E3E5DE] rounded bg-white text-[#20231F]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#20231F] mb-1 font-mono">
                        City / District &amp; State *
                      </label>
                      <input
                        type="text"
                        value={unlistedCity}
                        onChange={(e) => setUnlistedCity(e.target.value)}
                        placeholder="e.g. Pune, Maharashtra"
                        className="w-full px-2.5 py-1.5 text-xs border border-[#E3E5DE] rounded bg-white text-[#20231F]"
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
        <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#E3E5DE]">
            <FileText className="w-5 h-5 text-[#344B3B]" />
            <h2 className="text-base font-bold text-[#20231F]">
              Step 2: Grievance Details &amp; Evidence
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {/* Category Selector */}
            <div className="space-y-1">
              <label className="block font-semibold text-[#20231F]">
                Grievance Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="w-full px-3 py-2 text-xs border border-[#E3E5DE] rounded-md bg-[#F7F7F4] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white text-[#20231F]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#62665F] pt-0.5 font-mono">
                {CATEGORIES.find((c) => c.value === category)?.desc}
              </p>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="block font-semibold text-[#20231F]">
                Summary Subject *
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Non-refund of hostel caution deposit upon voluntary course withdrawal"
                className="w-full px-3 py-2 text-xs border border-[#E3E5DE] rounded-md bg-[#F7F7F4] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white text-[#20231F] font-sans"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="block font-semibold text-[#20231F]">
                Factual Allegation Description *
              </label>
              <textarea
                required
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail chronological events, names of officials contacted, specific clauses violated, amounts charged or withheld, and prior written communications..."
                className="w-full px-3 py-2 text-xs border border-[#E3E5DE] rounded-md bg-[#F7F7F4] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white text-[#20231F] font-sans"
              />
            </div>

            {/* Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block font-semibold text-[#20231F]">
                  Date of Incident / Refusal (Optional)
                </label>
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#E3E5DE] rounded-md bg-[#F7F7F4] text-[#20231F]"
                />
              </div>

              {/* Document Upload */}
              <div className="space-y-1">
                <label className="block font-semibold text-[#20231F]">
                  Attach Supporting Documents (Receipts/Emails)
                </label>
                <input
                  type="file"
                  onChange={handleSimulatedUpload}
                  className="w-full text-xs text-[#62665F] file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#E8EEE7] file:text-[#344B3B] hover:file:bg-[#d8e3d6]"
                />
              </div>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="p-3 bg-[#F7F7F4] rounded-md border border-[#E3E5DE] space-y-1.5 font-mono">
                <div className="font-semibold text-[#20231F] text-[11px]">
                  Attached Evidence ({files.length} items):
                </div>
                {files.map((f) => (
                  <div key={f.id} className="flex items-center justify-between text-[11px] text-[#20231F] bg-white p-2 rounded border border-[#E3E5DE]">
                    <span className="truncate">{f.name}</span>
                    <span className="text-[#85877F]">{f.size}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: Complainant Details & Privacy */}
      {currentStep === 3 && (
        <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#E3E5DE]">
            <User className="w-5 h-5 text-[#344B3B]" />
            <h2 className="text-base font-bold text-[#20231F]">
              Step 3: Complainant Details &amp; Confidentiality
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {/* Whistleblower Toggle */}
            <div className="p-4 bg-[#E8EEE7] border border-[#344B3B]/20 rounded-md space-y-2">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded border-[#344B3B] text-[#344B3B] w-4 h-4 accent-[#344B3B]"
                />
                <span className="font-bold text-[#344B3B] text-xs">
                  Enable Whistleblower Confidentiality (Identity Redacted from Institution)
                </span>
              </label>
              <p className="text-[11px] text-[#20231F] pl-6 leading-relaxed">
                If checked, your name will not appear on official show-cause notices dispatched to the college. Only designated AICTE desk officers will inspect your verified credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block font-semibold text-[#20231F]">
                  Complainant Role / Standing *
                </label>
                <select
                  value={complainantType}
                  onChange={(e) => setComplainantType(e.target.value as ComplainantType)}
                  className="w-full px-3 py-2 text-xs border border-[#E3E5DE] rounded-md bg-[#F7F7F4] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white text-[#20231F]"
                >
                  {COMPLAINANT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#20231F]">
                  Full Name {isAnonymous ? "(Stored Securely)" : "*"}
                </label>
                <input
                  type="text"
                  value={complainantName}
                  onChange={(e) => setComplainantName(e.target.value)}
                  placeholder="e.g. Rohit S. Verma"
                  className="w-full px-3 py-2 text-xs border border-[#E3E5DE] rounded-md bg-[#F7F7F4] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white text-[#20231F] font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#20231F]">
                  Email Address (For Reference &amp; Dual-Factor Tracking) *
                </label>
                <input
                  type="email"
                  required
                  value={complainantEmail}
                  onChange={(e) => setComplainantEmail(e.target.value)}
                  placeholder="e.g. rohit.verma@example.com"
                  className="w-full px-3 py-2 text-xs border border-[#E3E5DE] rounded-md bg-[#F7F7F4] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white text-[#20231F] font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-[#20231F]">
                  Contact Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  value={complainantPhone}
                  onChange={(e) => setComplainantPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs border border-[#E3E5DE] rounded-md bg-[#F7F7F4] focus:outline-none focus:ring-1 focus:ring-[#526B57] focus:bg-white text-[#20231F] font-sans"
                />
              </div>
            </div>

            {/* Declaration & Consent */}
            <div className="pt-3 border-t border-[#E3E5DE]">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="mt-0.5 rounded border-[#E3E5DE] text-[#344B3B] accent-[#344B3B]"
                />
                <span className="text-[11px] text-[#62665F] leading-relaxed">
                  I solemnly declare that the facts stated above and attached documents are true and bonafide to the best of my knowledge. I understand that submitting false allegations may attract statutory penalties under the AICTE Act.
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Duplicate & Overlap Screening Advisory */}
      {currentStep === 4 && (
        <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#E3E5DE]">
            <ShieldAlert className="w-5 h-5 text-[#925C0B]" />
            <h2 className="text-base font-bold text-[#20231F]">
              Step 4: Proactive Duplicate &amp; Overlap Advisory
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            {activeExistingCases.length > 0 ? (
              <div className="p-4 bg-[#FBF1DB] border border-[#925C0B]/25 rounded-md space-y-3">
                <div className="flex items-center space-x-2 text-[#925C0B] font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-[#925C0B]" />
                  <span>
                    Notice: Active Regulatory Inquiries Exist for This Institution ({activeExistingCases.length} records)
                  </span>
                </div>
                <p className="text-[#925C0B]/90 leading-relaxed text-[11px]">
                  Our de-duplication screening detected that <strong>{selectedInst?.name}</strong> is currently subject to one or more ongoing inquiries in other AICTE bureaus.
                </p>

                {/* Safe Public-Level Summaries */}
                <div className="space-y-2 pt-1 font-mono">
                  {activeExistingCases.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white rounded border border-[#925C0B]/20 text-[11px] space-y-1"
                    >
                      <div className="flex items-center justify-between font-semibold text-[#20231F]">
                        <span>Bureau Docket: {item.bureau} / Category: {item.category.replace(/_/g, " ")}</span>
                        <span className="text-[#85877F] text-[10px]">Received: {item.receivedDate}</span>
                      </div>
                      <p className="text-[#62665F] text-[11px]">
                        Subject Area: {item.subject}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-white/70 rounded border border-[#925C0B]/20 text-[11px] text-[#20231F] leading-relaxed">
                  <strong>Non-Automatic Rejection Guarantee:</strong> Your grievance will <strong>not</strong> be automatically rejected. AICTE procedures allow you to file a distinct complaint, and designated bureau officers will review whether your grievance should be linked to the existing joint inquiry or handled as an independent docket.
                </div>
              </div>
            ) : (
              <div className="p-4 bg-[#E8F4EC] border border-[#23734D]/25 rounded-md space-y-2">
                <div className="flex items-center space-x-2 text-[#23734D] font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#23734D]" />
                  <span>No Active Parallel Inquiries Detected for this Institution</span>
                </div>
                <p className="text-[#20231F] text-[11px] leading-relaxed">
                  This institution currently has no open overlap flags. Your complaint will be routed directly to the Public Grievance Redressal Cell (PGRC) as a fresh primary intake.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 5: Final Review & Submission */}
      {currentStep === 5 && (
        <div className="bg-white p-6 rounded-xl border border-[#E3E5DE] shadow-xs space-y-6">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#E3E5DE]">
            <CheckCircle2 className="w-5 h-5 text-[#344B3B]" />
            <h2 className="text-base font-bold text-[#20231F]">
              Step 5: Review &amp; Confirm Submission
            </h2>
          </div>

          <div className="space-y-4 text-xs divide-y divide-[#E3E5DE]">
            {/* Institution Info */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-semibold text-[#85877F] block font-mono">
                Respondent Institution
              </span>
              <div className="font-bold text-[#20231F] text-sm mt-0.5">
                {isUnlistedInstitution ? unlistedName : selectedInst?.name}
              </div>
              <div className="text-[11px] text-[#62665F] font-mono">
                {isUnlistedInstitution ? unlistedCity : `${selectedInst?.district}, ${selectedInst?.state} (PID: ${selectedInst?.id})`}
              </div>
            </div>

            {/* Grievance Summary */}
            <div className="pt-3">
              <span className="text-[10px] uppercase font-semibold text-[#85877F] block font-mono">
                Grievance Details
              </span>
              <div className="font-semibold text-[#20231F] mt-0.5">
                {subject}
              </div>
              <div className="text-[11px] text-[#62665F] mt-1 line-clamp-3">
                {description}
              </div>
              <div className="text-[11px] text-[#344B3B] font-medium mt-1 font-mono">
                Category: {category.replace(/_/g, " ")} • {files.length} evidence files attached
              </div>
            </div>

            {/* Complainant Summary */}
            <div className="pt-3">
              <span className="text-[10px] uppercase font-semibold text-[#85877F] block font-mono">
                Complainant Standing &amp; Tracking
              </span>
              <div className="font-semibold text-[#20231F] mt-0.5">
                {isAnonymous ? "Confidential Whistleblower" : complainantName} ({complainantType})
              </div>
              <div className="text-[11px] text-[#62665F] font-mono">
                Tracking verification will be linked to: <span>{complainantEmail}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E3E5DE]">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1 || isSubmitting}
          className="px-4 py-2 text-xs font-semibold text-[#20231F] bg-white border border-[#E3E5DE] rounded-md hover:bg-[#F7F7F4] disabled:opacity-40 flex items-center space-x-1.5 font-mono"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {currentStep < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2 text-xs font-semibold text-white bg-[#344B3B] hover:bg-[#293D30] rounded-md shadow-xs flex items-center space-x-1.5 font-mono"
          >
            <span>Proceed to Step {currentStep + 1}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-bold text-white bg-[#23734D] hover:bg-[#1c5d3e] rounded-md shadow-xs flex items-center space-x-2 disabled:opacity-50 font-mono"
          >
            {isSubmitting ? (
              <span>Submitting to AICTE Registry...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Lodge Grievance</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
