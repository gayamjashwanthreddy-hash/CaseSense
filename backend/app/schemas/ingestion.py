from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class IngestionRunResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    source_name: str
    source_url: str
    retrieval_status: str
    retrieval_timestamp: datetime
    records_fetched: int
    records_inserted: int
    records_updated: int
    records_skipped: int
    records_failed: int
    licence_or_attribution: str
    message: Optional[str] = None
    created_at: datetime


class PublicGrievanceStatisticResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    source_name: str
    category_type: str
    organization_name: str
    received_count: int
    disposed_count: int
    disposed_percentage: float
    pending_0_to_60: int
    pending_60_to_180: int
    pending_180_to_365: int
    pending_over_1_year: int
    report_date: str
    retrieved_at: datetime
    licence_attribution: str


class PublicRegulatoryDocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    source_name: str
    source_url: str
    title: str
    document_type: str
    publication_date: Optional[str] = None
    summary: Optional[str] = None
    retrieved_at: datetime
    licence_attribution: str


class TriggerIngestionRequest(BaseModel):
    source: str = "all"  # all, cpgrams, aishe, aicte, data_gov
    use_fixture: bool = False
    limit: Optional[int] = None
