import secrets
import urllib.request
import json

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from jose import jwt as jose_jwt

from ..database import get_db
from ..models import User
from ..auth import hash_password, verify_password, create_access_token
from ..config import GOOGLE_CLIENT_ID, APPLE_CLIENT_ID, ALLOW_MOCK_OAUTH

router = APIRouter(tags=["auth"])


class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str


class OAuthRequest(BaseModel):
    token: str
    email: str = None
    name: str = None


def generate_unique_username(email: str, db: Session) -> str:
    base = email.split("@")[0]
    base = "".join(c for c in base if c.isalnum() or c in ("-", "_"))
    if not base:
        base = "user"
    username = base
    while db.query(User).filter(User.username == username).first():
        username = f"{base}_{secrets.token_hex(2)}"
    return username


def verify_google_token(token: str) -> dict:
    url = f"https://oauth2.googleapis.com/tokeninfo?id_token={token}"
    try:
        req = urllib.request.Request(url, method="GET")
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode("utf-8"))
            if GOOGLE_CLIENT_ID and data.get("aud") != GOOGLE_CLIENT_ID:
                return None
            return data
    except Exception:
        return None


@router.post("/register")
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        (User.email == payload.email) | (User.username == payload.username)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    user = User(
        username=payload.username,
        email=payload.email,
        password=hash_password(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")

    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer"}


@router.post("/auth/google")
def google_login(payload: OAuthRequest, db: Session = Depends(get_db)):
    email = None

    if ALLOW_MOCK_OAUTH and (payload.token.startswith("mock_google_") or not GOOGLE_CLIENT_ID):
        email = payload.email or "google_user@example.com"
    else:
        token_info = verify_google_token(payload.token)
        if not token_info:
            raise HTTPException(status_code=400, detail="Invalid Google token")
        email = token_info.get("email")

    if not email:
        raise HTTPException(status_code=400, detail="Google account has no email")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        username = generate_unique_username(email, db)
        user = User(
            username=username,
            email=email,
            password=hash_password(secrets.token_hex(16)),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "username": user.username},
    }


@router.post("/auth/apple")
def apple_login(payload: OAuthRequest, db: Session = Depends(get_db)):
    email = None

    if ALLOW_MOCK_OAUTH and (payload.token.startswith("mock_apple_") or not APPLE_CLIENT_ID):
        email = payload.email or "apple_user@example.com"
    else:
        try:
            claims = jose_jwt.get_unverified_claims(payload.token)
            if claims.get("iss") != "https://appleid.apple.com":
                raise HTTPException(status_code=400, detail="Invalid Apple issuer")
            if APPLE_CLIENT_ID and claims.get("aud") != APPLE_CLIENT_ID:
                raise HTTPException(status_code=400, detail="Invalid Apple audience")
            email = claims.get("email")
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid Apple token")

    if not email:
        raise HTTPException(status_code=400, detail="Apple account has no email")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        username = generate_unique_username(email, db)
        user = User(
            username=username,
            email=email,
            password=hash_password(secrets.token_hex(16)),
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": str(user.id)})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "email": user.email, "username": user.username},
    }