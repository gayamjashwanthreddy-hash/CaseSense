from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.bureau import Bureau
from app.models.complaint import Complaint

router = APIRouter()


@router.get("")
def list_bureaus(db: Session = Depends(get_db)):
    """
    List active AICTE bureaus and regulatory cells with case counts.
    """
    bureaus = db.query(Bureau).filter(Bureau.is_active == True).all()
    results = []
    for b in bureaus:
        total = db.query(Complaint).filter(Complaint.bureau_id == b.id).count()
        pending = db.query(Complaint).filter(
            Complaint.bureau_id == b.id,
            Complaint.status != "RESOLVED"
        ).count()
        results.append({
            "id": b.id,
            "name": b.name,
            "description": b.description,
            "total_cases": total,
            "pending_cases": pending,
        })
    return results
