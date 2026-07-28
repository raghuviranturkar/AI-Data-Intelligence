"""
Business Rules Module
Contains business logic for generating insights
"""
from typing import Dict, Any, List


class BusinessRules:
    """Business rules for generating insights"""
    
    @staticmethod
    def get_quality_insight(quality_score: int, warnings: List[str]) -> List[str]:
        """Generate quality insights"""
        insights = []
        
        if quality_score >= 90:
            insights.append("Dataset quality is excellent. Ready for analysis.")
        elif quality_score >= 70:
            insights.append("Dataset quality is good with minor issues to address.")
        else:
            insights.append("Dataset quality needs improvement before analysis.")
        
        if warnings:
            if len(warnings) <= 3:
                insights.append(f"Minor issues detected: {len(warnings)} warnings.")
            else:
                insights.append(f"Multiple issues detected: {len(warnings)} warnings. Review recommended.")
        
        return insights
    
    @staticmethod
    def get_eda_insight(eda_results: Dict[str, Any]) -> List[str]:
        """Generate EDA insights"""
        insights = []
        
        strong_corrs = eda_results.get('correlation', {}).get('strong_correlations', {})
        strong_list = strong_corrs.get('strong_correlations', [])
        
        if strong_list:
            for corr in strong_list[:2]:
                insights.append(
                    f"Strong relationship detected between {corr['feature_1']} and {corr['feature_2']} "
                    f"(correlation: {corr['correlation']:.2f})."
                )
        
        distributions = eda_results.get('distributions', {}).get('numeric', {})
        distributions_data = distributions.get('numeric_distributions', {})
        
        for col, stats in list(distributions_data.items())[:2]:
            skewness = stats.get('skewness', 0)
            if abs(skewness) > 1:
                direction = "right" if skewness > 0 else "left"
                insights.append(f"{col} has a {direction}-skewed distribution.")
        
        return insights
    
    @staticmethod
    def get_model_insight(automl_results: Dict[str, Any]) -> List[str]:
        """Generate model insights"""
        insights = []
        
        if not automl_results:
            return ["No model training results available."]
        
        best_model = automl_results.get('best_model', {})
        if best_model:
            insights.append(
                f"Best performing model: {best_model.get('name', 'Unknown')} "
                f"(score: {best_model.get('score', 0):.3f})."
            )
        
        models_trained = automl_results.get('models_trained', 0)
        if models_trained > 0:
            insights.append(f"Successfully trained {models_trained} different models.")
        
        return insights
    
    @staticmethod
    def get_explainability_insight(explainability_results: Dict[str, Any]) -> List[str]:
        """Generate explainability insights"""
        insights = []
        
        if not explainability_results:
            return ["No explainability data available."]
        
        importance = explainability_results.get('feature_importance', {})
        if importance:
            sorted_importance = sorted(importance.items(), key=lambda x: x[1], reverse=True)
            top_features = sorted_importance[:3]
            
            if top_features:
                feature_names = [f[0] for f in top_features]
                insights.append(
                    f"Key drivers: {', '.join(feature_names)} have the strongest influence on predictions."
                )
        
        return insights
    
    @staticmethod
    def get_risk_insights(quality_score: int, 
                         warnings: List[str],
                         automl_results: Dict[str, Any]) -> List[str]:
        """Generate risk insights"""
        risks = []
        
        if quality_score < 70:
            risks.append("Dataset quality is below recommended threshold.")
        
        if warnings and len(warnings) > 5:
            risks.append(f"Multiple warnings ({len(warnings)}) indicate potential data quality issues.")
        
        best_model = automl_results.get('best_model', {})
        score = best_model.get('score', 0)
        if score < 0.6 and score > 0:
            risks.append("Model performance is below acceptable threshold.")
        
        for warning in warnings:
            if "infinite" in warning.lower() or "constant" in warning.lower():
                risks.append("Data contains problematic values that may affect model performance.")
                break
        
        return risks
    
    @staticmethod
    def get_strengths(quality_score: int, 
                     automl_results: Dict[str, Any]) -> List[str]:
        """Generate strengths"""
        strengths = []
        
        if quality_score >= 80:
            strengths.append("High data quality score.")
        
        if automl_results:
            models_trained = automl_results.get('models_trained', 0)
            if models_trained > 0:
                strengths.append(f"Successfully trained {models_trained} models.")
                
                best_model = automl_results.get('best_model', {})
                if best_model.get('name'):
                    strengths.append(f"Best model identified: {best_model.get('name')}.")
        
        strengths.append("Complete data pipeline established.")
        strengths.append("Automated analysis workflow in place.")
        
        return strengths
    
    @staticmethod
    def get_weaknesses(quality_score: int,
                      warnings: List[str],
                      automl_results: Dict[str, Any],
                      shap_available: bool) -> List[str]:
        """Generate weaknesses"""
        weaknesses = []
        
        if quality_score < 80:
            weaknesses.append("Data quality could be improved.")
        
        if len(warnings) > 3:
            weaknesses.append(f"{len(warnings)} data quality warnings present.")
        
        # Only mention SHAP if it's actually relevant
        if not shap_available and automl_results.get('models_trained', 0) > 0:
            weaknesses.append("Detailed model explanations not available.")
        
        best_model = automl_results.get('best_model', {})
        score = best_model.get('score', 0)
        if score < 0.7 and score > 0:
            weaknesses.append("Model performance is below desired threshold.")
        elif score == 0:
            weaknesses.append("No model has been trained yet.")
        
        return weaknesses
