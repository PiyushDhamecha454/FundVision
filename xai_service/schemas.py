# xai_service/schemas.py
from pydantic import BaseModel, EmailStr
from typing import Optional, Any, Dict

# ---------- Auth ----------
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ---------- Existing input schemas re-used ----------
class PredictInput(BaseModel):
    expense_ratio: float
    aum: float
    rating: float


class RecommendInput(BaseModel):
    risk_appetite: Optional[str] = None
    preferred_category: Optional[str] = None
    expense_preference: Optional[str] = None
    rating_threshold: float = 0
    aum_preference: Optional[str] = None


# ---------- Optional wrapped responses (if you want) ----------
class PredictResponse(BaseModel):
    user_email: EmailStr
    result: Dict[str, Any]  # this will hold whatever explain_prediction returns


class RecommendResponse(BaseModel):
    user_email: EmailStr
    recommended_funds: Any
    count: int
