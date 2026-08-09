from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.auth.models import User
from app.schemas.report import ReportCreate, ReportResponse
from app.services import report_service

router = APIRouter(prefix="/reports", tags=["reports"])

@router.post("/", response_model=ReportResponse)
def create_report(
    report: ReportCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return report_service.create_report(db, report, current_user.id)

@router.get("/", response_model=List[ReportResponse])
def list_reports(
    workspace_id: Optional[int] = Query(None),
    dataset_id: Optional[int] = Query(None),
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return report_service.get_reports(db, current_user.id, workspace_id, dataset_id, skip, limit)

@router.get("/{report_id}/download")
def download_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = report_service.get_report(db, report_id, current_user.id)
    if not os.path.exists(report.file_path):
        raise HTTPException(status_code=404, detail="Report file not found")
    return FileResponse(
        path=report.file_path,
        filename=f"{report.name}.{report.format}",
        media_type="application/octet-stream"
    )

@router.delete("/{report_id}")
def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report_service.delete_report(db, report_id, current_user.id)
    return {"message": "Report deleted successfully"}
