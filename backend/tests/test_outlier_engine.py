"""
Tests for Outlier Detection Engine
"""
import pandas as pd
import numpy as np
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.outlier_engine import detect_outliers


def create_test_dataset():
    """Create a dataset with various outlier scenarios"""
    np.random.seed(42)
    
    data = {
        'id': range(1, 201),
        'age': np.random.normal(35, 10, 200).astype(int),
        'salary': np.random.normal(60000, 20000, 200),
        'score': np.random.normal(75, 15, 200),
        'is_active': np.random.choice([0, 1], 200)
    }
    
    df = pd.DataFrame(data)
    
    # Add outliers
    df.loc[0, 'age'] = 150  # Extreme outlier
    df.loc[5, 'age'] = -5   # Negative outlier
    df.loc[10:15, 'salary'] = [250000, 280000, 310000, 290000, 260000, 270000]  # High salary outliers
    df.loc[20:22, 'score'] = [0, 2, 3]  # Low score outliers
    
    return df


def test_outlier_engine():
    """Test outlier detection"""
    df = create_test_dataset()
    
    # Detect outliers
    report = detect_outliers(df)
    
    print("\n" + "="*70)
    print("📊 OUTLIER DETECTION REPORT")
    print("="*70)
    
    print(f"\n📈 Summary:")
    summary = report['summary']
    print(f"   Columns Analyzed: {summary['columns_analyzed']}")
    print(f"   Columns with Outliers: {summary['columns_with_outliers']}")
    print(f"   Total Outliers: {summary['total_outliers']}")
    print(f"   Outlier Percentage: {summary['outlier_percentage_overall']}%")
    
    print(f"\n📊 Severity Distribution:")
    for severity, count in summary['severity_distribution'].items():
        if count > 0:
            print(f"   {severity}: {count} columns")
    
    print(f"\n🎯 Risk Scores:")
    for col, score in summary['riskiest_columns']:
        print(f"   {col}: {score}/100")
    
    print(f"\n📋 Rankings: {report['rankings']['ranking']}")
    print(f"   Highest Outlier Column: {report['rankings']['highest_outlier_column']}")
    
    print(f"\n🔍 Detailed Analysis:")
    for col, analysis in report['analysis'].items():
        outlier_analysis = analysis['outlier_analysis']
        if outlier_analysis['outlier_count'] > 0:
            print(f"\n   {col}:")
            print(f"      Method: {outlier_analysis['method']}")
            print(f"      Outliers: {outlier_analysis['outlier_count']}")
            print(f"      Percentage: {outlier_analysis['outlier_percentage']}%")
            print(f"      Severity: {analysis['severity']}")
            print(f"      Risk Score: {analysis['risk_score']}/100")
            print(f"      Distribution: {analysis['distribution']['distribution_type']}")
            print(f"      Recommendation: {analysis['recommendation']['action']}")
            print(f"      Reason: {analysis['recommendation']['reason']}")
            print(f"      Plot: {analysis['visualization']['recommended_plot']}")
    
    print("\n" + "="*70)
    
    # Assertions
    assert 'age' in report['analysis']
    assert 'salary' in report['analysis']
    assert report['summary']['columns_with_outliers'] > 0
    assert report['rankings']['highest_outlier_column'] is not None
    
    print("\n✅ All tests passed! Outlier engine working!")

if __name__ == "__main__":
    test_outlier_engine()
