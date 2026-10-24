import json
import re
from datetime import datetime, timezone
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
from app.models.relationship import ComplaintRelationship
from app.models.complaint import Complaint
from app.models.audit import AuditLog
from app.models.event import ComplaintEvent


class OverlapService:
    @staticmethod
    def get_candidates(db: Session, status_filter: Optional[str] = None) -> List[ComplaintRelationship]:
        query = db.query(ComplaintRelationship)
        if status_filter and status_filter != "ALL":
            query = query.filter(ComplaintRelationship.status == status_filter)
        return query.order_by(desc(ComplaintRelationship.detected_at)).all()

    @staticmethod
    def get_by_id(db: Session, pair_id: str) -> Optional[ComplaintRelationship]:
        return db.query(ComplaintRelationship).filter(
            ComplaintRelationship.id.ilike(pair_id.strip())
        ).first()

    @staticmethod
    def analyze_complaint(db: Session, complaint_id: str) -> List[ComplaintRelationship]:
        target = db.query(Complaint).filter(Complaint.id == complaint_id).first()
        if not target:
            return []

        # Find candidates: Same institution or matching keywords across different bureaus
        other_cases = db.query(Complaint).filter(
            Complaint.id != target.id,
            Complaint.status != "RESOLVED"
        ).all()

        results = []
        for other in other_cases:
            same_inst = target.institution_id == other.institution_id
            
            # Simple keyword overlap analysis
            target_words = set(re.findall(r"\w{4,}", target.subject.lower() + " " + target.description.lower()))
            other_words = set(re.findall(r"\w{4,}", other.subject.lower() + " " + other.description.lower()))
            common_words = list(target_words.intersection(other_words))
            
            same_bureau = target.bureau_id == other.bureau_id

            # Multi-dimensional explainable candidate matching
            score = 0
            score_breakdown = {
                "institution_identity": 0,
                "category_match": 0,
                "text_similarity": 0,
                "cross_bureau_correlation": 0
            }

            if same_inst:
                score += 45
                score_breakdown["institution_identity"] = 45
            if target.category == other.category:
                score += 25
                score_breakdown["category_match"] = 25
            if len(common_words) >= 2:
                text_pts = min(25, len(common_words) * 4)
                score += text_pts
                score_breakdown["text_similarity"] = text_pts
            if not same_bureau and same_inst:
                # Inter-bureau correlation bonus
                score += 5
                score_breakdown["cross_bureau_correlation"] = 5

            score = min(98, score)

            # If candidate threshold (>= 60) met, check or create candidate relationship
            if score >= 60:
                # Canonical pair ordering (min(id_a, id_b), max(id_a, id_b)) prevents duplicate reversed relationships
                first_id, second_id = (target.id, other.id) if target.id < other.id else (other.id, target.id)
                existing = db.query(ComplaintRelationship).filter(
                    or_(
                        and_(ComplaintRelationship.case_a_id == first_id, ComplaintRelationship.case_b_id == second_id),
                        and_(ComplaintRelationship.case_a_id == second_id, ComplaintRelationship.case_b_id == first_id),
                    )
                ).first()

                if not existing:
                    year = datetime.now().year
                    count = db.query(ComplaintRelationship).count() + 1
                    overlap_id = f"OVL-{year}-{count:03d}"

                    rationale = {
                        "same_institution": same_inst,
                        "institution_confidence": 100 if same_inst else 0,
                        "semantic_subject_similarity": min(95, len(common_words) * 12 + 40),
                        "matching_method": "HYBRID_STRUCTURED_AND_LEXICAL",
                        "score_breakdown": score_breakdown,
                        "entity_matches": [f"PID: {target.institution_id}"] if same_inst else [],
                        "common_keywords": common_words[:6],
                        "regulatory_clauses": ["AICTE Approval Process Handbook 2025-26"],
                        "reason_description": f"Surfaced candidate relationship: Overlapping grievance dockets detected between {target.bureau_id} and {other.bureau_id} targeting {target.institution_id}."
                    }

                    new_rel = ComplaintRelationship(
                        id=overlap_id,
                        case_a_id=first_id,
                        case_b_id=second_id,
                        institution_id=target.institution_id,
                        institution_name=target.institution.name if target.institution else "Registered Institution",
                        similarity_score=score,
                        urgency=target.priority,
                        detected_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"),
                        rationale_json=json.dumps(rationale),
                        status="PENDING_REVIEW",
                        lead_bureau=target.bureau_id
                    )
                    db.add(new_rel)
                    db.flush()
                    target.has_overlap = True
                    other.has_overlap = True
                    results.append(new_rel)
                else:
                    results.append(existing)

        db.commit()
        return results

    @staticmethod
    def resolve_overlap(
        db: Session,
        pair_id: str,
        action: str,
        reviewer_notes: str,
        reviewer_name: str,
        lead_bureau: Optional[str] = None
    ) -> Optional[ComplaintRelationship]:
        rel = OverlapService.get_by_id(db, pair_id)
        if not rel:
            return None

        now_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
        rel.status = action
        rel.reviewer_notes = reviewer_notes
        rel.reviewer_name = reviewer_name
        rel.reviewed_at = now_time
        if lead_bureau:
            rel.lead_bureau = lead_bureau

        case_a = db.query(Complaint).filter(Complaint.id == rel.case_a_id).first()
        case_b = db.query(Complaint).filter(Complaint.id == rel.case_b_id).first()

        if action == "CONFIRMED_LINKED":
            if case_a:
                case_a.status = "JOINT_COMMITTEE"
                case_a.last_action_summary = f"Cross-bureau correlation confirmed with {rel.case_b_id}. Joint committee convened."
            if case_b:
                case_b.status = "JOINT_COMMITTEE"
                case_b.last_action_summary = f"Cross-bureau correlation confirmed with {rel.case_a_id}. Joint committee convened."
        elif action == "REJECTED_DISTINCT":
            if case_a and case_a.status == "OVERLAP_FLAGGED":
                case_a.status = "UNDER_INVESTIGATION"
                case_a.has_overlap = False
            if case_b and case_b.status == "OVERLAP_FLAGGED":
                case_b.status = "UNDER_INVESTIGATION"
                case_b.has_overlap = False
        elif action == "MERGED":
            if case_a and case_b:
                lead = lead_bureau or rel.lead_bureau or case_a.bureau_id
                primary = case_a if case_a.bureau_id == lead else case_b
                secondary = case_b if primary == case_a else case_a
                primary.last_action_summary = f"Designated Lead Case. Secondary docket {secondary.id} merged into joint file."
                secondary.status = "RESOLVED"
                secondary.last_action_summary = f"Merged as secondary reference into Lead Case {primary.id}."

        # Audit logs for both cases
        for cid in [rel.case_a_id, rel.case_b_id]:
            audit = AuditLog(
                id=f"AUD-{int(datetime.now().timestamp()*1000)}-{cid.replace('/', '')}",
                case_id=cid,
                timestamp=now_time,
                action=f"Overlap Resolution: {action}",
                performed_by=reviewer_name,
                role="Senior Reviewer",
                bureau=lead_bureau or "REGULATION",
                details=f"Overlap {rel.id} reviewed. Action: {action}. Reviewer Rationale: {reviewer_notes}"
            )
            db.add(audit)

        db.commit()
        db.refresh(rel)
        return rel
