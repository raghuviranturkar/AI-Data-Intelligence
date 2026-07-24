"""
Tests for EDA & Visualization Engine
"""
import pandas as pd
import numpy as np
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.eda_engine import perform_eda


def create_test_dataset():
    """Create a dataset for EDA testing"""
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
        'is_manager': np.random.choice([0, 1], n),
        'churn': np.random.choice([0, 1], n)
    }
    
    df = pd.DataFrame(data)
    
    # Create some correlations
    df['salary'] = df['experience'] * 5000 + np.random.normal(30000, 10000, n)
    df['productivity'] = df['score'] * 0.8 + np.random.normal(20, 10, n)
    
    return df


def test_eda_engine():
    """Test EDA engine"""
    df = create_test_dataset()
    
    # Create context
    from app.services.validator import validate_dataset
    validation_report = validate_dataset(df, "test_eda.csv")
    
    context = {
        "dataframe": df,
        "validation": validation_report
    }
    
    # Perform EDA
    report = perform_eda(df, context)
    
    print("\n" + "="*70)
    print("📊 EDA & VISUALIZATION REPORT")
    print("="*70)
    
    print(f"\n📁 Overview:")
    overview = report['overview']
    print(f"   Total Rows: {overview['total_rows']}")
    print(f"   Total Columns: {overview['total_columns']}")
    print(f"   Numeric Features: {overview['numeric_features']}")
    print(f"   Categorical Features: {overview['categorical_features']}")
    print(f"   Boolean Features: {overview['boolean_features']}")
    if overview['target_column']:
        print(f"   Target Column: {overview['target_column']}")
    
    print(f"\n🔗 Correlations:")
    strong = report['correlation']['strong_correlations']
    print(f"   Strong Correlations: {strong['total_strong']}")
    for corr in strong['strong_correlations'][:3]:
        print(f"      {corr['feature_1']} ↔ {corr['feature_2']}: {corr['correlation']}")
    
    negative = report['correlation']['negative_correlations']
    print(f"   Negative Correlations: {negative['total_negative']}")
    for corr in negative['negative_correlations'][:3]:
        print(f"      {corr['feature_1']} ↔ {corr['feature_2']}: {corr['correlation']}")
    
    target = report['correlation']['target_correlations']
    print(f"\n🎯 Target Analysis:")
    if target.get('target'):
        print(f"   Target: {target['target']}")
        print(f"   Type: {target.get('type', 'unknown')}")
        
        if target.get('type') == 'numeric' and target.get('correlations'):
            print(f"   Top Features:")
            for col, corr in list(target['correlations'].items())[:3]:
                print(f"      {col}: {corr}")
        elif target.get('type') == 'categorical':
            print(f"   Unique Values: {target.get('unique_values', 0)}")
            print(f"   Most Common: {target.get('most_common', 'N/A')}")
            if target.get('value_counts'):
                print(f"   Top Categories:")
                for cat, count in list(target['value_counts'].items())[:3]:
                    print(f"      {cat}: {count}")
        else:
            print(f"   Message: {target.get('message', 'No target analysis available')}")
    
    print(f"\n📊 Visualizations:")
    viz = report['visualizations']
    print(f"   Recommended Charts: {viz['total_recommendations']}")
    print(f"   Chart Types:")
    chart_types = {}
    for v in viz['visualizations']:
        chart_types[v['type']] = chart_types.get(v['type'], 0) + 1
    for chart_type, count in chart_types.items():
        print(f"      {chart_type}: {count}")
    
    print(f"\n💡 Insights:")
    insights = report['insights']
    print(f"   Total Insights: {insights['total_insights']}")
    for insight in insights['insights'][:3]:
        print(f"      • {insight}")
    
    print(f"\n📈 Summary:")
    summary = report['summary']
    print(f"   Columns Analyzed: {summary['columns_analyzed']}")
    print(f"   Strong Relationships: {summary['strong_relationships']}")
    print(f"   Recommended Visualizations: {summary['recommended_visualizations']}")
    print(f"   Insights Generated: {summary['insights_generated']}")
    
    print("\n" + "="*70)
    
    # Assertions
    assert report['summary']['columns_analyzed'] > 0
    assert report['visualizations']['total_recommendations'] > 0
    assert report['insights']['total_insights'] > 0
    
    print("\n✅ All tests passed! EDA engine working!")

if __name__ == "__main__":
    test_eda_engine()
