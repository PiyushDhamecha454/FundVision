# xai_service/auth.py
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Response, Request, Cookie
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from .database import get_db
from . import db_models
from .schemas import UserCreate, UserOut, Token

import os

router = APIRouter(prefix="/auth", tags=["Authentication"])

auth_error = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

# ---------- CONFIG ----------
SECRET_KEY = os.getenv("SECRET_KEY", "CHANGE_THIS_TO_RANDOM_SECRET")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ---------- Helper functions ----------
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user_by_email(db: Session, email: str) -> Optional[db_models.User]:
    return db.query(db_models.User).filter(db_models.User.email == email).first()

def authenticate_user(db: Session, email: str, password: str) -> Optional[db_models.User]:
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


# ---------- Dependency for protected routes ----------
# In xai_service/auth.py

async def get_current_user(
    # FIX: Rename the variable to match the cookie key OR use alias
    access_token: str = Cookie(None, alias="access_token"), 
    db: Session = Depends(get_db),
) -> db_models.User:
    if not access_token:
        # Ensure auth_error is defined as discussed previously!
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    try:
        # Use access_token here instead of token
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user


# ---------- Routes ----------
# ---------- REGISTER ----------
@router.post("/register", response_model=Token)
def register_user(
    user_data: UserCreate,
    response: Response,
    db: Session = Depends(get_db)
):
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = db_models.User(
        email=user_data.email,
        hashed_password=get_password_hash(user_data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Create JWT after registration
    access_token = create_access_token({"sub": user.email})

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,          # set True in production
        samesite="lax",
        max_age=14 * 24 * 3600  # 2 weeks
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ---------- LOGIN ----------
@router.post("/login", response_model=Token)
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )

    access_token = create_access_token({"sub": user.email})

    # Set JWT cookie (2 weeks)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,          # set True in production
        samesite="lax",
        max_age=14 * 24 * 3600
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

@router.get("/check")
def check_auth(request: Request):
    """
    Check if user is authenticated based on access_token cookie.
    Returns user info if authenticated, else 401.
    """
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    # payload should have 'sub' or user info
    user_data = {"email": payload.get("sub"), "username": payload.get("username")}
    return JSONResponse(content={"user": user_data})

# ---------- LOGOUT ----------
@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out"}