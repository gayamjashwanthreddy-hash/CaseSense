import pytest
from fastapi import status


def test_list_overlap_candidates(client, reviewer_token):
    response = client.get(
        "/api/v1/overlap/candidates",
        headers={"Authorization": f"Bearer {reviewer_token}"}
    )
    assert response.status_code == status.HTTP_200_OK
    candidates = response.json()
    assert len(candidates) > 0

    first = candidates[0]
    assert "similarity_score" in first
    assert "rationale" in first
    assert "case_a" in first
    assert "case_b" in first
    assert first["case_a"]["ref_number"] is not None
    assert first["case_b"]["ref_number"] is not None


def test_overlap_rationale_components(client, reviewer_token):
    # Candidate OVL-2026-001 connects PGRC and Regulation complaints for Apex Institute
    response = client.get(
        "/api/v1/overlap/candidates/OVL-2026-001",
        headers={"Authorization": f"Bearer {reviewer_token}"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == "OVL-2026-001"
    assert data["institution_id"] == "1-10492811"
    assert data["similarity_score"] >= 80

    rationale = data["rationale"]
    # Check explainable scoring dimensions
    assert "same_institution" in rationale or "semantic_subject_similarity" in rationale or "entity_matches" in rationale


def test_reviewer_decision_link_as_related(client, reviewer_token):
    decision_payload = {
        "action": "CONFIRMED_LINKED",
        "lead_bureau": "REGULATION",
        "reviewer_notes": "Both complaints arise from the identical withholding of original educational credentials and illegal retention of security deposit during lateral withdrawal. Designated Regulation Bureau as lead coordinating desk while PGRC maintains complainant correspondence."
    }
    response = client.post(
        "/api/v1/overlap/candidates/OVL-2026-001/decision",
        json=decision_payload,
        headers={"Authorization": f"Bearer {reviewer_token}"}
    )
    assert response.status_code == status.HTTP_200_OK
    result = response.json()
    assert result["status"] == "CONFIRMED_LINKED"
    assert result["lead_bureau"] == "REGULATION"
    assert "Designated Regulation Bureau as lead" in result["reviewer_notes"]

    # Verify that BOTH individual cases still retain their independent records (Zero destructive merge!)
    case_a_id = result["case_a_id"]
    case_b_id = result["case_b_id"]

    res_a = client.get(f"/api/v1/complaints/{case_a_id}")
    res_b = client.get(f"/api/v1/complaints/{case_b_id}")

    assert res_a.status_code == status.HTTP_200_OK
    assert res_b.status_code == status.HTTP_200_OK
    assert res_a.json()["id"] != res_b.json()["id"]


def test_reviewer_decision_requires_authorized_role(client, apex_inst_token):
    # Institution representative cannot make administrative overlap decisions
    decision_payload = {
        "action": "REJECTED_DISTINCT",
        "lead_bureau": None,
        "reviewer_notes": "Attempting unauthorized decision from institution portal"
    }
    response = client.post(
        "/api/v1/overlap/candidates/OVL-2026-001/decision",
        json=decision_payload,
        headers={"Authorization": f"Bearer {apex_inst_token}"}
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_trigger_overlap_scan(client, officer_token):
    # Trigger scan on complaint CMP-2026-001
    response = client.post(
        "/api/v1/overlap/analyze",
        json={"case_id": "CMP-2026-001"},
        headers={"Authorization": f"Bearer {officer_token}"}
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["case_id"] == "CMP-2026-001"
    assert "candidates_surfaced" in data
