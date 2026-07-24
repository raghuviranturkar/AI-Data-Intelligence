"""
Tests for Feature Engineering Engine
"""
import pandas as pd
import numpy as np
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.pipeline import run_pipeline


def create_test_dataset():
    """Create a dataset for feature engineering testing"""
    np.random.seed(42)
    n = 200
    
    data = {
        'id': range(1, n + 1),
        'age': np.random.normal(35, 10, n),
        'salary': np.random.normal(60000, 20000, n),
        'score': np.random.normal(75, 15, n),
        'experience': np.random.normal(10, 5, n),
        'productivity': np.random.normal(80, 10, n),
        'department': np.random.choice(['IT', 'HR', 'Finance', 'Marketing', 'Sales'], n),
        'region': np.random.choice(['North', 'South', 'East', 'West'], n),
        'join_date': pd.date_range('2020-01-01', periods=n).astype(str),
        'is_manager': np.random.choice([0, 1], n),
        'churn': np.random.choice([0, 1], n)
    }
    
    df = pd.DataFrame(data)
    
    # Create some correlations
    df['salary'] = df['experience'] * 5000 + np.random.normal(30000, 10000, n)
    df['productivity'] = df['score'] * 0.8 + np.random.normal(20, 10, n)
    
    return df


def test_feature_engineering():
    """Test feature engineering engine"""
    df = create_test_dataset()
    
    # Run pipeline
    results = run_pipeline(df, "test_feature_engineering.csv")
    
    feature_eng = results.get('feature_engineering', {})
    
    print("\n" + "="*70)
    print("🔧 FEATURE ENGINEERING REPORT")
    print("="*70)
    
    print(f"\n📋 Feature Roles:")
    for col, role in feature_eng.get('feature_roles', {}).items():
        print(f"   {col}: {role}")
    
    print(f"\n📊 Encoding Recommendations:")
    for col, rec in feature_eng.get('encoding', {}).get('encoding_recommendations', {}).items():
        print(f"   {col}: {rec['recommended_encoding']} ({rec['unique_values']} unique)")
        print(f"      {rec['reason']}")
    
    print(f"\n📈 Scaling Recommendations:")
    for col, rec in feature_eng.get('scaling', {}).get('scaling_recommendations', {}).items():
        print(f"   {col}: {rec['recommended_scaling']} (skewness={rec['skewness']})")
        print(f"      {rec['reason']}")
    
    print(f"\n🔄 Transformation Recommendations:")
    for col, rec in feature_eng.get('transformations', {}).get('transformation_recommendations', {}).items():
        if rec['recommended_transform'] != 'none':
            print(f"   {col}: {rec['recommended_transform']} (skewness={rec['skewness']})")
            print(f"      {rec['reason']}")
    
    print(f"\n📉 Low Variance Features:")
    for item in feature_eng.get('low_variance', {}).get('low_variance_features', []):
        print(f"   {item['column']}: {item['recommendation']} - {item['reason']}")
    
    print(f"\n🤝 Interaction Suggestions:")
    for item in feature_eng.get('interactions', {}).get('interaction_suggestions', []):
        print(f"   {item['feature1']} × {item['feature2']} (r={item['correlation']})")
    
    print(f"\n📅 Datetime Features:")
    for col, rec in feature_eng.get('datetime_features', {}).get('datetime_suggestions', {}).items():
        print(f"   {col}: Extract {', '.join(rec['extract'])}")
    
    print(f"\n🎯 ML Readiness:")
    readiness = feature_eng.get('ml_readiness', {})
    print(f"   Score: {readiness.get('score', 0)}/100")
    print(f"   Status: {readiness.get('status', 'Unknown')}")
    print(f"   {readiness.get('recommendation', '')}")
    if readiness.get('issues'):
        print(f"   Issues: {len(readiness['issues'])}")
        for issue in readiness['issues'][:3]:
            print(f"      - {issue}")
    
    print(f"\n📊 Summary:")
    summary = feature_eng.get('summary', {})
    print(f"   Encoding Required: {summary.get('encoding_required', 0)}")
    print(f"   Scaling Required: {summary.get('scaling_required', 0)}")
    print(f"   Transform Required: {summary.get('transform_required', 0)}")
    print(f"   Drop Candidates: {summary.get('drop_candidates', 0)}")
    
    print("\n" + "="*70)
    
    # Assertions
    assert feature_eng.get('feature_roles') is not None
    assert feature_eng.get('ml_readiness', {}).get('score') is not None
    
    print("\n✅ All tests passed! Feature engineering engine working!")

if __name__ == "__main__":
    test_feature_engineering()
