"""
Upload Service
Handles file upload and processing
"""
import os
import shutil
from typing import Dict, Any
from datetime import datetime
from fastapi import UploadFile

from .dataset_inspector import inspect_dataset


class UploadService:
    """Service for handling file uploads"""
    
    def __init__(self, upload_dir: str = "uploads"):
        """
        Initialize upload service
        
        Args:
            upload_dir: Directory to store uploaded files
        """
        self.upload_dir = upload_dir
        os.makedirs(upload_dir, exist_ok=True)
    
    async def process_upload(self, file: UploadFile) -> Dict[str, Any]:
        """
        Process uploaded file
        
        Args:
            file: Uploaded file object
            
        Returns:
            Dictionary with processing results
        """
        # Validate file type
        allowed_extensions = {'.csv', '.xlsx', '.xls'}
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in allowed_extensions:
            raise ValueError(
                f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(self.upload_dir, safe_filename)
        
        # Save file
        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise Exception(f"Error saving file: {str(e)}")
        finally:
            await file.close()
        
        # Inspect dataset
        try:
            summary = inspect_dataset(file_path)
        except Exception as e:
            # Clean up file if inspection fails
            if os.path.exists(file_path):
                os.remove(file_path)
            raise Exception(f"Error inspecting dataset: {str(e)}")
        
        return {
            "file_path": file_path,
            "summary": summary
        }
