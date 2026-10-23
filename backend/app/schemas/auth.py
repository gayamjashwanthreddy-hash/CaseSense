from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    full_name: str
    bureau_id: Optional[str] = None
    institution_id: Optional[str] = None


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    institution_id: Optional[str] = None
    bureau_id: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class InstitutionLoginRequest(BaseModel):
    email: EmailStr
    access_key: str


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    full_name: str
    role: str
    bureau_id: Optional[str] = None
    institution_id: Optional[str] = None
    is_active: bool
