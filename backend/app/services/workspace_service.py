from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models import Workspace
from app.schemas.workspace import WorkspaceCreate, WorkspaceUpdate

def get_workspace(db: Session, workspace_id: int, user_id: int):
    workspace = db.query(Workspace).filter(
        Workspace.id == workspace_id,
        Workspace.user_id == user_id
    ).first()
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
    return workspace

def get_workspaces(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Workspace).filter(Workspace.user_id == user_id).offset(skip).limit(limit).all()

def create_workspace(db: Session, workspace: WorkspaceCreate, user_id: int):
    db_workspace = Workspace(
        name=workspace.name,
        description=workspace.description,
        user_id=user_id
    )
    db.add(db_workspace)
    db.commit()
    db.refresh(db_workspace)
    return db_workspace

def update_workspace(db: Session, workspace_id: int, workspace_update: WorkspaceUpdate, user_id: int):
    db_workspace = get_workspace(db, workspace_id, user_id)
    if workspace_update.name is not None:
        db_workspace.name = workspace_update.name
    if workspace_update.description is not None:
        db_workspace.description = workspace_update.description
    db.commit()
    db.refresh(db_workspace)
    return db_workspace

def delete_workspace(db: Session, workspace_id: int, user_id: int):
    db_workspace = get_workspace(db, workspace_id, user_id)
    db.delete(db_workspace)
    db.commit()
    return db_workspace
