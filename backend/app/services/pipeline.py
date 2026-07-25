"""
Data Intelligence Pipeline Orchestrator
Coordinates all analysis engines and maintains shared context
"""
import pandas as pd
import numpy as np
from typing import Dict, Any
import joblib
import os

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
    """
    Orchestrates the complete data intelligence pipeline
    Maintains shared context across all engines
    """
    
    def __init__(self):
        self.context = {}
        self.results = {}
        self._is_frozen = False
    
    def run(self, df: pd.DataFrame, file_name: str = "unknown", 
            include_automl: bool = True,
            include_explainability: bool = True,
            include_insights: bool = True) -> Dict[str, Any]:
        """
        Run the complete data intelligence pipeline
        """
        # Step 1: Dataset Inspection
        print("🔍 Running dataset inspection...")
        self.results["dataset"] = self._inspect_dataset(df, file_name)
        
        # Build shared context with proper dataset info
        self.context = {
            "dataframe": df,
            "file_name": file_name,
            "dataset": self.results["dataset"],
            "profiling": self.results["dataset"],
            "preprocessing": {}  # Store preprocessing objects
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
            print("🤖 Running AutoML...")
            self.results["automl"] = self._run_automl()
            self.context["automl"] = self.results["automl"]
            
            # Store preprocessing objects from AutoML
            if "preprocessor" in self.results["automl"]:
                self.context["preprocessing"]["scaler"] = self.results["automl"]["preprocessor"]
            if "feature_names" in self.results["automl"]:
                self.context["preprocessing"]["feature_names"] = self.results["automl"]["feature_names"]
            
            # Store trained models
            if "trained_models" in self.results["automl"]:
                self.context["preprocessing"]["trained_models"] = self.results["automl"]["trained_models"]
                
            # Store best model
            if "best_model" in self.results["automl"]:
                self.context["preprocessing"]["best_model"] = self.results["automl"]["best_model"]
        
        # Step 8: Explainability
        if include_explainability and include_automl:
            print("🔍 Running Explainability...")
            self.results["explainability"] = self._run_explainability()
            self.context["explainability"] = self.results["explainability"]
        
        # Step 9: AI Insights
        if include_insights and include_automl:
            print("💡 Running AI Insights...")
            self.results["insights"] = self._run_insights()
            self.context["insights"] = self.results["insights"]
        
        # Freeze the pipeline
        self._is_frozen = True
        print("✅ Pipeline complete! Context frozen for downstream modules.")
        
        return self.results
    
    def get_context(self) -> Dict[str, Any]:
        """Get the frozen pipeline context"""
        if not self._is_frozen:
            raise RuntimeError("Pipeline must be run before accessing context")
        return self.context
    
    def get_ml_ready_data(self) -> pd.DataFrame:
        """Get the ML-ready dataset"""
        if not self._is_frozen:
            raise RuntimeError("Pipeline must be run before accessing ML-ready data")
        return self.context.get("dataframe", pd.DataFrame())
    
    def get_preprocessing_objects(self) -> Dict[str, Any]:
        """Get preprocessing objects for inference"""
        if not self._is_frozen:
            raise RuntimeError("Pipeline must be run before accessing preprocessing objects")
        return self.context.get("preprocessing", {})
    
    def save_artifacts(self, path: str = "artifacts"):
        """Save pipeline artifacts to disk"""
        if not self._is_frozen:
            raise RuntimeError("Pipeline must be run before saving artifacts")
        
        os.makedirs(path, exist_ok=True)
        
        # Save preprocessing objects
        joblib.dump(self.context.get("preprocessing", {}), f"{path}/preprocessing.joblib")
        
        # Save feature engineering
        joblib.dump(self.context.get("feature_engineering", {}), f"{path}/feature_engineering.joblib")
        
        print(f"✅ Artifacts saved to {path}/")
    
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
    
    def _run_automl(self) -> Dict[str, Any]:
        """Run AutoML"""
        return run_automl(self.context)
    
    def _run_explainability(self) -> Dict[str, Any]:
        """Run Explainability"""
        return run_explainability(self.context)
    
    def _run_insights(self) -> Dict[str, Any]:
        """Run AI Insights"""
        return generate_insights(self.context)


def run_pipeline(df: pd.DataFrame, file_name: str = "unknown", 
                 include_automl: bool = True,
                 include_explainability: bool = True,
                 include_insights: bool = True) -> Dict[str, Any]:
    """
    Convenience function to run the complete pipeline
    """
    pipeline = DataIntelligencePipeline()
    return pipeline.run(df, file_name, include_automl, include_explainability, include_insights)


def load_pipeline_artifacts(path: str = "artifacts") -> Dict[str, Any]:
    """
    Load saved pipeline artifacts
    
    Args:
        path: Path to artifacts directory
        
    Returns:
        Loaded artifacts
    """
    import joblib
    artifacts = {}
    
    try:
        artifacts["preprocessing"] = joblib.load(f"{path}/preprocessing.joblib")
    except:
        print(f"⚠️ No preprocessing artifacts found at {path}/")
    
    try:
        artifacts["feature_engineering"] = joblib.load(f"{path}/feature_engineering.joblib")
    except:
        print(f"⚠️ No feature engineering artifacts found at {path}/")
    
    return artifacts
