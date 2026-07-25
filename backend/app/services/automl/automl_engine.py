"""
AutoML Engine
Orchestrates the complete AutoML pipeline
"""
import numpy as np
import pandas as pd
import pickle
import joblib
from typing import Dict, Any, List, Optional
from sklearn.preprocessing import LabelEncoder, StandardScaler, RobustScaler, MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
import os
import time

from .model_selector import ModelSelector, ProblemType
from .trainer import ModelTrainer
from .evaluator import ModelEvaluator
from .ranking import ModelRanker
from .metrics import MetricsCalculator


class AutoMLEngine:
    """
    AutoML Engine that trains and compares multiple models
    Consumes the frozen pipeline context
    """
    
    def __init__(self, context: Dict[str, Any]):
        """
        Initialize AutoML engine with pipeline context
        
        Args:
            context: Frozen pipeline context from DataIntelligencePipeline
        """
        self.context = context
        self.df = context.get("dataframe", pd.DataFrame())
        self.target_column = None
        self.problem_type = None
        self.model_selector = ModelSelector()
        self.trainer = ModelTrainer()
        self.evaluator = ModelEvaluator()
        self.ranker = ModelRanker()
        self.results = {}
        self.random_seed = 42
        self.trained_models = {}  # Store trained models
        self.preprocessor = None  # Store preprocessing pipeline
        
    def run(self) -> Dict[str, Any]:
        """
        Run the complete AutoML pipeline
        
        Returns:
            Complete AutoML results with trained models
        """
        print("🚀 Starting AutoML Engine...")
        
        # Step 1: Identify target and features
        print("📋 Identifying target and features...")
        self._identify_target()
        
        # Step 2: Detect problem type
        print("🔍 Detecting problem type...")
        self._detect_problem_type()
        
        # Step 3: Prepare data
        print("📊 Preparing data...")
        X, y, feature_names = self._prepare_data()
        
        # Step 4: Create preprocessing pipeline
        print("🔧 Creating preprocessing pipeline...")
        self._create_preprocessor(X, feature_names)
        
        # Step 5: Apply preprocessing
        print("📊 Applying preprocessing...")
        X_processed = self._apply_preprocessing(X)
        
        # Step 6: Get feature counts
        print("📊 Calculating feature counts...")
        feature_counts = self._get_feature_counts(X_processed, feature_names)
        
        # Step 7: Split data
        print("📊 Splitting data...")
        split_info = self._split_data(X_processed, y)
        
        # Step 8: Select models
        print("🤖 Selecting models...")
        models = self._select_models()
        
        # Step 9: Train models
        print("🏋️ Training models...")
        trained_models = self._train_models(models, split_info)
        
        # Step 10: Store trained models
        print("💾 Storing trained models...")
        self._store_trained_models(trained_models)
        
        # Step 11: Evaluate models
        print("📈 Evaluating models...")
        evaluated_models = self._evaluate_models(trained_models, split_info)
        
        # Step 12: Rank models
        print("🏆 Ranking models...")
        ranked_models = self._rank_models(evaluated_models)
        
        # Step 13: Select best model
        print("⭐ Selecting best model...")
        best_model = self._select_best(ranked_models)
        
        # Compile results
        self.results = {
            "problem_type": self.problem_type,
            "target_column": self.target_column,
            "feature_columns": [col for col in self.df.columns if col != self.target_column],
            "models_trained": len(trained_models),
            "candidate_models": [m["name"] for m in models],
            "training_summary": self._generate_training_summary(trained_models),
            "ranked_models": ranked_models,
            "best_model": best_model,
            "feature_counts": feature_counts,
            "dataset_split": split_info,
            "random_seed": self.random_seed,
            "preprocessor": self.preprocessor,
            "feature_names": feature_names,
            "trained_models": self.trained_models
        }
        
        print("✅ AutoML complete!")
        return self.results
    
    def _identify_target(self):
        """Identify target column from context"""
        feature_eng = self.context.get("feature_engineering", {})
        roles = feature_eng.get("feature_roles", {})
        
        for col, role in roles.items():
            if role == "target":
                self.target_column = col
                break
        
        if self.target_column is None:
            validation = self.context.get("validation", {})
            profiling = validation.get("profiling", {})
            candidates = profiling.get("target_candidates", [])
            if candidates:
                self.target_column = candidates[0]
    
    def _detect_problem_type(self):
        """Detect ML problem type from target"""
        if self.target_column is None:
            raise ValueError("No target column found")
        
        y = self.df[self.target_column].dropna().values
        problem_info = self.model_selector.detect_problem_type(y)
        self.problem_type = problem_info["problem_type"]
        self.problem_info = problem_info
    
    def _prepare_data(self) -> tuple:
        """Prepare data for ML training"""
        feature_cols = [col for col in self.df.columns if col != self.target_column]
        
        # Use only numeric columns
        numeric_cols = self.df[feature_cols].select_dtypes(include=[np.number]).columns.tolist()
        
        X = None
        feature_names = []
        
        if not numeric_cols:
            encoded_cols = []
            for col in feature_cols:
                if self.df[col].dtype == 'object':
                    try:
                        le = LabelEncoder()
                        self.df[col + '_encoded'] = le.fit_transform(self.df[col].astype(str))
                        encoded_cols.append(col + '_encoded')
                        feature_names.append(col + '_encoded')
                    except:
                        pass
            
            X = self.df[numeric_cols + encoded_cols].fillna(0).values
            feature_names = numeric_cols + encoded_cols
        else:
            X = self.df[numeric_cols].fillna(0).values
            feature_names = numeric_cols
        
        y = self.df[self.target_column].values
        
        if self.problem_type in [ProblemType.CLASSIFICATION.value, 
                                ProblemType.BINARY_CLASSIFICATION.value,
                                ProblemType.MULTI_CLASS_CLASSIFICATION.value]:
            le = LabelEncoder()
            y = le.fit_transform(y)
            self.target_encoder = le
        
        return X, y, feature_names
    
    def _create_preprocessor(self, X: np.ndarray, feature_names: List[str]):
        """Create preprocessing pipeline"""
        # Detect if we need scaling
        # Check for outliers in the data
        has_outliers = False
        try:
            q1 = np.percentile(X, 25, axis=0)
            q3 = np.percentile(X, 75, axis=0)
            iqr = q3 - q1
            outliers = ((X < (q1 - 1.5 * iqr)) | (X > (q3 + 1.5 * iqr))).any()
            has_outliers = outliers.any() if hasattr(outliers, 'any') else outliers
        except:
            pass
        
        # Choose scaler
        if has_outliers:
            scaler = RobustScaler()
        else:
            scaler = StandardScaler()
        
        self.preprocessor = {
            "scaler": scaler,
            "feature_names": feature_names,
            "is_fitted": False
        }
    
    def _apply_preprocessing(self, X: np.ndarray) -> np.ndarray:
        """Apply preprocessing to data"""
        if self.preprocessor is None:
            return X
        
        scaler = self.preprocessor["scaler"]
        
        # Fit scaler if not fitted
        if not self.preprocessor["is_fitted"]:
            scaler.fit(X)
            self.preprocessor["is_fitted"] = True
        
        return scaler.transform(X)
    
    def _get_feature_counts(self, X: np.ndarray, feature_names: List[str]) -> Dict[str, Any]:
        """Calculate feature counts"""
        original_features = len(self.df.columns) - 1
        encoded_features = len(feature_names)
        
        return {
            "original_features": original_features,
            "encoded_features": encoded_features,
            "final_features": encoded_features
        }
    
    def _split_data(self, X: np.ndarray, y: np.ndarray) -> Dict[str, Any]:
        """Split data into train, validation, and test sets"""
        X_train, X_temp, y_train, y_temp = train_test_split(
            X, y, test_size=0.3, random_state=self.random_seed
        )
        
        X_val, X_test, y_val, y_test = train_test_split(
            X_temp, y_temp, test_size=0.5, random_state=self.random_seed
        )
        
        return {
            "train_size": len(X_train),
            "validation_size": len(X_val),
            "test_size": len(X_test),
            "total_size": len(X),
            "train_ratio": round(len(X_train) / len(X), 3),
            "validation_ratio": round(len(X_val) / len(X), 3),
            "test_ratio": round(len(X_test) / len(X), 3),
            "X_train": X_train,
            "X_val": X_val,
            "X_test": X_test,
            "y_train": y_train,
            "y_val": y_val,
            "y_test": y_test,
            "random_seed": self.random_seed
        }
    
    def _select_models(self) -> List[Dict[str, Any]]:
        """Select candidate models"""
        return self.model_selector.select_models(self.problem_type)
    
    def _train_models(self, models: List[Dict[str, Any]], 
                     split_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Train all models"""
        trained_models = []
        
        for model_config in models:
            try:
                result = self.trainer.train_model(
                    model_config, 
                    split_info["X_train"], 
                    split_info["y_train"]
                )
                result["split_info"] = {
                    "train_size": split_info["train_size"],
                    "validation_size": split_info["validation_size"],
                    "test_size": split_info["test_size"],
                    "random_seed": self.random_seed
                }
                trained_models.append(result)
                print(f"   ✅ Trained {model_config['name']}")
            except Exception as e:
                print(f"   ❌ Failed to train {model_config['name']}: {str(e)}")
                trained_models.append({
                    "model_name": model_config["name"],
                    "error": str(e)
                })
        
        return trained_models
    
    def _store_trained_models(self, trained_models: List[Dict[str, Any]]):
        """Store trained models for later use"""
        for result in trained_models:
            if "error" not in result and "model_instance" in result:
                model_name = result["model_name"]
                self.trained_models[model_name] = {
                    "model": result["model_instance"],
                    "training_time": result.get("training_time", 0),
                    "cv_results": result.get("cv_results", {}),
                    "model_config": result.get("model_config", {})
                }
    
    def _evaluate_models(self, trained_models: List[Dict[str, Any]], 
                        split_info: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Evaluate all trained models"""
        evaluated_models = []
        
        for result in trained_models:
            if "error" in result:
                evaluated_models.append(result)
                continue
            
            try:
                evaluation = self.evaluator.evaluate_model(
                    result["model_instance"],
                    split_info["X_test"],
                    split_info["y_test"],
                    self.problem_type
                )
                
                result["evaluation"] = evaluation
                result["split_info"] = {
                    "train_size": split_info["train_size"],
                    "validation_size": split_info["validation_size"],
                    "test_size": split_info["test_size"],
                    "random_seed": self.random_seed
                }
                evaluated_models.append(result)
                print(f"   ✅ Evaluated {result['model_name']}")
            except Exception as e:
                print(f"   ❌ Failed to evaluate {result['model_name']}: {str(e)}")
                result["error"] = str(e)
                evaluated_models.append(result)
        
        return evaluated_models
    
    def _rank_models(self, evaluated_models: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Rank models by performance"""
        return self.ranker.rank_models(evaluated_models, self.problem_type)
    
    def _select_best(self, ranked_models: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Select and explain the best model"""
        return self.ranker.select_best_model(ranked_models)
    
    def _generate_training_summary(self, trained_models: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate training summary"""
        successful = [m for m in trained_models if "error" not in m]
        failed = [m for m in trained_models if "error" in m]
        
        return {
            "models_trained": len(successful),
            "models_failed": len(failed),
            "total_time": sum(m.get("training_time", 0) for m in successful),
            "problem_type": self.problem_type,
            "target": self.target_column
        }


def run_automl(context: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convenience function to run AutoML
    
    Args:
        context: Frozen pipeline context
        
    Returns:
        AutoML results with trained models
    """
    engine = AutoMLEngine(context)
    return engine.run()
