from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.complaint import Complaint
from app.models.relationship import ComplaintRelationship
from app.models.institution import Institution
from app.models.bureau import Bureau


class DashboardService:
    @staticmethod
    def get_overview_metrics(db: Session) -> Dict[str, Any]:
        all_cases = db.query(Complaint).all()
        active_cases = [c for c in all_cases if c.status != "RESOLVED"]
        
        pending_overlaps = db.query(ComplaintRelationship).filter(
            ComplaintRelationship.status == "PENDING_REVIEW"
        ).count()

        overdue_cases = [c for c in active_cases if c.days_open > 30]
        joint_committees = [c for c in all_cases if c.status == "JOINT_COMMITTEE"]

        high_risk_institutions = db.query(Institution).filter(
            Institution.risk_level.in_(["HIGH", "CRITICAL"])
        ).count()

        # Bureau Workloads
        bureaus = [
            {"bureau": "PGRC", "name": "Public Grievance", "total": 0, "pending": 0, "resolved": 0},
            {"bureau": "REGULATION", "name": "Regulation Bureau", "total": 0, "pending": 0, "resolved": 0},
            {"bureau": "APPROVAL", "name": "Approval Bureau", "total": 0, "pending": 0, "resolved": 0},
            {"bureau": "LEGAL", "name": "Legal Cell", "total": 0, "pending": 0, "resolved": 0},
            {"bureau": "CPGRAMS", "name": "CPGRAMS Desk", "total": 0, "pending": 0, "resolved": 0},
        ]
        for c in all_cases:
            b = next((x for x in bureaus if x["bureau"] == c.bureau_id), None)
            if b:
                b["total"] += 1
                if c.status == "RESOLVED":
                    b["resolved"] += 1
                else:
                    b["pending"] += 1

        # Ageing Tiers
        ageing_tiers = [
            {"tier": "0-15 Days", "count": 0, "label": "Under Normal SLA"},
            {"tier": "16-30 Days", "count": 0, "label": "Due Soon"},
            {"tier": "31-60 Days", "count": 0, "label": "Overdue"},
            {"tier": ">60 Days", "count": 0, "label": "Critical SLA Breach"},
        ]
        for c in active_cases:
            if c.days_open <= 15:
                ageing_tiers[0]["count"] += 1
            elif c.days_open <= 30:
                ageing_tiers[1]["count"] += 1
            elif c.days_open <= 60:
                ageing_tiers[2]["count"] += 1
            else:
                ageing_tiers[3]["count"] += 1

        # Regional Breakdown
        region_counts: Dict[str, int] = {}
        for c in active_cases:
            reg = c.institution.region if c.institution else "Central"
            region_counts[reg] = region_counts.get(reg, 0) + 1
        regional_data = [{"region": k, "count": v} for k, v in region_counts.items()]

        # Immediate attention desk (overdue or high priority)
        urgent = sorted(
            [c for c in active_cases if c.priority in ["HIGH", "CRITICAL"] or c.days_open > 30],
            key=lambda x: x.days_open,
            reverse=True
        )[:5]

        immediate_cases = [
            {
                "id": c.id,
                "ref_number": c.ref_number,
                "institution_name": c.institution.name if c.institution else "Registered Institution",
                "institution_id": c.institution_id,
                "bureau": c.bureau_id,
                "days_open": c.days_open,
                "priority": c.priority,
                "status": c.status,
                "subject": c.subject,
            }
            for c in urgent
        ]

        return {
            "total_active_cases": len(active_cases),
            "pending_overlaps_count": pending_overlaps,
            "overdue_count": len(overdue_cases),
            "joint_committees_count": len(joint_committees),
            "high_risk_institutions_count": high_risk_institutions,
            "bureau_workload": bureaus,
            "ageing_tiers": ageing_tiers,
            "regional_data": regional_data,
            "immediate_attention_cases": immediate_cases,
        }
