from typing import List, Optional
from sqlalchemy import String, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class Bureau(Base):
    __tablename__ = "bureaus"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)  # PGRC, REGULATION, APPROVAL, LEGAL, CPGRAMS
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    users = relationship("User", back_populates="bureau")
    complaints = relationship("Complaint", back_populates="bureau")
