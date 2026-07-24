"""
Upload Service
Handles file upload and processing
"""
import os
import shutil
from typing import Dict, Any
from datetime import datetime
from fastapi import UploadFile
import pandas as pd

from .dataset_inspector import inspect_dataset
from .validator import validate_dataset
from .cleaning_engine import generate_cleaning_recommendations


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
        
        # Load dataset for validation
        try:
            # Load based on file type
            if file_extension == '.csv':
                df = pd.read_csv(file_path)
            else:
                df = pd.read_excel(file_path)
            
            # Inspect dataset
            summary = inspect_dataset(file_path)
            
            # Validate dataset
            validation_report = validate_dataset(df, file.filename)
            
            # Generate cleaning recommendations
            cleaning_report = generate_cleaning_recommendations(df, validation_report)
            
            # Combine results
            result = {
                "file_path": file_path,
                "summary": summary,
                "validation": validation_report,
                "cleaning": cleaning_report
            }
            
            return result
            
        except Exception as e:
            # Clean up file if processing fails
            if os.path.exists(file_path):
                os.remove(file_path)
            raise Exception(f"Error processing dataset: {str(e)}")
