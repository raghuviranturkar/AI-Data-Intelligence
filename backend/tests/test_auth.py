"""
Authentication API tests
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture(autouse=True)
def setup_db():
    """Database setup is handled by conftest.py"""
    pass

def test_register_success(client):
    """Test successful user registration"""
    response = client.post(
        "/auth/register",
        json={"name": "Test User", "email": "test@example.com", "password": "Test123!"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

def test_register_duplicate_email(client):
    """Test duplicate email registration"""
    # First registration
    client.post(
        "/auth/register",
        json={"name": "Test User", "email": "duplicate@example.com", "password": "Test123!"}
    )
    # Second registration with same email
    response = client.post(
        "/auth/register",
        json={"name": "Another User", "email": "duplicate@example.com", "password": "Test123!"}
    )
    assert response.status_code == 400
    assert "Email already registered" in response.text

def test_login_success(client):
    """Test successful login"""
    # Register first
    client.post(
        "/auth/register",
        json={"name": "Login User", "email": "login@example.com", "password": "Test123!"}
    )
    # Login
    response = client.post(
        "/auth/login",
        json={"email": "login@example.com", "password": "Test123!"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data

def test_login_invalid_credentials(client):
    """Test login with invalid credentials"""
    response = client.post(
        "/auth/login",
        json={"email": "nonexistent@example.com", "password": "wrong"}
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.text

def test_get_current_user(client):
    """Test getting current user with valid token"""
    # Register
    client.post(
        "/auth/register",
        json={"name": "Current User", "email": "current@example.com", "password": "Test123!"}
    )
    # Login
    login_resp = client.post(
        "/auth/login",
        json={"email": "current@example.com", "password": "Test123!"}
    )
    token = login_resp.json()["access_token"]
    
    # Get current user
    response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "current@example.com"

def test_get_current_user_invalid_token(client):
    """Test getting current user with invalid token"""
    response = client.get(
        "/auth/me",
        headers={"Authorization": "Bearer invalid_token"}
    )
    assert response.status_code == 401

def test_logout(client):
    """Test logout endpoint"""
    response = client.post("/auth/logout")
    assert response.status_code == 200
    assert "Logged out successfully" in response.text
