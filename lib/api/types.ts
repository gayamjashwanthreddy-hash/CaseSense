export type BureauType = "PGRC" | "REGULATION" | "APPROVAL" | "LEGAL" | "CPGRAMS";

export type CaseStatus =
  | "NEW_INTAKE"
  | "UNDER_INVESTIGATION"
  | "OVERLAP_FLAGGED"
  | "JOINT_COMMITTEE"
  | "NOTICE_ISSUED"
  | "HEARING_SCHEDULED"
  | "RESOLVED"
  | "ESCALATED";

export type PriorityLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type ComplaintCategory =
  | "CAPITATION_FEE"
  | "CERTIFICATE_WITHHOLDING"
  | "FACULTY_IRREGULARITIES"
  | "INFRASTRUCTURE_DEFICIT"
  | "ADMISSION_IRREGULARITIES"
  | "UNAPPROVED_COURSES"
  | "ACADEMIC_HARASSMENT";

export type ComplainantType =
  | "Student"
  | "Faculty Member"
  | "Parent Association"
  | "Citizen / Public"
  | "Institutional Officer"
  | "Anonymous Whistleblower";

export interface EvidenceFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
}

export interface InstitutionResponse {
  id: string;
  caseId: string;
  institutionId: string;
  submittedAt: string;
  submittedBy: string; // e.g. "Dr. S. K. Deshmukh, Registrar"
  officialDesignation: string;
  statement: string;
  complianceDocuments: { name: string; size: string; type: string }[];
  status: "SUBMITTED" | "UNDER_REVIEW" | "ACCEPTED" | "REJECTED";
  officialRemarks?: string;
}

export interface PublicTimelineEvent {
  id: string;
  timestamp: string;
  phase: string;
  summary: string;
  status: CaseStatus;
}

export interface ComplaintCase {
  id: string; // e.g. AICTE/PGRC/2026/0892
  refNumber: string;
  trackingCode?: string; // e.g. TRK-882194 for non-guessable dual factor tracking
  institutionId: string; // e.g. 1-10492811
  institutionName: string;
  institutionState: string;
  institutionRegion: string;
  bureau: BureauType;
  category: ComplaintCategory;
  subject: string;
  description: string;
  complainantName: string;
  complainantType: ComplainantType;
  complainantEmail?: string;
  complainantPhone?: string;
  isAnonymous: boolean;
  receivedDate: string; // YYYY-MM-DD
  status: CaseStatus;
  priority: PriorityLevel;
  assignedOfficer: string;
  assignedOfficerRole: string;
  assignedBureau: BureauType;
  slaDeadline: string; // YYYY-MM-DD
  daysOpen: number;
  lastActionDate: string;
  lastActionSummary: string;
  nextActionDeadline: string;
  nextActionRequired: string;
  hasOverlap: boolean;
  overlapPairId?: string;
  linkedCases: string[];
  relevantClauses: string[];
  evidenceFiles: EvidenceFile[];
  institutionResponses?: InstitutionResponse[];
  notes?: string;
}

export interface OverlapRationale {
  sameInstitution: boolean;
  institutionConfidence: number; // 0-100
  semanticSubjectSimilarity: number; // 0-100
  entityMatches: string[];
  commonKeywords: string[];
  regulatoryClauses: string[];
  reasonDescription: string;
}

export type OverlapResolutionStatus =
  | "PENDING_REVIEW"
  | "CONFIRMED_LINKED"
  | "MERGED"
  | "REJECTED_DISTINCT"
  | "DEFERRED";

export interface OverlapPair {
  id: string; // e.g. OVL-2026-001
  caseAId: string;
  caseBId: string;
  institutionId: string;
  institutionName: string;
  detectedAt: string;
  similarityScore: number; // 0-100
  urgency: PriorityLevel;
  rationale: OverlapRationale;
  status: OverlapResolutionStatus;
  leadBureau?: BureauType;
  reviewerNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  linkedCoordinationId?: string;
}

export interface Institution {
  id: string; // AICTE Permanent ID e.g. 1-10492811
  name: string;
  state: string;
  district: string;
  region: string;
  category: "Technical / Engineering" | "Management" | "Pharmacy" | "Polytechnic" | "Architecture";
  approvalStatus: "Approved (2025-2026)" | "Under Review" | "Show-Cause Notice" | "Reduced Intake";
  accreditation: "NBA Accredited" | "NAAC A+" | "NAAC A" | "Non-Accredited";
  affiliatedUniversity: string;
  activeCasesCount: number;
  totalHistoricalCases: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  headOfInstitution: string;
  email: string;
  phone: string;
}

export interface AuditLogEntry {
  id: string;
  caseId: string;
  timestamp: string;
  action: string;
  performedBy: string;
  role: string;
  bureau: BureauType;
  details: string;
  rationale?: string;
}

export type UserRole =
  | "ADMIN"
  | "REGULATION_OFFICER"
  | "PGRC_OFFICER"
  | "APPROVAL_OFFICER"
  | "REVIEWER";

export interface UserProfile {
  id: string;
  name: string;
  designation: string;
  role: UserRole;
  bureau: BureauType;
  email: string;
  avatarInitials: string;
}

export interface InstitutionAccount {
  id: string;
  institutionId: string; // e.g. 1-10492811
  institutionName: string;
  email: string;
  contactPerson: string;
  designation: string;
  phone: string;
  role: "INSTITUTION_REPRESENTATIVE";
}

export interface PublicTrackingData {
  refNumber: string;
  caseId: string;
  institutionName: string;
  institutionState: string;
  category: ComplaintCategory;
  subject: string;
  receivedDate: string;
  status: CaseStatus;
  slaDeadline: string;
  bureau: BureauType;
  publicTimeline: {
    date: string;
    stage: string;
    description: string;
    isCompleted: boolean;
  }[];
  actionRequiredFromComplainant?: string;
  institutionResponseStatus?: "PENDING" | "RECEIVED" | "UNDER_SCRUTINY";
}
