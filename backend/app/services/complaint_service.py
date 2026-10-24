import json
import random
from datetime import datetime, timezone, timedelta
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
from app.models.complaint import Complaint
from app.models.institution import Institution
from app.models.event import ComplaintEvent
from app.models.audit import AuditLog
from app.models.relationship import ComplaintRelationship
from app.schemas.complaint import ComplaintCreate, PublicComplaintCreate, ComplaintStatusUpdate, ComplaintAssignRequest


class ComplaintService:
    @staticmethod
    def get_complaints(
        db: Session,
        skip: int = 0,
        limit: int = 50,
        bureau_id: Optional[str] = None,
        status: Optional[str] = None,
        priority: Optional[str] = None,
        has_overlap: Optional[bool] = None,
        institution_id: Optional[str] = None,
        search: Optional[str] = None,
    ) -> Tuple[List[Complaint], int]:
        query = db.query(Complaint)

        if bureau_id and bureau_id != "ALL":
            query = query.filter(Complaint.bureau_id == bureau_id)
        if status and status != "ALL":
            query = query.filter(Complaint.status == status)
        if priority and priority != "ALL":
            query = query.filter(Complaint.priority == priority)
        if has_overlap is not None:
            query = query.filter(Complaint.has_overlap == has_overlap)
        if institution_id:
            query = query.filter(Complaint.institution_id == institution_id)

        if search and search.strip():
            term = f"%{search.strip().lower()}%"
            query = query.join(Institution).filter(
                or_(
                    Complaint.id.ilike(term),
                    Complaint.ref_number.ilike(term),
                    Complaint.subject.ilike(term),
                    Complaint.complainant_name.ilike(term),
                    Institution.name.ilike(term),
                    Institution.id.ilike(term),
                )
            )

        total = query.count()
        complaints = query.order_by(desc(Complaint.created_at)).offset(skip).limit(limit).all()
        return complaints, total

    @staticmethod
    def get_by_id_or_ref(db: Session, identifier: str) -> Optional[Complaint]:
        cleaned = identifier.strip()
        return db.query(Complaint).filter(
            or_(
                Complaint.id.ilike(cleaned),
                Complaint.ref_number.ilike(cleaned)
            )
        ).first()

    @staticmethod
    def create_complaint(
        db: Session,
        data: ComplaintCreate,
        actor_name: str = "Intake Officer",
        actor_role: str = "BUREAU_OFFICER"
    ) -> Complaint:
        year = datetime.now().year
        count = db.query(Complaint).count() + 1
        case_num = f"{count:04d}"
        
        case_id = f"AICTE/{data.bureau_id}/{year}/{case_num}"
        ref_number = f"{data.bureau_id}-{year}-{case_num}"
        tracking_code = f"TRK-{random.randint(100000, 999999)}"
        now_str = datetime.now().strftime("%Y-%m-%d")
        sla_str = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
        next_deadline_str = (datetime.now() + timedelta(days=7)).strftime("%Y-%m-%d")

        # Check existing active complaints for this institution
        existing_for_inst = db.query(Complaint).filter(
            Complaint.institution_id == data.institution_id,
            Complaint.status != "RESOLVED"
        ).all()
        has_overlap = len(existing_for_inst) > 0

        complaint = Complaint(
            id=case_id,
            ref_number=ref_number,
            tracking_code=tracking_code,
            institution_id=data.institution_id,
            bureau_id=data.bureau_id,
            category=data.category,
            subject=data.subject,
            description=data.description,
            priority=data.priority,
            status="OVERLAP_FLAGGED" if has_overlap else "NEW_INTAKE",
            complainant_name="Anonymous Whistleblower" if data.is_anonymous else data.complainant_name,
            complainant_type=data.complainant_type,
            complainant_email=data.complainant_email,
            complainant_phone=data.complainant_phone,
            is_anonymous=data.is_anonymous,
            is_confidential=data.is_confidential,
            received_date=now_str,
            sla_deadline=sla_str,
            days_open=1,
            last_action_summary="Grievance cataloged into CaseBridge AI system.",
            last_action_date=now_str,
            next_action_required="Conduct preliminary administrative scrutiny.",
            next_action_deadline=next_deadline_str,
            assigned_officer=data.assigned_officer or actor_name,
            assigned_officer_role=actor_role,
            has_overlap=has_overlap,
            relevant_clauses_json=json.dumps(data.relevant_clauses) if data.relevant_clauses else json.dumps(["AICTE Approval Process Handbook 2025-26"]),
        )

        db.add(complaint)
        db.flush()

        # Append chronological event
        event = ComplaintEvent(
            id=f"EVT-{int(datetime.now().timestamp()*1000)}",
            complaint_id=complaint.id,
            event_type="INTAKE_RECORDED",
            previous_status=None,
            new_status=complaint.status,
            actor_name=actor_name,
            actor_role=actor_role,
            bureau=complaint.bureau_id,
            explanation=f"New grievance cataloged. Reference: {ref_number}.",
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        )
        db.add(event)

        # Audit log entry
        audit = AuditLog(
            id=f"AUD-{int(datetime.now().timestamp()*1000)}",
            case_id=complaint.id,
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"),
            action="Grievance Intake Registered",
            performed_by=actor_name,
            role=actor_role,
            bureau=complaint.bureau_id,
            details=f"Complaint registered for PID {data.institution_id}. Overlap status: {'Flagged' if has_overlap else 'Clear'}."
        )
        db.add(audit)

        # Trigger genuine candidate retrieval and multi-factor explainable matching
        from app.services.overlap_service import OverlapService
        surfaced_candidates = OverlapService.analyze_complaint(db, complaint.id)
        if surfaced_candidates:
            complaint.has_overlap = True
            complaint.overlap_pair_id = surfaced_candidates[0].id
            complaint.status = "OVERLAP_FLAGGED" 

        db.commit()
        db.refresh(complaint)
        return complaint

    @staticmethod
    def create_public_complaint(db: Session, data: PublicComplaintCreate) -> Tuple[Complaint, str, str]:
        # Formats public intake into ComplaintCreate
        statement_text = data.statement or data.description or "Public grievance submission"
        internal_data = ComplaintCreate(
            institution_id=data.institution_id,
            bureau_id="PGRC",
            category=data.category,
            subject=data.subject,
            description=statement_text,
            priority="HIGH" if data.is_whistleblower else "MEDIUM",
            complainant_name="Confidential Complainant" if data.is_whistleblower else data.complainant_name,
            complainant_type=data.complainant_type or "Student",
            complainant_email=data.complainant_email,
            complainant_phone=data.complainant_phone,
            is_anonymous=data.is_whistleblower or data.is_anonymous,
            is_confidential=data.is_whistleblower or data.is_confidential,
            assigned_officer="Assistant Director, PGRC"
        )
        complaint = ComplaintService.create_complaint(
            db, internal_data, actor_name=data.complainant_name, actor_role="CITIZEN"
        )
        return complaint, complaint.ref_number, complaint.tracking_code

    @staticmethod
    def update_status(
        db: Session,
        complaint_id: str,
        data: ComplaintStatusUpdate,
        actor_name: str,
        actor_role: str,
        actor_bureau: Optional[str] = None
    ) -> Optional[Complaint]:
        complaint = ComplaintService.get_by_id_or_ref(db, complaint_id)
        if not complaint:
            return None

        reason_text = data.justification or data.explanation or "Administrative status transition"
        old_status = complaint.status
        complaint.status = data.status
        now_str = datetime.now().strftime("%Y-%m-%d")
        now_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        complaint.last_action_date = now_str
        complaint.last_action_summary = f"Status updated from {old_status} to {data.status}. Rationale: {reason_text}"

        # Add event
        event = ComplaintEvent(
            id=f"EVT-{int(datetime.now().timestamp()*1000)}",
            complaint_id=complaint.id,
            event_type="STATUS_CHANGE",
            previous_status=old_status,
            new_status=data.status,
            actor_name=actor_name,
            actor_role=actor_role,
            bureau=actor_bureau or complaint.bureau_id,
            explanation=reason_text,
            timestamp=now_time
        )
        db.add(event)

        # Audit log
        audit = AuditLog(
            id=f"AUD-{int(datetime.now().timestamp()*1000)}",
            case_id=complaint.id,
            timestamp=now_time,
            action=f"Status Transition: {data.status}",
            performed_by=actor_name,
            role=actor_role,
            bureau=actor_bureau or complaint.bureau_id,
            details=f"From {old_status} to {data.status}. Justification: {data.justification}"
        )
        db.add(audit)

        db.commit()
        db.refresh(complaint)
        return complaint

    @staticmethod
    def track_complaint(db: Session, ref_number: str, verification_input: str) -> Optional[dict]:
        complaint = ComplaintService.get_by_id_or_ref(db, ref_number)
        if not complaint:
            return None

        # Verify against email, phone, or tracking_code
        v = verification_input.strip().lower()
        code_match = complaint.tracking_code.lower() == v
        email_match = complaint.complainant_email and complaint.complainant_email.lower() == v
        phone_match = complaint.complainant_phone and complaint.complainant_phone.replace(" ", "").replace("-", "") == v.replace(" ", "").replace("-", "")

        if not (code_match or email_match or phone_match):
            return None

        # Safe public milestones without exposing internal notes or confidential officer data
        milestones = [
            {"step": "GRIEVANCE_REGISTERED", "label": "Grievance Lodged & Ref Issued", "completed": True, "date": complaint.received_date},
            {"step": "PRELIMINARY_SCRUTINY", "label": "Bureau Desk Scrutiny", "completed": complaint.status != "NEW_INTAKE", "date": complaint.last_action_date if complaint.status != "NEW_INTAKE" else None},
            {"step": "SHOW_CAUSE_NOTICE", "label": "Institutional Clarification Issued", "completed": complaint.status in ["NOTICE_ISSUED", "HEARING_SCHEDULED", "JOINT_COMMITTEE", "RESOLVED"], "date": None},
            {"step": "COMMITTEE_HEARING", "label": "Standing Redressal Committee", "completed": complaint.status in ["HEARING_SCHEDULED", "JOINT_COMMITTEE", "RESOLVED"], "date": None},
            {"step": "FINAL_DIRECTIVE", "label": "Official Council Order / Closure", "completed": complaint.status == "RESOLVED", "date": None},
        ]

        return {
            "ref_number": complaint.ref_number,
            "status": complaint.status,
            "category": complaint.category,
            "institution_name": complaint.institution.name if complaint.institution else "Technical Institution",
            "institution_region": complaint.institution.region if complaint.institution else "India",
            "bureau": complaint.bureau_id,
            "received_date": complaint.received_date,
            "target_sla_date": complaint.sla_deadline,
            "current_stage": complaint.status,
            "is_confidential": complaint.is_confidential,
            "milestones": milestones,
        }
