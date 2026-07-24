"""
Tests for data validator
"""
import pandas as pd
import numpy as np
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.validator import validate_dataset


def create_test_dataset():
    """Create a test dataset with various issues"""
    data = {
        'id': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        'name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 
                 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'],
        'age': [25, 30, np.nan, 40, 45, 50, np.nan, 60, 65, 70],
        'salary': [50000, 60000, 70000, 80000, 90000, 
                   100000, 110000, 120000, 130000, 140000],
        'gender': ['M', 'F', 'M', 'F', 'M', 'F', 'M', 'F', 'M', 'F'],
        'department': ['IT', 'HR', 'IT', 'Finance', 'HR', 
                       'IT', 'HR', 'Finance', 'IT', 'HR'],
        'is_active': [True, True, False, True, False, 
                      True, True, False, True, False],
        'join_date': ['2020-01-01', '2019-05-15', '2021-03-10', 
                      '2018-11-20', '2022-06-01', '2020-08-12',
                      '2019-12-01', '2021-07-23', '2020-03-15', 
                      '2022-01-10'],
        'country': ['India', 'India', 'India', 'India', 'India',
                    'India', 'India', 'India', 'India', 'India']  # Constant column
    }
    df = pd.DataFrame(data)
    
    # Add some issues
    df.loc[0, 'age'] = np.inf  # Infinite value
    df.loc[2, 'id'] = 1  # Duplicate ID
    
    return df


def test_validator():
    """Test the validator with a test dataset"""
    df = create_test_dataset()
    
    # Validate
    report = validate_dataset(df, "test_data.csv")
    
    # Print report
    print("\n" + "="*60)
    print("VALIDATION REPORT")
    print("="*60)
    
    print(f"\n📊 Dataset: {report['dataset']['file_name']}")
    print(f"   Rows: {report['dataset']['rows']}")
    print(f"   Columns: {report['dataset']['columns']}")
    
    print(f"\n✅ Validation Status:")
    print(f"   Dataset Valid: {report['validation']['dataset_valid']}")
    print(f"   Empty Dataset: {report['validation']['empty_dataset']}")
    print(f"   Ready for Analysis: {report['validation']['readiness']}")
    
    print(f"\n⚠️ Issues Found:")
    for warning in report['quality']['warnings']:
        print(f"   - {warning}")
    
    print(f"\n📈 Quality Score: {report['quality']['quality_score']}/100")
    
    print(f"\n🏷️ Column Classifications:")
    for col_type, columns in report['profiling']['column_classifications'].items():
        if columns:
            print(f"   {col_type}: {', '.join(columns)}")
    
    print("\n" + "="*60)
    
    # Assertions
    assert report['validation']['dataset_valid'] == True
    assert report['validation']['constant_columns'] == ['country']
    assert report['validation']['infinite_values']['has_infinite'] == True
    assert report['quality']['quality_score'] >= 70
    
    print("\n✅ All tests passed!")

if __name__ == "__main__":
    test_validator()
