"""
Debug script to check context data flow
"""
import pandas as pd
import numpy as np
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.pipeline import run_pipeline

def create_test_dataset():
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

# Run pipeline
df = create_test_dataset()
results = run_pipeline(df, "test_debug.csv", include_insights=True)

# Check what's in the context
print("\n" + "="*70)
print("DEBUG: Checking Context Data")
print("="*70)

# Check dataset in results
print("\n📊 Results['dataset']:")
dataset = results.get('dataset', {})
print(f"   Type: {type(dataset)}")
print(f"   Keys: {list(dataset.keys()) if dataset else 'EMPTY'}")
print(f"   Shape: {dataset.get('shape', 'NOT FOUND')}")

# Check validation in results
print("\n📊 Results['validation']:")
validation = results.get('validation', {})
print(f"   Type: {type(validation)}")
print(f"   Keys: {list(validation.keys()) if validation else 'EMPTY'}")

# Check automl in results
print("\n📊 Results['automl']:")
automl = results.get('automl', {})
print(f"   Type: {type(automl)}")
print(f"   Keys: {list(automl.keys()) if automl else 'EMPTY'}")
print(f"   Best Model: {automl.get('best_model', 'NOT FOUND')}")

# Check insights in results
print("\n📊 Results['insights']:")
insights = results.get('insights', {})
print(f"   Type: {type(insights)}")
print(f"   Keys: {list(insights.keys()) if insights else 'EMPTY'}")
print(f"   Dataset Summary: {insights.get('dataset_summary', 'NOT FOUND')}")

# Check the pipeline context
print("\n📊 Pipeline Context (from results):")
print(f"   All top-level keys: {list(results.keys())}")

print("\n" + "="*70)
