from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import String, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Institution(Base):
    __tablename__ = "institutions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)  # AICTE PID, e.g. "1-10492811"
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    state: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False)
    region: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(100), default="Technical / Engineering")
    approval_status: Mapped[str] = mapped_column(String(100), default="Approved")
    accreditation: Mapped[str] = mapped_column(String(100), default="NBA / NAAC")
    affiliated_university: Mapped[str] = mapped_column(String(255), nullable=True)
    head_of_institution: Mapped[str] = mapped_column(String(255), nullable=True)
    email: Mapped[str] = mapped_column(String(255), nullable=True)
    phone: Mapped[str] = mapped_column(String(50), nullable=True)
    risk_level: Mapped[str] = mapped_column(String(50), default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    users = relationship("User", back_populates="institution")
    complaints = relationship("Complaint", back_populates="institution")
    responses = relationship("ComplaintResponse", back_populates="institution")
