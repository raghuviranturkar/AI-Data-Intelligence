"""
Insight Generator Module
Generates business-friendly insights from explanations
"""
from typing import Dict, Any, List


class InsightGenerator:
    """Generates business-friendly insights"""
    
    def __init__(self, feature_names: List[str]):
        """
        Initialize insight generator
        
        Args:
            feature_names: List of feature names
        """
        self.feature_names = feature_names
    
    def generate_confidence_assessment(self, feature_importance: Dict[str, float],
                                      shap_available: bool) -> Dict[str, Any]:
        """
        Generate confidence assessment for explanations
        
        Args:
            feature_importance: Feature importance dictionary
            shap_available: Whether SHAP is available
            
        Returns:
            Confidence assessment
        """
        if not feature_importance:
            return {
                "confidence": "Low",
                "reason": "No feature importance data available"
            }
        
        # Calculate how much the top features explain
        values = list(feature_importance.values())
        if not values:
            return {"confidence": "Low", "reason": "No feature importance data"}
        
        total = sum(values)
        if total == 0:
            return {"confidence": "Low", "reason": "Feature importance sum is zero"}
        
        # Sort and get top 3
        sorted_vals = sorted(values, reverse=True)
        top3_sum = sum(sorted_vals[:3])
        top3_pct = (top3_sum / total) * 100
        
        if top3_pct > 80:
            confidence = "High"
            reason = f"Top 3 features explain {top3_pct:.1f}% of the prediction"
        elif top3_pct > 50:
            confidence = "Medium"
            reason = f"Top 3 features explain {top3_pct:.1f}% of the prediction"
        else:
            confidence = "Low"
            reason = f"Top 3 features explain only {top3_pct:.1f}% of the prediction"
        
        # Adjust for SHAP availability
        if not shap_available:
            confidence = "Medium"
            reason = "SHAP not available - using model feature importance instead"
        
        return {
            "confidence": confidence,
            "reason": reason,
            "shap_available": shap_available,
            "top_features_explained": round(top3_pct, 1)
        }
    
    def generate_feature_impact_summary(self, categories: Dict[str, List[str]]) -> str:
        """
        Generate summary of feature impacts
        
        Args:
            categories: Categorized features
            
        Returns:
            Summary string
        """
        high = categories.get("high", [])
        medium = categories.get("medium", [])
        low = categories.get("low", [])
        
        parts = []
        if high:
            parts.append(f"High impact: {', '.join(high)}")
        if medium:
            parts.append(f"Medium impact: {', '.join(medium)}")
        if low:
            parts.append(f"Low impact: {', '.join(low)}")
        
        return "; ".join(parts) if parts else "No feature impact data available"
    
    def generate_visualization_recommendations(self) -> List[Dict[str, Any]]:
        """
        Generate visualization recommendations
        
        Returns:
            List of visualization recommendations
        """
        return [
            {
                "type": "feature_importance_bar",
                "title": "Feature Importance",
                "description": "Ranked feature importance",
                "available": True
            },
            {
                "type": "feature_categories",
                "title": "Feature Impact Categories",
                "description": "Features categorized by impact level",
                "available": True
            },
            {
                "type": "global_summary",
                "title": "Global Model Summary",
                "description": "Business-friendly model explanation",
                "available": True
            }
        ]
    
    def generate_summary(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Generate complete insight summary
        
        Args:
            results: Results from explainability engine
            
        Returns:
            Complete summary
        """
        feature_importance = results.get("feature_importance", {})
        categories = results.get("categories", {})
        shap_available = results.get("shap_available", False)
        confidence = results.get("confidence", {})
        
        return {
            "features_explained": len(self.feature_names),
            "global_explanations": len(results.get("global_explanation", {}).get("summary", [])),
            "local_explanations": 1 if results.get("local_explanation") else 0,
            "visualizations": len(self.generate_visualization_recommendations()),
            "shap_available": shap_available,
            "top_features": list(feature_importance.keys())[:5] if feature_importance else [],
            "feature_impact_summary": self.generate_feature_impact_summary(categories),
            "confidence": confidence.get("level", "Unknown"),
            "confidence_score": confidence.get("score", 0)
        }
