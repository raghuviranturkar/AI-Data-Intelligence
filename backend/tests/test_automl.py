"""
Tests for AutoML Engine
"""
import pandas as pd
import numpy as np
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.pipeline import run_pipeline


def create_test_dataset():
    """Create a dataset for AutoML testing"""
    np.random.seed(42)
    n = 500
    
    data = {
        'id': range(1, n + 1),
        'age': np.random.normal(35, 10, n),
        'salary': np.random.normal(60000, 20000, n),
        'experience': np.random.normal(10, 5, n),
        'department': np.random.choice(['IT', 'HR', 'Finance', 'Marketing', 'Sales'], n),
        'churn': np.random.choice([0, 1], n)
    }
    
    df = pd.DataFrame(data)
    
    # Create correlations
    df['salary'] = df['experience'] * 5000 + np.random.normal(30000, 10000, n)
    
    return df


def test_automl():
    """Test AutoML engine"""
    df = create_test_dataset()
    
    # Run pipeline with AutoML
    results = run_pipeline(df, "test_automl.csv")
    
    automl = results.get('automl', {})
    
    print("\n" + "="*70)
    print("🤖 AUTOML REPORT")
    print("="*70)
    
    print(f"\n📋 Problem Type: {automl.get('problem_type', 'Unknown')}")
    print(f"🎯 Target Column: {automl.get('target_column', 'Unknown')}")
    print(f"📊 Models Trained: {automl.get('models_trained', 0)}")
    
    print(f"\n🏆 Candidate Models:")
    for model in automl.get('candidate_models', []):
        print(f"   - {model}")
    
    print(f"\n📈 Training Summary:")
    summary = automl.get('training_summary', {})
    print(f"   Successful: {summary.get('models_trained', 0)}")
    print(f"   Failed: {summary.get('models_failed', 0)}")
    print(f"   Total Time: {summary.get('total_time', 0):.2f}s")
    
    print(f"\n⭐ Best Model:")
    best = automl.get('best_model', {})
    print(f"   Name: {best.get('name', 'Unknown')}")
    print(f"   Score: {best.get('score', 0):.4f}")
    print(f"   CV Score: {best.get('cv_score', 0):.4f}")
    print(f"   Reason: {best.get('reason', 'N/A')}")
    
    print(f"\n📊 Ranked Models:")
    for model in automl.get('ranked_models', [])[:3]:
        print(f"   {model['rank']}. {model['model_name']}")
        print(f"      Score: {model['score']:.4f}")
        print(f"      CV Score: {model['cv_score']:.4f}")
    
    print("\n" + "="*70)
    
    assert automl.get('best_model') is not None
    assert automl.get('models_trained', 0) > 0
    
    print("\n✅ AutoML test passed!")

if __name__ == "__main__":
    test_automl()
