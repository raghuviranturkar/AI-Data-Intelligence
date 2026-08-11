"""
Dataset Inspector Service
Handles all dataset inspection and profiling operations
"""
import pandas as pd
import numpy as np
from typing import Dict, Any, List
import os
import math


class DatasetInspector:
    """Inspects and profiles datasets loaded from CSV or Excel files"""
    
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.df = None
        self.file_name = os.path.basename(file_path)
        self._load_dataset()
    
    def _load_dataset(self) -> None:
        file_extension = os.path.splitext(self.file_path)[1].lower()
        
        try:
            if file_extension == '.csv':
                self.df = pd.read_csv(self.file_path)
            elif file_extension in ['.xlsx', '.xls']:
                self.df = pd.read_excel(self.file_path)
            else:
                raise ValueError(f"Unsupported file type: {file_extension}")
        except Exception as e:
            raise Exception(f"Error loading dataset: {str(e)}")
    
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
        elif isinstance(obj, pd.Series):
            return obj.tolist()
        elif isinstance(obj, float):
            if math.isnan(obj) or math.isinf(obj):
                return None
            return obj
        else:
            return obj
    
    def get_shape(self) -> Dict[str, int]:
        return {
            "rows": int(self.df.shape[0]),
            "columns": int(self.df.shape[1])
        }
    
    def get_columns(self) -> List[str]:
        return self.df.columns.tolist()
    
    def get_dtypes(self) -> Dict[str, str]:
        return self.df.dtypes.astype(str).to_dict()
    
    def get_numeric_columns(self) -> List[str]:
        return self.df.select_dtypes(include=[np.number]).columns.tolist()
    
    def get_categorical_columns(self) -> List[str]:
        return self.df.select_dtypes(include=['object', 'category', 'string']).columns.tolist()
    
    def missing_values(self) -> Dict[str, int]:
        return self._convert_to_native(self.df.isnull().sum().to_dict())
    
    def missing_percentage(self) -> Dict[str, float]:
        return self._convert_to_native((self.df.isnull().sum() / len(self.df) * 100).to_dict())
    
    def duplicate_rows(self) -> int:
        return int(self.df.duplicated().sum())
    
    def memory_usage(self) -> Dict[str, Any]:
        total_memory = self.df.memory_usage(deep=True).sum()
        return {
            "bytes": int(total_memory),
            "kilobytes": round(total_memory / 1024, 2),
            "megabytes": round(total_memory / (1024 * 1024), 2),
            "gigabytes": round(total_memory / (1024 * 1024 * 1024), 4)
        }
    
    def basic_statistics(self) -> Dict[str, Any]:
        numeric_df = self.df.select_dtypes(include=[np.number])
        
        if numeric_df.empty:
            return {"message": "No numeric columns found"}
        
        stats = {
            "count": numeric_df.count().to_dict(),
            "mean": numeric_df.mean().to_dict(),
            "std": numeric_df.std().to_dict(),
            "min": numeric_df.min().to_dict(),
            "25%": numeric_df.quantile(0.25).to_dict(),
            "50%": numeric_df.quantile(0.50).to_dict(),
            "75%": numeric_df.quantile(0.75).to_dict(),
            "max": numeric_df.max().to_dict()
        }
        
        # Convert NaN to None for JSON serialization
        return self._convert_to_native(stats)
    
    def get_summary(self) -> Dict[str, Any]:
        return self._convert_to_native({
            "file_name": self.file_name,
            "shape": self.get_shape(),
            "columns": self.get_columns(),
            "numeric_columns": self.get_numeric_columns(),
            "categorical_columns": self.get_categorical_columns(),
            "dtypes": self.get_dtypes(),
            "missing_values": self.missing_values(),
            "missing_percentage": self.missing_percentage(),
            "duplicate_rows": self.duplicate_rows(),
            "memory_usage": self.memory_usage(),
            "basic_statistics": self.basic_statistics()
        })


def inspect_dataset(file_path: str) -> Dict[str, Any]:
    inspector = DatasetInspector(file_path)
    return inspector.get_summary()
