"""
Tests for PDF Report Generator
"""
import pandas as pd
import numpy as np
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.pipeline import run_pipeline, generate_report


def create_test_dataset():
    """Create a dataset for report testing"""
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


def test_report():
    """Test PDF report generation"""
    df = create_test_dataset()
    
    # Run pipeline
    results = run_pipeline(df, "test_report.csv", include_insights=True)
    
    # Generate report
    print("\n📄 Generating PDF Report...")
    report_path = generate_report(results, "test_report.pdf")
    
    print(f"✅ Report generated: {report_path}")
    
    # Also generate HTML and Markdown
    from app.services.reports import ReportEngine
    engine = ReportEngine(results)
    
    print("📄 Generating HTML report...")
    html = engine.generate_html()
    with open("test_report.html", "w") as f:
        f.write(html)
    print("✅ HTML report generated: test_report.html")
    
    print("📄 Generating Markdown report...")
    md = engine.generate_markdown()
    with open("test_report.md", "w") as f:
        f.write(md)
    print("✅ Markdown report generated: test_report.md")
    
    # Check if files exist
    assert os.path.exists(report_path)
    assert os.path.exists("test_report.html")
    assert os.path.exists("test_report.md")
    
    print("\n✅ All reports generated successfully!")
    print(f"   - PDF: {report_path}")
    print(f"   - HTML: test_report.html")
    print(f"   - Markdown: test_report.md")

if __name__ == "__main__":
    test_report()
