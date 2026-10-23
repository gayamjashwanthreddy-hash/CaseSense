from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.dashboard_service import DashboardService
from app.schemas.dashboard import DashboardOverviewResponse

router = APIRouter()


@router.get("/overview", response_model=DashboardOverviewResponse)
def get_dashboard_overview(db: Session = Depends(get_db)):
    """
    Returns aggregated executive dashboard metrics dynamically computed from live database records.
    Guarantees 100% count consistency between cards, charts, and case tables.
    """
    return DashboardService.get_overview_metrics(db)
