"""
FastAPI Application Entry Point
"""
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import json

from app.schemas.dataset import UploadResponse, ErrorResponse
from app.services.upload_service import UploadService
from app.utils.json_encoder import NumpyJSONEncoder

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="AI Data Intelligence Engine",
    description="API for data processing and analysis",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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
    Returns comprehensive dataset analysis.
    """
    logger.info(f"Received file: {file.filename}")
    
    try:
        result = await upload_service.process_upload(file)
        
        # Convert response to JSON with custom encoder
        response_data = {
            "status": "success",
            "message": f"File {file.filename} processed successfully",
            "data": result
        }
        
        # Use custom JSON encoder to handle numpy types
        json_str = json.dumps(response_data, cls=NumpyJSONEncoder)
        return JSONResponse(content=json.loads(json_str))
        
    except ValueError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        logger.error(f"Error processing file: {str(e)}")
        import traceback
        traceback.print_exc()
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
