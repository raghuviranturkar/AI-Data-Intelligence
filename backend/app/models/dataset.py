from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=True)
    file_path = Column(String(512), nullable=True)
    row_count = Column(Integer, default=0)
    column_count = Column(Integer, default=0)
    file_size = Column(Integer, default=0)
    quality_score = Column(Float, nullable=True)
    ai_health_score = Column(Float, nullable=True)
    best_model = Column(String(255), nullable=True)
    processing_status = Column(String(50), default="pending")
    metadata_json = Column(JSON, nullable=True)
    uploaded_at = Column(DateTime, server_default=func.now())
    processed_at = Column(DateTime, nullable=True)
    session_id = Column(String(255), nullable=True)

    workspace = relationship("Workspace", back_populates="datasets")
    user = relationship("User")
    reports = relationship("Report", back_populates="dataset", cascade="all, delete-orphan")
