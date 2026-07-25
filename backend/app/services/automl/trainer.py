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
        
        Args:
            model_config: Model configuration from selector
            X: Feature matrix
            y: Target variable
            
        Returns:
            Training results
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
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=self.test_size, random_state=42
        )
        
        # Train model
        start_time = time.time()
        model.fit(X_train, y_train)
        training_time = time.time() - start_time
        
        # Cross-validation
        try:
            cv_scores = cross_val_score(model, X_train, y_train, cv=self.cv_folds)
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
