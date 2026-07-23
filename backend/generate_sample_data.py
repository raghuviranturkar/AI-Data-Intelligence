import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

def generate_sales_data(n_records=1000):
    """Generate sample sales data"""
    np.random.seed(42)
    
    data = {
        'Order_ID': [f'ORD-{i:05d}' for i in range(1, n_records + 1)],
        'Customer_Name': np.random.choice(['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'], n_records),
        'Product_Category': np.random.choice(['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Food'], n_records),
        'Product_Name': np.random.choice(['Laptop', 'T-Shirt', 'Novel', 'Lamp', 'Ball', 'Cereal', 'Phone', 'Jeans', 'Cookbook', 'Table'], n_records),
        'Quantity': np.random.randint(1, 10, n_records),
        'Unit_Price': np.round(np.random.uniform(10, 500, n_records), 2),
        'Discount': np.round(np.random.uniform(0, 0.3, n_records), 2),
        'Order_Date': [datetime.now() - timedelta(days=np.random.randint(0, 365)) for _ in range(n_records)],
        'Region': np.random.choice(['North', 'South', 'East', 'West'], n_records),
        'Sales_Channel': np.random.choice(['Online', 'Store', 'Catalog'], n_records)
    }
    
    df = pd.DataFrame(data)
    
    # Add some missing values
    df.loc[np.random.choice(n_records, 50, replace=False), 'Discount'] = np.nan
    df.loc[np.random.choice(n_records, 30, replace=False), 'Customer_Name'] = np.nan
    
    # Add some duplicates
    duplicate_indices = np.random.choice(n_records, 20, replace=False)
    df_duplicates = df.iloc[duplicate_indices].copy()
    df = pd.concat([df, df_duplicates], ignore_index=True)
    
    return df

def generate_heights_weights():
    """Generate sample heights and weights data"""
    np.random.seed(123)
    
    n = 100
    heights = np.random.normal(170, 10, n)
    weights = np.random.normal(70, 12, n)
    
    df = pd.DataFrame({
        'id': range(1, n + 1),
        'height': np.round(heights).astype(int),
        'weight': np.round(weights).astype(int)
    })
    
    # Ensure realistic ranges
    df['height'] = df['height'].clip(150, 200)
    df['weight'] = df['weight'].clip(45, 100)
    
    return df

def main():
    """Generate all sample datasets"""
    # Create datasets directory
    os.makedirs('../datasets', exist_ok=True)
    
    # Generate sales data
    print("Generating sales data...")
    sales_df = generate_sales_data(1000)
    sales_df.to_csv('../datasets/sales_data.csv', index=False)
    print(f"✅ Sales data created: {len(sales_df)} records")
    
    # Generate heights and weights
    print("Generating heights and weights data...")
    hw_df = generate_heights_weights()
    hw_df.to_csv('../datasets/heights_weights.csv', index=False)
    print(f"✅ Heights/weights data created: {len(hw_df)} records")
    
    # Generate small test dataset
    print("Generating small test dataset...")
    test_df = generate_sales_data(50)
    test_df.to_csv('../datasets/test_data.csv', index=False)
    print(f"✅ Test data created: {len(test_df)} records")
    
    print("\n✅ All sample datasets created in ../datasets/")
    print("Files:")
    print("  - sales_data.csv (1000+ records)")
    print("  - heights_weights.csv (100 records)")
    print("  - test_data.csv (50 records)")

if __name__ == "__main__":
    main()
