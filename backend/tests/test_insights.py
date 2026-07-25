"""
Tests for AI Insight Engine
"""
import pandas as pd
import numpy as np
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.pipeline import run_pipeline


def create_test_dataset():
    """Create a dataset for insight testing"""
    np.random.seed(42)
    n = 200
    
    data = {
        'id': range(1, n + 1),
        'age': np.random.normal(35, 10, n),
        'salary': np.random.normal(60000, 20000, n),
        'experience': np.random.normal(10, 5, n),
        'productivity': np.random.normal(80, 10, n),
        'department': np.random.choice(['IT', 'HR', 'Finance', 'Marketing', 'Sales'], n),
        'churn': np.random.choice([0, 1], n)
    }
    
    df = pd.DataFrame(data)
    df['salary'] = df['experience'] * 5000 + np.random.normal(30000, 10000, n)
    
    return df


def test_insights():
    """Test AI Insight Engine"""
    df = create_test_dataset()
    
    # Run complete pipeline with insights
    results = run_pipeline(df, "test_insights.csv", include_insights=True)
    
    insights = results.get('insights', {})
    
    print("\n" + "="*70)
    print("💡 AI INSIGHT REPORT")
    print("="*70)
    
    print(f"\n📊 Dataset Summary:")
    dataset_summary = insights.get('dataset_summary', {})
    print(f"   Rows: {dataset_summary.get('rows', 0)}")
    print(f"   Columns: {dataset_summary.get('columns', 0)}")
    print(f"   Quality Score: {dataset_summary.get('quality_score', 0)}")
    
    print(f"\n📊 AI Health Score:")
    health = insights.get('ai_health_score', {})
    print(f"   Score: {health.get('score', 0)}/100")
    print(f"   Confidence: {health.get('confidence', 'Unknown')}")
    
    print(f"\n💪 Strengths:")
    for strength in insights.get('strengths', []):
        print(f"   • {strength}")
    
    print(f"\n⚠️ Weaknesses:")
    for weakness in insights.get('weaknesses', []):
        print(f"   • {weakness}")
    
    print(f"\n🚨 Risks:")
    for risk in insights.get('risks', []):
        print(f"   • {risk}")
    
    print(f"\n🎯 Recommendations:")
    for rec in insights.get('recommendations', []):
        print(f"   • {rec}")
    
    print(f"\n📋 Next Steps:")
    for step in insights.get('next_steps', []):
        print(f"   • {step}")
    
    print(f"\n📝 Executive Summary:")
    print(f"   {insights.get('executive_summary', 'N/A')}")
    
    print(f"\n📊 Quality Insights:")
    for insight in insights.get('quality_insights', []):
        print(f"   • {insight}")
    
    print(f"\n📊 EDA Insights:")
    for insight in insights.get('eda_insights', []):
        print(f"   • {insight}")
    
    print(f"\n📊 Model Insights:")
    for insight in insights.get('model_insights', []):
        print(f"   • {insight}")
    
    print("\n" + "="*70)
    
    assert insights.get('ai_health_score') is not None
    assert insights.get('executive_summary') is not None
    assert insights.get('recommendations') is not None
    
    print("\n✅ AI Insight Engine test passed!")

if __name__ == "__main__":
    test_insights()
