-- =============================================================================
-- CASEBRIDGE AI — SUPABASE POSTGRESQL PRODUCTION MIGRATION
-- Problem Statement: SIH 2026 | SIH26264 | Team Code Ninja's
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. BUREAUS & REGULATORY CELLS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bureaus (
    id VARCHAR(64) PRIMARY KEY, -- 'PGRC', 'REGULATION', 'APPROVAL', 'LEGAL', 'CPGRAMS'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. APPROVED TECHNICAL INSTITUTIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.institutions (
    id VARCHAR(64) PRIMARY KEY, -- AICTE Permanent Institute ID (PID), e.g. '1-10492811'
    name VARCHAR(255) NOT NULL,
    state VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    category VARCHAR(100) DEFAULT 'Technical / Engineering',
    approval_status VARCHAR(100) DEFAULT 'Approved',
    accreditation VARCHAR(100) DEFAULT 'NBA / NAAC',
    affiliated_university VARCHAR(255),
    head_of_institution VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    risk_level VARCHAR(50) DEFAULT 'LOW', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_institutions_name ON public.institutions (name);
CREATE INDEX IF NOT EXISTS idx_institutions_state ON public.institutions (state);
CREATE INDEX IF NOT EXISTS idx_institutions_region ON public.institutions (region);
CREATE INDEX IF NOT EXISTS idx_institutions_risk_level ON public.institutions (risk_level);

-- -----------------------------------------------------------------------------
-- 3. USER PROFILES (Integrated with Supabase Auth auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users_profile (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(64) NOT NULL, -- 'ADMIN', 'BUREAU_OFFICER', 'INSTITUTION_REPRESENTATIVE', 'REVIEWER', 'PUBLIC_COMPLAINANT'
    bureau_id VARCHAR(64) REFERENCES public.bureaus(id) ON DELETE SET NULL,
    institution_id VARCHAR(64) REFERENCES public.institutions(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_profile_role ON public.users_profile (role);
CREATE INDEX IF NOT EXISTS idx_users_profile_institution_id ON public.users_profile (institution_id);
CREATE INDEX IF NOT EXISTS idx_users_profile_bureau_id ON public.users_profile (bureau_id);

-- -----------------------------------------------------------------------------
-- 4. COMPLAINTS & GRIEVANCE CASES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaints (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'AICTE/PGRC/2026/0892'
    ref_number VARCHAR(64) UNIQUE NOT NULL, -- e.g. 'PGRC-2026-0892'
    tracking_code VARCHAR(64) NOT NULL, -- non-guessable verification code, e.g. 'TRK-882194'
    institution_id VARCHAR(64) NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    bureau_id VARCHAR(64) NOT NULL REFERENCES public.bureaus(id) ON DELETE RESTRICT,
    category VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(50) DEFAULT 'MEDIUM', -- 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    status VARCHAR(50) DEFAULT 'NEW_INTAKE', -- 'NEW_INTAKE', 'UNDER_INVESTIGATION', 'OVERLAP_FLAGGED', 'JOINT_COMMITTEE', 'NOTICE_ISSUED', 'HEARING_SCHEDULED', 'RESOLVED', 'ESCALATED'
    complainant_name VARCHAR(255) NOT NULL,
    complainant_type VARCHAR(50) DEFAULT 'STUDENT', -- 'STUDENT', 'PARENT', 'FACULTY', 'CITIZEN'
    complainant_email VARCHAR(255),
    complainant_phone VARCHAR(50),
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_confidential BOOLEAN DEFAULT FALSE,
    received_date DATE NOT NULL,
    sla_deadline DATE NOT NULL,
    days_open INTEGER DEFAULT 1,
    last_action_summary TEXT,
    last_action_date DATE,
    next_action_required TEXT,
    next_action_deadline DATE,
    assigned_officer VARCHAR(255),
    assigned_officer_role VARCHAR(255),
    has_overlap BOOLEAN DEFAULT FALSE,
    overlap_pair_id VARCHAR(64),
    relevant_clauses_json JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_complaints_ref_number ON public.complaints (ref_number);
CREATE INDEX IF NOT EXISTS idx_complaints_tracking_code ON public.complaints (tracking_code);
CREATE INDEX IF NOT EXISTS idx_complaints_institution_id ON public.complaints (institution_id);
CREATE INDEX IF NOT EXISTS idx_complaints_bureau_id ON public.complaints (bureau_id);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON public.complaints (category);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON public.complaints (priority);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints (status);
CREATE INDEX IF NOT EXISTS idx_complaints_has_overlap ON public.complaints (has_overlap);
CREATE INDEX IF NOT EXISTS idx_complaints_received_date ON public.complaints (received_date);

-- -----------------------------------------------------------------------------
-- 5. COMPLAINT EVENTS (Chronological Append-Only History)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaint_events (
    id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    previous_status VARCHAR(50),
    new_status VARCHAR(50),
    actor_name VARCHAR(255) NOT NULL,
    actor_role VARCHAR(100),
    bureau VARCHAR(64),
    explanation TEXT,
    timestamp VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_complaint_events_complaint_id ON public.complaint_events (complaint_id);

-- -----------------------------------------------------------------------------
-- 6. COMPLAINT RELATIONSHIPS (Cross-Bureau Overlap Candidate Pairs)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaint_relationships (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'OVL-2026-001'
    case_a_id VARCHAR(64) NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    case_b_id VARCHAR(64) NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    institution_id VARCHAR(64) NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    institution_name VARCHAR(255) NOT NULL,
    similarity_score INTEGER DEFAULT 75,
    urgency VARCHAR(50) DEFAULT 'MEDIUM',
    detected_at VARCHAR(50) NOT NULL,
    rationale_json JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING_REVIEW', -- 'PENDING_REVIEW', 'CONFIRMED_LINKED', 'REJECTED_DISTINCT', 'DEFERRED', 'MERGED'
    lead_bureau VARCHAR(64),
    reviewer_name VARCHAR(255),
    reviewer_notes TEXT,
    reviewed_at VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_complaint_pair UNIQUE (case_a_id, case_b_id),
    CONSTRAINT chk_no_self_overlap CHECK (case_a_id <> case_b_id)
);

CREATE INDEX IF NOT EXISTS idx_relationships_case_a ON public.complaint_relationships (case_a_id);
CREATE INDEX IF NOT EXISTS idx_relationships_case_b ON public.complaint_relationships (case_b_id);
CREATE INDEX IF NOT EXISTS idx_relationships_institution ON public.complaint_relationships (institution_id);
CREATE INDEX IF NOT EXISTS idx_relationships_status ON public.complaint_relationships (status);

-- -----------------------------------------------------------------------------
-- 7. INSTITUTIONAL COMPLIANCE RESPONSES (Counter-Affidavits)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaint_responses (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'RESP-2026-001'
    complaint_id VARCHAR(64) NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    institution_id VARCHAR(64) NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
    submitted_by VARCHAR(255) NOT NULL,
    official_designation VARCHAR(255) NOT NULL,
    statement TEXT NOT NULL,
    compliance_documents_json JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'SUBMITTED',
    submitted_at VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_responses_complaint_id ON public.complaint_responses (complaint_id);
CREATE INDEX IF NOT EXISTS idx_responses_institution_id ON public.complaint_responses (institution_id);

-- -----------------------------------------------------------------------------
-- 8. COMPLAINT ATTACHMENTS (Secure Document Metadata)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attachments (
    id VARCHAR(64) PRIMARY KEY,
    complaint_id VARCHAR(64) NOT NULL REFERENCES public.complaints(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    storage_key VARCHAR(255) NOT NULL,
    file_size INTEGER DEFAULT 0,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    uploader_name VARCHAR(255) DEFAULT 'System',
    uploader_role VARCHAR(100) DEFAULT 'COMPLAINANT',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attachments_complaint_id ON public.attachments (complaint_id);

-- -----------------------------------------------------------------------------
-- 9. IMMUTABLE AUDIT LOGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    case_id VARCHAR(64),
    timestamp VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    performed_by VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    bureau VARCHAR(64),
    details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_case_id ON public.audit_logs (case_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs (action);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS on every table
ALTER TABLE public.bureaus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to extract user role from user profile or JWT app_metadata
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS text AS $$
DECLARE
    found_role text;
BEGIN
    -- 1. Check users_profile table first
    SELECT role INTO found_role FROM public.users_profile WHERE id = auth.uid();
    IF found_role IS NOT NULL THEN
        RETURN found_role;
    END IF;

    -- 2. Fall back to app_metadata role in JWT claims
    found_role := auth.jwt() -> 'app_metadata' ->> 'role';
    IF found_role IS NOT NULL THEN
        RETURN found_role;
    END IF;

    -- 3. Default fallback
    RETURN 'ANONYMOUS';
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Helper function to extract institution_id from user profile or JWT app_metadata
CREATE OR REPLACE FUNCTION public.get_auth_institution_id()
RETURNS text AS $$
DECLARE
    found_inst_id text;
BEGIN
    -- 1. Check users_profile table first
    SELECT institution_id INTO found_inst_id FROM public.users_profile WHERE id = auth.uid();
    IF found_inst_id IS NOT NULL THEN
        RETURN found_inst_id;
    END IF;

    -- 2. Fall back to app_metadata institution_id in JWT claims
    found_inst_id := auth.jwt() -> 'app_metadata' ->> 'institution_id';
    IF found_inst_id IS NOT NULL THEN
        RETURN found_inst_id;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 1. Bureaus RLS: Everyone authenticated can view bureaus
CREATE POLICY "Allow authenticated read bureaus" 
    ON public.bureaus FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow public read bureaus" 
    ON public.bureaus FOR SELECT TO anon USING (true);

-- 2. Institutions RLS: Everyone authenticated can view institutions directory
CREATE POLICY "Allow authenticated read institutions" 
    ON public.institutions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow public read institutions" 
    ON public.institutions FOR SELECT TO anon USING (true);
CREATE POLICY "Allow admin manage institutions" 
    ON public.institutions FOR ALL TO authenticated 
    USING (public.get_auth_role() = 'ADMIN');

-- 3. Users Profile RLS: Users can view their own profile, Admins can view all
CREATE POLICY "Users read own profile" 
    ON public.users_profile FOR SELECT TO authenticated 
    USING (id = auth.uid() OR public.get_auth_role() = 'ADMIN');

-- 4. Complaints RLS
-- A. Public submission: Anonymous & Authenticated can register new complaints
CREATE POLICY "Allow complaint submission" 
    ON public.complaints FOR INSERT TO anon, authenticated 
    WITH CHECK (true);

-- B. Official Bureau / Admin access: Bureau Officers & Admins view complaints
CREATE POLICY "Allow officers view complaints" 
    ON public.complaints FOR SELECT TO authenticated 
    USING (
        public.get_auth_role() IN ('ADMIN', 'REVIEWER', 'BUREAU_OFFICER')
    );

-- C. Strict Institution Isolation: Technical colleges can ONLY access complaints targeting their PID
CREATE POLICY "Allow institution access own complaints" 
    ON public.complaints FOR SELECT TO authenticated 
    USING (
        public.get_auth_role() = 'INSTITUTION_REPRESENTATIVE' 
        AND institution_id = public.get_auth_institution_id()
    );

-- D. Status updates: Restricted to authorized bureau officers and admins
CREATE POLICY "Allow officers update complaints" 
    ON public.complaints FOR UPDATE TO authenticated 
    USING (
        public.get_auth_role() IN ('ADMIN', 'REVIEWER', 'BUREAU_OFFICER')
    );

-- 5. Complaint Events RLS
CREATE POLICY "Allow read complaint events" 
    ON public.complaint_events FOR SELECT TO authenticated 
    USING (
        public.get_auth_role() IN ('ADMIN', 'REVIEWER', 'BUREAU_OFFICER')
        OR (
            public.get_auth_role() = 'INSTITUTION_REPRESENTATIVE'
            AND complaint_id IN (
                SELECT id FROM public.complaints WHERE institution_id = public.get_auth_institution_id()
            )
        )
    );

-- 6. Complaint Relationships (Overlap Candidates) RLS
-- Only authorized bureau reviewers, officers, and admins may inspect or adjudicate overlap pairs
CREATE POLICY "Allow reviewers manage overlap relationships" 
    ON public.complaint_relationships FOR ALL TO authenticated 
    USING (
        public.get_auth_role() IN ('ADMIN', 'REVIEWER', 'BUREAU_OFFICER')
    );

-- 7. Institutional Responses RLS
-- Institution representatives can lodge responses ONLY for their own institution
CREATE POLICY "Institutions lodge own responses" 
    ON public.complaint_responses FOR INSERT TO authenticated 
    WITH CHECK (
        public.get_auth_role() = 'INSTITUTION_REPRESENTATIVE'
        AND institution_id = public.get_auth_institution_id()
    );

CREATE POLICY "Read institutional responses" 
    ON public.complaint_responses FOR SELECT TO authenticated 
    USING (
        public.get_auth_role() IN ('ADMIN', 'REVIEWER', 'BUREAU_OFFICER')
        OR (
            public.get_auth_role() = 'INSTITUTION_REPRESENTATIVE'
            AND institution_id = public.get_auth_institution_id()
        )
    );

-- 8. Audit Logs RLS: Only Administrative Officials & Reviewers can inspect audit history
CREATE POLICY "Allow officers view audit logs" 
    ON public.audit_logs FOR SELECT TO authenticated 
    USING (
        public.get_auth_role() IN ('ADMIN', 'REVIEWER', 'BUREAU_OFFICER')
    );
CREATE POLICY "Allow authenticated log audit entries" 
    ON public.audit_logs FOR INSERT TO authenticated 
    WITH CHECK (true);

-- 9. Secure Complaint Tracking RPC for Citizens (Dual-Factor Verification)
CREATE OR REPLACE FUNCTION public.track_complaint(
    p_ref_number text,
    p_verification text
)
RETURNS jsonb AS $$
DECLARE
    found_case record;
    events_json jsonb;
    result jsonb;
BEGIN
    SELECT * INTO found_case
    FROM public.complaints
    WHERE UPPER(ref_number) = UPPER(TRIM(p_ref_number))
      AND (
          UPPER(tracking_code) = UPPER(TRIM(p_verification))
          OR LOWER(COALESCE(complainant_email, '')) = LOWER(TRIM(p_verification))
          OR TRIM(COALESCE(complainant_phone, '')) = TRIM(p_verification)
      );

    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Grievance record not found. Verify your reference number and dual-factor credential.'
        );
    END IF;

    -- Fetch timeline events
    SELECT COALESCE(jsonb_agg(to_jsonb(e) ORDER BY e.created_at ASC), '[]'::jsonb)
    INTO events_json
    FROM public.complaint_events e
    WHERE e.complaint_id = found_case.id;

    result := jsonb_build_object(
        'success', true,
        'case', jsonb_build_object(
            'id', found_case.id,
            'refNumber', found_case.ref_number,
            'institutionId', found_case.institution_id,
            'bureauId', found_case.bureau_id,
            'category', found_case.category,
            'subject', found_case.subject,
            'description', found_case.description,
            'priority', found_case.priority,
            'status', found_case.status,
            'complainantName', CASE WHEN found_case.is_anonymous THEN 'Whistleblower (Identity Protected)' ELSE found_case.complainant_name END,
            'receivedDate', found_case.received_date,
            'slaDeadline', found_case.sla_deadline,
            'daysOpen', found_case.days_open,
            'lastActionSummary', found_case.last_action_summary,
            'nextActionRequired', found_case.next_action_required,
            'hasOverlap', found_case.has_overlap
        ),
        'timeline', events_json
    );

    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution of track_complaint to anon and authenticated
GRANT EXECUTE ON FUNCTION public.track_complaint(text, text) TO anon, authenticated;

-- =============================================================================
-- STORAGE BUCKET DEFINITIONS & POLICIES
-- =============================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'complaint-attachments',
    'complaint-attachments',
    false,
    10485760, -- 10MB limit
    ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: Upload permitted during intake
CREATE POLICY "Allow grievance document upload"
    ON storage.objects FOR INSERT TO anon, authenticated
    WITH CHECK (bucket_id = 'complaint-attachments');

-- Storage RLS: Download restricted to authorized bureau officers and assigned college representative
CREATE POLICY "Restricted document download"
    ON storage.objects FOR SELECT TO authenticated
    USING (
        bucket_id = 'complaint-attachments'
        AND (
            public.get_auth_role() IN ('ADMIN', 'REVIEWER', 'BUREAU_OFFICER')
            OR (
                public.get_auth_role() = 'INSTITUTION_REPRESENTATIVE'
                AND (storage.foldername(name))[1] IN (
                    SELECT id FROM public.complaints WHERE institution_id = public.get_auth_institution_id()
                )
            )
        )
    );
-- =============================================================================
-- CASEBRIDGE AI — SUPABASE DEMO SEED DATA (SIH 2026 | SIH26264)
-- =============================================================================

-- 1. Insert Bureaus
INSERT INTO public.bureaus (id, name, description, is_active)
VALUES 
    ('PGRC', 'Public Grievance Redressal Cell', 'Student, faculty, and parent complaints, certificate retention, and academic disputes.', true),
    ('REGULATION', 'Regulation Bureau', 'Enforces fee norms, capitation prohibitions, faculty rosters, and state regulation standards.', true),
    ('APPROVAL', 'Approval Bureau', 'Monitors Extension of Approval (EOA), land/infrastructure compliance, and sanctioned intake.', true),
    ('LEGAL', 'Legal Cell', 'Manages High Court/Supreme Court writ petitions, compliance affidavits, and standing counsels.', true),
    ('CPGRAMS', 'CPGRAMS Desk', 'Centralized PMO / DARPG grievance referrals requiring prioritized statutory compliance.', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Institutions
INSERT INTO public.institutions (id, name, state, district, region, category, approval_status, accreditation, affiliated_university, head_of_institution, email, phone, risk_level)
VALUES 
    ('1-10492811', 'Apex Institute of Technology, Pune', 'Maharashtra', 'Pune', 'Western Region', 'Technical / Engineering', 'Under Review', 'NAAC A+', 'Savitribai Phule Pune University', 'Dr. Arvind S. Kulkarni', 'principal@apextech-pune.ac.in', '+91 20 2569 8812', 'HIGH'),
    ('1-28491022', 'Dr. B.R. Ambedkar Institute of Technology & Engineering, Hyderabad', 'Telangana', 'Hyderabad', 'South-Central', 'Technical / Engineering', 'Show-Cause Notice', 'NBA Accredited', 'JNTU Hyderabad', 'Dr. P. Venkateshwarlu', 'director@braite-hyd.edu.in', '+91 40 2315 4400', 'CRITICAL'),
    ('1-39102934', 'National Institute of Management & Science, Lucknow', 'Uttar Pradesh', 'Lucknow', 'Northern Region', 'Management', 'Approved', 'NBA / AIU Approved', 'AKTU Lucknow', 'Prof. Sunita Bajpai', 'director@nims-lucknow.edu.in', '+91 522 274 0911', 'MEDIUM'),
    ('1-48291055', 'Kalinga Polytechnic College, Bhubaneswar', 'Odisha', 'Khordha', 'Eastern Region', 'Polytechnic / Diploma', 'Approved with Deficiency', 'State Board Affiliated', 'SCTE&VT Odisha', 'Er. Manoranjan Das', 'principal@kalingapolytechnic.org', '+91 674 230 1822', 'HIGH'),
    ('1-58291033', 'Vidyapeeth Institute of Technology & Science, Indore', 'Madhya Pradesh', 'Indore', 'Central Region', 'Technical / Engineering', 'Approved', 'NAAC A', 'RGPV Bhopal', 'Dr. Sandeep J. Agrawal', 'registrar@vidyapeeth-indore.ac.in', '+91 731 402 3311', 'LOW'),
    ('1-68291077', 'Himalayan Institute of Pharmaceutical Sciences, Dehradun', 'Uttarakhand', 'Dehradun', 'Northern Region', 'Pharmacy', 'Approved', 'PCI & AICTE Approved', 'Uttarakhand Technical University', 'Dr. Ritu Chamoli', 'dean@hips-dehradun.org', '+91 135 277 8890', 'LOW')
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Complaints
INSERT INTO public.complaints (
    id, ref_number, tracking_code, institution_id, bureau_id, category, subject, description,
    priority, status, complainant_name, complainant_type, complainant_email, complainant_phone,
    is_anonymous, is_confidential, received_date, sla_deadline, days_open, last_action_summary,
    last_action_date, next_action_required, next_action_deadline, assigned_officer, assigned_officer_role,
    has_overlap, overlap_pair_id, relevant_clauses_json
)
VALUES
(
    'AICTE/PGRC/2026/0892', 'PGRC-2026-0892', 'TRK-882194', '1-10492811', 'PGRC', 'CERTIFICATE_WITHHOLDING',
    'Withholding of Original B.Tech Degrees Pending Placement Dues',
    'Complainant student alleges the institute refused to release final semester mark sheets and original transfer certificates until a mandatory campus placement service levy of Rs. 25,000 was settled.',
    'HIGH', 'OVERLAP_FLAGGED', 'Rohit S. Verma', 'STUDENT', 'rohit.verma@example.org', '+91 98234 11200',
    false, false, '2026-03-12', '2026-04-11', 9,
    'Notice served to respondent institution requesting itemized fee breakup.',
    '2026-03-14', 'Evaluate institutional response and cross-bureau overlap alert.', '2026-03-24',
    'Sh. Rajesh Sharma', 'Assistant Director, PGRC', true, 'OVL-2026-001',
    '["APH 2025-26 Chapter VII Clause 7.1"]'::jsonb
),
(
    'AICTE/REG/2026/0142', 'REG-2026-0142', 'TRK-991204', '1-10492811', 'REGULATION', 'CAPITATION_FEE',
    'Inquiry into Unauthorized Ancillary Fee Collection Mechanisms',
    'Parent association complaint alleging compulsory development levies and ancillary charges collected outside the State Fee Regulating Authority approved limits.',
    'HIGH', 'OVERLAP_FLAGGED', 'Pune Engineering Parents Association', 'PARENT', 'parents.assoc.pune@example.org', '+91 94220 88910',
    false, false, '2026-03-04', '2026-04-03', 17,
    'Show-cause letter issued under Regulation 14(2). Response awaited.',
    '2026-03-08', 'Joint Standing Committee hearing coordination with PGRC.', '2026-03-22',
    'Dr. Meenakshi Sundaram', 'Deputy Director, Regulation', true, 'OVL-2026-001',
    '["APH 2025-26 Chapter VII Clause 7.1 & 7.4"]'::jsonb
),
(
    'AICTE/APP/2026/0078', 'APP-2026-0078', 'TRK-440182', '1-10492811', 'APPROVAL', 'FACULTY_IRREGULARITIES',
    'Extension of Approval (EOA) Deficit Audit: Faculty Cadre Ratio',
    'Routine annual inspection noted student-faculty cadre ratio shortfalls in Computer Science Department (1:24 vs mandatory 1:15) and delayed biometric attendance integration.',
    'MEDIUM', 'UNDER_INVESTIGATION', 'Western Regional Standing Scrutiny Team', 'CITIZEN', NULL, NULL,
    false, false, '2026-02-18', '2026-03-20', 31,
    'Deficiency report uploaded to portal. Awaiting compliance affidavit.',
    '2026-02-24', 'Schedule Expert Visit Committee (EVC).', '2026-03-25',
    'Prof. K. Chandrasekhar', 'Director, Approval Bureau', false, NULL,
    '["APH 2025-26 Chapter II Clause 2.8"]'::jsonb
),
(
    'AICTE/CPGRAMS/2026/0045', 'CPG-2026-0045', 'TRK-119280', '1-28491022', 'CPGRAMS', 'INFRASTRUCTURE_DEFICIT',
    'PMO Escalation: Severe Laboratory Apparatus Deficit and Missing Fire Safety NOC',
    'Escalation from Department of Administrative Reforms & Public Grievances alleging campus operates 6 engineering courses without certified civil fire safety clearance.',
    'CRITICAL', 'ESCALATED', 'Faculty Welfare Association', 'FACULTY', NULL, NULL,
    true, true, '2026-01-20', '2026-02-19', 60,
    'Immediate show-cause notice dispatched. College requested 14-day extension.',
    '2026-02-05', 'Hearing before National Standing Appellate Committee.', '2026-03-28',
    'Dr. Abhay Jere', 'National Administrator', false, NULL,
    '["APH 2025-26 Chapter II Safety Norms"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Overlap Pair
INSERT INTO public.complaint_relationships (
    id, case_a_id, case_b_id, institution_id, institution_name, similarity_score,
    urgency, detected_at, rationale_json, status, lead_bureau, reviewer_name, reviewer_notes, reviewed_at
)
VALUES (
    'OVL-2026-001', 'AICTE/PGRC/2026/0892', 'AICTE/REG/2026/0142', '1-10492811',
    'Apex Institute of Technology, Pune', 88, 'HIGH', '2026-03-12 14:22:10 IST',
    '{
        "same_institution": true,
        "institution_confidence": 100,
        "semantic_subject_similarity": 88,
        "entity_matches": ["Permanent Institute ID: 1-10492811", "Apex Institute of Technology, Pune"],
        "common_keywords": ["withholding", "capitation fee", "original mark sheets", "placement dues"],
        "regulatory_clauses": ["APH 2025-26 Chapter VII Clause 7.1"],
        "reason_description": "Cross-bureau correlation: Both complaints cite PID 1-10492811 and challenge institutional certificate retention conditional on fee settlement under Chapter VII Clause 7.1."
    }'::jsonb,
    'PENDING_REVIEW', 'REGULATION', NULL, NULL, NULL
)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Institutional Response
INSERT INTO public.complaint_responses (
    id, complaint_id, institution_id, submitted_by, official_designation, statement,
    compliance_documents_json, status, submitted_at
)
VALUES (
    'RESP-2026-001', 'AICTE/PGRC/2026/0892', '1-10492811',
    'Dr. Arvind S. Kulkarni', 'Principal & Authorized Signatory',
    'Apex Institute of Technology categorically complies with all AICTE norms. The Rs. 25,000 charge cited by complainant Rohit S. Verma represents an optional third-party Japanese language training certification opted by the candidate, and original certificates were released on 2026-03-14 as evidenced by attached candidate acknowledgment receipt.',
    '[{"name": "Candidate_Receipt_Signed.pdf", "size": "1.4 MB", "type": "application/pdf"}]'::jsonb,
    'SUBMITTED', '2026-03-14 11:30:00 IST'
)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Initial Audit Logs
INSERT INTO public.audit_logs (id, case_id, timestamp, action, performed_by, role, bureau, details)
VALUES 
    ('AUD-INIT-001', 'AICTE/PGRC/2026/0892', '2026-03-12 10:14:02 IST', 'Grievance Intake Registered', 'Rohit S. Verma', 'Public Complainant', 'PGRC', 'Complaint filed against Apex Institute of Technology (PID: 1-10492811).'),
    ('AUD-INIT-002', 'AICTE/PGRC/2026/0892', '2026-03-12 14:22:10 IST', 'Candidate Overlap Surfaced', 'Correlation Engine', 'System', 'PGRC', 'Candidate pair OVL-2026-001 surfaced with AICTE/REG/2026/0142. Score: 88%.'),
    ('AUD-INIT-003', 'AICTE/PGRC/2026/0892', '2026-03-14 11:30:00 IST', 'Institutional Counter-Statement Filed', 'Dr. Arvind S. Kulkarni', 'INSTITUTION_REPRESENTATIVE', 'PGRC', 'Formal reply lodged with signed candidate acknowledgment proof.')
ON CONFLICT (id) DO NOTHING;
