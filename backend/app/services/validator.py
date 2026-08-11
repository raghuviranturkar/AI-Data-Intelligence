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
        self.df = df
        self.file_name = file_name
        self.quality_score = 100
        self._warnings = set()
        self.validation_results = {}
    
    def _convert_to_native(self, obj: Any) -> Any:
        """Convert numpy types to Python native types"""
        if isinstance(obj, (np.int64, np.int32, np.int16, np.int8)):
            return int(obj)
        elif isinstance(obj, (np.float64, np.float32, np.float16)):
            if np.isinf(obj):
                return None
            return float(obj)
        elif isinstance(obj, np.bool_):
            return bool(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        elif isinstance(obj, dict):
            return {k: self._convert_to_native(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [self._convert_to_native(v) for v in obj]
        else:
            return obj
    
    def _add_warning(self, warning: str) -> None:
        self._warnings.add(warning)
    
    def _get_warnings(self) -> List[str]:
        return list(self._warnings)
    
    def validate_empty_dataset(self) -> bool:
        is_empty = self.df.empty
        if is_empty:
            self.quality_score -= 30
            self._add_warning("Dataset is empty. No rows found.")
        return is_empty
    
    def detect_empty_columns(self) -> List[str]:
        empty_cols = self.df.columns[self.df.isnull().all()].tolist()
        if empty_cols:
            self.quality_score -= 5 * len(empty_cols)
            self._add_warning(f"Empty columns found: {', '.join(empty_cols)}")
        return empty_cols
    
    def detect_duplicate_columns(self) -> List[str]:
        duplicate_cols = []
        seen = set()
        for col in self.df.columns:
            if col in seen:
                duplicate_cols.append(col)
            seen.add(col)
        
        if duplicate_cols:
            self.quality_score -= 5 * len(duplicate_cols)
            self._add_warning(f"Duplicate column names: {', '.join(duplicate_cols)}")
        return duplicate_cols
    
    def detect_constant_columns(self) -> List[str]:
        constant_cols = []
        for col in self.df.columns:
            if len(self.df[col].dropna().unique()) <= 1:
                constant_cols.append(col)
                self.quality_score -= 3
                self._add_warning(f"'{col}' has constant values (provides no information)")
        return constant_cols
    
    def detect_high_missing_columns(self, threshold: float = 50.0) -> List[str]:
        high_missing = []
        for col in self.df.columns:
            missing_pct = (self.df[col].isnull().sum() / len(self.df)) * 100
            if missing_pct > threshold:
                high_missing.append(col)
                self.quality_score -= 10
                self._add_warning(f"'{col}' has {missing_pct:.1f}% missing values (threshold: {threshold}%)")
        return high_missing
    
    def detect_infinite_values(self) -> Dict[str, Any]:
        has_positive_inf = False
        has_negative_inf = False
        infinite_columns = []
        
        for col in self.df.select_dtypes(include=[np.number]).columns:
            pos_inf = np.isposinf(self.df[col]).any()
            neg_inf = np.isneginf(self.df[col]).any()
            
            if pos_inf or neg_inf:
                infinite_columns.append(col)
                self.quality_score -= 8
                
                if pos_inf:
                    has_positive_inf = True
                    self._add_warning(f"'{col}' contains positive infinity values (+∞)")
                if neg_inf:
                    has_negative_inf = True
                    self._add_warning(f"'{col}' contains negative infinity values (-∞)")
        
        return self._convert_to_native({
            "has_infinite": has_positive_inf or has_negative_inf,
            "has_positive_inf": has_positive_inf,
            "has_negative_inf": has_negative_inf,
            "infinite_columns": infinite_columns
        })
    
    def detect_id_columns(self) -> List[str]:
        id_columns = []
        id_patterns = ['id', 'customer_id', 'order_id', 'employee_id', 
                      'userid', 'product_id', 'transaction_id']
        
        for col in self.df.columns:
            col_lower = col.lower().strip()
            if any(pattern in col_lower for pattern in id_patterns):
                if len(self.df[col].dropna().unique()) == len(self.df):
                    id_columns.append(col)
                    self._add_warning(f"'{col}' appears to be an identifier column")
        
        return id_columns
    
    def detect_date_columns(self) -> List[str]:
        date_columns = []
        date_patterns = ['date', 'datetime', 'timestamp', 'time', 
                        'created_at', 'updated_at', 'dob', 'birth']
        
        for col in self.df.columns:
            col_lower = col.lower().strip()
            if any(pattern in col_lower for pattern in date_patterns):
                try:
                    sample = self.df[col].dropna()
                    if not sample.empty:
                        pd.to_datetime(sample)
                        date_columns.append(col)
                        self._add_warning(f"'{col}' appears to be a date/datetime column")
                except:
                    pass
        
        return date_columns
    
    def detect_boolean_columns(self) -> List[str]:
        bool_columns = []
        bool_values = {True, False, 'True', 'False', 'true', 'false', 1, 0, 'Yes', 'No', 'yes', 'no'}
        
        for col in self.df.columns:
            unique_values = set(self.df[col].dropna().unique())
            if len(unique_values) <= 2 and all(v in bool_values for v in unique_values):
                bool_columns.append(col)
        
        return bool_columns
    
    def calculate_cardinality(self, threshold: int = 50) -> Dict[str, Any]:
        high_cardinality = {}
        
        categorical_columns = self.df.select_dtypes(include=['object', 'string', 'category']).columns
        
        for col in categorical_columns:
            unique_count = self.df[col].nunique()
            if unique_count > threshold:
                high_cardinality[col] = {
                    "unique_values": int(unique_count),
                    "total_rows": int(len(self.df)),
                    "ratio": round(unique_count / len(self.df), 2)
                }
                self._add_warning(f"'{col}' has high cardinality ({unique_count} unique values)")
        
        return self._convert_to_native(high_cardinality)
    
    def detect_target_candidates(self) -> List[str]:
        target_candidates = []
        target_patterns = ['target', 'label', 'class', 
                          'purchase', 'churn', 'survive', 'default', 
                          'fraud', 'response', 'conversion']
        
        id_columns = self.detect_id_columns()
        date_columns = self.detect_date_columns()
        constant_columns = self.detect_constant_columns()
        excluded_columns = set(id_columns + date_columns + constant_columns)
        
        for col in self.df.columns:
            if col in excluded_columns:
                continue
                
            col_lower = col.lower().strip()
            if any(pattern in col_lower for pattern in target_patterns):
                target_candidates.append(col)
            elif len(self.df[col].dropna().unique()) == 2:
                target_candidates.append(col)
            elif 2 <= self.df[col].nunique() <= 10:
                target_candidates.append(col)
        
        seen = set()
        unique_candidates = []
        for col in target_candidates:
            if col not in seen:
                seen.add(col)
                unique_candidates.append(col)
        
        return unique_candidates
    
    def get_column_statistics(self) -> Dict[str, Any]:
        stats = {}
        
        for col in self.df.columns:
            col_stats = {
                "dtype": str(self.df[col].dtype),
                "unique_count": int(self.df[col].nunique()),
                "missing_count": int(self.df[col].isnull().sum()),
                "missing_percentage": float((self.df[col].isnull().sum() / len(self.df)) * 100),
            }
            
            if pd.api.types.is_numeric_dtype(self.df[col]):
                # Replace inf with NaN for statistics
                clean_col = self.df[col].replace([np.inf, -np.inf], np.nan)
                if clean_col.isnull().all():
                    col_stats["has_infinite"] = True
                    col_stats["mean"] = None
                    col_stats["std"] = None
                    col_stats["min"] = None
                    col_stats["max"] = None
                    col_stats["skewness"] = None
                    col_stats["kurtosis"] = None
                else:
                    col_stats["has_infinite"] = np.isinf(self.df[col]).any()
                    col_stats["mean"] = float(clean_col.mean()) if not pd.isna(clean_col.mean()) else None
                    col_stats["std"] = float(clean_col.std()) if not pd.isna(clean_col.std()) else None
                    col_stats["min"] = float(clean_col.min()) if not pd.isna(clean_col.min()) else None
                    col_stats["max"] = float(clean_col.max()) if not pd.isna(clean_col.max()) else None
                    col_stats["skewness"] = float(clean_col.skew()) if not pd.isna(clean_col.skew()) else None
                    col_stats["kurtosis"] = float(clean_col.kurt()) if not pd.isna(clean_col.kurt()) else None
            
            if pd.api.types.is_object_dtype(self.df[col]) or pd.api.types.is_string_dtype(self.df[col]):
                top_values = self.df[col].value_counts().head(5)
                col_stats["top_values"] = top_values.to_dict() if not top_values.empty else {}
                col_stats["most_common"] = str(self.df[col].mode().iloc[0]) if not self.df[col].mode().empty else None
            
            stats[col] = self._convert_to_native(col_stats)
        
        return stats
    
    def classify_columns(self) -> Dict[str, List[str]]:
        classifications = {
            "identifier": self.detect_id_columns(),
            "numeric": self.df.select_dtypes(include=[np.number]).columns.tolist(),
            "categorical": self.df.select_dtypes(include=['object', 'string']).columns.tolist(),
            "boolean": self.detect_boolean_columns(),
            "datetime": self.detect_date_columns(),
            "target_candidate": self.detect_target_candidates()
        }
        return self._convert_to_native(classifications)
    
    def calculate_quality_score(self) -> int:
        return max(0, min(100, self.quality_score))
    
    def check_readiness(self) -> Dict[str, Any]:
        issues_count = len(self._warnings)
        score = self.calculate_quality_score()
        
        if self.df.empty:
            return {"status": "Not Ready", "confidence": 0, "reason": "Dataset is empty"}
        
        if len(self.df.columns) < 2:
            return {"status": "Not Ready", "confidence": 0, "reason": "Dataset has less than 2 columns"}
        
        constant_cols = self.detect_constant_columns()
        if len(constant_cols) == len(self.df.columns):
            return {"status": "Not Ready", "confidence": 0, "reason": "All columns are constant"}
        
        if score >= 80:
            return {
                "status": "Ready",
                "confidence": score,
                "reason": "Dataset is ready for analysis" if issues_count == 0 else "Minor cleaning recommended before analysis."
            }
        elif score >= 50:
            return {
                "status": "Needs Cleaning",
                "confidence": score,
                "reason": f"Significant issues found ({issues_count} warnings). Cleaning recommended."
            }
        else:
            return {
                "status": "Not Ready",
                "confidence": score,
                "reason": f"Major issues found ({issues_count} warnings). Dataset requires substantial cleaning."
            }
    
    def get_validation_report(self) -> Dict[str, Any]:
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
        
        self.quality_score = self.calculate_quality_score()
        readiness = self.check_readiness()
        
        return self._convert_to_native({
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
                "readiness": readiness
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
                "warnings": self._get_warnings(),
                "total_warnings": len(self._get_warnings())
            }
        })


def validate_dataset(df: pd.DataFrame, file_name: str = "unknown") -> Dict[str, Any]:
    validator = DataValidator(df, file_name)
    return validator.get_validation_report()

def _convert_to_native(self, obj: Any) -> Any:
    """Convert numpy types to Python native types, handling NaN"""
    if isinstance(obj, (np.int64, np.int32, np.int16, np.int8)):
        return int(obj)
    elif isinstance(obj, (np.float64, np.float32, np.float16)):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return float(obj)
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {k: self._convert_to_native(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [self._convert_to_native(v) for v in obj]
    elif isinstance(obj, float):
        if math.isnan(obj) or math.isinf(obj):
            return None
        return obj
    else:
        return obj
