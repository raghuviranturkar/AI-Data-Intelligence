"""
Metrics Calculator for AutoML
Computes evaluation metrics for classification and regression
"""
import numpy as np
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report,
    mean_absolute_error, mean_squared_error, r2_score
)
from typing import Dict, Any, List, Optional


class MetricsCalculator:
    """Calculates evaluation metrics for ML models"""
    
    @staticmethod
    def calculate_classification_metrics(y_true: np.ndarray, 
                                        y_pred: np.ndarray,
                                        y_proba: Optional[np.ndarray] = None) -> Dict[str, Any]:
        """
        Calculate classification metrics
        
        Args:
            y_true: True labels
            y_pred: Predicted labels
            y_proba: Predicted probabilities (for ROC AUC)
            
        Returns:
            Dictionary of metrics
        """
        metrics = {
            "accuracy": round(accuracy_score(y_true, y_pred), 4),
            "precision": round(precision_score(y_true, y_pred, average='weighted', zero_division=0), 4),
            "recall": round(recall_score(y_true, y_pred, average='weighted', zero_division=0), 4),
            "f1": round(f1_score(y_true, y_pred, average='weighted', zero_division=0), 4)
        }
        
        # Add ROC AUC if probabilities are available
        if y_proba is not None:
            try:
                if len(np.unique(y_true)) == 2:  # Binary classification
                    metrics["roc_auc"] = round(roc_auc_score(y_true, y_proba[:, 1]), 4)
                else:  # Multi-class
                    metrics["roc_auc"] = round(roc_auc_score(y_true, y_proba, multi_class='ovr'), 4)
            except:
                metrics["roc_auc"] = None
        
        # Add confusion matrix
        cm = confusion_matrix(y_true, y_pred)
        metrics["confusion_matrix"] = cm.tolist()
        
        return metrics
    
    @staticmethod
    def calculate_regression_metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, Any]:
        """
        Calculate regression metrics
        
        Args:
            y_true: True values
            y_pred: Predicted values
            
        Returns:
            Dictionary of metrics
        """
        return {
            "mae": round(mean_absolute_error(y_true, y_pred), 4),
            "rmse": round(np.sqrt(mean_squared_error(y_true, y_pred)), 4),
            "r2": round(r2_score(y_true, y_pred), 4),
            "mse": round(mean_squared_error(y_true, y_pred), 4)
        }
    
    @staticmethod
    def get_cv_scores(cv_scores: List[float]) -> Dict[str, Any]:
        """
        Calculate cross-validation statistics
        
        Args:
            cv_scores: List of cross-validation scores
            
        Returns:
            Dictionary with mean and std
        """
        return {
            "mean": round(np.mean(cv_scores), 4),
            "std": round(np.std(cv_scores), 4),
            "min": round(np.min(cv_scores), 4),
            "max": round(np.max(cv_scores), 4)
        }
