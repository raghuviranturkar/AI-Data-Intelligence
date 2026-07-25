"""
Model Evaluator for AutoML
Evaluates trained models on test data
"""
import numpy as np
from typing import Dict, Any, Optional
from .metrics import MetricsCalculator


class ModelEvaluator:
    """Evaluates trained ML models"""
    
    def __init__(self, metrics_calculator: Optional[MetricsCalculator] = None):
        """
        Initialize evaluator
        
        Args:
            metrics_calculator: Metrics calculator instance
        """
        self.metrics_calculator = metrics_calculator or MetricsCalculator()
    
    def evaluate_model(self, model, X_test: np.ndarray, 
                      y_test: np.ndarray, 
                      problem_type: str) -> Dict[str, Any]:
        """
        Evaluate a trained model on test data
        
        Args:
            model: Trained model
            X_test: Test features
            y_test: Test targets
            problem_type: Type of ML problem
            
        Returns:
            Evaluation metrics
        """
        # Make predictions
        y_pred = model.predict(X_test)
        
        # Get probabilities if available
        y_proba = None
        if hasattr(model, "predict_proba"):
            try:
                y_proba = model.predict_proba(X_test)
            except:
                pass
        
        # Calculate metrics based on problem type
        if "classification" in problem_type:
            metrics = self.metrics_calculator.calculate_classification_metrics(
                y_test, y_pred, y_proba
            )
        else:  # Regression
            metrics = self.metrics_calculator.calculate_regression_metrics(
                y_test, y_pred
            )
        
        return {
            "metrics": metrics,
            "predictions": y_pred.tolist()[:10],  # First 10 predictions
            "actual": y_test.tolist()[:10]  # First 10 actual values
        }
