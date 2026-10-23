from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Integer, Text, DateTime, ForeignKey, Index, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class ComplaintRelationship(Base):
    """
    Core CaseBridge AI entity: Candidate overlap relationship between two complaints.
    Prevents self-referential links and stores complete explainable matching rationale.
    """
    __tablename__ = "complaint_relationships"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)  # e.g. "OVL-2026-001"
    case_a_id: Mapped[str] = mapped_column(String(64), ForeignKey("complaints.id", ondelete="CASCADE"), index=True, nullable=False)
    case_b_id: Mapped[str] = mapped_column(String(64), ForeignKey("complaints.id", ondelete="CASCADE"), index=True, nullable=False)
    
    institution_id: Mapped[str] = mapped_column(String(64), ForeignKey("institutions.id", ondelete="CASCADE"), index=True, nullable=False)
    institution_name: Mapped[str] = mapped_column(String(255), nullable=False)
    
    similarity_score: Mapped[int] = mapped_column(Integer, default=75)  # 0 to 100 percentage
    urgency: Mapped[str] = mapped_column(String(50), default="MEDIUM")
    detected_at: Mapped[str] = mapped_column(String(50), nullable=False)
    
    # Explainable rationale breakdown stored as structured JSON string
    rationale_json: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Reviewer decision status
    status: Mapped[str] = mapped_column(String(50), default="PENDING_REVIEW", index=True)  # PENDING_REVIEW, CONFIRMED_LINKED, REJECTED_DISTINCT, DEFERRED, MERGED
    lead_bureau: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    
    # Adjudication details
    reviewer_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    reviewer_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    reviewed_at: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint("case_a_id", "case_b_id", name="uq_case_pair"),
    )
