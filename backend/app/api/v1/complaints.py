import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.complaint_service import ComplaintService
from app.schemas.complaint import (
    ComplaintCreate,
    PublicComplaintCreate,
    ComplaintStatusUpdate,
    ComplaintResponseSchema,
    PublicTrackingResponse,
    ComplaintEventItem,
)
from app.models.user import User
from app.models.complaint import Complaint
from app.api.deps import get_current_user, get_optional_current_user, require_roles

router = APIRouter()


def serialize_complaint(c: Complaint) -> dict:
    events = [
        {
            "id": e.id,
            "event_type": e.event_type,
            "previous_status": e.previous_status,
            "new_status": e.new_status,
            "actor_name": e.actor_name,
            "actor_role": e.actor_role,
            "bureau": e.bureau,
            "explanation": e.explanation,
            "timestamp": e.timestamp,
        }
        for e in (c.events or [])
    ]
    responses = [
        {
            "id": r.id,
            "institution_id": r.institution_id,
            "submitted_by": r.submitted_by,
            "official_designation": r.official_designation,
            "statement": r.statement,
            "compliance_documents": json.loads(r.compliance_documents_json) if r.compliance_documents_json else [],
            "submitted_at": r.submitted_at,
        }
        for r in (c.responses or [])
    ]
    return {
        "id": c.id,
        "ref_number": c.ref_number,
        "tracking_code": c.tracking_code,
        "institution_id": c.institution_id,
        "institution_name": c.institution.name if c.institution else "Registered Institution",
        "institution_state": c.institution.state if c.institution else "India",
        "institution_region": c.institution.region if c.institution else "Central",
        "bureau_id": c.bureau_id,
        "category": c.category,
        "subject": c.subject,
        "description": c.description,
        "priority": c.priority,
        "status": c.status,
        "complainant_name": c.complainant_name,
        "complainant_type": c.complainant_type,
        "complainant_email": c.complainant_email,
        "complainant_phone": c.complainant_phone,
        "is_anonymous": c.is_anonymous,
        "is_confidential": c.is_confidential,
        "received_date": c.received_date,
        "sla_deadline": c.sla_deadline,
        "days_open": c.days_open,
        "last_action_summary": c.last_action_summary,
        "last_action_date": c.last_action_date,
        "next_action_required": c.next_action_required,
        "next_action_deadline": c.next_action_deadline,
        "assigned_officer": c.assigned_officer,
        "assigned_officer_role": c.assigned_officer_role,
        "has_overlap": c.has_overlap,
        "overlap_pair_id": c.overlap_pair_id,
        "relevant_clauses": json.loads(c.relevant_clauses_json) if c.relevant_clauses_json else [],
        "events": events,
        "responses": responses,
    }


@router.get("", response_model=List[ComplaintResponseSchema])
def list_complaints(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    bureau: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    has_overlap: Optional[bool] = None,
    institution_id: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Search and filter complaint cases across AICTE bureaus.
    Enforces role-based data filtering: Institution users automatically receive only their PID's complaints.
    """
    scoped_inst_id = institution_id
    if current_user and current_user.role == "INSTITUTION_REPRESENTATIVE":
        scoped_inst_id = current_user.institution_id

    complaints, total = ComplaintService.get_complaints(
        db=db,
        skip=skip,
        limit=limit,
        bureau_id=bureau,
        status=status,
        priority=priority,
        has_overlap=has_overlap,
        institution_id=scoped_inst_id,
        search=search,
    )
    return [serialize_complaint(c) for c in complaints]


@router.post("", response_model=ComplaintResponseSchema, status_code=status.HTTP_201_CREATED)
def create_complaint(
    data: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Internal intake route for authorized desk officers.
    """
    c = ComplaintService.create_complaint(
        db=db,
        data=data,
        actor_name=current_user.full_name,
        actor_role=current_user.role
    )
    return serialize_complaint(c)


@router.post("/public", status_code=status.HTTP_201_CREATED)
def register_public_complaint(
    data: PublicComplaintCreate,
    db: Session = Depends(get_db)
):
    """
    Citizen & Student public intake gateway.
    Returns safe non-guessable reference and dual-factor tracking code.
    """
    complaint, ref_number, tracking_code = ComplaintService.create_public_complaint(db, data)
    return {
        "success": True,
        "case_id": complaint.id,
        "ref_number": ref_number,
        "tracking_code": tracking_code,
        "institution_name": complaint.institution.name if complaint.institution else "Registered Institution",
        "received_date": complaint.received_date,
        "sla_deadline": complaint.sla_deadline,
        "message": "Grievance successfully cataloged into CaseBridge AI. Retain your Reference Number and Tracking Code."
    }


@router.post("/track", response_model=PublicTrackingResponse)
def track_complaint_status(
    payload: dict,
    db: Session = Depends(get_db)
):
    """
    Anti-enumeration public tracking verification:
    Requires both reference number AND verification input (email, phone, or tracking code).
    """
    ref_number = payload.get("ref_number", "")
    verification = payload.get("verification_input", "")

    if not ref_number or not verification:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both Reference Number and Verification Input (Email, Phone, or Tracking Code) are required."
        )

    res = ComplaintService.track_complaint(db, ref_number, verification)
    if not res:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No grievance matching the provided Reference Number and verification credential was found."
        )
    return res


@router.post("/status", response_model=ComplaintResponseSchema)
def update_complaint_status_direct(
    data: ComplaintStatusUpdate,
    identifier: str = Query(..., description="Complaint ID or Reference Number"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Updates case status by identifier query parameter (safe for IDs containing forward slashes).
    """
    c = ComplaintService.update_status(
        db=db,
        complaint_id=identifier,
        data=data,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        actor_bureau=current_user.bureau_id
    )
    if not c:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint docket '{identifier}' not found."
        )
    return serialize_complaint(c)


@router.post("/{identifier}/status", response_model=ComplaintResponseSchema)
def update_complaint_status(
    identifier: str,
    data: ComplaintStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Updates case status with mandatory justification and records immutable audit event.
    """
    c = ComplaintService.update_status(
        db=db,
        complaint_id=identifier,
        data=data,
        actor_name=current_user.full_name,
        actor_role=current_user.role,
        actor_bureau=current_user.bureau_id
    )
    if not c:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint docket '{identifier}' not found."
        )
    return serialize_complaint(c)


@router.get("/{identifier}/timeline", response_model=List[ComplaintEventItem])
def get_complaint_timeline(
    identifier: str,
    db: Session = Depends(get_db)
):
    """
    Returns complete chronological timeline for a complaint case.
    """
    c = ComplaintService.get_by_id_or_ref(db, identifier)
    if not c:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint docket '{identifier}' not found."
        )
    return c.events


@router.get("/{identifier:path}", response_model=ComplaintResponseSchema)
def get_complaint(
    identifier: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Retrieves full complaint file with chronological audit history and institutional responses.
    Enforces 403 access control for cross-institution requests.
    Supports identifiers with forward slashes (e.g., AICTE/PGRC/2026/0892) and ref numbers (PGRC-2026-0892).
    """
    c = ComplaintService.get_by_id_or_ref(db, identifier)
    if not c:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Complaint docket '{identifier}' not found."
        )

    # Scoping check for institution reps
    if current_user and current_user.role == "INSTITUTION_REPRESENTATIVE":
        if current_user.institution_id != c.institution_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access Denied: You are not authorized to view another institution's dossier."
            )

    return serialize_complaint(c)
