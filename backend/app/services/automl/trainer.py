"""
Model Trainer for AutoML
Trains models with cross-validation
"""
import time
import numpy as np
from sklearn.model_selection import cross_val_score, train_test_split
from typing import Dict, Any, List, Tuple, Optional
import warnings
warnings.filterwarnings('ignore')


class ModelTrainer:
    """Trains ML models with cross-validation"""
    
    def __init__(self, cv_folds: int = 5, test_size: float = 0.2):
        """
        Initialize trainer
        
        Args:
            cv_folds: Number of cross-validation folds
            test_size: Proportion of data for test set
        """
        self.cv_folds = cv_folds
        self.test_size = test_size
    
    def train_model(self, model_config: Dict[str, Any], 
                   X: np.ndarray, 
                   y: np.ndarray) -> Dict[str, Any]:
        """
        Train a single model with cross-validation
        """
        # Import the model class
        model_class = self._import_model_class(model_config["class"])
        
        if model_class is None:
            return {
                "model_name": model_config["name"],
                "error": f"Could not import {model_config['class']}"
            }
        
        # Initialize model
        model = model_class(**model_config.get("params", {}))
        
        # Handle small datasets
        n_samples = len(X)
        if n_samples < 10:
            # For very small datasets, use a smaller test size
            test_size = max(0.1, 1.0 / n_samples) if n_samples > 1 else 0.1
            cv_folds = min(2, n_samples) if n_samples >= 2 else 2
        else:
            test_size = self.test_size
            cv_folds = min(self.cv_folds, n_samples)
        
        # Split data
        try:
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=test_size, random_state=42
            )
        except ValueError:
            # If still failing, use a different approach
            if n_samples == 1:
                return {
                    "model_name": model_config["name"],
                    "error": "Dataset too small for training. Need at least 2 samples."
                }
            # Use a simple split
            split_idx = max(1, int(n_samples * 0.7))
            X_train, X_test = X[:split_idx], X[split_idx:]
            y_train, y_test = y[:split_idx], y[split_idx:]
        
        # Train model
        start_time = time.time()
        model.fit(X_train, y_train)
        training_time = time.time() - start_time
        
        # Cross-validation
        try:
            cv_scores = cross_val_score(model, X_train, y_train, cv=cv_folds)
            cv_results = {
                "mean": float(np.mean(cv_scores)),
                "std": float(np.std(cv_scores)),
                "scores": [float(s) for s in cv_scores]
            }
        except Exception as e:
            cv_results = {"error": str(e)}
        
        # Store results
        return {
            "model_name": model_config["name"],
            "model_instance": model,
            "training_time": round(training_time, 3),
            "cv_results": cv_results,
            "X_train": X_train,
            "X_test": X_test,
            "y_train": y_train,
            "y_test": y_test,
            "model_config": model_config
        }
    
    def _import_model_class(self, class_name: str):
        """Import model class from sklearn"""
        try:
            from sklearn import ensemble, linear_model, tree, neighbors
            modules = [ensemble, linear_model, tree, neighbors]
            for module in modules:
                if hasattr(module, class_name):
                    return getattr(module, class_name)
        except:
            return None
        return None
