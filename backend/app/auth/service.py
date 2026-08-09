from sqlalchemy.orm import Session
from . import models, schemas, security
from fastapi import HTTPException, status

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    existing = get_user_by_email(db, user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = security.get_password_hash(user.password)
    db_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hashed
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not security.verify_password(password, user.password_hash):
        return False
    return user

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def update_user(db: Session, user_id: int, update_data: schemas.UserUpdate):
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if update_data.name is not None:
        user.name = update_data.name
    if update_data.email is not None:
        existing = get_user_by_email(db, update_data.email)
        if existing and existing.id != user_id:
            raise HTTPException(status_code=400, detail="Email already in use")
        user.email = update_data.email
    db.commit()
    db.refresh(user)
    return user
