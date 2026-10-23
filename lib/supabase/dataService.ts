import { getSupabaseClient, isSupabaseConfigured } from "./client";
import {
  mapDbComplaintToModel,
  mapDbInstitutionToModel,
  mapDbOverlapToModel,
  mapDbResponseToModel,
  mapDbAuditToModel,
} from "./mappers";
import { CaseBridgeStore } from "@/lib/api/store";
import {
  ComplaintCase,
  Institution,
  OverlapPair,
  InstitutionResponse,
  AuditLogEntry,
  PublicTrackingData,
  OverlapResolutionStatus,
  CaseStatus,
  PriorityLevel,
  ComplaintCategory,
  BureauType,
} from "@/lib/api/types";

export const SupabaseDataService = {
  /**
   * Check if live Supabase cloud connection is configured and available
   */
  isLive(): boolean {
    return isSupabaseConfigured();
  },

  /**
   * Fetch complaint cases with optional filtering
   */
  async getCases(filters?: {
    search?: string;
    bureau?: string;
    status?: string;
    priority?: string;
    hasOverlap?: boolean;
    institutionId?: string;
  }): Promise<ComplaintCase[]> {
    const supabase = getSupabaseClient();
    if (this.isLive() && supabase) {
      try {
        let query = supabase.from("complaints").select(`
          *,
          institutions:institution_id (name, state, region)
        `);

        if (filters?.bureau && filters.bureau !== "ALL") {
          query = query.eq("bureau_id", filters.bureau);
        }
        if (filters?.status && filters.status !== "ALL") {
          query = query.eq("status", filters.status);
        }
        if (filters?.priority && filters.priority !== "ALL") {
          query = query.eq("priority", filters.priority);
        }
        if (filters?.hasOverlap !== undefined) {
          query = query.eq("has_overlap", filters.hasOverlap);
        }
        if (filters?.institutionId) {
          query = query.eq("institution_id", filters.institutionId);
        }
        if (filters?.search) {
          const q = filters.search.trim();
          query = query.or(
            `id.ilike.%${q}%,ref_number.ilike.%${q}%,subject.ilike.%${q}%,institution_id.ilike.%${q}%,complainant_name.ilike.%${q}%`
          );
        }

        const { data, error } = await query.order("received_date", { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map((row) => mapDbComplaintToModel(row));
        }
      } catch (err) {
        console.warn("Supabase query error for getCases, falling back to local store:", err);
      }
    }

    // Graceful fallback to local store
    return CaseBridgeStore.getCases(filters);
  },

  /**
   * Fetch a single case by ID or Reference Number
   */
  async getCaseById(caseId: string): Promise<ComplaintCase | undefined> {
    const supabase = getSupabaseClient();
    if (this.isLive() && supabase) {
      try {
        const { data, error } = await supabase
          .from("complaints")
          .select(`
            *,
            institutions:institution_id (name, state, region)
          `)
          .or(`id.eq.${caseId},ref_number.eq.${caseId}`)
          .single();

        if (!error && data) {
          // Fetch responses for this case
          const { data: responsesData } = await supabase
            .from("complaint_responses")
            .select("*")
            .eq("complaint_id", data.id)
            .order("created_at", { ascending: false });

          const mapped = mapDbComplaintToModel(data);
          if (responsesData) {
            mapped.institutionResponses = responsesData.map(mapDbResponseToModel);
          }
          return mapped;
        }
      } catch (err) {
        console.warn("Supabase query error for getCaseById, falling back to local store:", err);
      }
    }

    return CaseBridgeStore.getCaseById(caseId);
  },

  /**
   * Register a new public / citizen complaint
   */
  async createPublicComplaint(payload: {
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
  }): Promise<{ newCase: ComplaintCase; trackingCode: string; refNumber: string }> {
    const supabase = getSupabaseClient();
    const year = new Date().getFullYear();
    const randSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `TRK-${Math.floor(100000 + Math.random() * 900000)}`;
    const caseId = `AICTE/PGRC/${year}/${randSuffix}`;
    const refNumber = `PGRC-${year}-${randSuffix}`;
    const nowStr = new Date().toISOString().split("T")[0];

    if (this.isLive() && supabase) {
      try {
        // 1. Check for overlap in live database
        const { data: existingForInst } = await supabase
          .from("complaints")
          .select("id, bureau_id, institution_id")
          .eq("institution_id", payload.institutionId)
          .neq("status", "RESOLVED");

        const hasOverlap = Boolean(existingForInst && existingForInst.length > 0);

        // 2. Fetch institution name
        const { data: instData } = await supabase
          .from("institutions")
          .select("name, state, region")
          .eq("id", payload.institutionId)
          .single();

        const institutionName = instData?.name || "Registered AICTE Institution";

        // 3. Insert complaint row
        const dbPayload = {
          id: caseId,
          ref_number: refNumber,
          tracking_code: trackingCode,
          institution_id: payload.institutionId,
          bureau_id: "PGRC",
          category: payload.category,
          subject: payload.subject,
          description: payload.description,
          priority: "HIGH",
          status: hasOverlap ? "OVERLAP_FLAGGED" : "NEW_INTAKE",
          complainant_name: payload.isAnonymous ? "Confidential Complainant" : payload.complainantName,
          complainant_type: payload.complainantType || "STUDENT",
          complainant_email: payload.complainantEmail || null,
          complainant_phone: payload.complainantPhone || null,
          is_anonymous: payload.isAnonymous,
          is_confidential: payload.isAnonymous,
          received_date: nowStr,
          sla_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          days_open: 1,
          last_action_date: nowStr,
          last_action_summary: "Public grievance cataloged via Public Intake Gateway. Unique reference issued.",
          next_action_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          next_action_required: "Initial administrative scrutiny by PGRC desk.",
          assigned_officer: "Sh. Rajesh Sharma",
          assigned_officer_role: "Assistant Director, PGRC",
          has_overlap: hasOverlap,
          relevant_clauses_json: ["AICTE Approval Process Handbook 2025-26", "AICTE Public Grievance Regulations"],
        };

        const { error: insertError } = await supabase
          .from("complaints")
          .insert(dbPayload);

        if (!insertError) {
          // If overlap exists, register candidate relationship
          if (hasOverlap && existingForInst && existingForInst.length > 0) {
            const companion = existingForInst[0];
            const overlapId = `OVL-${year}-${Math.floor(100 + Math.random() * 900)}`;

            await supabase.from("complaint_relationships").insert({
              id: overlapId,
              case_a_id: companion.id,
              case_b_id: caseId,
              institution_id: payload.institutionId,
              institution_name: institutionName,
              similarity_score: 88,
              urgency: "HIGH",
              detected_at: new Date().toISOString().replace("T", " ").substring(0, 19),
              status: "PENDING_REVIEW",
              lead_bureau: companion.bureau_id || "PGRC",
              rationale_json: {
                sameInstitution: true,
                institutionConfidence: 100,
                semanticSubjectSimilarity: 85,
                entityMatches: [`Permanent Institute ID: ${payload.institutionId}`, `Institution: ${institutionName}`],
                commonKeywords: [payload.category.toLowerCase().replace(/_/g, " "), "grievance", "compliance"],
                regulatoryClauses: ["AICTE APH 2025-26 Clause 7.1"],
                reasonDescription: `Candidate overlap identified: Newly registered citizen grievance ${caseId} targets institution ${institutionName} (${payload.institutionId}) which is already subject to active regulatory inquiry ${companion.id}.`,
              },
            });

            // Update overlap_pair_id on complaint
            await supabase.from("complaints").update({ overlap_pair_id: overlapId }).eq("id", caseId);
          }

          // Also synchronize local store for instant reactive UI
          const localResult = CaseBridgeStore.createPublicComplaint(payload);
          return {
            newCase: mapDbComplaintToModel(dbPayload, institutionName),
            trackingCode,
            refNumber,
          };
        }
      } catch (err) {
        console.warn("Supabase createPublicComplaint failed, falling back to local store:", err);
      }
    }

    // Local fallback
    return CaseBridgeStore.createPublicComplaint(payload);
  },

  /**
   * Track complaint status via reference number and dual-factor verification code
   */
  async trackComplaint(refNumber: string, verificationInput: string): Promise<PublicTrackingData | null> {
    const supabase = getSupabaseClient();
    if (this.isLive() && supabase) {
      try {
        // Try executing the database RPC first
        const { data: rpcData, error: rpcError } = await supabase.rpc("track_complaint", {
          p_ref_number: refNumber.trim(),
          p_verification: verificationInput.trim(),
        });

        if (!rpcError && rpcData && rpcData.success && rpcData.case) {
          const c = rpcData.case;
          return {
            refNumber: c.refNumber || refNumber,
            caseId: c.id,
            institutionName: "Verified AICTE Institution",
            institutionState: "India",
            category: c.category,
            subject: c.subject || "Official Public Grievance Inquiry",
            status: c.status,
            receivedDate: c.receivedDate,
            slaDeadline: c.slaDeadline,
            bureau: (c.bureauId || "PGRC") as BureauType,
            publicTimeline: [
              {
                date: c.receivedDate,
                stage: "Complaint Registered",
                description: "Grievance received and authenticated in AICTE CaseBridge registry.",
                isCompleted: true,
              },
              {
                date: c.receivedDate,
                stage: "Preliminary Scrutiny",
                description: "Administrative bureau verification of jurisdiction and prima-facie grounds.",
                isCompleted: c.status !== "NEW_INTAKE",
              },
              {
                date: c.lastActionDate || c.receivedDate,
                stage: "Institutional Notice & Scrutiny",
                description: c.lastActionSummary || "Notice served to respondent institution.",
                isCompleted: c.status === "NOTICE_ISSUED" || c.status === "RESOLVED",
              },
              {
                date: c.slaDeadline,
                stage: "Final Resolution / Determination",
                description: c.status === "RESOLVED" ? "Statutory resolution published." : "Pending final resolution by Standing Committee.",
                isCompleted: c.status === "RESOLVED",
              },
            ],
          };
        }
      } catch (err) {
        console.warn("Supabase track_complaint error, falling back to local store:", err);
      }
    }

    return CaseBridgeStore.trackComplaint(refNumber, verificationInput);
  },

  /**
   * Fetch approved technical institutions
   */
  async getInstitutions(filters?: {
    search?: string;
    state?: string;
    riskLevel?: string;
    approvalStatus?: string;
  }): Promise<Institution[]> {
    const supabase = getSupabaseClient();
    if (this.isLive() && supabase) {
      try {
        let query = supabase.from("institutions").select("*");

        if (filters?.state && filters.state !== "ALL") {
          query = query.eq("state", filters.state);
        }
        if (filters?.riskLevel && filters.riskLevel !== "ALL") {
          query = query.eq("risk_level", filters.riskLevel);
        }
        if (filters?.approvalStatus && filters.approvalStatus !== "ALL") {
          query = query.eq("approval_status", filters.approvalStatus);
        }
        if (filters?.search) {
          const q = filters.search.trim();
          query = query.or(`name.ilike.%${q}%,id.ilike.%${q}%,state.ilike.%${q}%,district.ilike.%${q}%`);
        }

        const { data, error } = await query.order("name");
        if (!error && data && data.length > 0) {
          return data.map((row) => mapDbInstitutionToModel(row));
        }
      } catch (err) {
        console.warn("Supabase getInstitutions error, falling back to local store:", err);
      }
    }

    return CaseBridgeStore.getInstitutions(filters?.search);
  },

  /**
   * Fetch institution by Permanent Institute ID (PID)
   */
  async getInstitutionById(id: string): Promise<Institution | undefined> {
    const supabase = getSupabaseClient();
    if (this.isLive() && supabase) {
      try {
        const { data, error } = await supabase.from("institutions").select("*").eq("id", id).single();
        if (!error && data) {
          return mapDbInstitutionToModel(data);
        }
      } catch (err) {
        console.warn("Supabase getInstitutionById error, falling back to local store:", err);
      }
    }

    return CaseBridgeStore.getInstitutionById(id);
  },

  /**
   * Fetch cross-bureau overlap candidates
   */
  async getOverlaps(statusFilter?: OverlapResolutionStatus | "ALL"): Promise<OverlapPair[]> {
    const supabase = getSupabaseClient();
    if (this.isLive() && supabase) {
      try {
        let query = supabase.from("complaint_relationships").select("*");
        if (statusFilter && statusFilter !== "ALL") {
          query = query.eq("status", statusFilter);
        }
        const { data, error } = await query.order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(mapDbOverlapToModel);
        }
      } catch (err) {
        console.warn("Supabase getOverlaps error, falling back to local store:", err);
      }
    }

    return CaseBridgeStore.getOverlaps(statusFilter);
  },

  /**
   * Fetch overlap candidate pair by ID
   */
  async getOverlapById(pairId: string): Promise<OverlapPair | undefined> {
    const supabase = getSupabaseClient();
    if (this.isLive() && supabase) {
      try {
        const { data, error } = await supabase
          .from("complaint_relationships")
          .select("*")
          .eq("id", pairId)
          .single();
        if (!error && data) {
          return mapDbOverlapToModel(data);
        }
      } catch (err) {
        console.warn("Supabase getOverlapById error, falling back to local store:", err);
      }
    }

    return CaseBridgeStore.getOverlapById(pairId);
  },

  /**
   * Resolve an overlap pair decision (Confirm, Reject, Merge, Defer)
   */
  async resolveOverlap(
    pairId: string,
    action: OverlapResolutionStatus,
    reviewerNotes: string,
    leadBureau: BureauType
  ): Promise<OverlapPair | undefined> {
    const supabase = getSupabaseClient();
    if (this.isLive() && supabase) {
      try {
        const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);
        const { data, error } = await supabase
          .from("complaint_relationships")
          .update({
            status: action,
            reviewer_notes: reviewerNotes,
            lead_bureau: leadBureau,
            reviewed_at: nowStr,
            reviewer_name: "Dr. K. R. Venugopal (Admin / Standing Committee)",
          })
          .eq("id", pairId)
          .select()
          .single();

        if (!error && data) {
          // Mirror in local store for seamless UI updates
          CaseBridgeStore.resolveOverlap(pairId, action, reviewerNotes, "Dr. K. R. Venugopal", leadBureau);
          return mapDbOverlapToModel(data);
        }
      } catch (err) {
        console.warn("Supabase resolveOverlap error, falling back to local store:", err);
      }
    }

    return CaseBridgeStore.resolveOverlap(pairId, action, reviewerNotes, "Dr. K. R. Venugopal", leadBureau);
  },

  /**
   * Fetch institutional counter-affidavit compliance responses
   */
  async getInstitutionResponses(institutionId?: string): Promise<InstitutionResponse[]> {
    const supabase = getSupabaseClient();
    if (this.isLive() && supabase) {
      try {
        let query = supabase.from("complaint_responses").select("*");
        if (institutionId) {
          query = query.eq("institution_id", institutionId);
        }
        const { data, error } = await query.order("created_at", { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(mapDbResponseToModel);
        }
      } catch (err) {
        console.warn("Supabase getInstitutionResponses error, falling back to local store:", err);
      }
    }

    return CaseBridgeStore.getInstitutionResponses(institutionId);
  },

  /**
   * Submit an institutional compliance response / counter-affidavit
   */
  async submitInstitutionResponse(data: {
    caseId: string;
    institutionId: string;
    submittedBy: string;
    officialDesignation: string;
    statement: string;
    complianceDocuments: { name: string; size: string; type: string }[];
  }): Promise<InstitutionResponse> {
    const supabase = getSupabaseClient();
    if (this.isLive() && supabase) {
      try {
        const year = new Date().getFullYear();
        const randSuffix = Math.floor(100 + Math.random() * 900);
        const newId = `RESP-${year}-${randSuffix}`;
        const nowStr = new Date().toISOString().replace("T", " ").substring(0, 19);

        const { data: inserted, error } = await supabase
          .from("complaint_responses")
          .insert({
            id: newId,
            complaint_id: data.caseId,
            institution_id: data.institutionId,
            submitted_by: data.submittedBy,
            official_designation: data.officialDesignation,
            statement: data.statement,
            compliance_documents_json: data.complianceDocuments,
            status: "SUBMITTED",
            submitted_at: nowStr,
          })
          .select()
          .single();

        if (!error && inserted) {
          CaseBridgeStore.submitInstitutionResponse(data);
          return mapDbResponseToModel(inserted);
        }
      } catch (err) {
        console.warn("Supabase submitInstitutionResponse error, falling back to local store:", err);
      }
    }

    return CaseBridgeStore.submitInstitutionResponse(data);
  },

  /**
   * Upload an evidence attachment file to Supabase Storage
   */
  async uploadAttachment(
    complaintId: string,
    file: File
  ): Promise<{ path: string; publicUrl?: string } | null> {
    const supabase = getSupabaseClient();
    if (this.isLive() && supabase) {
      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${complaintId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("complaint-attachments")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.warn("Supabase storage upload error:", uploadError);
          return null;
        }

        const { data } = supabase.storage.from("complaint-attachments").getPublicUrl(filePath);
        return { path: filePath, publicUrl: data?.publicUrl };
      } catch (err) {
        console.warn("Error uploading attachment to Supabase Storage:", err);
      }
    }
    return null;
  },

  /**
   * Executive Dashboard Aggregated Metrics
   */
  async getDashboardMetrics() {
    return CaseBridgeStore.getDashboardMetrics();
  },
};
