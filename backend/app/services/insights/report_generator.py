"""
Report Generator
Generates structured reports from insights
"""
from typing import Dict, Any, List
from .narrative_generator import NarrativeGenerator


class ReportGenerator:
    """Generates structured reports"""
    
    def __init__(self, context: Dict[str, Any]):
        """
        Initialize report generator
        
        Args:
            context: Complete pipeline context
        """
        self.context = context
        self.narrative_generator = NarrativeGenerator(context)
    
    def generate_structured_report(self) -> Dict[str, Any]:
        """
        Generate structured report with all sections
        
        Returns:
            Complete structured report
        """
        return {
            "metadata": self._generate_metadata(),
            "overview": self._generate_overview(),
            "quality": self._generate_quality_section(),
            "eda": self._generate_eda_section(),
            "model": self._generate_model_section(),
            "explainability": self._generate_explainability_section(),
            "insights": self._generate_insights_section(),
            "narrative": self.narrative_generator.generate_full_report(),
            "summary": self._generate_summary()
        }
    
    def _generate_metadata(self) -> Dict[str, Any]:
        """Generate report metadata"""
        return {
            "report_version": "1.0",
            "generated_at": "timestamp",
            "dataset_name": self.context.get('file_name', 'unknown'),
            "analysis_complete": True
        }
    
    def _generate_overview(self) -> Dict[str, Any]:
        """Generate overview section"""
        dataset = self.context.get('dataset', {})
        shape = dataset.get('shape', {})
        
        return {
            "rows": shape.get('rows', 0),
            "columns": shape.get('columns', 0),
            "numeric_features": len(dataset.get('numeric_columns', [])),
            "categorical_features": len(dataset.get('categorical_columns', [])),
            "duplicate_rows": dataset.get('duplicate_rows', 0)
        }
    
    def _generate_quality_section(self) -> Dict[str, Any]:
        """Generate quality section"""
        validation = self.context.get('validation', {})
        quality = validation.get('quality', {})
        
        return {
            "quality_score": quality.get('quality_score', 0),
            "warnings": quality.get('warnings', []),
            "warnings_count": quality.get('total_warnings', 0),
            "ready_for_analysis": validation.get('validation', {}).get('readiness', False)
        }
    
    def _generate_eda_section(self) -> Dict[str, Any]:
        """Generate EDA section"""
        eda = self.context.get('eda', {})
        overview = eda.get('overview', {})
        
        return {
            "numeric_features": overview.get('numeric_features', 0),
            "categorical_features": overview.get('categorical_features', 0),
            "target_column": overview.get('target_column', None),
            "insights": eda.get('insights', {}).get('insights', [])
        }
    
    def _generate_model_section(self) -> Dict[str, Any]:
        """Generate model section"""
        automl = self.context.get('automl', {})
        best = automl.get('best_model', {})
        
        return {
            "models_trained": automl.get('models_trained', 0),
            "best_model": {
                "name": best.get('name', 'Unknown'),
                "score": best.get('score', 0),
                "cv_score": best.get('cv_score', 0),
                "reason": best.get('reason', '')
            },
            "ranked_models": automl.get('ranked_models', [])
        }
    
    def _generate_explainability_section(self) -> Dict[str, Any]:
        """Generate explainability section"""
        explainability = self.context.get('explainability', {})
        
        return {
            "shap_available": explainability.get('shap_available', False),
            "feature_importance": explainability.get('feature_importance', {}),
            "feature_ranking": explainability.get('feature_ranking', []),
            "categories": explainability.get('categories', {}),
            "global_explanation": explainability.get('global_explanation', {})
        }
    
    def _generate_insights_section(self) -> Dict[str, Any]:
        """Generate insights section"""
        insights = self.context.get('insights', {})
        
        return {
            "quality_insights": insights.get('quality_insights', []),
            "eda_insights": insights.get('eda_insights', []),
            "model_insights": insights.get('model_insights', []),
            "explainability_insights": insights.get('explainability_insights', []),
            "strengths": insights.get('strengths', []),
            "weaknesses": insights.get('weaknesses', []),
            "risks": insights.get('risks', []),
            "recommendations": insights.get('recommendations', [])
        }
    
    def _generate_summary(self) -> Dict[str, Any]:
        """Generate summary"""
        quality = self.context.get('validation', {}).get('quality', {})
        automl = self.context.get('automl', {})
        explainability = self.context.get('explainability', {})
        
        return {
            "quality_score": quality.get('quality_score', 0),
            "models_trained": automl.get('models_trained', 0),
            "best_model": automl.get('best_model', {}).get('name', 'Unknown'),
            "shap_available": explainability.get('shap_available', False)
        }
