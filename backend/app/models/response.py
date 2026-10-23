from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class ComplaintResponse(Base):
    """
    Formal institutional counter-affidavit filed by authorized college representative.
    """
    __tablename__ = "complaint_responses"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)  # e.g. "RESP-2026-001"
    complaint_id: Mapped[str] = mapped_column(String(64), ForeignKey("complaints.id", ondelete="CASCADE"), index=True, nullable=False)
    institution_id: Mapped[str] = mapped_column(String(64), ForeignKey("institutions.id", ondelete="CASCADE"), index=True, nullable=False)
    
    submitted_by: Mapped[str] = mapped_column(String(255), nullable=False)
    official_designation: Mapped[str] = mapped_column(String(255), nullable=False)
    statement: Mapped[str] = mapped_column(Text, nullable=False)
    compliance_documents_json: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="SUBMITTED")
    submitted_at: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    complaint = relationship("Complaint", back_populates="responses")
    institution = relationship("Institution", back_populates="responses")
