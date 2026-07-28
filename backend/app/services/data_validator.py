"""
Data Validator - Validates CSV data before processing
"""
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Tuple

class DataPreValidator:
    """Validates data before pipeline processing"""
    
    @staticmethod
    def validate_file(df: pd.DataFrame, filename: str) -> Tuple[bool, List[str]]:
        """
        Validate the DataFrame for common issues
        
        Returns:
            (is_valid, list_of_errors)
        """
        errors = []
        
        # Check for infinite values
        for col in df.select_dtypes(include=[np.number]).columns:
            inf_count = df[col].isin([np.inf, -np.inf]).sum()
            if inf_count > 0:
                errors.append(f"Column '{col}' contains {inf_count} infinite values (inf/-inf). Please replace with valid numbers.")
        
        # Check for completely empty columns
        for col in df.columns:
            if df[col].isnull().all():
                errors.append(f"Column '{col}' is completely empty. Please provide data for this column.")
        
        # Check for high percentage of missing values
        for col in df.columns:
            missing_pct = (df[col].isnull().sum() / len(df)) * 100
            if missing_pct > 90:
                errors.append(f"Column '{col}' has {missing_pct:.1f}% missing values. Consider removing or filling this column.")
        
        # Check for empty dataset
        if df.empty:
            errors.append("Dataset is empty. Please provide a file with data.")
        
        # Check for insufficient rows
        if len(df) < 2:
            errors.append("Dataset has less than 2 rows. Minimum 2 rows required for analysis.")
        
        # Check for insufficient columns
        if len(df.columns) < 2:
            errors.append("Dataset has less than 2 columns. Minimum 2 columns required for analysis.")
        
        return len(errors) == 0, errors
