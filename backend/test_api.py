"""
Test the API endpoints
"""
import requests
import json
import os

# API endpoint
BASE_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    response = requests.get(f"{BASE_URL}/health")
    print(f"Health check: {response.json()}")
    assert response.status_code == 200

def test_upload():
    """Test upload endpoint"""
    # Find a CSV file to upload
    csv_files = []
    
    # Check datasets directory
    datasets_dir = "../datasets"
    if os.path.exists(datasets_dir):
        for file in os.listdir(datasets_dir):
            if file.endswith('.csv'):
                csv_files.append(os.path.join(datasets_dir, file))
    
    if not csv_files:
        print("No CSV files found in datasets directory")
        return
    
    # Upload the first CSV found
    file_path = csv_files[0]
    print(f"Uploading: {file_path}")
    
    with open(file_path, 'rb') as f:
        files = {'file': (os.path.basename(file_path), f, 'text/csv')}
        response = requests.post(f"{BASE_URL}/upload", files=files)
    
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    assert response.status_code == 200

if __name__ == "__main__":
    print("Testing API endpoints...")
    test_health()
    test_upload()
    print("Tests completed!")