import json
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.models.bureau import Bureau
from app.models.institution import Institution
from app.models.user import User
from app.models.complaint import Complaint
from app.models.relationship import ComplaintRelationship
from app.models.response import ComplaintResponse
from app.models.event import ComplaintEvent
from app.models.audit import AuditLog
from app.core.security import get_password_hash


def seed_database(db: Session) -> None:
    # Check if already seeded
    if db.query(Bureau).count() > 0:
        return

    print("Seeding CaseBridge AI database with authentic AICTE synthetic dataset...")

    # 1. Bureaus
    bureaus_data = [
        {"id": "PGRC", "name": "Public Grievance Redressal Cell", "description": "Handles student, parent, and faculty complaints, certificate retention, and academic disputes."},
        {"id": "REGULATION", "name": "Regulation Bureau", "description": "Enforces fee norms, capitation prohibitions, faculty rosters, and state regulation standards."},
        {"id": "APPROVAL", "name": "Approval Bureau", "description": "Monitors Extension of Approval (EOA), land/infrastructure compliance, and sanctioned intake."},
        {"id": "LEGAL", "name": "Legal Cell", "description": "Manages High Court/Supreme Court writ petitions, compliance affidavits, and standing counsels."},
        {"id": "CPGRAMS", "name": "CPGRAMS Desk", "description": "Tracks centralized PMO / DARPG grievance referrals requiring prioritized statutory compliance."},
    ]
    for b in bureaus_data:
        db.add(Bureau(**b))
    db.flush()

    # 2. Institutions
    institutions_data = [
        {
            "id": "1-10492811",
            "name": "Apex Institute of Technology, Pune",
            "state": "Maharashtra",
            "district": "Pune",
            "region": "Western Region",
            "category": "Technical / Engineering",
            "approval_status": "Under Review",
            "accreditation": "NAAC A+",
            "affiliated_university": "Savitribai Phule Pune University",
            "head_of_institution": "Dr. Arvind S. Kulkarni",
            "email": "principal@apextech-pune.ac.in",
            "phone": "+91 20 2569 8812",
            "risk_level": "HIGH",
        },
        {
            "id": "1-28491022",
            "name": "Dr. B.R. Ambedkar Institute of Technology & Engineering, Hyderabad",
            "state": "Telangana",
            "district": "Hyderabad",
            "region": "South-Central",
            "category": "Technical / Engineering",
            "approval_status": "Show-Cause Notice",
            "accreditation": "NBA Accredited",
            "affiliated_university": "JNTU Hyderabad",
            "head_of_institution": "Dr. P. Venkateshwarlu",
            "email": "director@braite-hyd.edu.in",
            "phone": "+91 40 2315 4400",
            "risk_level": "CRITICAL",
        },
        {
            "id": "1-39102934",
            "name": "National Institute of Management & Science, Lucknow",
            "state": "Uttar Pradesh",
            "district": "Lucknow",
            "region": "Northern Region",
            "category": "Management",
            "approval_status": "Approved",
            "accreditation": "NBA / AIU Approved",
            "affiliated_university": "AKTU Lucknow",
            "head_of_institution": "Prof. Sunita Bajpai",
            "email": "director@nims-lucknow.edu.in",
            "phone": "+91 522 274 0911",
            "risk_level": "MEDIUM",
        },
        {
            "id": "1-48291055",
            "name": "Kalinga Polytechnic College, Bhubaneswar",
            "state": "Odisha",
            "district": "Khordha",
            "region": "Eastern Region",
            "category": "Polytechnic / Diploma",
            "approval_status": "Approved with Deficiency",
            "accreditation": "State Board Affiliated",
            "affiliated_university": "SCTE&VT Odisha",
            "head_of_institution": "Er. Manoranjan Das",
            "email": "principal@kalingapolytechnic.org",
            "phone": "+91 674 230 1822",
            "risk_level": "HIGH",
        },
        {
            "id": "1-58291033",
            "name": "Vidyapeeth Institute of Technology & Science, Indore",
            "state": "Madhya Pradesh",
            "district": "Indore",
            "region": "Central Region",
            "category": "Technical / Engineering",
            "approval_status": "Approved",
            "accreditation": "NAAC A",
            "affiliated_university": "RGPV Bhopal",
            "head_of_institution": "Dr. Sandeep J. Agrawal",
            "email": "registrar@vidyapeeth-indore.ac.in",
            "phone": "+91 731 402 3311",
            "risk_level": "LOW",
        },
        {
            "id": "1-68291077",
            "name": "Himalayan Institute of Pharmaceutical Sciences, Dehradun",
            "state": "Uttarakhand",
            "district": "Dehradun",
            "region": "Northern Region",
            "category": "Pharmacy",
            "approval_status": "Approved",
            "accreditation": "PCI & AICTE Approved",
            "affiliated_university": "Uttarakhand Technical University",
            "head_of_institution": "Dr. Ritu Chamoli",
            "email": "dean@hips-dehradun.org",
            "phone": "+91 135 277 8890",
            "risk_level": "LOW",
        },
    ]
    for inst in institutions_data:
        db.add(Institution(**inst))
    db.flush()

    # 3. Users across roles
    users_data = [
        {
            "id": "USR-001",
            "email": "admin@aicte-india.org",
            "full_name": "Dr. Abhay Jere",
            "hashed_password": get_password_hash("admin@2026"),
            "role": "ADMIN",
            "bureau_id": None,
            "institution_id": None,
        },
        {
            "id": "USR-002",
            "email": "m.sundaram@aicte-india.org",
            "full_name": "Dr. Meenakshi Sundaram",
            "hashed_password": get_password_hash("officer@2026"),
            "role": "BUREAU_OFFICER",
            "bureau_id": "REGULATION",
            "institution_id": None,
        },
        {
            "id": "USR-003",
            "email": "rajesh.sharma@aicte-india.org",
            "full_name": "Sh. Rajesh Sharma",
            "hashed_password": get_password_hash("officer@2026"),
            "role": "BUREAU_OFFICER",
            "bureau_id": "PGRC",
            "institution_id": None,
        },
        {
            "id": "USR-004",
            "email": "k.chandrasekhar@aicte-india.org",
            "full_name": "Prof. K. Chandrasekhar",
            "hashed_password": get_password_hash("officer@2026"),
            "role": "BUREAU_OFFICER",
            "bureau_id": "APPROVAL",
            "institution_id": None,
        },
        {
            "id": "USR-005",
            "email": "anuradha.sen@aicte-india.org",
            "full_name": "Smt. Anuradha Sen",
            "hashed_password": get_password_hash("reviewer@2026"),
            "role": "REVIEWER",
            "bureau_id": "REGULATION",
            "institution_id": None,
        },
        # Institutional Representatives
        {
            "id": "USR-INST-001",
            "email": "registrar@apextech-pune.ac.in",
            "full_name": "Dr. Arvind S. Kulkarni (Principal)",
            "hashed_password": get_password_hash("apex@compliance2026"),
            "role": "INSTITUTION_REPRESENTATIVE",
            "bureau_id": None,
            "institution_id": "1-10492811",
        },
        {
            "id": "USR-INST-002",
            "email": "director@braite-hyd.edu.in",
            "full_name": "Dr. P. Venkateshwarlu (Director)",
            "hashed_password": get_password_hash("braite@compliance2026"),
            "role": "INSTITUTION_REPRESENTATIVE",
            "bureau_id": None,
            "institution_id": "1-28491022",
        },
        {
            "id": "USR-INST-003",
            "email": "director@nims-lucknow.edu.in",
            "full_name": "Prof. Sunita Bajpai (Dean)",
            "hashed_password": get_password_hash("nims@compliance2026"),
            "role": "INSTITUTION_REPRESENTATIVE",
            "bureau_id": None,
            "institution_id": "1-39102934",
        },
    ]
    for u in users_data:
        db.add(User(**u))
    db.flush()

    # 4. Seed Complaints
    complaints_data = [
        {
            "id": "AICTE/PGRC/2026/0892",
            "ref_number": "PGRC-2026-0892",
            "tracking_code": "TRK-882194",
            "institution_id": "1-10492811",
            "bureau_id": "PGRC",
            "category": "CERTIFICATE_WITHHOLDING",
            "subject": "Withholding of Original B.Tech Degrees Pending Placement Dues",
            "description": "Complainant student alleges the institute refused to release final semester mark sheets and original transfer certificates until a mandatory 'campus placement service levy' of ₹25,000 was settled.",
            "priority": "HIGH",
            "status": "OVERLAP_FLAGGED",
            "complainant_name": "Rohit S. Verma",
            "complainant_type": "STUDENT",
            "complainant_email": "rohit.verma@example.org",
            "complainant_phone": "+91 98234 11200",
            "is_anonymous": False,
            "is_confidential": False,
            "received_date": "2026-03-12",
            "sla_deadline": "2026-04-11",
            "days_open": 9,
            "last_action_summary": "Notice served to respondent institution requesting itemized fee breakup.",
            "last_action_date": "2026-03-14",
            "next_action_required": "Evaluate institutional response and cross-bureau overlap alert.",
            "next_action_deadline": "2026-03-24",
            "assigned_officer": "Sh. Rajesh Sharma",
            "assigned_officer_role": "Assistant Director, PGRC",
            "has_overlap": True,
            "overlap_pair_id": "OVL-2026-001",
            "relevant_clauses_json": json.dumps(["APH 2025-26 Chapter VII Clause 7.1"]),
        },
        {
            "id": "AICTE/REG/2026/0142",
            "ref_number": "REG-2026-0142",
            "tracking_code": "TRK-991204",
            "institution_id": "1-10492811",
            "bureau_id": "REGULATION",
            "category": "CAPITATION_FEE",
            "subject": "Inquiry into Unauthorized Ancillary Fee Collection Mechanisms",
            "description": "Parent association complaint alleging compulsory development levies and ancillary charges collected outside the State Fee Regulating Authority approved limits.",
            "priority": "HIGH",
            "status": "OVERLAP_FLAGGED",
            "complainant_name": "Pune Engineering Parents Association",
            "complainant_type": "PARENT",
            "complainant_email": "parents.assoc.pune@example.org",
            "complainant_phone": "+91 94220 88910",
            "is_anonymous": False,
            "is_confidential": False,
            "received_date": "2026-03-04",
            "sla_deadline": "2026-04-03",
            "days_open": 17,
            "last_action_summary": "Show-cause letter issued under Regulation 14(2). Response awaited.",
            "last_action_date": "2026-03-08",
            "next_action_required": "Joint Standing Committee hearing coordination with PGRC.",
            "next_action_deadline": "2026-03-22",
            "assigned_officer": "Dr. Meenakshi Sundaram",
            "assigned_officer_role": "Deputy Director, Regulation",
            "has_overlap": True,
            "overlap_pair_id": "OVL-2026-001",
            "relevant_clauses_json": json.dumps(["APH 2025-26 Chapter VII Clause 7.1 & 7.4"]),
        },
        {
            "id": "AICTE/APP/2026/0078",
            "ref_number": "APP-2026-0078",
            "tracking_code": "TRK-440182",
            "institution_id": "1-10492811",
            "bureau_id": "APPROVAL",
            "category": "FACULTY_IRREGULARITIES",
            "subject": "Extension of Approval (EOA) Deficit Audit: Faculty Cadre Ratio",
            "description": "Routine annual inspection noted student-faculty cadre ratio shortfalls in Computer Science Department (1:24 vs mandatory 1:15) and delayed biometric attendance integration.",
            "priority": "MEDIUM",
            "status": "UNDER_INVESTIGATION",
            "complainant_name": "Western Regional Standing Scrutiny Team",
            "complainant_type": "CITIZEN",
            "is_anonymous": False,
            "is_confidential": False,
            "received_date": "2026-02-18",
            "sla_deadline": "2026-03-20",
            "days_open": 31,
            "last_action_summary": "Deficiency report uploaded to portal. Awaiting compliance affidavit.",
            "last_action_date": "2026-02-24",
            "next_action_required": "Schedule Expert Visit Committee (EVC).",
            "next_action_deadline": "2026-03-25",
            "assigned_officer": "Prof. K. Chandrasekhar",
            "assigned_officer_role": "Director, Approval Bureau",
            "has_overlap": False,
            "relevant_clauses_json": json.dumps(["APH 2025-26 Chapter II Clause 2.8"]),
        },
        {
            "id": "AICTE/CPGRAMS/2026/0045",
            "ref_number": "CPG-2026-0045",
            "tracking_code": "TRK-119280",
            "institution_id": "1-28491022",
            "bureau_id": "CPGRAMS",
            "category": "INFRASTRUCTURE_DEFICIT",
            "subject": "PMO Escalation: Severe Laboratory Apparatus Deficit and Missing Fire Safety NOC",
            "description": "Escalation from Department of Administrative Reforms & Public Grievances alleging campus operates 6 engineering courses without certified civil fire safety clearance.",
            "priority": "CRITICAL",
            "status": "ESCALATED",
            "complainant_name": "Faculty Welfare Association",
            "complainant_type": "FACULTY",
            "is_anonymous": True,
            "is_confidential": True,
            "received_date": "2026-01-20",
            "sla_deadline": "2026-02-19",
            "days_open": 60,
            "last_action_summary": "Immediate show-cause notice dispatched. College requested 14-day extension.",
            "last_action_date": "2026-02-05",
            "next_action_required": "Hearing before National Standing Appellate Committee.",
            "next_action_deadline": "2026-03-28",
            "assigned_officer": "Dr. Abhay Jere",
            "assigned_officer_role": "National Administrator",
            "has_overlap": False,
            "relevant_clauses_json": json.dumps(["APH 2025-26 Chapter II Safety Norms"]),
        },
    ]

    for c in complaints_data:
        db.add(Complaint(**c))
    db.flush()

    # 5. Seed Overlap Pair
    rationale_ovl1 = {
        "same_institution": True,
        "institution_confidence": 100,
        "semantic_subject_similarity": 88,
        "entity_matches": ["Permanent Institute ID: 1-10492811", "Apex Institute of Technology, Pune"],
        "common_keywords": ["withholding", "capitation fee", "original mark sheets", "placement dues"],
        "regulatory_clauses": ["APH 2025-26 Chapter VII Clause 7.1"],
        "reason_description": "Cross-bureau correlation: Both complaints cite PID 1-10492811 and challenge institutional certificate retention conditional on fee settlement under Chapter VII Clause 7.1."
    }

    ovl1 = ComplaintRelationship(
        id="OVL-2026-001",
        case_a_id="AICTE/PGRC/2026/0892",
        case_b_id="AICTE/REG/2026/0142",
        institution_id="1-10492811",
        institution_name="Apex Institute of Technology, Pune",
        similarity_score=88,
        urgency="HIGH",
        detected_at="2026-03-12 14:22:10 IST",
        rationale_json=json.dumps(rationale_ovl1),
        status="PENDING_REVIEW",
        lead_bureau="REGULATION",
    )
    db.add(ovl1)

    # 6. Seed Institutional Response
    resp1 = ComplaintResponse(
        id="RESP-2026-001",
        complaint_id="AICTE/PGRC/2026/0892",
        institution_id="1-10492811",
        submitted_by="Dr. Arvind S. Kulkarni",
        official_designation="Principal & Authorized Signatory",
        statement="Apex Institute of Technology categorically complies with all AICTE norms. The ₹25,000 charge cited by complainant Rohit S. Verma represents an optional third-party Japanese language training certification opted by the candidate, and original certificates were released on 2026-03-14 as evidenced by attached candidate acknowledgment receipt.",
        compliance_documents_json=json.dumps([{"name": "Candidate_Receipt_Signed.pdf", "size": "1.4 MB", "type": "application/pdf"}]),
        status="SUBMITTED",
        submitted_at="2026-03-14 11:30:00 IST",
    )
    db.add(resp1)

    # 7. Seed Initial Audit Logs
    audit_data = [
        {
            "id": "AUD-INIT-001",
            "case_id": "AICTE/PGRC/2026/0892",
            "timestamp": "2026-03-12 10:14:02 IST",
            "action": "Grievance Intake Registered",
            "performed_by": "Rohit S. Verma",
            "role": "Public Complainant",
            "bureau": "PGRC",
            "details": "Complaint filed against Apex Institute of Technology (PID: 1-10492811).",
        },
        {
            "id": "AUD-INIT-002",
            "case_id": "AICTE/PGRC/2026/0892",
            "timestamp": "2026-03-12 14:22:10 IST",
            "action": "Candidate Overlap Surfaced",
            "performed_by": "Correlation Engine",
            "role": "System",
            "bureau": "PGRC",
            "details": "Candidate pair OVL-2026-001 surfaced with AICTE/REG/2026/0142. Score: 88%.",
        },
        {
            "id": "AUD-INIT-003",
            "case_id": "AICTE/PGRC/2026/0892",
            "timestamp": "2026-03-14 11:30:00 IST",
            "action": "Institutional Counter-Statement Filed",
            "performed_by": "Dr. Arvind S. Kulkarni",
            "role": "INSTITUTION_REPRESENTATIVE",
            "bureau": "PGRC",
            "details": "Formal reply lodged with signed candidate acknowledgment proof.",
        },
    ]
    for a in audit_data:
        db.add(AuditLog(**a))

    db.commit()
    print("Database seeding completed successfully!")
