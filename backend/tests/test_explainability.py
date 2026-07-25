"""
Tests for Explainability Engine
"""
import pandas as pd
import numpy as np
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.pipeline import run_pipeline


def create_test_dataset():
    """Create a dataset for explainability testing"""
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
    
    # Create correlations
    df['salary'] = df['experience'] * 5000 + np.random.normal(30000, 10000, n)
    
    return df


def test_explainability():
    """Test explainability engine"""
    df = create_test_dataset()
    
    # Run pipeline with AutoML
    results = run_pipeline(df, "test_explainability.csv")
    
    # Run explainability
    from app.services.explainability import run_explainability
    
    # Create context from pipeline results
    context = {
        "dataframe": df,
        "automl": results.get("automl", {}),
        "feature_engineering": results.get("feature_engineering", {})
    }
    
    explainability_results = run_explainability(context)
    
    print("\n" + "="*70)
    print("🔍 EXPLAINABILITY REPORT")
    print("="*70)
    
    print(f"\n📊 SHAP Available: {explainability_results.get('shap_available', False)}")
    
    print(f"\n📋 Feature Importance:")
    importance = explainability_results.get('feature_importance', {})
    for name, imp in list(importance.items())[:5]:
        print(f"   {name}: {imp:.4f}")
    
    print(f"\n📊 Feature Categories:")
    categories = explainability_results.get('categories', {})
    for category, features in categories.items():
        if features:
            print(f"   {category}: {', '.join(features[:3])}")
    
    print(f"\n🌍 Global Explanation:")
    global_exp = explainability_results.get('global_explanation', {})
    for summary in global_exp.get('summary', []):
        print(f"   • {summary}")
    
    print(f"\n🔍 Local Explanation:")
    local_exp = explainability_results.get('local_explanation', {})
    print(f"   Prediction: {local_exp.get('prediction', 'N/A')}")
    for reason in local_exp.get('reasons', []):
        print(f"   • {reason}")
    
    print(f"\n💡 Insights:")
    insights = explainability_results.get('insights', {})
    confidence = insights.get('confidence_assessment', {})
    print(f"   Confidence: {confidence.get('confidence', 'N/A')}")
    print(f"   {confidence.get('reason', '')}")
    
    print(f"\n📊 Summary:")
    summary = explainability_results.get('summary', {})
    print(f"   Features Explained: {summary.get('features_explained', 0)}")
    print(f"   Global Explanations: {summary.get('global_explanations', 0)}")
    print(f"   Visualizations: {summary.get('visualizations', 0)}")
    
    print("\n" + "="*70)
    
    assert explainability_results.get('summary') is not None
    assert explainability_results.get('feature_importance') is not None
    
    print("\n✅ Explainability test passed!")

if __name__ == "__main__":
    test_explainability()
