from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(64), index=True, nullable=False)  # ADMIN, BUREAU_OFFICER, INSTITUTION_REPRESENTATIVE, REVIEWER, PUBLIC_COMPLAINANT
    bureau_id: Mapped[Optional[str]] = mapped_column(String(64), ForeignKey("bureaus.id", ondelete="SET NULL"), nullable=True)
    institution_id: Mapped[Optional[str]] = mapped_column(String(64), ForeignKey("institutions.id", ondelete="SET NULL"), nullable=True, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    # Relationships
    bureau = relationship("Bureau", back_populates="users", lazy="joined")
    institution = relationship("Institution", back_populates="users", lazy="joined")
