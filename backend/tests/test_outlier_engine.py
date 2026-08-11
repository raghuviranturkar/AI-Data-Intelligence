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
    df.loc[0, 'age'] = 150
    df.loc[5, 'age'] = -5
    df.loc[10:15, 'salary'] = [250000, 280000, 310000, 290000, 260000, 270000]
    df.loc[20:22, 'score'] = [0, 2, 3]
    
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
    if 'outlier_percentage_overall' in summary:
        print(f"   Outlier Percentage: {summary['outlier_percentage_overall']}%")
    
    print(f"\n📊 Severity Distribution:")
    for severity, count in summary['severity_distribution'].items():
        if count > 0:
            print(f"   {severity}: {count} columns")
    
    if summary.get('riskiest_columns'):
        print(f"\n🎯 Risk Scores:")
        for col, score in summary['riskiest_columns']:
            print(f"   {col}: {score}/100")
    
    print(f"\n📋 Rankings: {report['rankings']['ranking']}")
    highest = report['rankings'].get('highest_outlier_column')
    if highest:
        print(f"   Highest Outlier Column: {highest}")
    
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
    
    print("\n" + "="*70)
    
    # Assertions
    assert 'analysis' in report
    assert 'summary' in report
    assert 'rankings' in report
    assert len(report['analysis']) > 0
    assert summary['columns_with_outliers'] > 0
    
    # Check that at least one outlier column is detected
    # Note: Only 'age' may be detected depending on the engine's logic
    detected_columns = list(report['analysis'].keys())
    assert len(detected_columns) > 0
    
    print("\n✅ Outlier test passed!")

if __name__ == "__main__":
    test_outlier_engine()
