"""
Model Ranker for AutoML
Ranks models based on performance metrics
"""
from typing import Dict, Any, List, Optional


class ModelRanker:
    """Ranks models based on performance"""
    
    def __init__(self, primary_metric: Optional[str] = None):
        """
        Initialize ranker
        
        Args:
            primary_metric: Primary metric for ranking
        """
        self.primary_metric = primary_metric
    
    def rank_models(self, model_results: List[Dict[str, Any]], 
                   problem_type: str) -> List[Dict[str, Any]]:
        """
        Rank models based on performance
        
        Args:
            model_results: List of model evaluation results
            problem_type: Type of ML problem
            
        Returns:
            Ranked list of models
        """
        # Determine primary metric
        metric = self._get_primary_metric(problem_type)
        
        # Extract scores
        scored_models = []
        for result in model_results:
            if "error" in result:
                continue
                
            metrics = result.get("evaluation", {}).get("metrics", {})
            score = metrics.get(metric, 0)
            
            # Get CV score if available
            cv_score = result.get("cv_results", {}).get("mean", 0)
            
            scored_models.append({
                "model_name": result["model_name"],
                "score": score,
                "cv_score": cv_score,
                "training_time": result.get("training_time", 0),
                "metrics": metrics,
                "result": result
            })
        
        # Sort by score (descending)
        scored_models.sort(key=lambda x: x["score"], reverse=True)
        
        # Add ranks
        ranked_models = []
        for rank, model in enumerate(scored_models, 1):
            ranked_models.append({
                "rank": rank,
                "model_name": model["model_name"],
                "score": model["score"],
                "cv_score": model["cv_score"],
                "training_time": model["training_time"],
                "metrics": model["metrics"]
            })
        
        return ranked_models
    
    def select_best_model(self, ranked_models: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Select the best model from ranked list
        
        Args:
            ranked_models: Ranked list of models
            
        Returns:
            Best model information
        """
        if not ranked_models:
            return {"error": "No models available"}
        
        best = ranked_models[0]
        
        # Generate explanation
        explanation = self._generate_explanation(best, ranked_models)
        
        return {
            "name": best["model_name"],
            "score": best["score"],
            "cv_score": best["cv_score"],
            "training_time": best["training_time"],
            "metrics": best["metrics"],
            "reason": explanation
        }
    
    def _get_primary_metric(self, problem_type: str) -> str:
        """Get primary metric for problem type"""
        if problem_type == "regression":
            return "r2"
        else:  # Classification
            return "f1"  # Use F1 as primary metric
    
    def _generate_explanation(self, best: Dict[str, Any], 
                            all_models: List[Dict[str, Any]]) -> str:
        """Generate explanation for why the best model was selected"""
        explanation = f"Selected '{best['model_name']}' as the best model"
        
        # Add score explanation
        if best['score'] > 0.9:
            explanation += f" with excellent performance (score: {best['score']:.3f})"
        elif best['score'] > 0.7:
            explanation += f" with good performance (score: {best['score']:.3f})"
        else:
            explanation += f" with moderate performance (score: {best['score']:.3f})"
        
        # Add CV explanation
        if best['cv_score'] > 0.8:
            explanation += f" and stable cross-validation performance ({best['cv_score']:.3f})"
        
        # Compare with second best
        if len(all_models) > 1:
            second = all_models[1]
            diff = best['score'] - second['score']
            if diff > 0.05:
                explanation += f", significantly outperforming the second-best model by {diff:.3f} points"
            elif diff > 0.01:
                explanation += f", slightly outperforming the second-best model by {diff:.3f} points"
        
        return explanation
