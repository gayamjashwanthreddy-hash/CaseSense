from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.db.session import get_db
from app.models.user import User
from app.models.audit import AuditLog
from app.schemas.auth import UserResponse
from app.schemas.dashboard import AuditLogResponse
from app.api.deps import require_roles

router = APIRouter()


@router.get("/users", response_model=List[UserResponse])
def list_system_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["ADMIN", "REVIEWER", "BUREAU_OFFICER"]))
):
    """
    Authorized directory of AICTE officials, reviewers, and institutional signatories.
    """
    return db.query(User).filter(User.is_active == True).all()


@router.get("/audit-logs", response_model=List[AuditLogResponse])
def list_audit_logs(
    case_id: Optional[str] = None,
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["ADMIN", "REVIEWER", "BUREAU_OFFICER"]))
):
    """
    Immutable compliance audit ledger detailing every status transition, review action, and institutional filing.
    """
    query = db.query(AuditLog)
    if case_id:
        query = query.filter(AuditLog.case_id == case_id)
    return query.order_by(desc(AuditLog.created_at)).limit(limit).all()
