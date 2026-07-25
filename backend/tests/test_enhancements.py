"""
Test the enhanced feature engineering with priorities and costs
"""
import pandas as pd
import numpy as np
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.pipeline import run_pipeline


def test_enhancements():
    """Test the enhancements"""
    np.random.seed(42)
    n = 200
    
    data = {
        'id': range(1, n + 1),
        'age': np.random.normal(35, 10, n),
        'salary': np.random.normal(60000, 20000, n),
        'score': np.random.normal(75, 15, n),
        'experience': np.random.normal(10, 5, n),
        'department': np.random.choice(['IT', 'HR', 'Finance', 'Marketing', 'Sales'], n),
        'churn': np.random.choice([0, 1], n)
    }
    
    df = pd.DataFrame(data)
    df.loc[0, 'age'] = np.inf
    df.loc[10:15, 'age'] = np.nan
    
    # Run pipeline
    results = run_pipeline(df, "test_enhancements.csv")
    
    feature_eng = results.get('feature_engineering', {})
    
    print("\n" + "="*70)
    print("🔧 ENHANCED FEATURE ENGINEERING REPORT")
    print("="*70)
    
    print(f"\n📊 Priority Breakdown:")
    priority_breakdown = feature_eng.get('summary', {}).get('priority_breakdown', {})
    for priority, count in priority_breakdown.items():
        print(f"   {priority}: {count}")
    
    print(f"\n💰 Cost Breakdown:")
    cost_breakdown = feature_eng.get('summary', {}).get('cost_breakdown', {})
    for cost, count in cost_breakdown.items():
        print(f"   {cost}: {count}")
    
    print(f"\n📈 ML Readiness:")
    readiness = feature_eng.get('ml_readiness', {})
    print(f"   Score: {readiness.get('score', 0)}/100")
    print(f"   Status: {readiness.get('status', 'Unknown')}")
    print(f"   Critical Issues: {readiness.get('critical_count', 0)}")
    for issue in readiness.get('critical_issues', []):
        print(f"      ⚠️ {issue}")
    
    print(f"\n🎯 Encoding with Priority & Cost:")
    for col, rec in feature_eng.get('encoding', {}).get('encoding_recommendations', {}).items():
        print(f"   {col}: {rec['recommended_encoding']}")
        print(f"      Priority: {rec['priority']} | Cost: {rec['cost']}")
        print(f"      Expected Improvement: {rec['expected_improvement']}")
    
    print(f"\n📉 Scaling with Priority & Cost:")
    for col, rec in feature_eng.get('scaling', {}).get('scaling_recommendations', {}).items():
        print(f"   {col}: {rec['recommended_scaling']}")
        print(f"      Priority: {rec['priority']} | Cost: {rec['cost']}")
        print(f"      Expected Improvement: {rec['expected_improvement']}")
    
    print("\n" + "="*70)
    
    assert feature_eng.get('summary', {}).get('priority_breakdown') is not None
    assert feature_eng.get('ml_readiness', {}).get('critical_issues') is not None
    
    print("\n✅ All enhancements working!")

if __name__ == "__main__":
    test_enhancements()
