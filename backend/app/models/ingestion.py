from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Integer, Float, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class DataIngestionRun(Base):
    """
    Provenance and audit trail for data acquisition runs across official regulatory sources.
    """
    __tablename__ = "data_ingestion_runs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)  # UUID
    source_name: Mapped[str] = mapped_column(String(64), index=True, nullable=False)  # aicte, aishe, cpgrams, data_gov
    source_url: Mapped[str] = mapped_column(String(512), nullable=False)
    retrieval_status: Mapped[str] = mapped_column(String(50), nullable=False)  # SUCCESS, PARTIAL, MAINTENANCE_BLOCKED, FAILED
    retrieval_timestamp: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    records_fetched: Mapped[int] = mapped_column(Integer, default=0)
    records_inserted: Mapped[int] = mapped_column(Integer, default=0)
    records_updated: Mapped[int] = mapped_column(Integer, default=0)
    records_skipped: Mapped[int] = mapped_column(Integer, default=0)
    records_failed: Mapped[int] = mapped_column(Integer, default=0)
    licence_or_attribution: Mapped[str] = mapped_column(String(512), nullable=False)
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))


class PublicGrievanceStatistic(Base):
    """
    Aggregate public grievance statistics legally obtained from official portals (e.g. CPGRAMS DARPG dashboard).
    Does NOT contain private complaint records, whistleblower identities, or individual PII.
    """
    __tablename__ = "public_grievance_statistics"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)  # stable key, e.g. "cpgrams:central:higher-education:2026-10-24"
    source_name: Mapped[str] = mapped_column(String(64), index=True, default="CPGRAMS")
    source_url: Mapped[str] = mapped_column(String(512), nullable=False)
    category_type: Mapped[str] = mapped_column(String(50), index=True, nullable=False)  # CENTRAL_MINISTRY, STATE_UT
    organization_name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    received_count: Mapped[int] = mapped_column(Integer, default=0)
    disposed_count: Mapped[int] = mapped_column(Integer, default=0)
    disposed_percentage: Mapped[float] = mapped_column(Float, default=0.0)
    pending_0_to_60: Mapped[int] = mapped_column(Integer, default=0)
    pending_60_to_180: Mapped[int] = mapped_column(Integer, default=0)
    pending_180_to_365: Mapped[int] = mapped_column(Integer, default=0)
    pending_over_1_year: Mapped[int] = mapped_column(Integer, default=0)
    report_date: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    retrieved_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    licence_attribution: Mapped[str] = mapped_column(String(512), default="DARPG, Government of India - Public Grievance Dashboard")


class PublicInstitutionRecord(Base):
    """
    Public higher-education institution record from official directories (AISHE, AICTE).
    """
    __tablename__ = "public_institution_records"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)  # stable identifier, e.g. "aishe:U-0456"
    source_name: Mapped[str] = mapped_column(String(64), index=True, nullable=False)  # AISHE, AICTE
    source_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)  # AISHE Code or AICTE PID
    source_url: Mapped[str] = mapped_column(String(512), nullable=False)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    state: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False)
    management_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # Central Government, State, Private, etc.
    category: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # University, College, Standalone, R&D
    website: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    year_of_establishment: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # Urban, Rural
    approval_status: Mapped[str] = mapped_column(String(100), default="Approved")
    validation_status: Mapped[str] = mapped_column(String(50), default="VALIDATED")
    retrieved_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    licence_attribution: Mapped[str] = mapped_column(String(512), default="Ministry of Education, Government of India (AISHE / AICTE)")


class PublicRegulatoryDocument(Base):
    """
    Public regulatory notices, reports, datasets, and circular metadata.
    """
    __tablename__ = "public_regulatory_documents"

    id: Mapped[str] = mapped_column(String(255), primary_key=True)  # stable key
    source_name: Mapped[str] = mapped_column(String(64), index=True, nullable=False)  # DATA_GOV, AISHE, AICTE
    source_url: Mapped[str] = mapped_column(String(512), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    document_type: Mapped[str] = mapped_column(String(100), default="CATALOG_FEED")  # CATALOG_FEED, REPORT, CIRCULAR
    publication_date: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    retrieved_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    licence_attribution: Mapped[str] = mapped_column(String(512), default="Open Government Data Platform India / Official Notice")
