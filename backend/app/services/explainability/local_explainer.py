"""
Local Explainer Module
Generates business-friendly explanations for individual predictions
"""
from typing import Dict, Any, List


class LocalExplainer:
    """Generates business-friendly local explanations"""
    
    def __init__(self, feature_names: List[str], target_name: str = "target"):
        """
        Initialize local explainer
        
        Args:
            feature_names: List of feature names
            target_name: Name of the target variable
        """
        self.feature_names = feature_names
        self.target_name = target_name
    
    def generate_explanation(self, feature_contributions: List[Dict[str, Any]], 
                           prediction: Any,
                           threshold: float = 0.1) -> Dict[str, Any]:
        """
        Generate business-friendly explanation
        
        Args:
            feature_contributions: List of feature contributions
            prediction: Model prediction
            threshold: Threshold for significant contributions
            
        Returns:
            Business-friendly explanation
        """
        reasons = []
        
        # Get top positive and negative contributions
        positive = [f for f in feature_contributions if f["direction"] == "increase"]
        negative = [f for f in feature_contributions if f["direction"] == "decrease"]
        
        # Generate reasons from top positive features
        for f in positive[:3]:
            if f["contribution"] > threshold:
                reasons.append(
                    f"High {f['feature']} increased the predicted outcome"
                )
        
        # Generate reasons from top negative features
        for f in negative[:3]:
            if f["contribution"] > threshold:
                reasons.append(
                    f"Low {f['feature']} decreased the predicted outcome"
                )
        
        if not reasons:
            reasons.append("No strong factors identified for this prediction")
        
        # Generate summary
        summary = self._generate_summary(positive[:3], negative[:3])
        
        return {
            "prediction": prediction,
            "reasons": reasons,
            "summary": summary,
            "top_contributors": [
                f["feature"] for f in feature_contributions[:3]
            ]
        }
    
    def _generate_summary(self, top_positive: List[Dict], 
                         top_negative: List[Dict]) -> str:
        """Generate a summary explanation"""
        parts = []
        
        if top_positive:
            features = [f["feature"] for f in top_positive[:2]]
            if len(features) == 1:
                parts.append(f"High {features[0]} was the main driver")
            else:
                parts.append(f"High {features[0]} and {features[1]} were key drivers")
        
        if top_negative:
            features = [f["feature"] for f in top_negative[:2]]
            if len(features) == 1:
                parts.append(f"Low {features[0]} reduced the prediction")
            else:
                parts.append(f"Low {features[0]} and {features[1]} reduced the prediction")
        
        if not parts:
            return "No significant factors identified"
        
        return ". ".join(parts) + "."
    
    def generate_business_reason(self, feature: str, direction: str, 
                                  value: float) -> str:
        """
        Generate a business-friendly reason for a feature
        
        Args:
            feature: Feature name
            direction: 'increase' or 'decrease'
            value: Feature value
            
        Returns:
            Business-friendly reason
        """
        if direction == "increase":
            return f"High {feature} increased the prediction"
        else:
            return f"Low {feature} decreased the prediction"
    
    def translate_to_business(self, feature: str, shap_value: float) -> str:
        """
        Translate technical SHAP value to business language
        
        Args:
            feature: Feature name
            shap_value: SHAP value
            
        Returns:
            Business-friendly translation
        """
        if abs(shap_value) < 0.05:
            return f"{feature} had minimal impact on the prediction"
        elif shap_value > 0:
            return f"{feature} strongly increased the predicted outcome"
        else:
            return f"{feature} strongly decreased the predicted outcome"
