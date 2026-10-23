from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class BureauWorkloadItem(BaseModel):
    bureau: str
    name: str
    total: int
    pending: int
    resolved: int


class AgeingTierItem(BaseModel):
    tier: str
    count: int
    label: str


class RegionalDataItem(BaseModel):
    region: str
    count: int


class DashboardOverviewResponse(BaseModel):
    total_active_cases: int
    pending_overlaps_count: int
    overdue_count: int
    joint_committees_count: int
    high_risk_institutions_count: int
    bureau_workload: List[BureauWorkloadItem]
    ageing_tiers: List[AgeingTierItem]
    regional_data: List[RegionalDataItem]
    immediate_attention_cases: List[dict]


class AuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    case_id: Optional[str] = None
    timestamp: str
    action: str
    performed_by: str
    role: Optional[str] = None
    bureau: Optional[str] = None
    details: Optional[str] = None
