"""
Upload Service
Handles file upload and processing
"""
import os
import shutil
from typing import Dict, Any, Optional
from datetime import datetime
from fastapi import UploadFile
import pandas as pd
import traceback

from .pipeline import run_pipeline
from .reports import generate_pdf_report, generate_html_report, generate_markdown_report


class UploadService:
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = upload_dir
        os.makedirs(upload_dir, exist_ok=True)
        os.makedirs("reports", exist_ok=True)
    
    async def process_upload(self, file: UploadFile, user_id: Optional[int] = None) -> Dict[str, Any]:
        # Validate file type
        allowed_extensions = {'.csv', '.xlsx', '.xls'}
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension not in allowed_extensions:
            raise ValueError(
                f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
            )
        
        # Generate unique filename and session ID
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        safe_filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(self.upload_dir, safe_filename)
        session_id = timestamp
        
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
            if file_extension == '.csv':
                df = pd.read_csv(file_path)
            else:
                df = pd.read_excel(file_path)
            
            print(f"📊 Loaded dataset: {len(df)} rows, {len(df.columns)} columns")
            
            # Run pipeline
            results = run_pipeline(df, file.filename)
            
            # Add session_id to results
            results["session_id"] = session_id
            
            # Generate reports
            print("📄 Generating reports...")
            
            # Create context for report generation and assistant
            context = {
                "dataframe": df,
                "file_name": file.filename,
                "dataset": results.get("dataset", {}),
                "validation": results.get("validation", {}),
                "eda": results.get("eda", {}),
                "feature_engineering": results.get("feature_engineering", {}),
                "automl": results.get("automl", {}),
                "explainability": results.get("explainability", {}),
                "insights": results.get("insights", {})
            }
            
            # Store context for the assistant with user_id
            if user_id is not None:
                from app.routers.assistant import set_dataset_context
                set_dataset_context(user_id, context)
                print(f"📊 Context stored for user {user_id}")
            
            # Generate PDF
            try:
                pdf_path = generate_pdf_report(context, f"reports/report_{session_id}.pdf")
                results["report_pdf"] = pdf_path
                print(f"   ✅ PDF Report: {pdf_path}")
            except Exception as e:
                print(f"   ❌ PDF Report failed: {str(e)}")
                traceback.print_exc()
            
            # Generate HTML - save to file
            try:
                html_path = f"reports/report_{session_id}.html"
                html_content = generate_html_report(context)
                with open(html_path, 'w') as f:
                    f.write(html_content)
                results["report_html"] = html_path
                print(f"   ✅ HTML Report: {html_path}")
            except Exception as e:
                print(f"   ❌ HTML Report failed: {str(e)}")
                traceback.print_exc()
            
            # Generate Markdown - save to file
            try:
                md_path = f"reports/report_{session_id}.md"
                md_content = generate_markdown_report(context)
                with open(md_path, 'w') as f:
                    f.write(md_content)
                results["report_markdown"] = md_path
                print(f"   ✅ Markdown Report: {md_path}")
            except Exception as e:
                print(f"   ❌ Markdown Report failed: {str(e)}")
                traceback.print_exc()
            
            results["file_path"] = file_path
            
            print("✅ Pipeline complete!")
            return results
            
        except Exception as e:
            if os.path.exists(file_path):
                os.remove(file_path)
            print(f"❌ Error: {str(e)}")
            traceback.print_exc()
            raise Exception(f"Error processing dataset: {str(e)}")
