from fastapi import APIRouter
from app.api.v1 import (
    auth,
    complaints,
    overlap,
    institutions,
    bureaus,
    dashboard,
    reports,
    admin,
    ingestion,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Identity"])
api_router.include_router(complaints.router, prefix="/complaints", tags=["Complaint Management"])
api_router.include_router(overlap.router, prefix="/overlap", tags=["Cross-Bureau Overlap Triage"])
api_router.include_router(institutions.router, prefix="/institutions", tags=["Institution Profiles & Compliance"])
api_router.include_router(bureaus.router, prefix="/bureaus", tags=["Bureaus & Workloads"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Executive Dashboard"])
api_router.include_router(reports.router, prefix="/reports", tags=["Analytics & Reports"])
api_router.include_router(admin.router, prefix="/admin", tags=["Governance & Audit"])
api_router.include_router(ingestion.router, prefix="/ingestion", tags=["Regulatory Data Ingestion"])
