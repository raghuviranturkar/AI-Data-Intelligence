"""
FastAPI Application Entry Point
"""
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import json

from app.schemas.dataset import UploadResponse, ErrorResponse
from app.services.upload_service import UploadService
from app.utils.json_encoder import NumpyJSONEncoder
from app.auth.dependencies import get_current_user
from app.auth.models import User

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
async def upload_dataset(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Upload and analyze a dataset
    
    Accepts CSV, XLSX, or XLS files.
    Returns comprehensive dataset analysis.
    """
    logger.info(f"Received file: {file.filename} from user {current_user.id}")
    
    try:
        result = await upload_service.process_upload(file, user_id=current_user.id)
        
        response_data = {
            "status": "success",
            "message": f"File {file.filename} processed successfully",
            "data": result
        }
        
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


# Import authentication router
from app.auth import router as auth_router
app.include_router(auth_router)

# Import product routers
from app.routers import workspace_router, dataset_router, report_router
app.include_router(workspace_router)
app.include_router(dataset_router)
app.include_router(report_router)

# Import assistant router
from app.routers.assistant import router as assistant_router
app.include_router(assistant_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
