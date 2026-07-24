"""
FastAPI Application Entry Point
"""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging

from app.schemas.dataset import UploadResponse, ErrorResponse
from app.services.upload_service import UploadService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AI Data Intelligence Engine",
    description="API for data processing, analysis, and ML preparation",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
upload_service = UploadService()


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Data Intelligence Engine",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "AI Data Intelligence Engine"
    }


@app.post(
    "/upload",
    response_model=UploadResponse,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    }
)
async def upload_dataset(file: UploadFile = File(...)):
    """
    Upload and analyze a dataset
    
    Accepts CSV, XLSX, or XLS files.
    Returns comprehensive dataset analysis including:
    - Dataset inspection
    - Validation & quality
    - Cleaning recommendations
    - Outlier detection
    - Exploratory Data Analysis (EDA)
    - Feature Engineering recommendations
    - ML readiness assessment
    """
    logger.info(f"Received file: {file.filename}")
    
    try:
        # Process the upload using pipeline
        result = await upload_service.process_upload(file)
        
        # Return combined response
        return UploadResponse(
            status="success",
            message=f"File {file.filename} processed successfully",
            data={
                "dataset": result.get("dataset", {}),
                "validation": result.get("validation", {}),
                "cleaning": result.get("cleaning", {}),
                "outliers": result.get("outliers", {}),
                "eda": result.get("eda", {}),
                "feature_engineering": result.get("feature_engineering", {})
            }
        )
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
