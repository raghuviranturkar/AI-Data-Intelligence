from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.auth.models import User
from app.schemas.dataset import DatasetCreate, DatasetUpdate, DatasetResponse
from app.services import dataset_service

router = APIRouter(prefix="/datasets", tags=["datasets"])

@router.get("/", response_model=List[DatasetResponse])
def list_datasets(
    workspace_id: Optional[int] = Query(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return dataset_service.get_datasets(db, current_user.id, workspace_id, skip, limit)

@router.get("/{dataset_id}", response_model=DatasetResponse)
def get_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return dataset_service.get_dataset(db, dataset_id, current_user.id)

@router.patch("/{dataset_id}", response_model=DatasetResponse)
def update_dataset(
    dataset_id: int,
    dataset_update: DatasetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return dataset_service.update_dataset(db, dataset_id, dataset_update, current_user.id)

@router.delete("/{dataset_id}")
def delete_dataset(
    dataset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    dataset_service.delete_dataset(db, dataset_id, current_user.id)
    return {"message": "Dataset deleted successfully"}
