from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class ComplaintEvent(Base):
    __tablename__ = "complaint_events"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    complaint_id: Mapped[str] = mapped_column(String(64), ForeignKey("complaints.id", ondelete="CASCADE"), index=True, nullable=False)
    event_type: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g. "INTAKE", "STATUS_CHANGE", "ASSIGNMENT", "OVERLAP_FLAGGED", "RESPONSE_FILED"
    previous_status: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    new_status: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    actor_name: Mapped[str] = mapped_column(String(255), nullable=False)
    actor_role: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    bureau: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    explanation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    timestamp: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship
    complaint = relationship("Complaint", back_populates="events")
