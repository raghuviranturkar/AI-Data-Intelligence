import numpy as np

import numpy as np

"""
Dataset Inspector Service
Handles all dataset inspection and profiling operations
"""
import pandas as pd
import numpy as np
from typing import Dict, Any, List
import os


class DatasetInspector:
    """Inspects and profiles datasets loaded from CSV or Excel files"""
    
    def __init__(self, file_path: str):
        """
        Initialize the inspector with a file path
        
        Args:
            file_path: Path to the dataset file
        """
        self.file_path = file_path
        self.df = None
        self.file_name = os.path.basename(file_path)
        self._load_dataset()
    
    def _load_dataset(self) -> None:
        """
        Load dataset automatically detecting file type
        """
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
    
    def get_shape(self) -> Dict[str, int]:
        """
        Get dataset dimensions
        
        Returns:
            Dictionary with rows and columns count
        """
        return {
            "rows": int(self.df.shape[0]),
            "columns": int(self.df.shape[1])
        }
    
    def get_columns(self) -> List[str]:
        """
        Get list of column names
        
        Returns:
            List of column names
        """
        return self.df.columns.tolist()
    
    def get_dtypes(self) -> Dict[str, str]:
        """
        Get data types for each column
        
        Returns:
            Dictionary mapping column names to data types
        """
        return self.df.dtypes.astype(str).to_dict()
    
    def get_numeric_columns(self) -> List[str]:
        """
        Get names of numeric columns
        
        Returns:
            List of numeric column names
        """
        return self.df.select_dtypes(include=[np.number]).columns.tolist()
    
    def get_categorical_columns(self) -> List[str]:
        """
        Get names of categorical columns
        
        Returns:
            List of categorical column names
        """
        return self.df.select_dtypes(include=['object', 'category']).columns.tolist()
    
    def missing_values(self) -> Dict[str, int]:
        """
        Count missing values per column
        
        Returns:
            Dictionary mapping column names to missing value counts
        """
        return self.df.isnull().sum().to_dict()
    
    def missing_percentage(self) -> Dict[str, float]:
        """
        Calculate percentage of missing values per column
        
        Returns:
            Dictionary mapping column names to missing percentage
        """
        return (self.df.isnull().sum() / len(self.df) * 100).to_dict()
    
    def duplicate_rows(self) -> int:
        """
        Count duplicate rows
        
        Returns:
            Number of duplicate rows
        """
        return int(self.df.duplicated().sum())
    
    def memory_usage(self) -> Dict[str, str]:
        """
        Calculate memory usage
        
        Returns:
            Dictionary with memory usage in different formats
        """
        total_memory = self.df.memory_usage(deep=True).sum()
        
        return {
            "bytes": int(total_memory),
            "kilobytes": round(total_memory / 1024, 2),
            "megabytes": round(total_memory / (1024 * 1024), 2),
            "gigabytes": round(total_memory / (1024 * 1024 * 1024), 4)
        }
    
    def basic_statistics(self) -> Dict[str, Any]:
        """
        Get basic statistics for numeric columns
        
        Returns:
            Dictionary with statistics for each numeric column
        """
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
        
        # Convert numpy types to Python types for JSON serialization
        for key in stats:
            for col in stats[key]:
                if isinstance(stats[key][col], (np.int64, np.float64)):
                    stats[key][col] = float(stats[key][col])
                elif isinstance(stats[key][col], np.int32):
                    stats[key][col] = int(stats[key][col])
        
        return stats
    
    def get_summary(self) -> Dict[str, Any]:
        """
        Get complete dataset summary
        
        Returns:
            Comprehensive dataset summary
        """
        return {
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
        }


def inspect_dataset(file_path: str) -> Dict[str, Any]:
    """
    Convenience function to inspect a dataset
    
    Args:
        file_path: Path to the dataset file
        
    Returns:
        Complete dataset summary
    """
    inspector = DatasetInspector(file_path)
    return inspector.get_summary()