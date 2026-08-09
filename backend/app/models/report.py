from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    workspace_id = Column(Integer, ForeignKey("workspaces.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    dataset_id = Column(Integer, ForeignKey("datasets.id"), nullable=True)
    name = Column(String(255), nullable=False)
    format = Column(String(20), nullable=False)  # pdf, html, markdown
    file_path = Column(String(512), nullable=False)
    file_size = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())

    workspace = relationship("Workspace", back_populates="reports")
    dataset = relationship("Dataset", back_populates="reports")
    user = relationship("User")
