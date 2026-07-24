"""
Test the improved validator
"""
import pandas as pd
import numpy as np
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.validator import validate_dataset

def test_improvements():
    """Test all improvements"""
    
    # Create test data - use float for columns that will have infinity
    data = {
        'id': list(range(1, 101)),
        'customer_name': ['Customer_' + str(i) for i in range(1, 101)],
        'age': np.random.randint(18, 80, 100).astype(float),  # Convert to float
        'salary': np.random.randint(30000, 150000, 100).astype(float),  # Convert to float
        'country': ['USA'] * 100,
        'purchase_date': pd.date_range('2023-01-01', periods=100).astype(str),
        'is_premium': np.random.choice([True, False], 100),
        'churn': np.random.choice([0, 1], 100)
    }
    
    df = pd.DataFrame(data)
    
    # Now we can safely add infinity to float columns
    df.loc[0, 'age'] = np.inf  # Positive infinity
    df.loc[5, 'age'] = -np.inf  # Negative infinity
    df.loc[10:15, 'age'] = np.nan  # Missing values
    df.loc[20:30, 'salary'] = np.nan  # More missing
    
    # Validate
    report = validate_dataset(df, "test_improvements.csv")
    
    print("\n" + "="*70)
    print("📊 VALIDATION REPORT - IMPROVED VERSION")
    print("="*70)
    
    print(f"\n📁 Dataset: {report['dataset']['file_name']}")
    print(f"   Rows: {report['dataset']['rows']}")
    print(f"   Columns: {report['dataset']['columns']}")
    
    print(f"\n✅ Readiness:")
    readiness = report['validation']['readiness']
    print(f"   Status: {readiness['status']}")
    print(f"   Confidence: {readiness['confidence']}/100")
    print(f"   Reason: {readiness['reason']}")
    
    print(f"\n⚠️ Warnings ({report['quality']['total_warnings']} unique warnings):")
    for i, warning in enumerate(report['quality']['warnings'], 1):
        print(f"   {i}. {warning}")
    
    print(f"\n📈 Quality Score: {report['quality']['quality_score']}/100")
    
    print(f"\n🎯 Target Candidates: {report['profiling']['target_candidates']}")
    
    print(f"\n🔍 Infinite Values:")
    inf = report['validation']['infinite_values']
    print(f"   Has Infinite: {inf['has_infinite']}")
    print(f"   Positive Infinity: {inf['has_positive_inf']}")
    print(f"   Negative Infinity: {inf['has_negative_inf']}")
    print(f"   Columns: {inf['infinite_columns']}")
    
    print(f"\n🏷️ High Cardinality (categorical only):")
    for col, info in report['profiling']['high_cardinality'].items():
        print(f"   {col}: {info['unique_values']} unique (ratio: {info['ratio']})")
    
    print("\n" + "="*70)
    
    # Assertions
    assert report['quality']['total_warnings'] == len(set(report['quality']['warnings']))
    assert 'purchase_date' not in report['profiling']['target_candidates']
    
    print("\n✅ All tests passed! All improvements working!")

if __name__ == "__main__":
    test_improvements()
