"""
Recommendation Engine
Generates actionable business recommendations
"""
from typing import Dict, Any, List


class RecommendationEngine:
    """Generates actionable business recommendations"""
    
    def __init__(self, context: Dict[str, Any]):
        self.context = context
        
    def generate_recommendations(self) -> List[str]:
        """Generate business recommendations"""
        recommendations = []
        
        quality_score = self._get_quality_score()
        if quality_score < 70:
            recommendations.append("Improve data quality by addressing missing values and outliers.")
        
        missing_cols = self._get_missing_columns()
        if missing_cols:
            recommendations.append(
                f"Address missing values in: {', '.join(missing_cols[:3])}."
            )
        
        feature_count = self._get_feature_count()
        if feature_count < 5:
            recommendations.append("Consider collecting more features to improve model performance.")
        
        best_model = self._get_best_model()
        if best_model:
            recommendations.append(
                f"Deploy the {best_model} model to production after validation."
            )
        else:
            recommendations.append("Train models to identify the best performing algorithm.")
        
        if not recommendations:
            recommendations.append("Continue monitoring model performance with new data.")
            recommendations.append("Consider periodic retraining to maintain accuracy.")
        
        return recommendations[:5]
    
    def _get_quality_score(self) -> int:
        validation = self.context.get('validation', {})
        quality = validation.get('quality', {})
        return quality.get('quality_score', 50)
    
    def _get_missing_columns(self) -> List[str]:
        dataset = self.context.get('dataset', {})
        missing = dataset.get('missing_values', {})
        return [col for col, count in missing.items() if count > 0]
    
    def _get_feature_count(self) -> int:
        feature_eng = self.context.get('feature_engineering', {})
        roles = feature_eng.get('feature_roles', {})
        return len([col for col, role in roles.items() if role == 'feature'])
    
    def _get_best_model(self) -> str:
        automl = self.context.get('automl', {})
        best = automl.get('best_model', {})
        model_name = best.get('name', '')
        
        if not model_name:
            ranked = automl.get('ranked_models', [])
            if ranked:
                model_name = ranked[0].get('model_name', '')
        
        return model_name
    
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
