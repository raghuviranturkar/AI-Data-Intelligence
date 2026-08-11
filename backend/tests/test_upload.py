"""
Upload and pipeline tests
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app
import os

client = TestClient(app)

# Test data
TEST_CSV = """id,name,age,score
1,Alice,25,85
2,Bob,30,92
3,Charlie,35,78
4,Diana,28,90
5,Eve,32,88
"""

def test_upload_success():
    """Test successful dataset upload"""
    # Register and login first
    client.post(
        "/auth/register",
        json={"name": "Upload User", "email": "upload@example.com", "password": "Test123!"}
    )
    login_resp = client.post(
        "/auth/login",
        json={"email": "upload@example.com", "password": "Test123!"}
    )
    token = login_resp.json()["access_token"]
    
    # Create test file
    with open("test_upload.csv", "w") as f:
        f.write(TEST_CSV)
    
    # Upload
    with open("test_upload.csv", "rb") as f:
        response = client.post(
            "/upload",
            files={"file": ("test_upload.csv", f, "text/csv")},
            headers={"Authorization": f"Bearer {token}"}
        )
    
    # Clean up
    os.remove("test_upload.csv")
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "session_id" in data["data"]

def test_upload_unauthorized():
    """Test upload without authentication"""
    with open("test_upload.csv", "w") as f:
        f.write(TEST_CSV)
    
    with open("test_upload.csv", "rb") as f:
        response = client.post(
            "/upload",
            files={"file": ("test_upload.csv", f, "text/csv")}
        )
    
    os.remove("test_upload.csv")
    assert response.status_code == 401

def test_upload_invalid_file():
    """Test upload with invalid file type"""
    # Register and login
    client.post(
        "/auth/register",
        json={"name": "Upload User 2", "email": "upload2@example.com", "password": "Test123!"}
    )
    login_resp = client.post(
        "/auth/login",
        json={"email": "upload2@example.com", "password": "Test123!"}
    )
    token = login_resp.json()["access_token"]
    
    # Create invalid file
    with open("test_upload.txt", "w") as f:
        f.write("This is not a CSV file")
    
    with open("test_upload.txt", "rb") as f:
        response = client.post(
            "/upload",
            files={"file": ("test_upload.txt", f, "text/plain")},
            headers={"Authorization": f"Bearer {token}"}
        )
    
    os.remove("test_upload.txt")
    assert response.status_code == 400
