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
import json
import traceback

from .pipeline import run_pipeline
from ..utils.json_encoder import NumpyJSONEncoder


class UploadService:
    """Service for handling file uploads"""
    
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = upload_dir
        os.makedirs(upload_dir, exist_ok=True)
    
    async def process_upload(self, file: UploadFile) -> Dict[str, Any]:
        """
        Process uploaded file using the complete pipeline
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
        
        # Process through pipeline
        try:
            # Load dataset
            print(f"📊 Loading file: {file.filename}")
            if file_extension == '.csv':
                df = pd.read_csv(file_path)
            else:
                df = pd.read_excel(file_path)
            
            print(f"📊 Loaded dataset: {len(df)} rows, {len(df.columns)} columns")
            
            # Check if dataset is too small
            if len(df) < 2:
                raise ValueError(f"Dataset has only {len(df)} rows. Minimum 2 rows required for analysis.")
            
            # Check for required columns
            if len(df.columns) < 2:
                raise ValueError(f"Dataset has only {len(df.columns)} columns. Minimum 2 columns required.")
            
            # Run pipeline
            results = run_pipeline(df, file.filename)
            
            # Add file path to results
            results["file_path"] = file_path
            
            print("✅ Pipeline complete!")
            return results
            
        except ValueError as e:
            # Clean up file
            if os.path.exists(file_path):
                os.remove(file_path)
            print(f"❌ Validation Error: {str(e)}")
            raise ValueError(str(e))
            
        except Exception as e:
            # Clean up file if processing fails
            if os.path.exists(file_path):
                os.remove(file_path)
            print(f"❌ Error processing dataset: {str(e)}")
            print(traceback.format_exc())
            raise Exception(f"Error processing dataset: {str(e)}")
