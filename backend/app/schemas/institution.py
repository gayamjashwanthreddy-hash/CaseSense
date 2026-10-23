from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class InstitutionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    state: str
    district: str
    region: str
    category: str
    approval_status: str
    accreditation: str
    affiliated_university: Optional[str] = None
    head_of_institution: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    risk_level: str
    active_cases_count: Optional[int] = 0
    total_cases_count: Optional[int] = 0


class InstitutionUpdate(BaseModel):
    name: Optional[str] = None
    head_of_institution: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    risk_level: Optional[str] = None


class ResponseCreate(BaseModel):
    case_id: str
    submitted_by: str = Field(..., min_length=2)
    official_designation: str = Field(..., min_length=2)
    statement: str = Field(..., min_length=10)
    compliance_documents: Optional[List[dict]] = None
