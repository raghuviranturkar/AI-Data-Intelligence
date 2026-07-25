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
        """Generate executive summary"""
        parts = []
        
        # Dataset overview
        dataset_summary = self._get_dataset_summary()
        parts.append(dataset_summary)
        
        # Quality assessment
        quality_assessment = self._get_quality_assessment()
        if quality_assessment:
            parts.append(quality_assessment)
        
        # Model performance
        model_summary = self._get_model_summary()
        if model_summary:
            parts.append(model_summary)
        
        # Key insights
        key_insights = self._get_key_insights()
        if key_insights:
            parts.append(key_insights)
        
        # Recommendation
        recommendation = self._get_recommendation()
        if recommendation:
            parts.append(recommendation)
        
        return " ".join(parts)
    
    def _get_dataset_summary(self) -> str:
        """Get dataset summary"""
        dataset = self.context.get('dataset', {})
        shape = dataset.get('shape', {})
        rows = shape.get('rows', 0)
        cols = shape.get('columns', 0)
        
        return f"The dataset contains {rows} rows and {cols} columns."
    
    def _get_quality_assessment(self) -> str:
        """Get quality assessment"""
        validation = self.context.get('validation', {})
        quality = validation.get('quality', {})
        score = quality.get('quality_score', 0)
        
        if score >= 90:
            return "Data quality is excellent with minimal issues."
        elif score >= 70:
            return "Data quality is good with some minor issues to address."
        elif score >= 50:
            return "Data quality requires attention. Several issues identified."
        else:
            return "Data quality needs significant improvement before analysis."
    
    def _get_model_summary(self) -> str:
        """Get model summary"""
        automl = self.context.get('automl', {})
        best = automl.get('best_model', {})
        
        if not best:
            return "Model training not yet performed."
        
        name = best.get('name', 'Unknown')
        score = best.get('score', 0)
        
        if score >= 0.9:
            performance = "excellent"
        elif score >= 0.7:
            performance = "good"
        elif score >= 0.5:
            performance = "moderate"
        else:
            performance = "below expectations"
        
        return f"The {name} model achieved {performance} performance (score: {score:.3f})."
    
    def _get_key_insights(self) -> str:
        """Get key insights"""
        explainability = self.context.get('explainability', {})
        importance = explainability.get('feature_importance', {})
        
        if not importance:
            return "No key insights available."
        
        sorted_importance = sorted(importance.items(), key=lambda x: x[1], reverse=True)
        top_features = sorted_importance[:3]
        
        if top_features:
            feature_names = [f[0] for f in top_features]
            return f"Key drivers: {', '.join(feature_names)} strongly influence predictions."
        
        return "Feature importance analysis not available."
    
    def _get_recommendation(self) -> str:
        """Get recommendation"""
        recommendations = self._get_recommendations()
        
        if not recommendations:
            return "Continue monitoring and improving the dataset."
        
        return f"Recommendations: {recommendations[0]}"
    
    def _get_recommendations(self) -> List[str]:
        """Get recommendations from context"""
        insights = self.context.get('insights', {})
        return insights.get('recommendations', [])
    
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
        """Generate dataset overview"""
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
        """Generate model section"""
        automl = self.context.get('automl', {})
        best = automl.get('best_model', {})
        models_trained = automl.get('models_trained', 0)
        
        if not best:
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
