from typing import Optional
from pydantic import BaseModel, Field, field_validator


class ValidatedGrievanceStat(BaseModel):
    id: str = Field(..., min_length=3)
    source_name: str = Field(default="CPGRAMS")
    source_url: str = Field(..., min_length=5)
    category_type: str = Field(...)  # CENTRAL_MINISTRY or STATE_UT
    organization_name: str = Field(..., min_length=2)
    received_count: int = Field(ge=0)
    disposed_count: int = Field(ge=0)
    disposed_percentage: float = Field(ge=0.0, le=100.0)
    pending_0_to_60: int = Field(ge=0, default=0)
    pending_60_to_180: int = Field(ge=0, default=0)
    pending_180_to_365: int = Field(ge=0, default=0)
    pending_over_1_year: int = Field(ge=0, default=0)
    report_date: str = Field(..., min_length=4)
    licence_attribution: str = Field(default="DARPG, Government of India")

    @field_validator("disposed_percentage", mode="before")
    def clamp_percentage(cls, v):
        try:
            val = float(v)
            return max(0.0, min(100.0, val))
        except (ValueError, TypeError):
            return 0.0


class ValidatedInstitution(BaseModel):
    id: str = Field(..., min_length=3)
    source_name: str = Field(...)  # AISHE or AICTE
    source_id: str = Field(..., min_length=2)
    source_url: str = Field(...)
    name: str = Field(..., min_length=2)
    state: str = Field(..., min_length=2)
    district: str = Field(..., min_length=2)
    management_type: Optional[str] = None
    category: Optional[str] = "Technical / Higher Education"
    website: Optional[str] = None
    year_of_establishment: Optional[str] = None
    location: Optional[str] = None
    approval_status: str = Field(default="Approved")
    validation_status: str = Field(default="VALIDATED")
    licence_attribution: str = Field(default="Ministry of Education, Government of India")


class ValidatedRegulatoryDoc(BaseModel):
    id: str = Field(..., min_length=3)
    source_name: str = Field(...)
    source_url: str = Field(...)
    title: str = Field(..., min_length=3)
    document_type: str = Field(default="CATALOG_FEED")
    publication_date: Optional[str] = None
    summary: Optional[str] = None
    licence_attribution: str = Field(default="Open Government Data Platform India / Official Source")
