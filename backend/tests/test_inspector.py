"""
Tests for dataset inspector
"""
import pandas as pd
import numpy as np
import os
import tempfile
from app.services.dataset_inspector import inspect_dataset


def create_test_csv():
    """Create a test CSV file"""
    data = {
        'Name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve'],
        'Age': [25, 30, 35, 40, 45],
        'Salary': [50000, 60000, 70000, 80000, 90000],
        'Department': ['IT', 'HR', 'IT', 'Finance', 'HR'],
        'Join_Date': ['2020-01-01', '2019-05-15', '2021-03-10', '2018-11-20', '2022-06-01']
    }
    df = pd.DataFrame(data)
    
    # Add some missing values
    df.loc[0, 'Age'] = np.nan
    df.loc[2, 'Salary'] = np.nan
    
    # Create temp file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.csv')
    df.to_csv(temp_file.name, index=False)
    temp_file.close()
    
    return temp_file.name


def test_inspect_dataset():
    """Test dataset inspection"""
    # Create test dataset
    file_path = create_test_csv()
    
    try:
        # Inspect dataset
        summary = inspect_dataset(file_path)
        
        # Test basic properties
        assert summary['file_name'] == os.path.basename(file_path)
        assert summary['shape']['rows'] == 5
        assert summary['shape']['columns'] == 5
        assert 'Name' in summary['columns']
        assert 'Age' in summary['columns']
        
        # Test missing values
        assert summary['missing_values']['Age'] == 1
        assert summary['missing_values']['Salary'] == 1
        
        # Test duplicate rows
        assert summary['duplicate_rows'] == 0
        
        print("All tests passed!")
        print(f"Summary: {summary}")
        
    finally:
        # Clean up
        if os.path.exists(file_path):
            os.remove(file_path)


if __name__ == "__main__":
    test_inspect_dataset()