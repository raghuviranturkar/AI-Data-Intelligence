"""
AutoML Engine
Orchestrates the complete AutoML pipeline
"""
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from sklearn.preprocessing import LabelEncoder

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
        X, y = self._prepare_data()
        
        # Step 4: Select models
        print("🤖 Selecting models...")
        models = self._select_models()
        
        # Step 5: Train models
        print("🏋️ Training models...")
        trained_models = self._train_models(models, X, y)
        
        # Step 6: Evaluate models
        print("📈 Evaluating models...")
        evaluated_models = self._evaluate_models(trained_models, X, y)
        
        # Step 7: Rank models
        print("🏆 Ranking models...")
        ranked_models = self._rank_models(evaluated_models)
        
        # Step 8: Select best model
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
            "best_model": best_model
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
        Returns X (features) and y (target)
        """
        # Get features (exclude target)
        feature_cols = [col for col in self.df.columns if col != self.target_column]
        
        # Remove non-numeric columns that aren't encoded
        # For now, use only numeric columns
        numeric_cols = self.df[feature_cols].select_dtypes(include=[np.number]).columns.tolist()
        
        if not numeric_cols:
            # Try to encode categorical columns
            encoded_cols = []
            for col in feature_cols:
                if self.df[col].dtype == 'object':
                    try:
                        le = LabelEncoder()
                        self.df[col + '_encoded'] = le.fit_transform(self.df[col].astype(str))
                        encoded_cols.append(col + '_encoded')
                    except:
                        pass
            
            # Use encoded columns plus numeric
            X = self.df[numeric_cols + encoded_cols].fillna(0).values
        else:
            X = self.df[numeric_cols].fillna(0).values
        
        # Target
        y = self.df[self.target_column].values
        
        # Encode target if categorical
        if self.problem_type in [ProblemType.CLASSIFICATION.value, 
                                ProblemType.BINARY_CLASSIFICATION.value,
                                ProblemType.MULTI_CLASS_CLASSIFICATION.value]:
            le = LabelEncoder()
            y = le.fit_transform(y)
        
        return X, y
    
    def _select_models(self) -> List[Dict[str, Any]]:
        """Select candidate models"""
        return self.model_selector.select_models(self.problem_type)
    
    def _train_models(self, models: List[Dict[str, Any]], 
                     X: np.ndarray, 
                     y: np.ndarray) -> List[Dict[str, Any]]:
        """Train all models"""
        trained_models = []
        
        for model_config in models:
            try:
                result = self.trainer.train_model(model_config, X, y)
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
                        X: np.ndarray, 
                        y: np.ndarray) -> List[Dict[str, Any]]:
        """Evaluate all trained models"""
        evaluated_models = []
        
        for result in trained_models:
            if "error" in result:
                evaluated_models.append(result)
                continue
            
            try:
                evaluation = self.evaluator.evaluate_model(
                    result["model_instance"],
                    result["X_test"],
                    result["y_test"],
                    self.problem_type
                )
                
                result["evaluation"] = evaluation
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
