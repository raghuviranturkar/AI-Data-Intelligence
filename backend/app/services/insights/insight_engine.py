"""
AI Insight Engine
Converts analysis results into business-friendly intelligence
"""
from typing import Dict, Any, List
from .business_rules import BusinessRules
from .recommendation_engine import RecommendationEngine
from .narrative_generator import NarrativeGenerator
from .report_generator import ReportGenerator


class AIInsightEngine:
    """
    AI Insight Engine that converts analysis into business intelligence
    """
    
    def __init__(self, context: Dict[str, Any]):
        """
        Initialize insight engine
        
        Args:
            context: Complete pipeline context
        """
        self.context = context
        self.business_rules = BusinessRules()
        self.recommendation_engine = RecommendationEngine(context)
        self.narrative_generator = NarrativeGenerator(context)
        self.report_generator = ReportGenerator(context)
        self.results = {}
        
    def run(self) -> Dict[str, Any]:
        """
        Run the complete insight generation pipeline
        
        Returns:
            Complete insight results
        """
        print("💡 Starting AI Insight Engine...")
        
        # Step 1: Extract data from context
        print("📊 Extracting data from pipeline...")
        self._extract_data()
        
        # Step 2: Generate quality insights
        print("📊 Generating quality insights...")
        quality_insights = self._generate_quality_insights()
        
        # Step 3: Generate EDA insights
        print("📊 Generating EDA insights...")
        eda_insights = self._generate_eda_insights()
        
        # Step 4: Generate model insights
        print("📊 Generating model insights...")
        model_insights = self._generate_model_insights()
        
        # Step 5: Generate explainability insights
        print("📊 Generating explainability insights...")
        explainability_insights = self._generate_explainability_insights()
        
        # Step 6: Generate strengths and weaknesses
        print("📊 Generating strengths and weaknesses...")
        strengths, weaknesses = self._generate_strengths_weaknesses()
        
        # Step 7: Generate risks
        print("📊 Generating risks...")
        risks = self._generate_risks()
        
        # Step 8: Generate recommendations
        print("📊 Generating recommendations...")
        recommendations = self.recommendation_engine.generate_recommendations()
        next_steps = self.recommendation_engine.get_next_steps()
        
        # Step 9: Calculate AI health score
        print("📊 Calculating AI health score...")
        ai_health_score = self._calculate_ai_health_score()
        
        # Step 10: Generate executive summary
        print("📊 Generating executive summary...")
        executive_summary = self.narrative_generator.generate_executive_summary()
        
        # Step 11: Generate full report
        print("📊 Generating full report...")
        full_report = self.report_generator.generate_structured_report()
        
        # Compile results
        self.results = {
            "dataset_summary": self._get_dataset_summary(),
            "quality_insights": quality_insights,
            "eda_insights": eda_insights,
            "model_insights": model_insights,
            "explainability_insights": explainability_insights,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "risks": risks,
            "recommendations": recommendations,
            "next_steps": next_steps,
            "ai_health_score": ai_health_score,
            "executive_summary": executive_summary,
            "full_report": full_report
        }
        
        # Categorize insights
        self.results["insights"] = {
            "quality": quality_insights,
            "eda": eda_insights,
            "model": model_insights,
            "business": recommendations,
            "risk": risks
        }
        
        print("✅ AI Insight Engine complete!")
        return self.results
    
    def _extract_data(self):
        """Extract data from context"""
        self.dataset = self.context.get('dataset', {})
        self.validation = self.context.get('validation', {})
        self.eda = self.context.get('eda', {})
        self.automl = self.context.get('automl', {})
        self.explainability = self.context.get('explainability', {})
        self.quality = self.validation.get('quality', {})
        self.warnings = self.quality.get('warnings', [])
        self.quality_score = self.quality.get('quality_score', 50)
    
    def _generate_quality_insights(self) -> List[str]:
        """Generate quality insights"""
        return self.business_rules.get_quality_insight(
            self.quality_score, self.warnings
        )
    
    def _generate_eda_insights(self) -> List[str]:
        """Generate EDA insights"""
        return self.business_rules.get_eda_insight(self.eda)
    
    def _generate_model_insights(self) -> List[str]:
        """Generate model insights"""
        return self.business_rules.get_model_insight(self.automl)
    
    def _generate_explainability_insights(self) -> List[str]:
        """Generate explainability insights"""
        return self.business_rules.get_explainability_insight(self.explainability)
    
    def _generate_strengths_weaknesses(self) -> tuple:
        """Generate strengths and weaknesses"""
        shap_available = self.explainability.get('shap_available', False)
        
        strengths = self.business_rules.get_strengths(
            self.quality_score, self.automl
        )
        
        weaknesses = self.business_rules.get_weaknesses(
            self.quality_score, self.warnings, self.automl, shap_available
        )
        
        return strengths, weaknesses
    
    def _generate_risks(self) -> List[str]:
        """Generate risks"""
        return self.business_rules.get_risk_insights(
            self.quality_score, self.warnings, self.automl
        )
    
    def _calculate_ai_health_score(self) -> Dict[str, Any]:
        """
        Calculate overall AI health score (0-100)
        Combines quality, ML readiness, model score, and explainability
        """
        # Start with quality score
        score = self.quality_score * 0.3
        
        # Add ML readiness
        readiness = self.validation.get('validation', {}).get('readiness', {})
        if isinstance(readiness, dict):
            readiness_score = readiness.get('confidence', 0)
        else:
            readiness_score = 80 if readiness else 50
        score += readiness_score * 0.2
        
        # Add model performance
        best_model = self.automl.get('best_model', {})
        model_score = best_model.get('score', 0) * 100
        score += model_score * 0.3
        
        # Add explainability
        shap_available = self.explainability.get('shap_available', False)
        explainability_score = 90 if shap_available else 60
        score += explainability_score * 0.2
        
        # Determine confidence level
        confidence = "High" if score >= 80 else "Medium" if score >= 50 else "Low"
        
        return {
            "score": round(score, 1),
            "confidence": confidence,
            "components": {
                "quality": self.quality_score,
                "readiness": readiness_score,
                "model": round(model_score, 1),
                "explainability": explainability_score
            }
        }
    
    def _get_dataset_summary(self) -> Dict[str, Any]:
        """Get dataset summary"""
        shape = self.dataset.get('shape', {})
        return {
            "rows": shape.get('rows', 0),
            "columns": shape.get('columns', 0),
            "quality_score": self.quality_score,
            "ml_readiness": self.automl.get('models_trained', 0) > 0
        }


def generate_insights(context: Dict[str, Any]) -> Dict[str, Any]:
    """
    Convenience function to generate insights
    
    Args:
        context: Complete pipeline context
        
    Returns:
        Complete insight results
    """
    engine = AIInsightEngine(context)
    return engine.run()
