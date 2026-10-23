import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.institution_service import InstitutionService
from app.services.complaint_service import ComplaintService
from app.schemas.institution import InstitutionResponse, ResponseCreate
from app.schemas.complaint import ComplaintResponseSchema
from app.models.user import User
from app.models.institution import Institution
from app.models.complaint import Complaint
from app.api.deps import get_current_user, get_optional_current_user, verify_institution_access
from app.api.v1.complaints import serialize_complaint

router = APIRouter()


@router.get("", response_model=List[InstitutionResponse])
def list_institutions(
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Search and list technical institutions registered in AICTE directory.
    """
    institutions = InstitutionService.get_institutions(db, search=search)
    results = []
    for inst in institutions:
        active_count = db.query(Complaint).filter(
            Complaint.institution_id == inst.id,
            Complaint.status != "RESOLVED"
        ).count()
        total_count = db.query(Complaint).filter(Complaint.institution_id == inst.id).count()

        results.append(
            InstitutionResponse(
                id=inst.id,
                name=inst.name,
                state=inst.state,
                district=inst.district,
                region=inst.region,
                category=inst.category,
                approval_status=inst.approval_status,
                accreditation=inst.accreditation,
                affiliated_university=inst.affiliated_university,
                head_of_institution=inst.head_of_institution,
                email=inst.email,
                phone=inst.phone,
                risk_level=inst.risk_level,
                active_cases_count=active_count,
                total_cases_count=total_count,
            )
        )
    return results


@router.get("/{institution_id}", response_model=InstitutionResponse)
def get_institution(
    institution_id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieves full 360° profile and compliance history for an institution.
    """
    inst = InstitutionService.get_by_id(db, institution_id)
    if not inst:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Institution with Permanent ID '{institution_id}' not found."
        )

    active_count = db.query(Complaint).filter(
        Complaint.institution_id == inst.id,
        Complaint.status != "RESOLVED"
    ).count()
    total_count = db.query(Complaint).filter(Complaint.institution_id == inst.id).count()

    return InstitutionResponse(
        id=inst.id,
        name=inst.name,
        state=inst.state,
        district=inst.district,
        region=inst.region,
        category=inst.category,
        approval_status=inst.approval_status,
        accreditation=inst.accreditation,
        affiliated_university=inst.affiliated_university,
        head_of_institution=inst.head_of_institution,
        email=inst.email,
        phone=inst.phone,
        risk_level=inst.risk_level,
        active_cases_count=active_count,
        total_cases_count=total_count,
    )


@router.get("/{institution_id}/complaints", response_model=List[ComplaintResponseSchema])
def get_institution_complaints(
    institution_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Retrieves all complaints active or past for the given institution.
    Enforces strict 403 barrier if an institution representative attempts to access another PID's records.
    """
    if current_user and current_user.role == "INSTITUTION_REPRESENTATIVE":
        if current_user.institution_id != institution_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access Denied: You are not authorized to inspect another institution's complaint dossier."
            )

    complaints, _ = ComplaintService.get_complaints(db=db, institution_id=institution_id, limit=100)
    return [serialize_complaint(c) for c in complaints]


@router.post("/{institution_id}/responses", status_code=status.HTTP_201_CREATED)
def submit_institution_response(
    institution_id: str,
    data: ResponseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lodge an official institutional counter-statement / compliance affidavit.
    Enforces that only the designated institution representative can submit responses.
    """
    verify_institution_access(institution_id, current_user)
    try:
        resp = InstitutionService.submit_response(db, data, institution_id)
        return {
            "success": True,
            "response_id": resp.id,
            "complaint_id": resp.complaint_id,
            "institution_id": resp.institution_id,
            "submitted_at": resp.submitted_at,
            "message": "Official counter-affidavit successfully lodged and appended to the complaint audit trail."
        }
    except PermissionError as e:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(e))


@router.get("/{institution_id}/responses")
def get_institution_responses(
    institution_id: str,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Retrieves historical counter-statements filed by this institution.
    """
    if current_user and current_user.role == "INSTITUTION_REPRESENTATIVE":
        if current_user.institution_id != institution_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access Denied: Cannot view another institution's response ledger."
            )

    responses = InstitutionService.get_responses(db, institution_id=institution_id)
    return [
        {
            "id": r.id,
            "case_id": r.complaint_id,
            "institution_id": r.institution_id,
            "submitted_by": r.submitted_by,
            "official_designation": r.official_designation,
            "statement": r.statement,
            "compliance_documents": json.loads(r.compliance_documents_json) if r.compliance_documents_json else [],
            "status": r.status,
            "submitted_at": r.submitted_at,
        }
        for r in responses
    ]
