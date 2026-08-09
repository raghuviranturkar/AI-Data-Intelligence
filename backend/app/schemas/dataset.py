"""
Pydantic models for dataset operations
"""
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
from datetime import datetime


class DatasetSummary(BaseModel):
    """Response model for dataset summary"""
    file_name: str
    shape: Dict[str, int]
    columns: List[str]
    numeric_columns: List[str]
    categorical_columns: List[str]
    dtypes: Dict[str, str]
    missing_values: Dict[str, int]
    missing_percentage: Dict[str, float]
    duplicate_rows: int
    memory_usage: Dict[str, Any]
    basic_statistics: Dict[str, Any]


class ValidationReport(BaseModel):
    """Response model for validation report"""
    dataset: Dict[str, Any]
    validation: Dict[str, Any]
    profiling: Dict[str, Any]
    quality: Dict[str, Any]


class UploadResponse(BaseModel):
    """Response model for upload endpoint"""
    status: str
    message: Optional[str] = None
    data: Optional[Dict[str, Any]] = None


class ErrorResponse(BaseModel):
    """Response model for errors"""
    status: str
    message: str
    details: Optional[str] = None


# Workspace/Dataset History schemas
class DatasetCreate(BaseModel):
    workspace_id: int
    original_filename: str
    stored_filename: Optional[str] = None
    file_path: Optional[str] = None
    row_count: int = 0
    column_count: int = 0
    file_size: int = 0
    session_id: Optional[str] = None


class DatasetUpdate(BaseModel):
    quality_score: Optional[float] = None
    ai_health_score: Optional[float] = None
    best_model: Optional[str] = None
    processing_status: Optional[str] = None
    processed_at: Optional[datetime] = None
    metadata_json: Optional[Dict[str, Any]] = None


class DatasetResponse(BaseModel):
    id: int
    workspace_id: int
    user_id: int
    original_filename: str
    row_count: int
    column_count: int
    file_size: int
    quality_score: Optional[float] = None
    ai_health_score: Optional[float] = None
    best_model: Optional[str] = None
    processing_status: str
    uploaded_at: datetime
    processed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
