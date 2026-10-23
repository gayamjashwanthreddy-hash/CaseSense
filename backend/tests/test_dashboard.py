import pytest
from fastapi import status
from app.models.complaint import Complaint
from app.models.institution import Institution
from app.models.relationship import ComplaintRelationship


def test_dashboard_overview_metrics_consistency(client, db_session):
    response = client.get("/api/v1/dashboard/overview")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()

    # Query true database counts
    all_complaints = db_session.query(Complaint).all()
    db_total_complaints = len(all_complaints)
    db_active_complaints = len([c for c in all_complaints if c.status != "RESOLVED"])
    db_pending_overlaps = db_session.query(ComplaintRelationship).filter(
        ComplaintRelationship.status == "PENDING_REVIEW"
    ).count()

    # 1. Total Active Complaints verification
    assert data["total_active_cases"] == db_active_complaints

    # 2. Overlaps count verification
    assert data["pending_overlaps_count"] == db_pending_overlaps

    # 3. Sum of Bureau Workload Totals MUST EXACTLY equal Total Complaints
    bureau_sum = sum(b["total"] for b in data["bureau_workload"])
    assert bureau_sum == db_total_complaints


def test_dashboard_recent_complaints_contain_real_records(client):
    response = client.get("/api/v1/dashboard/overview")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()

    assert "immediate_attention_cases" in data
    assert len(data["immediate_attention_cases"]) > 0

    first = data["immediate_attention_cases"][0]
    assert "ref_number" in first
    assert "subject" in first
    assert "institution_name" in first
    assert "bureau" in first
    assert "status" in first


def test_health_check_endpoint(client):
    response = client.get("/api/v1/health")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert data["service"] == "CaseBridge AI Backend API"
    assert data["database"] == "CONNECTED"
