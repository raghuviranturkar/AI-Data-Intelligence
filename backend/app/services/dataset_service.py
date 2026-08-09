from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import Dataset
from app.schemas.dataset import DatasetCreate, DatasetUpdate
from app.services.workspace_service import get_workspace

def get_dataset(db: Session, dataset_id: int, user_id: int):
    dataset = db.query(Dataset).filter(
        Dataset.id == dataset_id,
        Dataset.user_id == user_id
    ).first()
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return dataset

def get_datasets(db: Session, user_id: int, workspace_id: int = None, skip: int = 0, limit: int = 100):
    query = db.query(Dataset).filter(Dataset.user_id == user_id)
    if workspace_id:
        query = query.filter(Dataset.workspace_id == workspace_id)
    return query.order_by(Dataset.uploaded_at.desc()).offset(skip).limit(limit).all()

def create_dataset(db: Session, dataset: DatasetCreate, user_id: int):
    # Verify workspace belongs to user
    get_workspace(db, dataset.workspace_id, user_id)
    db_dataset = Dataset(
        workspace_id=dataset.workspace_id,
        user_id=user_id,
        original_filename=dataset.original_filename,
        stored_filename=dataset.stored_filename,
        file_path=dataset.file_path,
        row_count=dataset.row_count,
        column_count=dataset.column_count,
        file_size=dataset.file_size,
        session_id=dataset.session_id,
        processing_status="processing"
    )
    db.add(db_dataset)
    db.commit()
    db.refresh(db_dataset)
    return db_dataset

def update_dataset(db: Session, dataset_id: int, dataset_update: DatasetUpdate, user_id: int):
    db_dataset = get_dataset(db, dataset_id, user_id)
    for key, value in dataset_update.model_dump(exclude_unset=True).items():
        setattr(db_dataset, key, value)
    if dataset_update.processing_status == "completed":
        db_dataset.processed_at = dataset_update.processed_at or db_dataset.processed_at
    db.commit()
    db.refresh(db_dataset)
    return db_dataset

def delete_dataset(db: Session, dataset_id: int, user_id: int):
    db_dataset = get_dataset(db, dataset_id, user_id)
    db.delete(db_dataset)
    db.commit()
    return db_dataset
