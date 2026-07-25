"""
Recommendation Engine
Generates actionable business recommendations
"""
from typing import Dict, Any, List


class RecommendationEngine:
    """Generates actionable business recommendations"""
    
    def __init__(self, context: Dict[str, Any]):
        """
        Initialize recommendation engine
        
        Args:
            context: Complete pipeline context
        """
        self.context = context
        
    def generate_recommendations(self) -> List[str]:
        """Generate business recommendations"""
        recommendations = []
        
        # Quality recommendations
        quality_score = self._get_quality_score()
        if quality_score < 70:
            recommendations.append("Improve data quality by addressing missing values and outliers.")
        
        # Missing value recommendations
        missing_cols = self._get_missing_columns()
        if missing_cols:
            recommendations.append(
                f"Address missing values in: {', '.join(missing_cols[:3])}."
            )
        
        # Feature recommendations
        feature_count = self._get_feature_count()
        if feature_count < 5:
            recommendations.append("Consider collecting more features to improve model performance.")
        
        # Model recommendations - FIXED to use the actual best model
        best_model = self._get_best_model()
        if best_model:
            recommendations.append(
                f"Deploy the {best_model} model to production after validation."
            )
        else:
            recommendations.append("Train models to identify the best performing algorithm.")
        
        # SHAP recommendation
        if not self._is_shap_available():
            recommendations.append("Install SHAP for more detailed model explanations.")
        
        # General recommendations
        if not recommendations:
            recommendations.append("Continue monitoring model performance with new data.")
            recommendations.append("Consider periodic retraining to maintain accuracy.")
        
        return recommendations[:5]  # Limit to 5 recommendations
    
    def _get_quality_score(self) -> int:
        """Get quality score from context"""
        validation = self.context.get('validation', {})
        quality = validation.get('quality', {})
        return quality.get('quality_score', 50)
    
    def _get_missing_columns(self) -> List[str]:
        """Get columns with missing values"""
        dataset = self.context.get('dataset', {})
        missing = dataset.get('missing_values', {})
        return [col for col, count in missing.items() if count > 0]
    
    def _get_feature_count(self) -> int:
        """Get number of features"""
        feature_eng = self.context.get('feature_engineering', {})
        roles = feature_eng.get('feature_roles', {})
        return len([col for col, role in roles.items() if role == 'feature'])
    
    def _get_best_model(self) -> str:
        """Get best model name - FIXED to read from automl results"""
        automl = self.context.get('automl', {})
        best = automl.get('best_model', {})
        
        # Get the model name from the best_model dict
        model_name = best.get('name', '')
        
        # If no best model found, check ranked models
        if not model_name:
            ranked = automl.get('ranked_models', [])
            if ranked:
                model_name = ranked[0].get('model_name', '')
        
        return model_name
    
    def _is_shap_available(self) -> bool:
        """Check if SHAP is available"""
        explainability = self.context.get('explainability', {})
        return explainability.get('shap_available', False)
    
    def get_next_steps(self) -> List[str]:
        """Generate next steps"""
        next_steps = []
        
        if self._get_quality_score() < 80:
            next_steps.append("1. Clean the dataset")
            next_steps.append("2. Address missing values")
        
        best_model = self._get_best_model()
        if not best_model:
            next_steps.append("1. Train models")
            next_steps.append("2. Evaluate performance")
        else:
            next_steps.append("1. Validate model on test data")
            next_steps.append("2. Deploy to production")
        
        next_steps.append("3. Monitor model performance")
        next_steps.append("4. Retrain periodically")
        
        return next_steps[:5]
