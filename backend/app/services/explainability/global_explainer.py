"""
Global Explainer Module
Generates business-friendly global explanations
"""
from typing import Dict, Any, List


class GlobalExplainer:
    """Generates business-friendly global explanations"""
    
    def __init__(self, feature_ranking: List[Dict[str, Any]]):
        """
        Initialize global explainer
        
        Args:
            feature_ranking: Ranked feature importance
        """
        self.feature_ranking = feature_ranking
    
    def generate_summary(self, top_n: int = 5) -> List[str]:
        """
        Generate global explanation summary
        
        Args:
            top_n: Number of top features to include
            
        Returns:
            List of summary statements
        """
        summary = []
        
        if not self.feature_ranking:
            return ["No feature importance data available"]
        
        # Top features
        top_features = self.feature_ranking[:top_n]
        
        if top_features:
            feature_names = [f["feature"] for f in top_features]
            summary.append(
                f"The most influential features are: {', '.join(feature_names[:3])}"
            )
        
        # Feature with highest importance
        if top_features:
            top = top_features[0]
            summary.append(
                f"'{top['feature']}' is the most important feature "
                f"({top['percentage']:.1f}% impact)"
            )
        
        # Second highest
        if len(top_features) > 1:
            second = top_features[1]
            summary.append(
                f"'{second['feature']}' is the second most important feature "
                f"({second['percentage']:.1f}% impact)"
            )
        
        return summary
    
    def get_insights(self, categories: Dict[str, List[str]]) -> List[str]:
        """
        Generate insights from feature categories
        
        Args:
            categories: Categorized features
            
        Returns:
            List of insights
        """
        insights = []
        
        high_features = categories.get("high", [])
        if high_features:
            insights.append(
                f"Key drivers: {', '.join(high_features[:3])} "
                f"have the strongest influence on predictions"
            )
        
        low_features = categories.get("low", [])
        if low_features:
            if len(low_features) > 3:
                insights.append(
                    f"Many features ({len(low_features)}) have minimal impact "
                    "and could potentially be removed"
                )
            else:
                insights.append(
                    f"Low impact features: {', '.join(low_features)}"
                )
        
        return insights
    
    def generate_visualization_summary(self) -> Dict[str, Any]:
        """
        Generate summary for visualizations
        
        Returns:
            Visualization summary
        """
        if not self.feature_ranking:
            return {}
        
        return {
            "top_features": self.feature_ranking[:5],
            "feature_count": len(self.feature_ranking),
            "top_feature": self.feature_ranking[0]["feature"] if self.feature_ranking else None,
            "top_importance": self.feature_ranking[0]["importance"] if self.feature_ranking else None
        }
