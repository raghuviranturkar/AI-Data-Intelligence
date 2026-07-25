"""
Feature Importance Module
Calculates and categorizes feature importance
"""
import numpy as np
from typing import Dict, Any, List
from sklearn.inspection import permutation_importance


class FeatureImportance:
    """Calculates feature importance using multiple methods"""
    
    def __init__(self, model, X_train: np.ndarray, y_train: np.ndarray,
                 feature_names: List[str]):
        """
        Initialize feature importance
        
        Args:
            model: Trained model
            X_train: Training data
            y_train: Training labels
            feature_names: List of feature names
        """
        self.model = model
        self.X_train = X_train
        self.y_train = y_train
        self.feature_names = feature_names
    
    def get_importance_from_model(self) -> Dict[str, float]:
        """
        Get feature importance from model if available
        """
        importance = {}
        
        # Check for model-specific importance
        if hasattr(self.model, 'feature_importances_'):
            imp = self.model.feature_importances_
            importance = {self.feature_names[i]: float(imp[i]) 
                         for i in range(len(self.feature_names))}
        elif hasattr(self.model, 'coef_'):
            # Linear models
            coef = self.model.coef_
            if len(coef.shape) > 1:
                # Multi-class
                coef = np.mean(np.abs(coef), axis=0)
            else:
                coef = np.abs(coef)
            importance = {self.feature_names[i]: float(coef[i]) 
                         for i in range(len(self.feature_names))}
        
        return importance
    
    def get_permutation_importance(self, n_repeats: int = 10) -> Dict[str, float]:
        """
        Get permutation importance
        """
        try:
            result = permutation_importance(
                self.model, self.X_train, self.y_train,
                n_repeats=n_repeats, random_state=42
            )
            
            importance = {
                self.feature_names[i]: float(result.importances_mean[i])
                for i in range(len(self.feature_names))
            }
            return importance
        except:
            return {}
    
    def categorize_importance(self, importance_dict: Dict[str, float]) -> Dict[str, List[str]]:
        """
        Categorize features by impact level
        
        Args:
            importance_dict: Dictionary of feature importance
            
        Returns:
            Categorized features
        """
        if not importance_dict:
            return {"high": [], "medium": [], "low": []}
        
        values = list(importance_dict.values())
        if not values:
            return {"high": [], "medium": [], "low": []}
        
        # Sort and categorize
        sorted_items = sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)
        
        total = sum(values)
        if total > 0:
            percentages = [(name, val/total) for name, val in sorted_items]
        else:
            percentages = [(name, 0) for name, _ in sorted_items]
        
        categories = {"high": [], "medium": [], "low": []}
        
        for name, pct in percentages:
            if pct > 0.1:
                categories["high"].append(name)
            elif pct > 0.03:
                categories["medium"].append(name)
            else:
                categories["low"].append(name)
        
        return categories
    
    def get_feature_ranking(self, importance_dict: Dict[str, float]) -> List[Dict[str, Any]]:
        """
        Get ranked feature importance
        
        Args:
            importance_dict: Dictionary of feature importance
            
        Returns:
            Ranked list of features with importance
        """
        sorted_items = sorted(importance_dict.items(), key=lambda x: x[1], reverse=True)
        
        total = sum(importance_dict.values()) if importance_dict else 1
        
        ranking = []
        for rank, (name, imp) in enumerate(sorted_items, 1):
            ranking.append({
                "rank": rank,
                "feature": name,
                "importance": round(imp, 4),
                "percentage": round((imp / total * 100) if total > 0 else 0, 2)
            })
        
        return ranking
