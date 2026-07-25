"""
Narrative Generator
Generates human-readable narratives from analysis results
"""
from typing import Dict, Any, List


class NarrativeGenerator:
    """Generates human-readable narratives"""
    
    def __init__(self, context: Dict[str, Any]):
        """
        Initialize narrative generator
        
        Args:
            context: Complete pipeline context
        """
        self.context = context
        
    def generate_executive_summary(self) -> str:
        """Generate executive summary - FIXED to use correct data"""
        parts = []
        
        # Dataset overview - FIXED to read from correct location
        dataset = self.context.get('dataset', {})
        shape = dataset.get('shape', {})
        rows = shape.get('rows', 0)
        cols = shape.get('columns', 0)
        parts.append(f"The dataset contains {rows} rows and {cols} columns.")
        
        # Quality assessment
        validation = self.context.get('validation', {})
        quality = validation.get('quality', {})
        score = quality.get('quality_score', 0)
        
        if score >= 90:
            parts.append("Data quality is excellent with minimal issues.")
        elif score >= 70:
            parts.append("Data quality is good with some minor issues to address.")
        elif score >= 50:
            parts.append("Data quality requires attention. Several issues identified.")
        else:
            parts.append("Data quality needs significant improvement before analysis.")
        
        # Model performance - FIXED to use correct best model
        automl = self.context.get('automl', {})
        best = automl.get('best_model', {})
        
        if best:
            name = best.get('name', 'Unknown')
            score_val = best.get('score', 0)
            
            if score_val >= 0.9:
                performance = "excellent"
            elif score_val >= 0.7:
                performance = "good"
            elif score_val >= 0.5:
                performance = "moderate"
            else:
                performance = "below expectations"
            
            parts.append(f"The {name} model achieved {performance} performance (score: {score_val:.3f}).")
        
        # Key insights
        explainability = self.context.get('explainability', {})
        importance = explainability.get('feature_importance', {})
        
        if importance:
            sorted_importance = sorted(importance.items(), key=lambda x: x[1], reverse=True)
            top_features = sorted_importance[:3]
            
            if top_features:
                feature_names = [f[0] for f in top_features]
                parts.append(f"Key drivers: {', '.join(feature_names)} strongly influence predictions.")
        
        # Recommendation
        insights = self.context.get('insights', {})
        recommendations = insights.get('recommendations', [])
        if recommendations:
            parts.append(f"Recommendations: {recommendations[0]}")
        
        return " ".join(parts)
    
    def generate_full_report(self) -> Dict[str, str]:
        """Generate full narrative report"""
        return {
            "executive_summary": self.generate_executive_summary(),
            "dataset_overview": self._generate_dataset_overview(),
            "quality_section": self._generate_quality_section(),
            "eda_section": self._generate_eda_section(),
            "model_section": self._generate_model_section(),
            "explainability_section": self._generate_explainability_section(),
            "recommendations_section": self._generate_recommendations_section(),
            "conclusion": self._generate_conclusion()
        }
    
    def _generate_dataset_overview(self) -> str:
        """Generate dataset overview - FIXED"""
        dataset = self.context.get('dataset', {})
        shape = dataset.get('shape', {})
        rows = shape.get('rows', 0)
        cols = shape.get('columns', 0)
        
        return f"The dataset consists of {rows} records with {cols} features. " + \
               f"This provides a {'sufficient' if rows > 100 else 'limited'} " + \
               f"amount of data for analysis."
    
    def _generate_quality_section(self) -> str:
        """Generate quality section"""
        validation = self.context.get('validation', {})
        quality = validation.get('quality', {})
        score = quality.get('quality_score', 0)
        warnings = quality.get('warnings', [])
        
        text = f"Data Quality Score: {score}/100. "
        
        if not warnings:
            text += "No warnings detected. Dataset is clean."
        else:
            text += f"{len(warnings)} warnings identified. "
            text += "Review warnings for specific issues."
        
        return text
    
    def _generate_eda_section(self) -> str:
        """Generate EDA section"""
        eda = self.context.get('eda', {})
        overview = eda.get('overview', {})
        
        text = "Exploratory Data Analysis completed. "
        text += f"Found {overview.get('numeric_features', 0)} numeric and "
        text += f"{overview.get('categorical_features', 0)} categorical features. "
        
        return text
    
    def _generate_model_section(self) -> str:
        """Generate model section - FIXED"""
        automl = self.context.get('automl', {})
        best = automl.get('best_model', {})
        models_trained = automl.get('models_trained', 0)
        
        if not best or not best.get('name'):
            return "No models were trained."
        
        text = f"Trained {models_trained} models. "
        text += f"Best model: {best.get('name', 'Unknown')} "
        text += f"(score: {best.get('score', 0):.3f}). "
        
        return text
    
    def _generate_explainability_section(self) -> str:
        """Generate explainability section"""
        explainability = self.context.get('explainability', {})
        importance = explainability.get('feature_importance', {})
        
        if not importance:
            return "Explainability analysis not available."
        
        sorted_importance = sorted(importance.items(), key=lambda x: x[1], reverse=True)
        top = sorted_importance[:3]
        
        text = "Feature importance analysis shows: "
        if top:
            text += f"{', '.join([f[0] for f in top])} are the most influential features."
        
        return text
    
    def _generate_recommendations_section(self) -> str:
        """Generate recommendations section"""
        insights = self.context.get('insights', {})
        recommendations = insights.get('recommendations', [])
        
        if not recommendations:
            return "No specific recommendations at this time."
        
        return "Recommendations: " + " ".join(recommendations[:3])
    
    def _generate_conclusion(self) -> str:
        """Generate conclusion"""
        return "Overall, the dataset is ready for analysis and model deployment " + \
               "with the recommended preprocessing steps."
