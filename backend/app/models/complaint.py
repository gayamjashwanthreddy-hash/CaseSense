from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import String, Integer, Boolean, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)  # e.g. "AICTE/PGRC/2026/0892"
    ref_number: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)  # e.g. "PGRC-2026-0892"
    tracking_code: Mapped[str] = mapped_column(String(64), index=True, nullable=False)  # e.g. "TRK-882194"
    
    institution_id: Mapped[str] = mapped_column(String(64), ForeignKey("institutions.id", ondelete="CASCADE"), index=True, nullable=False)
    bureau_id: Mapped[str] = mapped_column(String(64), ForeignKey("bureaus.id", ondelete="RESTRICT"), index=True, nullable=False)
    
    category: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    subject: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    priority: Mapped[str] = mapped_column(String(50), default="MEDIUM", index=True)
    status: Mapped[str] = mapped_column(String(50), default="NEW_INTAKE", index=True)
    
    # Complainant information (with privacy / whistleblower protection)
    complainant_name: Mapped[str] = mapped_column(String(255), nullable=False)
    complainant_type: Mapped[str] = mapped_column(String(50), default="STUDENT")
    complainant_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    complainant_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    is_anonymous: Mapped[bool] = mapped_column(Boolean, default=False)
    is_confidential: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # SLA & Case Processing
    received_date: Mapped[str] = mapped_column(String(20), nullable=False)
    sla_deadline: Mapped[str] = mapped_column(String(20), nullable=False)
    days_open: Mapped[int] = mapped_column(Integer, default=1)
    
    last_action_summary: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    last_action_date: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    next_action_required: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    next_action_deadline: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    
    assigned_officer: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    assigned_officer_role: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    has_overlap: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    overlap_pair_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    relevant_clauses_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    institution = relationship("Institution", back_populates="complaints", lazy="joined")
    bureau = relationship("Bureau", back_populates="complaints", lazy="joined")
    events = relationship("ComplaintEvent", back_populates="complaint", cascade="all, delete-orphan", order_by="desc(ComplaintEvent.timestamp)")
    responses = relationship("ComplaintResponse", back_populates="complaint", cascade="all, delete-orphan", order_by="desc(ComplaintResponse.submitted_at)")
    attachments = relationship("Attachment", back_populates="complaint", cascade="all, delete-orphan")
