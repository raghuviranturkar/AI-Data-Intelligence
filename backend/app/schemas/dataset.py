"""
Pydantic models for dataset operations
"""
from pydantic import BaseModel
from typing import Dict, Any, List, Optional


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


class UploadResponse(BaseModel):
    """Response model for upload endpoint"""
    status: str
    message: Optional[str] = None
    data: Optional[DatasetSummary] = None


class ErrorResponse(BaseModel):
    """Response model for errors"""
    status: str
    message: str
    details: Optional[str] = None
