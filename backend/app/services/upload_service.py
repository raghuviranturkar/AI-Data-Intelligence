"""
Upload Service with Data Validation and Report Storage
"""
import os
import shutil
from typing import Dict, Any
from datetime import datetime
from fastapi import UploadFile
import pandas as pd
import numpy as np
import traceback

from .pipeline import run_pipeline
from .data_validator import DataPreValidator
from .report_storage import store_results


class UploadService:
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = upload_dir
        os.makedirs(upload_dir, exist_ok=True)
    
    async def process_upload(self, file: UploadFile) -> Dict[str, Any]:
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
            
            # Pre-validate the data
            is_valid, errors = DataPreValidator.validate_file(df, file.filename)
            
            if not is_valid:
                # Clean up file
                if os.path.exists(file_path):
                    os.remove(file_path)
                
                error_message = "The dataset has the following issues:\n" + "\n".join([f"• {e}" for e in errors])
                raise ValueError(error_message)
            
            # Run pipeline
            results = run_pipeline(df, file.filename)
            
            # Add file path to results
            results["file_path"] = file_path
            results["file_name"] = file.filename
            
            # Store results for report generation
            session_id = store_results(results)
            results["session_id"] = session_id
            
            print("✅ Pipeline complete!")
            print(f"📄 Report session ID: {session_id}")
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
