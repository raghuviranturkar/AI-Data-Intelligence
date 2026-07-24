"""
Data Validation & Quality Engine
Validates dataset quality and generates comprehensive quality reports
"""
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Tuple, Optional
from datetime import datetime


class DataValidator:
    """Validates dataset quality and generates quality reports"""
    
    def __init__(self, df: pd.DataFrame, file_name: str = "unknown"):
        """
        Initialize validator with a pandas DataFrame
        
        Args:
            df: Pandas DataFrame to validate
            file_name: Name of the original file
        """
        self.df = df
        self.file_name = file_name
        self.quality_score = 100
        self.warnings = []
        self.validation_results = {}
        
    def validate_empty_dataset(self) -> bool:
        """Check if dataset is empty"""
        is_empty = self.df.empty
        if is_empty:
            self.quality_score -= 30
            self.warnings.append("Dataset is empty. No rows found.")
        return is_empty
    
    def detect_empty_columns(self) -> List[str]:
        """Detect columns that are completely empty (all NaN)"""
        empty_cols = self.df.columns[self.df.isnull().all()].tolist()
        if empty_cols:
            self.quality_score -= 5 * len(empty_cols)
            self.warnings.append(f"Empty columns found: {', '.join(empty_cols)}")
        return empty_cols
    
    def detect_duplicate_columns(self) -> List[str]:
        """Detect duplicate column names"""
        duplicate_cols = []
        seen = set()
        for col in self.df.columns:
            if col in seen:
                duplicate_cols.append(col)
            seen.add(col)
        
        if duplicate_cols:
            self.quality_score -= 5 * len(duplicate_cols)
            self.warnings.append(f"Duplicate column names: {', '.join(duplicate_cols)}")
        return duplicate_cols
    
    def detect_constant_columns(self) -> List[str]:
        """Detect columns with constant values"""
        constant_cols = []
        for col in self.df.columns:
            if len(self.df[col].dropna().unique()) <= 1:
                constant_cols.append(col)
                self.quality_score -= 3
                self.warnings.append(f"'{col}' has constant values (provides no information)")
        return constant_cols
    
    def detect_high_missing_columns(self, threshold: float = 50.0) -> List[str]:
        """Detect columns with missing values above threshold"""
        high_missing = []
        for col in self.df.columns:
            missing_pct = (self.df[col].isnull().sum() / len(self.df)) * 100
            if missing_pct > threshold:
                high_missing.append(col)
                self.quality_score -= 10
                self.warnings.append(f"'{col}' has {missing_pct:.1f}% missing values (threshold: {threshold}%)")
        return high_missing
    
    def detect_infinite_values(self) -> Dict[str, bool]:
        """Detect infinite values in numeric columns"""
        has_infinite = False
        infinite_columns = []
        
        for col in self.df.select_dtypes(include=[np.number]).columns:
            if np.isinf(self.df[col]).any():
                has_infinite = True
                infinite_columns.append(col)
                self.quality_score -= 8
                self.warnings.append(f"'{col}' contains infinite values (∞ or -∞)")
        
        return {
            "has_infinite": has_infinite,
            "infinite_columns": infinite_columns
        }
    
    def detect_id_columns(self) -> List[str]:
        """Detect potential ID columns"""
        id_columns = []
        id_patterns = ['id', 'customer_id', 'order_id', 'employee_id', 
                      'userid', 'product_id', 'transaction_id']
        
        for col in self.df.columns:
            col_lower = col.lower().strip()
            # Check by name pattern
            if any(pattern in col_lower for pattern in id_patterns):
                # Check if unique values equals total rows (likely ID)
                if len(self.df[col].dropna().unique()) == len(self.df):
                    id_columns.append(col)
                    self.warnings.append(f"'{col}' appears to be an identifier column")
        
        return id_columns
    
    def detect_date_columns(self) -> List[str]:
        """Detect potential date/datetime columns"""
        date_columns = []
        date_patterns = ['date', 'datetime', 'timestamp', 'time', 
                        'created_at', 'updated_at', 'dob', 'birth']
        
        for col in self.df.columns:
            col_lower = col.lower().strip()
            if any(pattern in col_lower for pattern in date_patterns):
                # Check if it can be converted to datetime
                try:
                    pd.to_datetime(self.df[col].dropna())
                    date_columns.append(col)
                    self.warnings.append(f"'{col}' appears to be a date/datetime column")
                except:
                    pass
        
        return date_columns
    
    def detect_boolean_columns(self) -> List[str]:
        """Detect boolean columns"""
        bool_columns = []
        bool_values = {True, False, 'True', 'False', 'true', 'false', 1, 0, 'Yes', 'No', 'yes', 'no'}
        
        for col in self.df.columns:
            unique_values = set(self.df[col].dropna().unique())
            # Check if all unique values are boolean-like
            if len(unique_values) <= 2 and all(v in bool_values for v in unique_values):
                bool_columns.append(col)
        
        return bool_columns
    
    def calculate_cardinality(self, threshold: int = 50) -> Dict[str, Any]:
        """Calculate cardinality and detect high cardinality columns"""
        high_cardinality = {}
        for col in self.df.columns:
            unique_count = self.df[col].nunique()
            if unique_count > threshold:
                high_cardinality[col] = {
                    "unique_values": unique_count,
                    "total_rows": len(self.df),
                    "ratio": unique_count / len(self.df)
                }
                self.warnings.append(f"'{col}' has high cardinality ({unique_count} unique values)")
        
        return high_cardinality
    
    def detect_target_candidates(self) -> List[str]:
        """Detect potential target columns for ML"""
        target_candidates = []
        target_patterns = ['target', 'label', 'class', 'category', 
                          'purchase', 'churn', 'survive', 'default', 
                          'fraud', 'response', 'conversion']
        
        for col in self.df.columns:
            col_lower = col.lower().strip()
            # Check by name pattern
            if any(pattern in col_lower for pattern in target_patterns):
                target_candidates.append(col)
            # Check binary columns (could be target)
            elif len(self.df[col].dropna().unique()) == 2:
                target_candidates.append(col)
        
        # Remove duplicates
        target_candidates = list(set(target_candidates))
        return target_candidates
    
    def get_column_statistics(self) -> Dict[str, Any]:
        """Get detailed column statistics"""
        stats = {}
        
        for col in self.df.columns:
            col_stats = {
                "dtype": str(self.df[col].dtype),
                "unique_count": int(self.df[col].nunique()),
                "missing_count": int(self.df[col].isnull().sum()),
                "missing_percentage": float((self.df[col].isnull().sum() / len(self.df)) * 100),
            }
            
            # Add statistics based on column type
            if pd.api.types.is_numeric_dtype(self.df[col]):
                col_stats.update({
                    "mean": float(self.df[col].mean()) if not pd.isna(self.df[col].mean()) else None,
                    "std": float(self.df[col].std()) if not pd.isna(self.df[col].std()) else None,
                    "min": float(self.df[col].min()) if not pd.isna(self.df[col].min()) else None,
                    "max": float(self.df[col].max()) if not pd.isna(self.df[col].max()) else None,
                    "skewness": float(self.df[col].skew()) if not pd.isna(self.df[col].skew()) else None,
                    "kurtosis": float(self.df[col].kurt()) if not pd.isna(self.df[col].kurt()) else None,
                })
            
            # Add sample values for categorical columns
            if pd.api.types.is_object_dtype(self.df[col]) or pd.api.types.is_string_dtype(self.df[col]):
                top_values = self.df[col].value_counts().head(5)
                col_stats["top_values"] = top_values.to_dict() if not top_values.empty else {}
                col_stats["most_common"] = str(self.df[col].mode().iloc[0]) if not self.df[col].mode().empty else None
            
            stats[col] = col_stats
        
        return stats
    
    def classify_columns(self) -> Dict[str, List[str]]:
        """Classify columns into different types"""
        classifications = {
            "identifier": [],
            "numeric": [],
            "categorical": [],
            "boolean": [],
            "datetime": [],
            "target_candidate": []
        }
        
        # Get ID columns
        classifications["identifier"] = self.detect_id_columns()
        
        # Get datetime columns
        classifications["datetime"] = self.detect_date_columns()
        
        # Get boolean columns
        classifications["boolean"] = self.detect_boolean_columns()
        
        # Get numeric columns
        classifications["numeric"] = self.df.select_dtypes(include=[np.number]).columns.tolist()
        
        # Get categorical columns (object/string types)
        classifications["categorical"] = self.df.select_dtypes(include=['object', 'string']).columns.tolist()
        
        # Get target candidates
        classifications["target_candidate"] = self.detect_target_candidates()
        
        return classifications
    
    def calculate_quality_score(self) -> int:
        """Calculate final quality score"""
        # Start with base score (already modified by individual checks)
        # Ensure score doesn't go below 0
        return max(0, min(100, self.quality_score))
    
    def check_readiness(self) -> bool:
        """Check if dataset is ready for analysis"""
        # Dataset is ready if:
        # 1. Not empty
        # 2. No duplicate columns
        # 3. Not all columns are constant
        # 4. Has at least some numeric or categorical data
        
        if self.df.empty:
            return False
        if self.detect_duplicate_columns():
            return False
        if len(self.detect_constant_columns()) == len(self.df.columns):
            return False
        if len(self.df.columns) < 2:
            return False
        
        return True
    
    def get_validation_report(self) -> Dict[str, Any]:
        """Generate comprehensive validation report"""
        # Run all validation checks
        empty_dataset = self.validate_empty_dataset()
        empty_columns = self.detect_empty_columns()
        duplicate_columns = self.detect_duplicate_columns()
        constant_columns = self.detect_constant_columns()
        high_missing = self.detect_high_missing_columns()
        infinite_info = self.detect_infinite_values()
        id_columns = self.detect_id_columns()
        date_columns = self.detect_date_columns()
        boolean_columns = self.detect_boolean_columns()
        high_cardinality = self.calculate_cardinality()
        target_candidates = self.detect_target_candidates()
        column_stats = self.get_column_statistics()
        classifications = self.classify_columns()
        
        # Update quality score
        self.quality_score = self.calculate_quality_score()
        
        return {
            "dataset": {
                "file_name": self.file_name,
                "rows": len(self.df),
                "columns": len(self.df.columns),
                "column_names": self.df.columns.tolist()
            },
            "validation": {
                "dataset_valid": not empty_dataset,
                "empty_dataset": empty_dataset,
                "empty_columns": empty_columns,
                "duplicate_columns": duplicate_columns,
                "constant_columns": constant_columns,
                "high_missing_columns": high_missing,
                "infinite_values": infinite_info,
                "readiness": self.check_readiness()
            },
            "profiling": {
                "id_columns": id_columns,
                "date_columns": date_columns,
                "boolean_columns": boolean_columns,
                "high_cardinality": high_cardinality,
                "target_candidates": target_candidates,
                "column_classifications": classifications,
                "column_statistics": column_stats
            },
            "quality": {
                "quality_score": self.quality_score,
                "warnings": self.warnings,
                "total_warnings": len(self.warnings)
            }
        }


def validate_dataset(df: pd.DataFrame, file_name: str = "unknown") -> Dict[str, Any]:
    """
    Convenience function to validate a dataset
    
    Args:
        df: Pandas DataFrame to validate
        file_name: Name of the original file
        
    Returns:
        Comprehensive validation report
    """
    validator = DataValidator(df, file_name)
    return validator.get_validation_report()
