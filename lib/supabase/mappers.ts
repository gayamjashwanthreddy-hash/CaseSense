import {
  ComplaintCase,
  Institution,
  OverlapPair,
  InstitutionResponse,
  AuditLogEntry,
  BureauType,
  CaseStatus,
  PriorityLevel,
  ComplaintCategory,
  ComplainantType,
} from "@/lib/api/types";

export function mapDbComplaintToModel(row: any, institutionName?: string): ComplaintCase {
  return {
    id: row.id,
    refNumber: row.ref_number || row.id,
    trackingCode: row.tracking_code,
    institutionId: row.institution_id,
    institutionName: institutionName || row.institutions?.name || row.institution_name || "Technical Institution",
    institutionState: row.institutions?.state || row.institution_state || "India",
    institutionRegion: row.institutions?.region || row.institution_region || "Central",
    bureau: (row.bureau_id as BureauType) || "PGRC",
    category: (row.category as ComplaintCategory) || "CAPITATION_FEE",
    subject: row.subject || "",
    description: row.description || "",
    complainantName: row.is_anonymous ? "Whistleblower (Identity Protected)" : (row.complainant_name || "Complainant"),
    complainantType: (row.complainant_type as ComplainantType) || "Student",
    complainantEmail: row.complainant_email,
    complainantPhone: row.complainant_phone,
    isAnonymous: Boolean(row.is_anonymous),
    receivedDate: row.received_date || new Date().toISOString().split("T")[0],
    status: (row.status as CaseStatus) || "NEW_INTAKE",
    priority: (row.priority as PriorityLevel) || "MEDIUM",
    assignedOfficer: row.assigned_officer || "Senior Scrutiny Officer",
    assignedOfficerRole: row.assigned_officer_role || "Inquiry Coordinator",
    assignedBureau: (row.bureau_id as BureauType) || "PGRC",
    slaDeadline: row.sla_deadline || new Date().toISOString().split("T")[0],
    daysOpen: row.days_open || 1,
    lastActionDate: row.last_action_date || row.received_date || new Date().toISOString().split("T")[0],
    lastActionSummary: row.last_action_summary || "Complaint intake recorded",
    nextActionDeadline: row.next_action_deadline || row.sla_deadline || new Date().toISOString().split("T")[0],
    nextActionRequired: row.next_action_required || "Initial review pending",
    hasOverlap: Boolean(row.has_overlap),
    overlapPairId: row.overlap_pair_id || undefined,
    linkedCases: row.linked_cases || [],
    relevantClauses: Array.isArray(row.relevant_clauses_json) ? row.relevant_clauses_json : [],
    evidenceFiles: Array.isArray(row.evidence_files) ? row.evidence_files : [],
    institutionResponses: Array.isArray(row.responses) ? row.responses.map(mapDbResponseToModel) : [],
    notes: row.notes,
  };
}

export function mapDbInstitutionToModel(row: any, activeCount = 0, historicalCount = 0): Institution {
  return {
    id: row.id,
    name: row.name,
    state: row.state || "",
    district: row.district || "",
    region: row.region || "",
    category: row.category || "Technical / Engineering",
    approvalStatus: row.approval_status || "Approved (2025-2026)",
    accreditation: row.accreditation || "NBA Accredited",
    affiliatedUniversity: row.affiliated_university || "State Technical University",
    activeCasesCount: activeCount,
    totalHistoricalCases: historicalCount,
    riskLevel: row.risk_level || "LOW",
    headOfInstitution: row.head_of_institution || "Principal / Director",
    email: row.email || "",
    phone: row.phone || "",
  };
}

export function mapDbOverlapToModel(row: any): OverlapPair {
  return {
    id: row.id,
    caseAId: row.case_a_id,
    caseBId: row.case_b_id,
    institutionId: row.institution_id,
    institutionName: row.institution_name,
    similarityScore: row.similarity_score || 75,
    urgency: row.urgency || "MEDIUM",
    detectedAt: row.detected_at || new Date().toISOString(),
    rationale: row.rationale_json || {
      sameInstitution: true,
      institutionConfidence: 100,
      semanticSubjectSimilarity: 75,
      entityMatches: [],
      commonKeywords: [],
      regulatoryClauses: [],
      reasonDescription: "Algorithmic cross-bureau correlation detected.",
    },
    status: row.status || "PENDING_REVIEW",
    leadBureau: row.lead_bureau,
    reviewerNotes: row.reviewer_notes,
    reviewedBy: row.reviewer_name,
    reviewedAt: row.reviewed_at,
  };
}

export function mapDbResponseToModel(row: any): InstitutionResponse {
  return {
    id: row.id,
    caseId: row.complaint_id,
    institutionId: row.institution_id,
    submittedBy: row.submitted_by,
    officialDesignation: row.official_designation,
    statement: row.statement,
    complianceDocuments: Array.isArray(row.compliance_documents_json)
      ? row.compliance_documents_json
      : [],
    status: row.status || "SUBMITTED",
    submittedAt: row.submitted_at || new Date().toISOString(),
    officialRemarks: row.official_remarks,
  };
}

export function mapDbAuditToModel(row: any): AuditLogEntry {
  return {
    id: row.id,
    caseId: row.case_id,
    timestamp: row.timestamp || row.created_at || new Date().toISOString(),
    action: row.action,
    performedBy: row.performed_by,
    role: row.role || "Officer",
    bureau: (row.bureau as BureauType) || "PGRC",
    details: row.details || "",
  };
}
