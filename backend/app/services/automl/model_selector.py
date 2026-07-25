"""
Model Selector for AutoML
Selects appropriate models based on problem type
"""
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional
from enum import Enum


class ProblemType(Enum):
    """ML problem types"""
    CLASSIFICATION = "classification"
    REGRESSION = "regression"
    BINARY_CLASSIFICATION = "binary_classification"
    MULTI_CLASS_CLASSIFICATION = "multi_class_classification"


class ModelSelector:
    """Selects candidate models based on problem type"""
    
    # Model definitions
    MODELS = {
        "classification": {
            "Logistic Regression": {
                "class": "LogisticRegression",
                "params": {"max_iter": 1000, "random_state": 42},
                "description": "Linear model for classification"
            },
            "Random Forest": {
                "class": "RandomForestClassifier",
                "params": {"n_estimators": 100, "random_state": 42},
                "description": "Ensemble of decision trees"
            },
            "Decision Tree": {
                "class": "DecisionTreeClassifier",
                "params": {"random_state": 42, "max_depth": 10},
                "description": "Single decision tree"
            },
            "Gradient Boosting": {
                "class": "GradientBoostingClassifier",
                "params": {"n_estimators": 100, "random_state": 42},
                "description": "Boosting ensemble"
            },
            "KNN": {
                "class": "KNeighborsClassifier",
                "params": {"n_neighbors": 5},
                "description": "K-Nearest Neighbors"
            }
        },
        "regression": {
            "Linear Regression": {
                "class": "LinearRegression",
                "params": {},
                "description": "Linear model for regression"
            },
            "Random Forest Regressor": {
                "class": "RandomForestRegressor",
                "params": {"n_estimators": 100, "random_state": 42},
                "description": "Ensemble of decision trees for regression"
            },
            "Gradient Boosting Regressor": {
                "class": "GradientBoostingRegressor",
                "params": {"n_estimators": 100, "random_state": 42},
                "description": "Boosting ensemble for regression"
            },
            "Decision Tree Regressor": {
                "class": "DecisionTreeRegressor",
                "params": {"random_state": 42, "max_depth": 10},
                "description": "Single decision tree for regression"
            }
        }
    }
    
    def __init__(self):
        """Initialize model selector"""
        self._check_xgboost()
    
    def _check_xgboost(self):
        """Check if XGBoost is available"""
        try:
            import xgboost
            self.xgboost_available = True
        except ImportError:
            self.xgboost_available = False
    
    def detect_problem_type(self, y: np.ndarray) -> Dict[str, Any]:
        """
        Detect ML problem type from target variable
        
        Args:
            y: Target variable
            
        Returns:
            Dictionary with problem type and metadata
        """
        # Convert to numpy array if pandas series
        if hasattr(y, 'values'):
            y = y.values
        
        # Convert to numpy array if pandas StringDtype
        if hasattr(y, 'dtype') and str(y.dtype).startswith('string'):
            y = np.array(y, dtype=object)
        
        unique_values = np.unique(y)
        n_unique = len(unique_values)
        
        # Check if numeric by trying to convert
        is_numeric = False
        try:
            # Try to convert to float
            test = np.array(y, dtype=float)
            is_numeric = True
        except:
            is_numeric = False
        
        if is_numeric and n_unique > 20:
            return {
                "problem_type": ProblemType.REGRESSION.value,
                "n_unique": n_unique,
                "is_numeric": is_numeric,
                "unique_values": unique_values[:10].tolist()
            }
        elif n_unique == 2:
            return {
                "problem_type": ProblemType.BINARY_CLASSIFICATION.value,
                "n_unique": n_unique,
                "is_numeric": is_numeric,
                "unique_values": unique_values.tolist()
            }
        elif n_unique <= 20:
            return {
                "problem_type": ProblemType.MULTI_CLASS_CLASSIFICATION.value,
                "n_unique": n_unique,
                "is_numeric": is_numeric,
                "unique_values": unique_values.tolist()
            }
        else:
            # Fallback to regression
            return {
                "problem_type": ProblemType.REGRESSION.value,
                "n_unique": n_unique,
                "is_numeric": is_numeric,
                "unique_values": unique_values[:10].tolist()
            }
    
    def select_models(self, problem_type: str, max_models: int = 5) -> List[Dict[str, Any]]:
        """
        Select candidate models for the problem type
        
        Args:
            problem_type: Type of ML problem
            max_models: Maximum number of models to select
            
        Returns:
            List of model configurations
        """
        # Get base models for problem type
        problem_type_key = problem_type
        if problem_type in [ProblemType.BINARY_CLASSIFICATION.value, 
                           ProblemType.MULTI_CLASS_CLASSIFICATION.value]:
            problem_type_key = ProblemType.CLASSIFICATION.value
        
        models = []
        
        # Add base models
        if problem_type_key in self.MODELS:
            for name, config in self.MODELS[problem_type_key].items():
                models.append({
                    "name": name,
                    "class": config["class"],
                    "params": config["params"],
                    "description": config["description"],
                    "is_xgboost": False
                })
        
        # Limit models
        return models[:max_models]
    
    def get_problem_type_display(self, problem_type: str) -> str:
        """Get user-friendly display name for problem type"""
        display_names = {
            ProblemType.CLASSIFICATION.value: "Classification",
            ProblemType.REGRESSION.value: "Regression",
            ProblemType.BINARY_CLASSIFICATION.value: "Binary Classification",
            ProblemType.MULTI_CLASS_CLASSIFICATION.value: "Multi-Class Classification"
        }
        return display_names.get(problem_type, problem_type)
