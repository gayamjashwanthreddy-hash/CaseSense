from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import verify_password, create_access_token


class AuthService:
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        user = db.query(User).filter(User.email == email.strip().lower()).first()
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        if not user.is_active:
            return None
            
        # Update last login timestamp
        user.last_login_at = datetime.now(timezone.utc)
        db.commit()
        return user

    @staticmethod
    def authenticate_institution(db: Session, email: str, access_key: str) -> Optional[User]:
        user = db.query(User).filter(
            User.email == email.strip().lower(),
            User.role == "INSTITUTION_REPRESENTATIVE"
        ).first()
        if not user:
            return None
        if not verify_password(access_key, user.hashed_password):
            return None
        if not user.is_active:
            return None
            
        user.last_login_at = datetime.now(timezone.utc)
        db.commit()
        return user

    @staticmethod
    def generate_token(user: User) -> str:
        return create_access_token(
            subject=user.id,
            role=user.role,
            institution_id=user.institution_id,
            bureau_id=user.bureau_id
        )
