"""
Tests for Cleaning Recommendation Engine
"""
import pandas as pd
import numpy as np
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.validator import validate_dataset
from app.services.cleaning_engine import generate_cleaning_recommendations


def create_test_dataset():
    """Create a dataset with various issues"""
    data = {
        'id': range(1, 101),
        'customer_name': ['Customer_' + str(i) for i in range(1, 101)],
        'age': np.random.randint(18, 80, 100).astype(float),
        'salary': np.random.randint(30000, 150000, 100).astype(float),
        'country': ['USA'] * 100,
        'purchase_date': pd.date_range('2023-01-01', periods=100).astype(str),
        'is_premium': np.random.choice([True, False], 100),
        'churn': np.random.choice([0, 1], 100)
    }
    
    df = pd.DataFrame(data)
    
    # Add issues
    df.loc[0, 'age'] = np.inf
    df.loc[5, 'age'] = -np.inf
    df.loc[10:15, 'age'] = np.nan  # 6 missing values
    df.loc[20:30, 'salary'] = np.nan  # 11 missing values
    
    # Add duplicate rows
    df_duplicates = df.iloc[0:2].copy()  # Take 2 rows and duplicate them
    df = pd.concat([df, df_duplicates], ignore_index=True)
    
    return df


def test_cleaning_recommendations():
    """Test cleaning recommendations"""
    df = create_test_dataset()
    
    # Validate first
    validation_report = validate_dataset(df, "test_cleaning.csv")
    
    # Generate cleaning recommendations
    cleaning_report = generate_cleaning_recommendations(df, validation_report)
    
    print("\n" + "="*70)
    print("🧹 CLEANING RECOMMENDATIONS")
    print("="*70)
    
    print(f"\n📊 Summary:")
    summary = cleaning_report['summary']
    print(f"   Total Issues: {summary['total_issues']}")
    print(f"   Critical: {summary['critical']}")
    print(f"   High: {summary['high']}")
    print(f"   Medium: {summary['medium']}")
    print(f"   Low: {summary['low']}")
    print(f"   Steps to Take: {summary['steps_to_take']}")
    
    print(f"\n📋 Checklist:")
    for item in cleaning_report['checklist'][:5]:  # Show first 5
        print(f"   [{item['priority'].upper()}] {item['column']}: {item['strategy']}")
        print(f"      {item['reason']}")
    
    print(f"\n🔍 Detailed Recommendations:")
    for col, rec in cleaning_report['recommendations'].items():
        if col == "_dataset_":
            print(f"\n   DATASET-LEVEL:")
        else:
            print(f"\n   {col}:")
        print(f"      Problem: {rec['problem']}")
        print(f"      Strategy: {rec['recommended_strategy']}")
        print(f"      Priority: {rec['priority']}")
        print(f"      Impact: {rec['impact']}")
    
    print("\n" + "="*70)
    
    # Assertions
    assert 'age' in cleaning_report['recommendations']
    assert 'country' in cleaning_report['recommendations']
    assert cleaning_report['summary']['total_issues'] > 0
    assert cleaning_report['summary']['critical'] >= 1
    
    print("\n✅ All tests passed! Cleaning engine working!")

if __name__ == "__main__":
    test_cleaning_recommendations()
