"""
AutoML Engine
Orchestrates the complete AutoML pipeline
"""
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split

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
        
    def run(self) -> Dict[str, Any]:
        """
        Run the complete AutoML pipeline
        
        Returns:
            Complete AutoML results
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
        
        # Step 4: Get feature counts
        print("📊 Calculating feature counts...")
        feature_counts = self._get_feature_counts(X, feature_names)
        
        # Step 5: Split data
        print("📊 Splitting data...")
        split_info = self._split_data(X, y)
        
        # Step 6: Select models
        print("🤖 Selecting models...")
        models = self._select_models()
        
        # Step 7: Train models
        print("🏋️ Training models...")
        trained_models = self._train_models(models, split_info)
        
        # Step 8: Evaluate models
        print("📈 Evaluating models...")
        evaluated_models = self._evaluate_models(trained_models, split_info)
        
        # Step 9: Rank models
        print("🏆 Ranking models...")
        ranked_models = self._rank_models(evaluated_models)
        
        # Step 10: Select best model
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
            "random_seed": self.random_seed
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
            # Fallback: use first target candidate
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
        
        # Store additional info
        self.problem_info = problem_info
    
    def _prepare_data(self) -> tuple:
        """
        Prepare data for ML training
        Returns X (features), y (target), and feature names
        """
        # Get features (exclude target)
        feature_cols = [col for col in self.df.columns if col != self.target_column]
        
        # Remove non-numeric columns that aren't encoded
        # For now, use only numeric columns
        numeric_cols = self.df[feature_cols].select_dtypes(include=[np.number]).columns.tolist()
        
        X = None
        feature_names = []
        
        if not numeric_cols:
            # Try to encode categorical columns
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
            
            # Use encoded columns plus numeric
            X = self.df[numeric_cols + encoded_cols].fillna(0).values
            feature_names = numeric_cols + encoded_cols
        else:
            X = self.df[numeric_cols].fillna(0).values
            feature_names = numeric_cols
        
        # Target
        y = self.df[self.target_column].values
        
        # Encode target if categorical
        if self.problem_type in [ProblemType.CLASSIFICATION.value, 
                                ProblemType.BINARY_CLASSIFICATION.value,
                                ProblemType.MULTI_CLASS_CLASSIFICATION.value]:
            le = LabelEncoder()
            y = le.fit_transform(y)
        
        return X, y, feature_names
    
    def _get_feature_counts(self, X: np.ndarray, feature_names: List[str]) -> Dict[str, Any]:
        """
        Calculate feature counts at different stages
        """
        original_features = len(self.df.columns) - 1  # Exclude target
        encoded_features = len(feature_names)
        
        # Estimate features after dropping low variance
        # This is a simple estimate - in production you'd use actual feature selection
        estimated_final = encoded_features
        
        return {
            "original_features": original_features,
            "encoded_features": encoded_features,
            "final_features": estimated_final,
            "features_after_dropping": estimated_final
        }
    
    def _split_data(self, X: np.ndarray, y: np.ndarray) -> Dict[str, Any]:
        """
        Split data into train, validation, and test sets
        """
        # Split into train (70%), temp (30%)
        X_train, X_temp, y_train, y_temp = train_test_split(
            X, y, test_size=0.3, random_state=self.random_seed
        )
        
        # Split temp into validation (50%) and test (50%)
        # This gives us 70% train, 15% validation, 15% test
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
                # Add split info to result
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
        AutoML results
    """
    engine = AutoMLEngine(context)
    return engine.run()
