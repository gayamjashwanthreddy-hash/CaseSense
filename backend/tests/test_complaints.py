import pytest
from fastapi import status


def test_public_complaint_registration(client):
    payload = {
        "institution_id": "1-10492811",
        "category": "Academic Mismanagement",
        "subject": "Delayed distribution of semester marksheets",
        "description": "The institution has not released the 6th semester marksheets despite repeated requests, affecting employment joining.",
        "complainant_name": "Rohan Deshmukh",
        "complainant_type": "Student",
        "complainant_email": "rohan.deshmukh@example.com",
        "complainant_phone": "+91 98765 43210",
        "is_anonymous": False,
        "is_confidential": False
    }
    response = client.post("/api/v1/complaints/public", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["success"] is True
    assert "ref_number" in data
    assert "tracking_code" in data
    assert data["ref_number"].startswith("PGRC-") or data["case_id"].startswith("AICTE/")
    assert len(data["tracking_code"]) >= 6


def test_public_complaint_dual_factor_tracking(client):
    # First create a public complaint
    payload = {
        "institution_id": "1-10492811",
        "category": "Fee Regulatory Violation",
        "subject": "Extra development fee demanded",
        "description": "Additional unauthorized development fee charged before hall ticket issue.",
        "complainant_name": "Pooja Hegde",
        "complainant_type": "Student",
        "complainant_email": "pooja.hegde@example.com",
        "complainant_phone": "+91 91234 56789",
        "is_anonymous": False,
        "is_confidential": False
    }
    res = client.post("/api/v1/complaints/public", json=payload)
    assert res.status_code == status.HTTP_201_CREATED
    intake = res.json()
    ref_number = intake["ref_number"]
    tracking_code = intake["tracking_code"]

    # 1. Track using tracking_code
    track_res1 = client.post(
        "/api/v1/complaints/track",
        json={"ref_number": ref_number, "verification_input": tracking_code}
    )
    assert track_res1.status_code == status.HTTP_200_OK
    data1 = track_res1.json()
    assert data1["ref_number"] == ref_number
    assert data1["status"] in ["Submitted", "Intake Verification", "Under Review", "NEW_INTAKE", "OVERLAP_FLAGGED"]

    # 2. Track using email
    track_res2 = client.post(
        "/api/v1/complaints/track",
        json={"ref_number": ref_number, "verification_input": "pooja.hegde@example.com"}
    )
    assert track_res2.status_code == status.HTTP_200_OK

    # 3. Track using incorrect verification credential (Anti-enumeration)
    track_res3 = client.post(
        "/api/v1/complaints/track",
        json={"ref_number": ref_number, "verification_input": "wrong.email@example.com"}
    )
    assert track_res3.status_code == status.HTTP_404_NOT_FOUND


def test_officer_complaint_intake(client, officer_token):
    payload = {
        "institution_id": "1-10492811",
        "bureau_id": "REGULATION",
        "category": "Faculty Norms Violation",
        "subject": "Faculty roster not maintained as per 1:15 cadre ratio",
        "description": "Inspection notice referral regarding faculty deficiencies in Mechanical Engineering department.",
        "complainant_name": "State Directorate of Technical Education",
        "complainant_type": "Other",
        "priority": "HIGH",
        "sla_days": 15,
        "relevant_clauses": ["AICTE Regulation 2024 Clause 7.1", "Cadre Ratio Norm 1:15"]
    }
    response = client.post(
        "/api/v1/complaints",
        json=payload,
        headers={"Authorization": f"Bearer {officer_token}"}
    )
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["bureau_id"] == "REGULATION"
    assert data["priority"] == "HIGH"
    assert "Cadre Ratio Norm 1:15" in data["relevant_clauses"]


def test_complaints_list_filtering(client, admin_token):
    # Filter by bureau PGRC
    response = client.get(
        "/api/v1/complaints?bureau=PGRC",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == status.HTTP_200_OK
    cases = response.json()
    assert len(cases) > 0
    for c in cases:
        assert c["bureau_id"] == "PGRC"


def test_complaints_institution_scoping(client, apex_inst_token):
    # Institution representative from Apex (1-10492811)
    response = client.get(
        "/api/v1/complaints",
        headers={"Authorization": f"Bearer {apex_inst_token}"}
    )
    assert response.status_code == status.HTTP_200_OK
    cases = response.json()
    assert len(cases) > 0
    for c in cases:
        assert c["institution_id"] == "1-10492811"


def test_complaint_status_transition_and_audit(client, reviewer_token):
    # Transition status of seeded complaint PGRC-2026-0892
    payload = {
        "status": "Bureau Inquiry",
        "explanation": "Inquiry committee convened under Dr. Sundaram for verification of certificate return receipt.",
        "next_action": "Submit inquiry report within 7 business days",
        "next_action_deadline": "2026-11-10"
    }
    response = client.post(
        "/api/v1/complaints/PGRC-2026-0892/status",
        json=payload,
        headers={"Authorization": f"Bearer {reviewer_token}"}
    )
    assert response.status_code == status.HTTP_200_OK
    updated = response.json()
    assert updated["status"] == "Bureau Inquiry"

    # Verify event audit trail contains the explanation and actor
    events = updated["events"]
    assert len(events) > 0
    latest_event = events[0]
    assert latest_event["new_status"] == "Bureau Inquiry"
    assert "Inquiry committee convened" in latest_event["explanation"]
