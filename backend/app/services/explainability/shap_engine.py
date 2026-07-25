"""
SHAP Engine for Model Explainability
Handles SHAP explainer selection and computation with graceful fallback
"""
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional, Union
import warnings
warnings.filterwarnings('ignore')

# Try to import SHAP, but don't fail if not available
try:
    import shap
    SHAP_AVAILABLE = True
except ImportError:
    SHAP_AVAILABLE = False


class SHAPEngine:
    """Handles SHAP explainer selection and computation"""
    
    def __init__(self, model, X_train: np.ndarray, feature_names: List[str], 
                 problem_type: str, model_type: str = None):
        """
        Initialize SHAP engine
        
        Args:
            model: Trained model
            X_train: Training data
            feature_names: List of feature names
            problem_type: Type of ML problem
            model_type: Type of model (e.g., 'tree', 'linear')
        """
        self.model = model
        self.X_train = X_train
        self.feature_names = feature_names
        self.problem_type = problem_type
        self.model_type = model_type
        self.explainer = None
        self.shap_values = None
        self.is_available = SHAP_AVAILABLE
        
    def _get_explainer_type(self) -> str:
        """
        Determine the appropriate SHAP explainer type
        
        Returns:
            Explainer type string
        """
        if not self.is_available:
            return 'not_available'
            
        # Check if model is tree-based
        model_class = self.model.__class__.__name__
        tree_based = ['RandomForestClassifier', 'RandomForestRegressor',
                     'GradientBoostingClassifier', 'GradientBoostingRegressor',
                     'XGBClassifier', 'XGBRegressor', 'DecisionTreeClassifier',
                     'DecisionTreeRegressor']
        
        linear_based = ['LogisticRegression', 'LinearRegression',
                       'Ridge', 'Lasso', 'ElasticNet']
        
        if any(name in model_class for name in tree_based):
            return 'tree'
        elif any(name in model_class for name in linear_based):
            return 'linear'
        else:
            return 'kernel'
    
    def compute_shap_values(self, X_sample: Optional[np.ndarray] = None) -> Dict[str, Any]:
        """
        Compute SHAP values for the model
        
        Args:
            X_sample: Sample data for SHAP values (optional)
            
        Returns:
            SHAP values and metadata
        """
        if not self.is_available:
            return {
                "available": False,
                "error": "SHAP not installed. Install with: pip install shap",
                "feature_importance": self._get_fallback_importance()
            }
        
        explainer_type = self._get_explainer_type()
        
        # Select explainer
        try:
            if explainer_type == 'tree':
                self.explainer = shap.TreeExplainer(self.model)
            elif explainer_type == 'linear':
                self.explainer = shap.LinearExplainer(self.model, self.X_train)
            else:
                self.explainer = shap.KernelExplainer(
                    self.model.predict, 
                    self.X_train[:100]  # Use subset for speed
                )
        except Exception as e:
            # Fallback to KernelExplainer
            try:
                self.explainer = shap.KernelExplainer(
                    self.model.predict, 
                    self.X_train[:100]
                )
            except:
                return {
                    "available": False,
                    "error": f"Failed to create SHAP explainer: {str(e)}",
                    "feature_importance": self._get_fallback_importance()
                }
        
        # Compute SHAP values
        try:
            X_use = X_sample if X_sample is not None else self.X_train[:100]
            
            if explainer_type == 'tree':
                self.shap_values = self.explainer.shap_values(X_use)
            else:
                self.shap_values = self.explainer.shap_values(X_use)
            
            # Calculate feature importance from SHAP
            if isinstance(self.shap_values, list):
                # Multi-class
                shap_abs = np.abs(np.array(self.shap_values))
                shap_importance = np.mean(shap_abs, axis=(0, 1)) if len(shap_abs.shape) > 1 else np.mean(shap_abs, axis=0)
            else:
                shap_abs = np.abs(self.shap_values)
                shap_importance = np.mean(shap_abs, axis=0)
            
            # Normalize to sum to 1
            if shap_importance.sum() > 0:
                shap_importance = shap_importance / shap_importance.sum()
            
            return {
                "available": True,
                "explainer_type": explainer_type,
                "shap_values": self.shap_values,
                "feature_importance": {
                    self.feature_names[i]: float(shap_importance[i]) 
                    for i in range(len(self.feature_names))
                },
                "feature_names": self.feature_names
            }
            
        except Exception as e:
            return {
                "available": False,
                "error": f"Failed to compute SHAP values: {str(e)}",
                "feature_importance": self._get_fallback_importance()
            }
    
    def _get_fallback_importance(self) -> Dict[str, float]:
        """
        Get fallback feature importance when SHAP is not available
        """
        # Try to get from model
        if hasattr(self.model, 'feature_importances_'):
            imp = self.model.feature_importances_
            return {self.feature_names[i]: float(imp[i]) 
                   for i in range(len(self.feature_names))}
        elif hasattr(self.model, 'coef_'):
            coef = self.model.coef_
            if len(coef.shape) > 1:
                coef = np.mean(np.abs(coef), axis=0)
            else:
                coef = np.abs(coef)
            return {self.feature_names[i]: float(coef[i]) 
                   for i in range(len(self.feature_names))}
        else:
            # Return uniform importance
            return {name: 1.0/len(self.feature_names) 
                   for name in self.feature_names}
    
    def get_local_explanation(self, X_sample: np.ndarray) -> Dict[str, Any]:
        """
        Get local explanation for a single prediction
        
        Args:
            X_sample: Single sample to explain
            
        Returns:
            Local explanation with feature contributions
        """
        if self.shap_values is None:
            return {"error": "SHAP values not computed"}
        
        # Get SHAP values for the sample
        try:
            if isinstance(self.shap_values, list):
                # Multi-class - use first class
                shap_sample = [sv[0] for sv in self.shap_values]
                shap_sample = np.array(shap_sample)
            else:
                shap_sample = self.shap_values[0]
            
            # Get predictions
            pred = self.model.predict(X_sample.reshape(1, -1))[0]
            
            # Get prediction probability if available
            proba = None
            if hasattr(self.model, 'predict_proba'):
                proba = self.model.predict_proba(X_sample.reshape(1, -1))[0]
            
            # Sort features by absolute SHAP value
            feature_contributions = []
            for i, name in enumerate(self.feature_names):
                val = float(shap_sample[i])
                feature_contributions.append({
                    "feature": name,
                    "contribution": abs(val),
                    "direction": "increase" if val > 0 else "decrease",
                    "shap_value": val
                })
            
            # Sort by contribution
            feature_contributions.sort(key=lambda x: x["contribution"], reverse=True)
            
            return {
                "prediction": int(pred),
                "probability": float(max(proba)) if proba is not None else None,
                "feature_contributions": feature_contributions[:10],  # Top 10
                "top_positive": [f["feature"] for f in feature_contributions 
                               if f["direction"] == "increase"][:5],
                "top_negative": [f["feature"] for f in feature_contributions 
                               if f["direction"] == "decrease"][:5]
            }
            
        except Exception as e:
            return {"error": f"Failed to get local explanation: {str(e)}"}


def check_shap_available() -> bool:
    """Check if SHAP is available"""
    return SHAP_AVAILABLE
