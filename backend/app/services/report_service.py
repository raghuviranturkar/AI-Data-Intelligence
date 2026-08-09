from sqlalchemy.orm import Session
from fastapi import HTTPException, status
import os
from app.models import Report
from app.schemas.report import ReportCreate
from app.services.workspace_service import get_workspace

def get_report(db: Session, report_id: int, user_id: int):
    report = db.query(Report).filter(
        Report.id == report_id,
        Report.user_id == user_id
    ).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

def get_reports(db: Session, user_id: int, workspace_id: int = None, dataset_id: int = None, skip: int = 0, limit: int = 100):
    query = db.query(Report).filter(Report.user_id == user_id)
    if workspace_id:
        query = query.filter(Report.workspace_id == workspace_id)
    if dataset_id:
        query = query.filter(Report.dataset_id == dataset_id)
    return query.order_by(Report.created_at.desc()).offset(skip).limit(limit).all()

def create_report(db: Session, report: ReportCreate, user_id: int):
    # Verify workspace belongs to user
    get_workspace(db, report.workspace_id, user_id)
    db_report = Report(
        workspace_id=report.workspace_id,
        user_id=user_id,
        dataset_id=report.dataset_id,
        name=report.name,
        format=report.format,
        file_path=report.file_path,
        file_size=report.file_size
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

def delete_report(db: Session, report_id: int, user_id: int):
    db_report = get_report(db, report_id, user_id)
    # Delete file if exists
    if os.path.exists(db_report.file_path):
        try:
            os.remove(db_report.file_path)
        except:
            pass
    db.delete(db_report)
    db.commit()
    return db_report
