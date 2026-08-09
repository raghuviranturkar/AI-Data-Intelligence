from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
from . import schemas, service, security, dependencies
from app.database import get_db

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return service.create_user(db, user)

@router.post("/login", response_model=schemas.Token)
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = service.authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    access_token = security.create_access_token(data={"sub": db_user.email})
    refresh_token = security.create_refresh_token(data={"sub": db_user.email})
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/refresh", response_model=schemas.Token)
def refresh(refresh_token: str, db: Session = Depends(get_db)):
    payload = security.decode_token(refresh_token)
    if payload is None or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    user = service.get_user_by_email(db, email)
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    new_access = security.create_access_token(data={"sub": user.email})
    new_refresh = security.create_refresh_token(data={"sub": user.email})
    return {"access_token": new_access, "refresh_token": new_refresh, "token_type": "bearer"}

@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}

@router.get("/me", response_model=schemas.UserOut)
def get_current_user(current_user = Depends(dependencies.get_current_user)):
    return current_user

@router.patch("/profile", response_model=schemas.UserOut)
def update_profile(
    update_data: schemas.UserUpdate,
    current_user = Depends(dependencies.get_current_user),
    db: Session = Depends(get_db)
):
    return service.update_user(db, current_user.id, update_data)
