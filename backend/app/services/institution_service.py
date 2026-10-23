import json
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from app.models.institution import Institution
from app.models.complaint import Complaint
from app.models.response import ComplaintResponse
from app.models.event import ComplaintEvent
from app.models.audit import AuditLog
from app.schemas.institution import ResponseCreate


class InstitutionService:
    @staticmethod
    def get_institutions(db: Session, search: Optional[str] = None) -> List[Institution]:
        query = db.query(Institution)
        if search and search.strip():
            term = f"%{search.strip().lower()}%"
            query = query.filter(
                or_(
                    Institution.name.ilike(term),
                    Institution.id.ilike(term),
                    Institution.state.ilike(term),
                    Institution.district.ilike(term),
                    Institution.region.ilike(term),
                )
            )
        return query.order_by(Institution.name).all()

    @staticmethod
    def get_by_id(db: Session, institution_id: str) -> Optional[Institution]:
        return db.query(Institution).filter(
            Institution.id.ilike(institution_id.strip())
        ).first()

    @staticmethod
    def get_responses(db: Session, institution_id: Optional[str] = None) -> List[ComplaintResponse]:
        query = db.query(ComplaintResponse)
        if institution_id:
            query = query.filter(ComplaintResponse.institution_id == institution_id)
        return query.order_by(desc(ComplaintResponse.created_at)).all()

    @staticmethod
    def submit_response(db: Session, data: ResponseCreate, institution_id: str) -> ComplaintResponse:
        # Enforce institution security: ensure complaint belongs to this institution
        complaint = db.query(Complaint).filter(Complaint.id == data.case_id).first()
        if not complaint or complaint.institution_id != institution_id:
            raise PermissionError("Access Denied: Cannot submit response to another institution's complaint.")

        year = datetime.now().year
        count = db.query(ComplaintResponse).count() + 1
        resp_id = f"RESP-{year}-{count:03d}"
        now_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")

        response = ComplaintResponse(
            id=resp_id,
            complaint_id=complaint.id,
            institution_id=institution_id,
            submitted_by=data.submitted_by,
            official_designation=data.official_designation,
            statement=data.statement,
            compliance_documents_json=json.dumps(data.compliance_documents or []),
            status="SUBMITTED",
            submitted_at=now_time
        )
        db.add(response)

        # Update complaint last action summary
        complaint.last_action_date = datetime.now().strftime("%Y-%m-%d")
        complaint.last_action_summary = f"Institutional counter-affidavit filed by {data.submitted_by} ({data.official_designation})."

        # Event
        event = ComplaintEvent(
            id=f"EVT-{int(datetime.now().timestamp()*1000)}",
            complaint_id=complaint.id,
            event_type="RESPONSE_FILED",
            previous_status=complaint.status,
            new_status=complaint.status,
            actor_name=data.submitted_by,
            actor_role="INSTITUTION_REPRESENTATIVE",
            bureau=complaint.bureau_id,
            explanation=f"Institutional response {resp_id} submitted with compliance evidence.",
            timestamp=now_time
        )
        db.add(event)

        # Audit log
        audit = AuditLog(
            id=f"AUD-{int(datetime.now().timestamp()*1000)}",
            case_id=complaint.id,
            timestamp=now_time,
            action="Institutional Counter-Statement Filed",
            performed_by=data.submitted_by,
            role="INSTITUTION_REPRESENTATIVE",
            bureau=complaint.bureau_id,
            details=f"Response {resp_id} lodged by {institution_id}."
        )
        db.add(audit)

        db.commit()
        db.refresh(response)
        return response
