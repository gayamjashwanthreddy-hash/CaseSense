from typing import List, Optional, Any
from pydantic import BaseModel, Field, ConfigDict


class ComplaintBase(BaseModel):
    institution_id: str
    category: str
    subject: str = Field(..., min_length=5, max_length=255)
    description: str = Field(..., min_length=10)
    priority: str = "MEDIUM"


class PublicComplaintCreate(BaseModel):
    institution_id: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1)
    subject: str = Field(..., min_length=5, max_length=255)
    statement: Optional[str] = None
    description: Optional[str] = None
    complainant_name: str = Field(..., min_length=2)
    complainant_type: Optional[str] = "Student"
    complainant_email: Optional[str] = None
    complainant_phone: Optional[str] = None
    is_whistleblower: bool = False
    is_anonymous: bool = False
    is_confidential: bool = False
    evidence_files: Optional[List[dict]] = None


class ComplaintCreate(ComplaintBase):
    bureau_id: str
    complainant_name: str
    complainant_type: str = "CITIZEN"
    complainant_email: Optional[str] = None
    complainant_phone: Optional[str] = None
    is_anonymous: bool = False
    is_confidential: bool = False
    assigned_officer: Optional[str] = None
    relevant_clauses: Optional[List[str]] = None


class ComplaintStatusUpdate(BaseModel):
    status: str
    justification: Optional[str] = None
    explanation: Optional[str] = None
    next_action: Optional[str] = None
    next_action_deadline: Optional[str] = None


class ComplaintAssignRequest(BaseModel):
    officer_name: str
    officer_role: str = "Desk Officer"
    bureau: Optional[str] = None


class ComplaintEventItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    event_type: str
    previous_status: Optional[str] = None
    new_status: Optional[str] = None
    actor_name: str
    actor_role: Optional[str] = None
    bureau: Optional[str] = None
    explanation: Optional[str] = None
    timestamp: str


class ComplaintResponseItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    institution_id: str
    submitted_by: str
    official_designation: str
    statement: str
    compliance_documents: Optional[List[dict]] = None
    submitted_at: str


class ComplaintResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    ref_number: str
    tracking_code: str
    institution_id: str
    institution_name: Optional[str] = None
    institution_state: Optional[str] = None
    institution_region: Optional[str] = None
    bureau_id: str
    category: str
    subject: str
    description: str
    priority: str
    status: str
    complainant_name: str
    complainant_type: str
    complainant_email: Optional[str] = None
    complainant_phone: Optional[str] = None
    is_anonymous: bool
    is_confidential: bool
    received_date: str
    sla_deadline: str
    days_open: int
    last_action_summary: Optional[str] = None
    last_action_date: Optional[str] = None
    next_action_required: Optional[str] = None
    next_action_deadline: Optional[str] = None
    assigned_officer: Optional[str] = None
    assigned_officer_role: Optional[str] = None
    has_overlap: bool
    overlap_pair_id: Optional[str] = None
    relevant_clauses: List[str] = []
    events: List[ComplaintEventItem] = []
    responses: List[ComplaintResponseItem] = []


class PublicTrackingResponse(BaseModel):
    ref_number: str
    status: str
    category: str
    institution_name: str
    institution_region: str
    bureau: str
    received_date: str
    target_sla_date: str
    current_stage: str
    is_confidential: bool
    milestones: List[dict]
