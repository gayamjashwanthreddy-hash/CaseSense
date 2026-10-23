import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.overlap_service import OverlapService
from app.schemas.overlap import OverlapCandidateResponse, OverlapDecisionRequest, OverlapAnalyzeRequest
from app.models.relationship import ComplaintRelationship
from app.models.complaint import Complaint
from app.models.user import User
from app.api.deps import get_current_user, require_roles

router = APIRouter()


def serialize_overlap(rel: ComplaintRelationship, db: Session) -> dict:
    case_a = db.query(Complaint).filter(Complaint.id == rel.case_a_id).first()
    case_b = db.query(Complaint).filter(Complaint.id == rel.case_b_id).first()

    def serialize_case(c: Optional[Complaint]):
        if not c:
            return None
        return {
            "id": c.id,
            "ref_number": c.ref_number,
            "bureau": c.bureau_id,
            "category": c.category,
            "subject": c.subject,
            "description": c.description,
            "complainant": c.complainant_name,
            "received_date": c.received_date,
            "days_open": c.days_open,
            "status": c.status,
            "priority": c.priority,
            "relevant_clauses": json.loads(c.relevant_clauses_json) if c.relevant_clauses_json else [],
        }

    rationale = json.loads(rel.rationale_json) if rel.rationale_json else {}

    return {
        "id": rel.id,
        "case_a_id": rel.case_a_id,
        "case_b_id": rel.case_b_id,
        "institution_id": rel.institution_id,
        "institution_name": rel.institution_name,
        "similarity_score": rel.similarity_score,
        "urgency": rel.urgency,
        "detected_at": rel.detected_at,
        "status": rel.status,
        "lead_bureau": rel.lead_bureau,
        "reviewer_name": rel.reviewer_name,
        "reviewer_notes": rel.reviewer_notes,
        "reviewed_at": rel.reviewed_at,
        "rationale": rationale,
        "case_a": serialize_case(case_a),
        "case_b": serialize_case(case_b),
    }


@router.get("/candidates", response_model=List[OverlapCandidateResponse])
def list_overlap_candidates(
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Returns candidate cross-bureau overlap pairs surfaced by the correlation engine.
    """
    candidates = OverlapService.get_candidates(db, status_filter=status)
    return [serialize_overlap(c, db) for c in candidates]


@router.get("/candidates/{pair_id}", response_model=OverlapCandidateResponse)
def get_overlap_candidate(
    pair_id: str,
    db: Session = Depends(get_db)
):
    """
    Returns detailed candidate pair comparison with full companion case attributes.
    """
    candidate = OverlapService.get_by_id(db, pair_id)
    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Overlap candidate '{pair_id}' not found."
        )
    return serialize_overlap(candidate, db)


@router.post("/candidates/{pair_id}/decision", response_model=OverlapCandidateResponse)
def record_reviewer_decision(
    pair_id: str,
    data: OverlapDecisionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["ADMIN", "REVIEWER", "BUREAU_OFFICER"]))
):
    """
    Official Reviewer Adjudication Desk (Human-in-the-Loop):
    Executes 'CONFIRMED_LINKED', 'REJECTED_DISTINCT', 'DEFERRED', or 'MERGED'.
    Enforces mandatory written justification committed to the permanent audit ledger.
    """
    resolved = OverlapService.resolve_overlap(
        db=db,
        pair_id=pair_id,
        action=data.action,
        reviewer_notes=data.reviewer_notes,
        reviewer_name=current_user.full_name,
        lead_bureau=data.lead_bureau
    )
    if not resolved:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Overlap candidate '{pair_id}' not found."
        )
    return serialize_overlap(resolved, db)


@router.post("/analyze")
def trigger_overlap_scan(
    data: OverlapAnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Triggers explicit correlation evaluation between the given case and existing active dockets.
    """
    pairs = OverlapService.analyze_complaint(db, data.case_id)
    return {
        "case_id": data.case_id,
        "candidates_surfaced": len(pairs),
        "candidate_ids": [p.id for p in pairs]
    }
