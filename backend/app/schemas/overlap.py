from typing import List, Optional, Any
from pydantic import BaseModel, Field, ConfigDict


class OverlapRationale(BaseModel):
    same_institution: bool
    institution_confidence: int
    semantic_subject_similarity: int
    entity_matches: List[str]
    common_keywords: List[str]
    regulatory_clauses: List[str]
    reason_description: str


class OverlapCandidateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    case_a_id: str
    case_b_id: str
    institution_id: str
    institution_name: str
    similarity_score: int
    urgency: str
    detected_at: str
    status: str
    lead_bureau: Optional[str] = None
    reviewer_name: Optional[str] = None
    reviewer_notes: Optional[str] = None
    reviewed_at: Optional[str] = None
    rationale: OverlapRationale

    # Companion case details embedded for side-by-side inspection
    case_a: Optional[dict] = None
    case_b: Optional[dict] = None


class OverlapDecisionRequest(BaseModel):
    action: str = Field(..., pattern="^(CONFIRMED_LINKED|REJECTED_DISTINCT|DEFERRED|MERGED)$")
    reviewer_notes: str = Field(..., min_length=5)
    lead_bureau: Optional[str] = None


class OverlapAnalyzeRequest(BaseModel):
    case_id: str
