from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ReportBase(BaseModel):
    name: str
    format: str  # pdf, html, markdown

class ReportCreate(ReportBase):
    workspace_id: int
    dataset_id: Optional[int] = None
    file_path: str
    file_size: int = 0

class ReportResponse(ReportBase):
    id: int
    workspace_id: int
    user_id: int
    dataset_id: Optional[int] = None
    file_path: str
    file_size: int
    created_at: datetime

    class Config:
        from_attributes = True
