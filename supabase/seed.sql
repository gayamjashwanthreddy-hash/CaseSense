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
