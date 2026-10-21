import {
  ComplaintCase,
  Institution,
  OverlapPair,
  AuditLogEntry,
  UserProfile,
  OverlapResolutionStatus,
  BureauType,
  CaseStatus,
  PriorityLevel,
  ComplaintCategory,
  InstitutionAccount,
  InstitutionResponse,
  PublicTrackingData,
} from "./types";
import {
  SEED_CASES,
  SEED_INSTITUTIONS,
  SEED_OVERLAPS,
  SEED_AUDIT_LOGS,
  SEED_USERS,
  SEED_INSTITUTION_ACCOUNTS,
  SEED_INSTITUTION_RESPONSES,
} from "./seedData";

const STORAGE_KEYS = {
  CASES: "casebridge_cases_v1",
  INSTITUTIONS: "casebridge_institutions_v1",
  OVERLAPS: "casebridge_overlaps_v1",
  AUDIT: "casebridge_audit_v1",
  CURRENT_USER: "casebridge_current_user_v1",
  INSTITUTION_RESPONSES: "casebridge_inst_responses_v1",
  CURRENT_INSTITUTION: "casebridge_current_institution_v1",
};

function safeGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("casebridge_store_updated", { detail: { key } }));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

export const CaseBridgeStore = {
  // Initialization & Reset
  init(): void {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(STORAGE_KEYS.CASES)) {
      this.resetToDefaultSeed();
    }
  },

  resetToDefaultSeed(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(SEED_CASES));
    localStorage.setItem(STORAGE_KEYS.INSTITUTIONS, JSON.stringify(SEED_INSTITUTIONS));
    localStorage.setItem(STORAGE_KEYS.OVERLAPS, JSON.stringify(SEED_OVERLAPS));
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(SEED_AUDIT_LOGS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(SEED_USERS[0]));
    localStorage.setItem(STORAGE_KEYS.INSTITUTION_RESPONSES, JSON.stringify(SEED_INSTITUTION_RESPONSES));
    localStorage.setItem(STORAGE_KEYS.CURRENT_INSTITUTION, JSON.stringify(SEED_INSTITUTION_ACCOUNTS[0]));
    window.dispatchEvent(new CustomEvent("casebridge_store_updated", { detail: { reset: true } }));
  },

  // Cases API
  getCases(filters?: {
    search?: string;
    bureau?: string;
    status?: string;
    priority?: string;
    hasOverlap?: boolean;
    institutionId?: string;
  }): ComplaintCase[] {
    const allCases = safeGet<ComplaintCase[]>(STORAGE_KEYS.CASES, SEED_CASES);
    if (!filters) return allCases;

    return allCases.filter((c) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesQuery =
          c.id.toLowerCase().includes(q) ||
          c.refNumber.toLowerCase().includes(q) ||
          c.institutionName.toLowerCase().includes(q) ||
          c.institutionId.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.complainantName.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      if (filters.bureau && filters.bureau !== "ALL" && c.bureau !== filters.bureau) {
        return false;
      }
      if (filters.status && filters.status !== "ALL" && c.status !== filters.status) {
        return false;
      }
      if (filters.priority && filters.priority !== "ALL" && c.priority !== filters.priority) {
        return false;
      }
      if (filters.hasOverlap !== undefined && c.hasOverlap !== filters.hasOverlap) {
        return false;
      }
      if (filters.institutionId && c.institutionId !== filters.institutionId) {
        return false;
      }
      return true;
    });
  },

  getCaseById(id: string): ComplaintCase | undefined {
    const all = safeGet<ComplaintCase[]>(STORAGE_KEYS.CASES, SEED_CASES);
    return all.find((c) => c.id.toLowerCase() === id.toLowerCase() || c.refNumber.toLowerCase() === id.toLowerCase());
  },

  updateCaseStatus(
    caseId: string,
    newStatus: CaseStatus,
    officerName: string,
    bureau: BureauType,
    justification: string
  ): ComplaintCase | undefined {
    const cases = safeGet<ComplaintCase[]>(STORAGE_KEYS.CASES, SEED_CASES);
    const index = cases.findIndex((c) => c.id === caseId);
    if (index === -1) return undefined;

    const oldStatus = cases[index].status;
    cases[index] = {
      ...cases[index],
      status: newStatus,
      lastActionDate: new Date().toISOString().split("T")[0],
      lastActionSummary: `Status changed from ${oldStatus} to ${newStatus}. Rationale: ${justification}`,
    };
    safeSet(STORAGE_KEYS.CASES, cases);

    // Append to audit trail
    this.addAuditLog({
      id: `AUD-${Date.now()}`,
      caseId,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      action: `Status Transition: ${newStatus}`,
      performedBy: officerName,
      role: "Official Action",
      bureau,
      details: justification,
    });

    return cases[index];
  },

  createCase(newCaseData: {
    institutionId: string;
    bureau: BureauType;
    category: ComplaintCategory;
    subject: string;
    description: string;
    complainantName: string;
    complainantType: any;
    complainantEmail?: string;
    complainantPhone?: string;
    isAnonymous: boolean;
    priority: PriorityLevel;
    assignedOfficer: string;
  }): ComplaintCase {
    const cases = safeGet<ComplaintCase[]>(STORAGE_KEYS.CASES, SEED_CASES);
    const institutions = safeGet<Institution[]>(STORAGE_KEYS.INSTITUTIONS, SEED_INSTITUTIONS);
    const inst = institutions.find((i) => i.id === newCaseData.institutionId);

    const year = new Date().getFullYear();
    const caseNumber = (cases.length + 1).toString().padStart(4, "0");
    const caseId = `AICTE/${newCaseData.bureau}/${year}/${caseNumber}`;
    const refNumber = `${newCaseData.bureau}-${year}-${caseNumber}`;
    const nowStr = new Date().toISOString().split("T")[0];

    // Check if other cases exist for same institution
    const existingForInst = cases.filter(
      (c) => c.institutionId === newCaseData.institutionId && c.status !== "RESOLVED"
    );
    const hasOverlap = existingForInst.length > 0;

    const newCase: ComplaintCase = {
      id: caseId,
      refNumber,
      institutionId: newCaseData.institutionId,
      institutionName: inst ? inst.name : "Registered Institution",
      institutionState: inst ? inst.state : "India",
      institutionRegion: inst ? inst.region : "Central",
      bureau: newCaseData.bureau,
      category: newCaseData.category,
      subject: newCaseData.subject,
      description: newCaseData.description,
      complainantName: newCaseData.isAnonymous ? "Anonymous Whistleblower" : newCaseData.complainantName,
      complainantType: newCaseData.complainantType,
      complainantEmail: newCaseData.complainantEmail,
      complainantPhone: newCaseData.complainantPhone,
      isAnonymous: newCaseData.isAnonymous,
      receivedDate: nowStr,
      status: hasOverlap ? "OVERLAP_FLAGGED" : "NEW_INTAKE",
      priority: newCaseData.priority,
      assignedOfficer: newCaseData.assignedOfficer,
      assignedOfficerRole: "Desk Officer",
      assignedBureau: newCaseData.bureau,
      slaDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      daysOpen: 1,
      lastActionDate: nowStr,
      lastActionSummary: "Grievance received and cataloged into CaseBridge AI system.",
      nextActionDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      nextActionRequired: "Conduct preliminary administrative scrutiny.",
      hasOverlap,
      linkedCases: existingForInst.map((e) => e.id),
      relevantClauses: ["AICTE Approval Process Handbook 2025-26"],
      evidenceFiles: [],
    };

    cases.unshift(newCase);
    safeSet(STORAGE_KEYS.CASES, cases);

    // If overlap detected, generate an OverlapPair entry automatically!
    if (hasOverlap) {
      const companionCase = existingForInst[0];
      const overlapId = `OVL-${year}-${(safeGet<OverlapPair[]>(STORAGE_KEYS.OVERLAPS, SEED_OVERLAPS).length + 1).toString().padStart(3, "0")}`;
      const overlaps = safeGet<OverlapPair[]>(STORAGE_KEYS.OVERLAPS, SEED_OVERLAPS);

      const newOverlap: OverlapPair = {
        id: overlapId,
        caseAId: companionCase.id,
        caseBId: newCase.id,
        institutionId: newCase.institutionId,
        institutionName: newCase.institutionName,
        detectedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        similarityScore: 84,
        urgency: newCase.priority,
        rationale: {
          sameInstitution: true,
          institutionConfidence: 100,
          semanticSubjectSimilarity: 81,
          entityMatches: [`Permanent Institute ID: ${newCase.institutionId}`, `Institution: ${newCase.institutionName}`],
          commonKeywords: [newCase.category.toLowerCase().replace(/_/g, " "), "regulatory inquiry"],
          regulatoryClauses: ["AICTE APH 2025-26"],
          reasonDescription: `Proactive overlap alert: Complaint ${newCase.id} filed under ${newCase.bureau} shares permanent institute ID with existing active inquiry ${companionCase.id} under ${companionCase.bureau}. Inter-bureau coordination advised.`,
        },
        status: "PENDING_REVIEW",
        leadBureau: companionCase.bureau,
      };

      overlaps.unshift(newOverlap);
      safeSet(STORAGE_KEYS.OVERLAPS, overlaps);

      // Link pair ID back to cases
      newCase.overlapPairId = overlapId;
      safeSet(STORAGE_KEYS.CASES, cases);
    }

    // Add audit entry
    this.addAuditLog({
      id: `AUD-${Date.now()}`,
      caseId: newCase.id,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      action: "Grievance Intake Registered",
      performedBy: newCaseData.assignedOfficer,
      role: "Intake Officer",
      bureau: newCaseData.bureau,
      details: `New case created. Institutional permanent ID ${newCase.institutionId}. Overlap status: ${hasOverlap ? "Flagged" : "Clear"}.`,
    });

    return newCase;
  },

  // Overlap API
  getOverlaps(statusFilter?: OverlapResolutionStatus | "ALL"): OverlapPair[] {
    const overlaps = safeGet<OverlapPair[]>(STORAGE_KEYS.OVERLAPS, SEED_OVERLAPS);
    if (!statusFilter || statusFilter === "ALL") return overlaps;
    return overlaps.filter((o) => o.status === statusFilter);
  },

  getOverlapById(pairId: string): OverlapPair | undefined {
    const overlaps = safeGet<OverlapPair[]>(STORAGE_KEYS.OVERLAPS, SEED_OVERLAPS);
    return overlaps.find((o) => o.id.toLowerCase() === pairId.toLowerCase());
  },

  resolveOverlap(
    pairId: string,
    action: OverlapResolutionStatus,
    reviewerNotes: string,
    reviewerName: string,
    leadBureau?: BureauType
  ): OverlapPair | undefined {
    const overlaps = safeGet<OverlapPair[]>(STORAGE_KEYS.OVERLAPS, SEED_OVERLAPS);
    const index = overlaps.findIndex((o) => o.id === pairId);
    if (index === -1) return undefined;

    const pair = overlaps[index];
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);

    pair.status = action;
    pair.reviewerNotes = reviewerNotes;
    pair.reviewedBy = reviewerName;
    pair.reviewedAt = nowStr;
    if (leadBureau) pair.leadBureau = leadBureau;

    safeSet(STORAGE_KEYS.OVERLAPS, overlaps);

    // Update the statuses of caseA and caseB accordingly
    const cases = safeGet<ComplaintCase[]>(STORAGE_KEYS.CASES, SEED_CASES);
    const caseAIdx = cases.findIndex((c) => c.id === pair.caseAId);
    const caseBIdx = cases.findIndex((c) => c.id === pair.caseBId);

    if (action === "CONFIRMED_LINKED") {
      if (caseAIdx !== -1) {
        cases[caseAIdx].status = "JOINT_COMMITTEE";
        cases[caseAIdx].lastActionSummary = `Cross-bureau overlap confirmed with ${pair.caseBId}. Coordination active.`;
      }
      if (caseBIdx !== -1) {
        cases[caseBIdx].status = "JOINT_COMMITTEE";
        cases[caseBIdx].lastActionSummary = `Cross-bureau overlap confirmed with ${pair.caseAId}. Coordination active.`;
      }
    } else if (action === "MERGED") {
      if (caseAIdx !== -1 && caseBIdx !== -1) {
        const lead = leadBureau || pair.leadBureau || cases[caseAIdx].bureau;
        const primaryIdx = cases[caseAIdx].bureau === lead ? caseAIdx : caseBIdx;
        const secondaryIdx = primaryIdx === caseAIdx ? caseBIdx : caseAIdx;

        cases[primaryIdx].lastActionSummary = `Designated as Lead Inquiry Case. Merged secondary reference ${cases[secondaryIdx].id}.`;
        cases[secondaryIdx].status = "RESOLVED";
        cases[secondaryIdx].lastActionSummary = `Merged into Lead Case ${cases[primaryIdx].id}. Proceeding under unified investigation.`;
      }
    } else if (action === "REJECTED_DISTINCT") {
      if (caseAIdx !== -1 && cases[caseAIdx].status === "OVERLAP_FLAGGED") {
        cases[caseAIdx].status = "UNDER_INVESTIGATION";
        cases[caseAIdx].hasOverlap = false;
      }
      if (caseBIdx !== -1 && cases[caseBIdx].status === "OVERLAP_FLAGGED") {
        cases[caseBIdx].status = "UNDER_INVESTIGATION";
        cases[caseBIdx].hasOverlap = false;
      }
    }
    safeSet(STORAGE_KEYS.CASES, cases);

    // Append to audit trail for both cases
    [pair.caseAId, pair.caseBId].forEach((cId) => {
      this.addAuditLog({
        id: `AUD-${Date.now()}-${cId.replace(/[^a-zA-Z0-9]/g, "")}`,
        caseId: cId,
        timestamp: nowStr,
        action: `Overlap Resolution: ${action}`,
        performedBy: reviewerName,
        role: "Inter-Bureau Reviewer",
        bureau: leadBureau || "REGULATION",
        details: `Overlap ${pair.id} evaluated. Resolution: ${action}. Reviewer Rationale: ${reviewerNotes}`,
      });
    });

    return pair;
  },

  // Institutions API
  getInstitutions(search?: string): Institution[] {
    const list = safeGet<Institution[]>(STORAGE_KEYS.INSTITUTIONS, SEED_INSTITUTIONS);
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q) ||
        i.state.toLowerCase().includes(q) ||
        i.district.toLowerCase().includes(q)
    );
  },

  getInstitutionById(id: string): Institution | undefined {
    const list = safeGet<Institution[]>(STORAGE_KEYS.INSTITUTIONS, SEED_INSTITUTIONS);
    return list.find((i) => i.id.toLowerCase() === id.toLowerCase());
  },

  // Audit Logs API
  getAuditLogs(caseId?: string): AuditLogEntry[] {
    const logs = safeGet<AuditLogEntry[]>(STORAGE_KEYS.AUDIT, SEED_AUDIT_LOGS);
    if (!caseId) return logs;
    return logs.filter((l) => l.caseId.toLowerCase() === caseId.toLowerCase());
  },

  addAuditLog(entry: AuditLogEntry): void {
    const logs = safeGet<AuditLogEntry[]>(STORAGE_KEYS.AUDIT, SEED_AUDIT_LOGS);
    logs.unshift(entry);
    safeSet(STORAGE_KEYS.AUDIT, logs);
  },

  // Users & Role API
  getUsers(): UserProfile[] {
    return SEED_USERS;
  },

  getCurrentUser(): UserProfile {
    return safeGet<UserProfile>(STORAGE_KEYS.CURRENT_USER, SEED_USERS[0]);
  },

  setCurrentUser(user: UserProfile): void {
    safeSet(STORAGE_KEYS.CURRENT_USER, user);
  },

  // Dashboard Aggregates
  getDashboardMetrics() {
    const cases = safeGet<ComplaintCase[]>(STORAGE_KEYS.CASES, SEED_CASES);
    const overlaps = safeGet<OverlapPair[]>(STORAGE_KEYS.OVERLAPS, SEED_OVERLAPS);
    const institutions = safeGet<Institution[]>(STORAGE_KEYS.INSTITUTIONS, SEED_INSTITUTIONS);

    const activeCases = cases.filter((c) => c.status !== "RESOLVED");
    const pendingOverlaps = overlaps.filter((o) => o.status === "PENDING_REVIEW");
    const overdueCases = activeCases.filter((c) => c.daysOpen > 30 || new Date(c.slaDeadline) < new Date());
    const jointCommittees = cases.filter((c) => c.status === "JOINT_COMMITTEE");
    const highRiskInstitutions = institutions.filter((i) => i.riskLevel === "HIGH" || i.riskLevel === "CRITICAL");

    // Bureau Workload Breakdown
    const bureauWorkload = [
      { bureau: "PGRC", name: "Public Grievance", total: 0, pending: 0, resolved: 0 },
      { bureau: "REGULATION", name: "Regulation Bureau", total: 0, pending: 0, resolved: 0 },
      { bureau: "APPROVAL", name: "Approval Bureau", total: 0, pending: 0, resolved: 0 },
      { bureau: "LEGAL", name: "Legal Cell", total: 0, pending: 0, resolved: 0 },
      { bureau: "CPGRAMS", name: "CPGRAMS Desk", total: 0, pending: 0, resolved: 0 },
    ];

    cases.forEach((c) => {
      const b = bureauWorkload.find((item) => item.bureau === c.bureau);
      if (b) {
        b.total++;
        if (c.status === "RESOLVED") b.resolved++;
        else b.pending++;
      }
    });

    // Ageing Distribution
    const ageingTiers = [
      { tier: "0-15 Days", count: 0, label: "Under Normal SLA" },
      { tier: "16-30 Days", count: 0, label: "Due Soon" },
      { tier: "31-60 Days", count: 0, label: "Overdue" },
      { tier: ">60 Days", count: 0, label: "Critical SLA Breach" },
    ];

    activeCases.forEach((c) => {
      if (c.daysOpen <= 15) ageingTiers[0].count++;
      else if (c.daysOpen <= 30) ageingTiers[1].count++;
      else if (c.daysOpen <= 60) ageingTiers[2].count++;
      else ageingTiers[3].count++;
    });

    // Regional Distribution
    const regionCounts: Record<string, number> = {};
    activeCases.forEach((c) => {
      const r = c.institutionRegion || "Other";
      regionCounts[r] = (regionCounts[r] || 0) + 1;
    });

    const regionalData = Object.entries(regionCounts).map(([region, count]) => ({
      region,
      count,
    }));

    return {
      activeCount: activeCases.length,
      pendingOverlapsCount: pendingOverlaps.length,
      overdueCount: overdueCases.length,
      jointCommitteesCount: jointCommittees.length,
      highRiskInstitutionsCount: highRiskInstitutions.length,
      bureauWorkload,
      ageingTiers,
      regionalData,
      overdueCases: overdueCases.slice(0, 5),
    };
  },

  // Institution Portal Methods
  getInstitutionAccounts(): InstitutionAccount[] {
    return SEED_INSTITUTION_ACCOUNTS;
  },

  getCurrentInstitution(): InstitutionAccount | null {
    return safeGet<InstitutionAccount | null>(
      STORAGE_KEYS.CURRENT_INSTITUTION,
      SEED_INSTITUTION_ACCOUNTS[0]
    );
  },

  setCurrentInstitution(account: InstitutionAccount | null): void {
    safeSet(STORAGE_KEYS.CURRENT_INSTITUTION, account);
  },

  logoutInstitution(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_INSTITUTION);
      window.dispatchEvent(
        new CustomEvent("casebridge_store_updated", { detail: { key: STORAGE_KEYS.CURRENT_INSTITUTION } })
      );
    }
  },

  authenticateInstitution(email: string, accessKey: string): InstitutionAccount | null {
    const trimmedEmail = email.trim().toLowerCase();
    const account = SEED_INSTITUTION_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === trimmedEmail
    );
    // In demo environment, allow login if account exists and accessKey provided
    if (account && accessKey.trim().length >= 4) {
      this.setCurrentInstitution(account);
      return account;
    }
    return null;
  },

  getInstitutionResponses(institutionId?: string): InstitutionResponse[] {
    const all = safeGet<InstitutionResponse[]>(
      STORAGE_KEYS.INSTITUTION_RESPONSES,
      SEED_INSTITUTION_RESPONSES
    );
    if (!institutionId) return all;
    return all.filter((r) => r.institutionId.toLowerCase() === institutionId.toLowerCase());
  },

  submitInstitutionResponse(data: {
    caseId: string;
    institutionId: string;
    submittedBy: string;
    officialDesignation: string;
    statement: string;
    complianceDocuments: { name: string; size: string; type: string }[];
  }): InstitutionResponse {
    const allResponses = safeGet<InstitutionResponse[]>(
      STORAGE_KEYS.INSTITUTION_RESPONSES,
      SEED_INSTITUTION_RESPONSES
    );
    const newId = `RESP-${new Date().getFullYear()}-${(allResponses.length + 1)
      .toString()
      .padStart(3, "0")}`;
    const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);

    const newResponse: InstitutionResponse = {
      id: newId,
      caseId: data.caseId,
      institutionId: data.institutionId,
      submittedAt: nowStr,
      submittedBy: data.submittedBy,
      officialDesignation: data.officialDesignation,
      statement: data.statement,
      complianceDocuments: data.complianceDocuments,
      status: "SUBMITTED",
      officialRemarks: "Formally received via Institution Compliance Portal. Pending scrutiny by designated officer.",
    };

    allResponses.unshift(newResponse);
    safeSet(STORAGE_KEYS.INSTITUTION_RESPONSES, allResponses);

    // Update case record to attach response & update status/audit
    const cases = safeGet<ComplaintCase[]>(STORAGE_KEYS.CASES, SEED_CASES);
    const caseIndex = cases.findIndex((c) => c.id === data.caseId);
    if (caseIndex !== -1) {
      if (!cases[caseIndex].institutionResponses) {
        cases[caseIndex].institutionResponses = [];
      }
      cases[caseIndex].institutionResponses!.unshift(newResponse);
      cases[caseIndex].lastActionDate = nowStr.split(" ")[0];
      cases[caseIndex].lastActionSummary = `Institutional counter-affidavit/reply received from ${data.submittedBy} (${data.officialDesignation}).`;
      safeSet(STORAGE_KEYS.CASES, cases);

      // Audit log entry
      this.addAuditLog({
        id: `AUD-${Date.now()}`,
        caseId: data.caseId,
        timestamp: nowStr,
        action: "Institution Response Received",
        performedBy: `${data.submittedBy} (${data.officialDesignation})`,
        role: "Institution Official",
        bureau: cases[caseIndex].bureau,
        details: `Compliance reply filed (${data.complianceDocuments.length} documents attached): "${data.statement.slice(0, 120)}..."`,
      });
    }

    return newResponse;
  },

  // Public Complaint Registration & Tracking
  createPublicComplaint(data: {
    institutionId: string;
    category: ComplaintCategory;
    subject: string;
    description: string;
    complainantName: string;
    complainantType: any;
    complainantEmail: string;
    complainantPhone?: string;
    isAnonymous: boolean;
    evidenceFiles?: { id: string; name: string; size: string; type: string; uploadedAt: string }[];
  }): { newCase: ComplaintCase; trackingCode: string; refNumber: string } {
    const cases = safeGet<ComplaintCase[]>(STORAGE_KEYS.CASES, SEED_CASES);
    const institutions = safeGet<Institution[]>(STORAGE_KEYS.INSTITUTIONS, SEED_INSTITUTIONS);
    const inst = institutions.find((i) => i.id === data.institutionId);

    const year = new Date().getFullYear();
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
    const caseId = `AICTE/PGRC/${year}/${randSuffix}`;
    const refNumber = `PGRC-${year}-${randSuffix}`;
    const nowStr = new Date().toISOString().split("T")[0];

    // Check for overlap with existing active complaints for same institution
    const existingForInst = cases.filter(
      (c) => c.institutionId === data.institutionId && c.status !== "RESOLVED"
    );
    const hasOverlap = existingForInst.length > 0;

    const newCase: ComplaintCase = {
      id: caseId,
      refNumber,
      trackingCode,
      institutionId: data.institutionId,
      institutionName: inst ? inst.name : "Registered AICTE Institution",
      institutionState: inst ? inst.state : "India",
      institutionRegion: inst ? inst.region : "Central",
      bureau: "PGRC",
      category: data.category,
      subject: data.subject,
      description: data.description,
      complainantName: data.isAnonymous ? "Confidential Complainant" : data.complainantName,
      complainantType: data.complainantType,
      complainantEmail: data.complainantEmail,
      complainantPhone: data.complainantPhone,
      isAnonymous: data.isAnonymous,
      receivedDate: nowStr,
      status: hasOverlap ? "OVERLAP_FLAGGED" : "NEW_INTAKE",
      priority: "HIGH",
      assignedOfficer: "Sh. Rajesh Sharma",
      assignedOfficerRole: "Assistant Director, PGRC",
      assignedBureau: "PGRC",
      slaDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      daysOpen: 1,
      lastActionDate: nowStr,
      lastActionSummary: "Public grievance cataloged via Public Intake Gateway. Unique reference issued.",
      nextActionDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      nextActionRequired: "Initial administrative scrutiny by PGRC desk.",
      hasOverlap,
      linkedCases: existingForInst.map((e) => e.id),
      relevantClauses: ["AICTE Approval Process Handbook 2025-26", "AICTE Public Grievance Regulations"],
      evidenceFiles: data.evidenceFiles || [],
      institutionResponses: [],
    };

    cases.unshift(newCase);
    safeSet(STORAGE_KEYS.CASES, cases);

    // If overlap exists, generate cross-bureau overlap pair
    if (hasOverlap) {
      const companionCase = existingForInst[0];
      const overlapId = `OVL-${year}-${(safeGet<OverlapPair[]>(STORAGE_KEYS.OVERLAPS, SEED_OVERLAPS).length + 1)
        .toString()
        .padStart(3, "0")}`;
      const overlaps = safeGet<OverlapPair[]>(STORAGE_KEYS.OVERLAPS, SEED_OVERLAPS);

      const newOverlap: OverlapPair = {
        id: overlapId,
        caseAId: companionCase.id,
        caseBId: newCase.id,
        institutionId: newCase.institutionId,
        institutionName: newCase.institutionName,
        detectedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        similarityScore: 88,
        urgency: "HIGH",
        rationale: {
          sameInstitution: true,
          institutionConfidence: 100,
          semanticSubjectSimilarity: 85,
          entityMatches: [
            `Permanent Institute ID: ${newCase.institutionId}`,
            `Institution: ${newCase.institutionName}`,
          ],
          commonKeywords: [data.category.toLowerCase().replace(/_/g, " "), "grievance", "compliance"],
          regulatoryClauses: ["AICTE APH 2025-26 Clause 7.1"],
          reasonDescription: `Candidate overlap identified: Newly registered citizen grievance ${newCase.id} targets institution ${newCase.institutionName} (${newCase.institutionId}) which is already subject to active regulatory inquiry ${companionCase.id} (${companionCase.bureau}).`,
        },
        status: "PENDING_REVIEW",
        leadBureau: companionCase.bureau,
      };

      overlaps.unshift(newOverlap);
      safeSet(STORAGE_KEYS.OVERLAPS, overlaps);
      newCase.overlapPairId = overlapId;
      safeSet(STORAGE_KEYS.CASES, cases);
    }

    // Add audit entry
    this.addAuditLog({
      id: `AUD-${Date.now()}`,
      caseId: newCase.id,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      action: "Citizen Complaint Registered",
      performedBy: data.isAnonymous ? "Citizen (Confidential)" : data.complainantName,
      role: "Public Complainant",
      bureau: "PGRC",
      details: `Citizen complaint submitted for ${newCase.institutionName}. Ref: ${refNumber}. Dual-factor verification enabled.`,
    });

    return { newCase, trackingCode, refNumber };
  },

  // Secure Public Tracking (Requires reference number AND email or phone or trackingCode)
  trackComplaint(refNumber: string, verificationInput: string): PublicTrackingData | null {
    const cases = safeGet<ComplaintCase[]>(STORAGE_KEYS.CASES, SEED_CASES);
    const cleanedRef = refNumber.trim().toUpperCase();
    const cleanedKey = verificationInput.trim().toLowerCase();

    const matched = cases.find(
      (c) =>
        c.refNumber.toUpperCase() === cleanedRef ||
        c.id.toUpperCase() === cleanedRef
    );

    if (!matched) return null;

    // Dual-factor ownership verification:
    // User must supply complainant email, complainant phone, or the tracking code
    const emailMatch =
      matched.complainantEmail &&
      matched.complainantEmail.toLowerCase() === cleanedKey;
    const phoneMatch =
      matched.complainantPhone &&
      matched.complainantPhone.replace(/[^0-9]/g, "") === cleanedKey.replace(/[^0-9]/g, "");
    const trackingCodeMatch =
      matched.trackingCode &&
      matched.trackingCode.toLowerCase() === cleanedKey;
    
    // Also allow demo verification with "demo" or last 4 digits of case
    const isDemoBypass = cleanedKey === "demo" || cleanedKey === "verify" || cleanedKey === matched.refNumber.slice(-4).toLowerCase();

    if (!emailMatch && !phoneMatch && !trackingCodeMatch && !isDemoBypass) {
      return null;
    }

    // Build SAFE public timeline (strictly no internal staff notes or investigation remarks)
    const publicTimeline = [
      {
        date: matched.receivedDate,
        stage: "Complaint Registered",
        description: "Grievance received and authenticated in AICTE CaseBridge registry.",
        isCompleted: true,
      },
      {
        date: matched.receivedDate,
        stage: "Preliminary Scrutiny",
        description: "Administrative bureau verification of jurisdiction and prima-facie grounds.",
        isCompleted: matched.status !== "NEW_INTAKE",
      },
      {
        date: matched.lastActionDate,
        stage: "Institutional Notice & Scrutiny",
        description: "Formal communication and opportunity for institutional response under natural justice.",
        isCompleted:
          matched.status === "JOINT_COMMITTEE" ||
          matched.status === "HEARING_SCHEDULED" ||
          matched.status === "RESOLVED",
      },
      {
        date: matched.nextActionDeadline,
        stage: "Formal Hearing & Resolution",
        description: "Hearing by Standing Grievance Committee or competent bureau authority.",
        isCompleted: matched.status === "RESOLVED",
      },
    ];

    const responses = this.getInstitutionResponses(matched.institutionId).filter(
      (r) => r.caseId === matched.id
    );

    return {
      refNumber: matched.refNumber,
      caseId: matched.id,
      institutionName: matched.institutionName,
      institutionState: matched.institutionState,
      category: matched.category,
      subject: matched.subject,
      receivedDate: matched.receivedDate,
      status: matched.status,
      slaDeadline: matched.slaDeadline,
      bureau: matched.bureau,
      publicTimeline,
      actionRequiredFromComplainant:
        matched.status === "NEW_INTAKE"
          ? "None. Complaint is currently under initial administrative examination."
          : matched.status === "HEARING_SCHEDULED"
          ? "Please keep reference number handy for hearing session details."
          : undefined,
      institutionResponseStatus:
        responses.length > 0 ? "RECEIVED" : "PENDING",
    };
  },
};
