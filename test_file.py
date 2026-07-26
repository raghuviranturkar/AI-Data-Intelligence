"""
Test script to diagnose file upload issues
"""
import pandas as pd
import sys

def test_file(file_path):
    print(f"\n📁 Testing file: {file_path}")
    print("=" * 50)
    
    try:
        # Try to read the file
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)
        
        print(f"✅ File loaded successfully!")
        print(f"   Rows: {len(df)}")
        print(f"   Columns: {len(df.columns)}")
        print(f"   Column names: {list(df.columns)}")
        
        # Check for issues
        if len(df) < 2:
            print("❌ ERROR: Dataset has less than 2 rows")
            return False
        
        if len(df.columns) < 2:
            print("❌ ERROR: Dataset has less than 2 columns")
            return False
        
        # Check for empty values
        empty_cols = df.columns[df.isnull().all()].tolist()
        if empty_cols:
            print(f"⚠️  Empty columns found: {empty_cols}")
        
        # Check data types
        print(f"   Data types: {df.dtypes.to_dict()}")
        
        print("✅ File looks good for analysis!")
        return True
        
    except Exception as e:
        print(f"❌ Error reading file: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        test_file(sys.argv[1])
    else:
        print("Usage: python test_file.py <datasets/test_data.csv>")
