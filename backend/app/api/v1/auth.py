from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.auth_service import AuthService
from app.schemas.auth import LoginRequest, InstitutionLoginRequest, Token, UserResponse
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/login", response_model=Token)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Standard user authentication for administrative officials and bureau officers.
    """
    user = AuthService.authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = AuthService.generate_token(user)
    return Token(
        access_token=access_token,
        token_type="bearer",
        role=user.role,
        user_id=user.id,
        full_name=user.full_name,
        bureau_id=user.bureau_id,
        institution_id=user.institution_id
    )


@router.post("/institution-login", response_model=Token)
def institution_login(request: InstitutionLoginRequest, db: Session = Depends(get_db)):
    """
    Dedicated authentication for technical institution representatives (principals, deans).
    Scopes user context to their registered AICTE Permanent Institute ID.
    """
    user = AuthService.authenticate_institution(db, request.email, request.access_key)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid institutional credentials or unauthorized access key",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = AuthService.generate_token(user)
    return Token(
        access_token=access_token,
        token_type="bearer",
        role=user.role,
        user_id=user.id,
        full_name=user.full_name,
        institution_id=user.institution_id
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns the currently authenticated user's profile and RBAC permissions.
    """
    return current_user
