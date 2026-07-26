"""
Data Intelligence Pipeline Orchestrator
"""
import pandas as pd
import numpy as np
from typing import Dict, Any
import traceback

from .dataset_inspector import inspect_dataset
from .validator import validate_dataset
from .cleaning_engine import generate_cleaning_recommendations
from .outlier_engine import detect_outliers
from .eda_engine import perform_eda
from .feature_engine import engineer_features
from .automl import run_automl
from .explainability import run_explainability
from .insights import generate_insights


class DataIntelligencePipeline:
    """Orchestrates the complete data intelligence pipeline"""
    
    def __init__(self):
        self.context = {}
        self.results = {}
        self._is_frozen = False
    
    def run(self, df: pd.DataFrame, file_name: str = "unknown", 
            include_automl: bool = True,
            include_explainability: bool = True,
            include_insights: bool = True) -> Dict[str, Any]:
        """Run the complete data intelligence pipeline"""
        try:
            # Step 1: Dataset Inspection
            print("🔍 Running dataset inspection...")
            self.results["dataset"] = self._inspect_dataset(df, file_name)
            
            self.context = {
                "dataframe": df,
                "file_name": file_name,
                "dataset": self.results["dataset"],
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
            
            # Step 7: AutoML
            if include_automl:
                try:
                    print("🤖 Running AutoML...")
                    self.results["automl"] = self._run_automl()
                    self.context["automl"] = self.results["automl"]
                except Exception as e:
                    print(f"⚠️ AutoML failed: {str(e)}")
                    self.results["automl"] = {"error": str(e)}
            
            # Step 8: Explainability
            if include_explainability and include_automl and "automl" in self.results:
                try:
                    print("🔍 Running Explainability...")
                    self.results["explainability"] = self._run_explainability()
                    self.context["explainability"] = self.results["explainability"]
                except Exception as e:
                    print(f"⚠️ Explainability failed: {str(e)}")
                    self.results["explainability"] = {"error": str(e)}
            
            # Step 9: AI Insights
            if include_insights and include_automl and "automl" in self.results:
                try:
                    print("💡 Running AI Insights...")
                    self.results["insights"] = self._run_insights()
                    self.context["insights"] = self.results["insights"]
                except Exception as e:
                    print(f"⚠️ Insights generation failed: {str(e)}")
                    self.results["insights"] = {"error": str(e)}
            
            self._is_frozen = True
            print("✅ Pipeline complete!")
            return self.results
            
        except Exception as e:
            print(f"❌ Pipeline failed: {str(e)}")
            print(traceback.format_exc())
            raise
    
    # ... (rest of the methods remain the same)
    
    def _inspect_dataset(self, df: pd.DataFrame, file_name: str) -> Dict[str, Any]:
        """Run dataset inspection"""
        return {
            "file_name": file_name,
            "shape": {"rows": len(df), "columns": len(df.columns)},
            "columns": df.columns.tolist(),
            "numeric_columns": df.select_dtypes(include=[np.number]).columns.tolist(),
            "categorical_columns": df.select_dtypes(include=['object', 'string']).columns.tolist(),
            "dtypes": df.dtypes.astype(str).to_dict(),
            "missing_values": df.isnull().sum().to_dict(),
            "missing_percentage": (df.isnull().sum() / len(df) * 100).to_dict(),
            "duplicate_rows": int(df.duplicated().sum()),
            "memory_usage": {
                "bytes": int(df.memory_usage(deep=True).sum()),
                "kilobytes": round(df.memory_usage(deep=True).sum() / 1024, 2),
                "megabytes": round(df.memory_usage(deep=True).sum() / (1024 * 1024), 2)
            }
        }
    
    def _validate_dataset(self, df: pd.DataFrame, file_name: str) -> Dict[str, Any]:
        from .validator import validate_dataset
        return validate_dataset(df, file_name)
    
    def _generate_cleaning(self, df: pd.DataFrame) -> Dict[str, Any]:
        from .cleaning_engine import generate_cleaning_recommendations
        return generate_cleaning_recommendations(df, self.context.get("validation", {}))
    
    def _detect_outliers(self, df: pd.DataFrame) -> Dict[str, Any]:
        from .outlier_engine import detect_outliers
        return detect_outliers(df, self.context)
    
    def _perform_eda(self, df: pd.DataFrame) -> Dict[str, Any]:
        from .eda_engine import perform_eda
        return perform_eda(df, self.context)
    
    def _engineer_features(self, df: pd.DataFrame) -> Dict[str, Any]:
        from .feature_engine import engineer_features
        return engineer_features(df, self.context)
    
    def _run_automl(self) -> Dict[str, Any]:
        from .automl import run_automl
        return run_automl(self.context)
    
    def _run_explainability(self) -> Dict[str, Any]:
        from .explainability import run_explainability
        return run_explainability(self.context)
    
    def _run_insights(self) -> Dict[str, Any]:
        from .insights import generate_insights
        return generate_insights(self.context)


def run_pipeline(df: pd.DataFrame, file_name: str = "unknown", 
                 include_automl: bool = True,
                 include_explainability: bool = True,
                 include_insights: bool = True) -> Dict[str, Any]:
    pipeline = DataIntelligencePipeline()
    return pipeline.run(df, file_name, include_automl, include_explainability, include_insights)
