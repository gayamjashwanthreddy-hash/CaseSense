from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.db.session import get_db
from app.models.user import User
from app.models.ingestion import (
    DataIngestionRun,
    PublicGrievanceStatistic,
    PublicRegulatoryDocument,
)
from app.schemas.ingestion import (
    IngestionRunResponse,
    PublicGrievanceStatisticResponse,
    PublicRegulatoryDocumentResponse,
    TriggerIngestionRequest,
)
from app.api.deps import require_roles
from app.ingestion.service import IngestionService

router = APIRouter()


@router.post("/run", response_model=List[dict])
def trigger_ingestion(
    request: TriggerIngestionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["ADMIN", "REVIEWER"])),
):
    """
    Authorized execution of the regulatory data ingestion pipeline across AICTE, AISHE, CPGRAMS, and data.gov.in.
    Restricted to Administrative Officials and Senior Reviewers.
    """
    service = IngestionService(db)
    if request.source == "all":
        results = service.run_all(use_fixture=request.use_fixture, limit=request.limit)
    else:
        results = [service.run_source(request.source, use_fixture=request.use_fixture, limit=request.limit)]
    return results


@router.get("/status", response_model=List[IngestionRunResponse])
def get_ingestion_runs(
    limit: int = Query(20, ge=1, le=100),
    source: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["ADMIN", "REVIEWER", "BUREAU_OFFICER"])),
):
    """
    Audit log of regulatory data acquisition runs with source provenance, timestamps, and record counts.
    """
    query = db.query(DataIngestionRun)
    if source:
        query = query.filter(DataIngestionRun.source_name == source.lower().strip())
    return query.order_by(desc(DataIngestionRun.created_at)).limit(limit).all()


@router.get("/statistics", response_model=List[PublicGrievanceStatisticResponse])
def get_public_grievance_statistics(
    category_type: Optional[str] = Query(None, description="Filter by CENTRAL_MINISTRY or STATE_UT"),
    search: Optional[str] = Query(None, description="Search organization or state name"),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """
    Public aggregate grievance statistics (received, disposed, pending, ageing) from CPGRAMS DARPG dashboard.
    Publicly accessible endpoint (Read-only aggregate metrics, no PII).
    """
    query = db.query(PublicGrievanceStatistic)
    if category_type:
        query = query.filter(PublicGrievanceStatistic.category_type == category_type.upper().strip())
    if search:
        query = query.filter(PublicGrievanceStatistic.organization_name.ilike(f"%{search.strip()}%"))
    return query.order_by(desc(PublicGrievanceStatistic.received_count)).limit(limit).all()


@router.get("/documents", response_model=List[PublicRegulatoryDocumentResponse])
def get_public_regulatory_documents(
    search: Optional[str] = Query(None, description="Search document title or summary"),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """
    Catalog of public regulatory documents, circulars, and dataset metadata from data.gov.in and AISHE.
    """
    query = db.query(PublicRegulatoryDocument)
    if search:
        query = query.filter(PublicRegulatoryDocument.title.ilike(f"%{search.strip()}%"))
    return query.order_by(desc(PublicRegulatoryDocument.retrieved_at)).limit(limit).all()
