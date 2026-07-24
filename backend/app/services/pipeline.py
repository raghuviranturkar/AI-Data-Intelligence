"""
Data Intelligence Pipeline Orchestrator
Coordinates all analysis engines and maintains shared context
"""
import pandas as pd
import numpy as np
from typing import Dict, Any

from .dataset_inspector import inspect_dataset
from .validator import validate_dataset
from .cleaning_engine import generate_cleaning_recommendations
from .outlier_engine import detect_outliers
from .eda_engine import perform_eda
from .feature_engine import engineer_features


class DataIntelligencePipeline:
    """
    Orchestrates the complete data intelligence pipeline
    Maintains shared context across all engines
    """
    
    def __init__(self):
        self.context = {}
        self.results = {}
    
    def run(self, df: pd.DataFrame, file_name: str = "unknown") -> Dict[str, Any]:
        """
        Run the complete data intelligence pipeline
        
        Args:
            df: Pandas DataFrame to analyze
            file_name: Name of the original file
            
        Returns:
            Complete analysis results
        """
        # Step 1: Dataset Inspection
        print("🔍 Running dataset inspection...")
        self.results["dataset"] = self._inspect_dataset(df, file_name)
        
        # Build shared context
        self.context = {
            "dataframe": df,
            "file_name": file_name,
            "profiling": self.results["dataset"]
        }
        
        # Step 2: Validation
        print("✅ Running validation...")
        self.results["validation"] = self._validate_dataset(df, file_name)
        self.context["validation"] = self.results["validation"]
        
        # Step 3: Cleaning Recommendations
        print("🧹 Generating cleaning recommendations...")
        self.results["cleaning"] = self._generate_cleaning(df)
        self.context["cleaning"] = self.results["cleaning"]
        
        # Step 4: Outlier Detection
        print("📊 Detecting outliers...")
        self.results["outliers"] = self._detect_outliers(df)
        self.context["outliers"] = self.results["outliers"]
        
        # Step 5: EDA
        print("📈 Performing EDA...")
        self.results["eda"] = self._perform_eda(df)
        self.context["eda"] = self.results["eda"]
        
        # Step 6: Feature Engineering
        print("🔧 Engineering features...")
        self.results["feature_engineering"] = self._engineer_features(df)
        self.context["feature_engineering"] = self.results["feature_engineering"]
        
        print("✅ Pipeline complete!")
        
        return self.results
    
    def _inspect_dataset(self, df: pd.DataFrame, file_name: str) -> Dict[str, Any]:
        """Run dataset inspection"""
        # Calculate basic statistics
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        categorical_cols = df.select_dtypes(include=['object', 'string']).columns.tolist()
        
        # Calculate memory usage
        memory_bytes = df.memory_usage(deep=True).sum()
        
        return {
            "file_name": file_name,
            "shape": {"rows": len(df), "columns": len(df.columns)},
            "columns": df.columns.tolist(),
            "numeric_columns": numeric_cols,
            "categorical_columns": categorical_cols,
            "dtypes": df.dtypes.astype(str).to_dict(),
            "missing_values": df.isnull().sum().to_dict(),
            "missing_percentage": (df.isnull().sum() / len(df) * 100).to_dict(),
            "duplicate_rows": int(df.duplicated().sum()),
            "memory_usage": {
                "bytes": int(memory_bytes),
                "kilobytes": round(memory_bytes / 1024, 2),
                "megabytes": round(memory_bytes / (1024 * 1024), 2),
                "gigabytes": round(memory_bytes / (1024 * 1024 * 1024), 4)
            }
        }
    
    def _validate_dataset(self, df: pd.DataFrame, file_name: str) -> Dict[str, Any]:
        """Run validation"""
        from .validator import validate_dataset
        return validate_dataset(df, file_name)
    
    def _generate_cleaning(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Generate cleaning recommendations"""
        from .cleaning_engine import generate_cleaning_recommendations
        return generate_cleaning_recommendations(df, self.context.get("validation", {}))
    
    def _detect_outliers(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Detect outliers"""
        from .outlier_engine import detect_outliers
        return detect_outliers(df, self.context)
    
    def _perform_eda(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Perform EDA"""
        from .eda_engine import perform_eda
        return perform_eda(df, self.context)
    
    def _engineer_features(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Engineer features"""
        from .feature_engine import engineer_features
        return engineer_features(df, self.context)


def run_pipeline(df: pd.DataFrame, file_name: str = "unknown") -> Dict[str, Any]:
    """
    Convenience function to run the complete pipeline
    
    Args:
        df: Pandas DataFrame
        file_name: Name of the original file
        
    Returns:
        Complete analysis results
    """
    pipeline = DataIntelligencePipeline()
    return pipeline.run(df, file_name)
