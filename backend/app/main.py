"""
FastAPI Application Entry Point
"""
from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse, PlainTextResponse
import logging
import json

from app.schemas.dataset import UploadResponse, ErrorResponse
from app.services.upload_service import UploadService
from app.services.report_storage import get_results
from app.services.reports.pdf_generator import generate_pdf_report, generate_html_report, generate_markdown_report
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
    return {
        "message": "AI Data Intelligence Engine",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "AI Data Intelligence Engine"}


@app.post(
    "/upload",
    response_model=UploadResponse,
    responses={
        400: {"model": ErrorResponse},
        500: {"model": ErrorResponse}
    }
)
async def upload_dataset(file: UploadFile = File(...)):
    """Upload and analyze a dataset"""
    logger.info(f"Received file: {file.filename}")
    
    try:
        result = await upload_service.process_upload(file)
        
        response_data = {
            "status": "success",
            "message": f"File {file.filename} processed successfully",
            "data": result,
            "session_id": result.get("session_id")
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


@app.get("/reports/pdf")
async def download_pdf_report(session_id: str = Query(..., description="Session ID from upload response")):
    """Download PDF report"""
    context = get_results(session_id)
    
    if not context:
        raise HTTPException(status_code=404, detail=f"No results found for session ID: {session_id}")
    
    try:
        pdf_path = generate_pdf_report(context, f"report_{session_id}.pdf")
        return FileResponse(
            pdf_path, 
            media_type='application/pdf', 
            filename=f"report_{session_id}.pdf"
        )
    except Exception as e:
        logger.error(f"Error generating PDF: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating PDF: {str(e)}")


@app.get("/reports/html")
async def download_html_report(session_id: str = Query(..., description="Session ID from upload response")):
    """Download HTML report"""
    context = get_results(session_id)
    
    if not context:
        raise HTTPException(status_code=404, detail=f"No results found for session ID: {session_id}")
    
    try:
        html_content = generate_html_report(context)
        return HTMLResponse(content=html_content)
    except Exception as e:
        logger.error(f"Error generating HTML: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating HTML: {str(e)}")


@app.get("/reports/md")
async def download_markdown_report(session_id: str = Query(..., description="Session ID from upload response")):
    """Download Markdown report"""
    context = get_results(session_id)
    
    if not context:
        raise HTTPException(status_code=404, detail=f"No results found for session ID: {session_id}")
    
    try:
        md_content = generate_markdown_report(context)
        return PlainTextResponse(content=md_content, media_type="text/markdown")
    except Exception as e:
        logger.error(f"Error generating Markdown: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating Markdown: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
