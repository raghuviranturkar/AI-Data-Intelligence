"""
Report generation and download tests
"""
import pytest
import os
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(autouse=True)
def setup_db():
    pass

def test_report_endpoints(client):
    """Test report download endpoints with invalid session"""
    response = client.get("/reports/pdf?session_id=invalid")
    assert response.status_code == 404
    
    response = client.get("/reports/html?session_id=invalid")
    assert response.status_code == 404
    
    response = client.get("/reports/md?session_id=invalid")
    assert response.status_code == 404

def test_report_headers(client):
    """Test report response headers with valid session"""
    reports_dir = "reports"
    if os.path.exists(reports_dir):
        files = os.listdir(reports_dir)
        pdf_files = [f for f in files if f.endswith('.pdf')]
        if pdf_files:
            session_id = pdf_files[0].replace('report_', '').replace('.pdf', '')
            
            # Test PDF
            response = client.get(f"/reports/pdf?session_id={session_id}")
            assert response.status_code == 200
            assert response.headers.get("content-type") == "application/pdf"
            assert "content-disposition" in response.headers
            
            # Test HTML - accept charset variation
            response = client.get(f"/reports/html?session_id={session_id}")
            assert response.status_code == 200
            content_type = response.headers.get("content-type", "")
            assert "text/html" in content_type
            
            # Test Markdown - accept charset variation
            response = client.get(f"/reports/md?session_id={session_id}")
            assert response.status_code == 200
            content_type = response.headers.get("content-type", "")
            assert "text/markdown" in content_type

def test_report_generation_flow():
    """Test the full report generation flow"""
    reports_dir = "reports"
    assert os.path.exists(reports_dir), "Reports directory does not exist"
    
    files = os.listdir(reports_dir)
    pdf_files = [f for f in files if f.endswith('.pdf')]
    html_files = [f for f in files if f.endswith('.html')]
    md_files = [f for f in files if f.endswith('.md')]
    
    # At least one of each format should exist
    assert len(pdf_files) > 0, "No PDF reports found"
    assert len(html_files) > 0, "No HTML reports found"
    assert len(md_files) > 0, "No Markdown reports found"
