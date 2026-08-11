from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import Optional, Dict, Any
from app.database import get_db
from app.auth.dependencies import get_current_user
from app.auth.models import User

router = APIRouter(prefix="/assistant", tags=["assistant"])

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

# In-memory context store for user datasets
user_context: Dict[int, Dict[str, Any]] = {}

def get_dataset_context(user_id: int) -> Optional[Dict[str, Any]]:
    """Retrieve the dataset context for a user"""
    return user_context.get(user_id)

def set_dataset_context(user_id: int, context: Dict[str, Any]) -> None:
    """Store the dataset context for a user"""
    user_context[user_id] = context
    print(f"📊 Context stored for user {user_id}")

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Process a chat message with the dataset context"""
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    # Get context for the authenticated user
    context = get_dataset_context(current_user.id)
    
    if not context:
        return ChatResponse(
            response="I don't have access to any dataset. Please upload a dataset first using the Upload page, then I'll be able to answer questions about your data."
        )
    
    response = generate_response(request.message, context)
    return ChatResponse(response=response)

def generate_response(message: str, context: Dict[str, Any]) -> str:
    """Generate a response based on the message and context."""
    message_lower = message.lower()
    
    dataset = context.get('dataset', {})
    validation = context.get('validation', {})
    automl = context.get('automl', {})
    insights = context.get('insights', {})
    explainability = context.get('explainability', {})
    
    shape = dataset.get('shape', {})
    rows = shape.get('rows', 0)
    cols = shape.get('columns', 0)
    
    quality = validation.get('quality', {})
    quality_score = quality.get('quality_score', 0)
    warnings = quality.get('warnings', [])
    
    best_model = automl.get('best_model', {})
    best_model_name = best_model.get('name', 'N/A')
    best_model_score = best_model.get('score', 0)
    models_trained = automl.get('models_trained', 0)
    
    health = insights.get('ai_health_score', {})
    health_score = health.get('score', 0)
    health_confidence = health.get('confidence', 'Unknown')
    
    recommendations = insights.get('recommendations', [])
    strengths = insights.get('strengths', [])
    weaknesses = insights.get('weaknesses', [])
    risks = insights.get('risks', [])
    executive_summary = insights.get('executive_summary', '')
    
    # Quality questions
    if 'quality' in message_lower or 'score' in message_lower:
        return f"""📊 **Dataset Quality**

Your dataset has a quality score of **{quality_score}/100**.

{quality_score >= 80 and 'This is an excellent score, indicating high data quality.' or quality_score >= 60 and 'This is a good score, indicating acceptable data quality.' or 'This score indicates that data quality needs improvement.'}

{warnings and f'⚠️ {len(warnings)} warnings were detected during validation.' or '✅ No warnings were detected.'}

**Recommendation:** {quality_score >= 80 and 'Your dataset is ready for analysis and model training.' or quality_score >= 60 and 'Consider addressing the warnings to improve data quality.' or 'Focus on improving data quality before proceeding with analysis.'}"""

    # Model questions
    if 'model' in message_lower or 'best' in message_lower or 'performed' in message_lower:
        return f"""🤖 **Best Performing Model**

The best performing model is **{best_model_name}** with a score of **{best_model_score:.3f}**.

**Training Summary:**
- {models_trained} models were trained and evaluated.
- {best_model_name} was selected as the best performing model.
- CV Score: {best_model.get('cv_score', 0):.3f}

**Why this model?** {best_model.get('reason', 'Selected based on overall performance metrics.')}

📌 *For detailed model comparison, visit the Models page.*"""

    # Feature importance questions
    if 'feature' in message_lower or 'important' in message_lower:
        ranking = explainability.get('feature_ranking', [])
        if ranking:
            top_features = ranking[:3]
            feature_list = '\n'.join([f"  • **{f['feature']}**: {f['percentage']:.1f}% impact" for f in top_features])
            return f"""🔍 **Most Important Features**

The top features influencing model predictions are:

{feature_list}

**Explanation:** These features have the strongest impact on model decisions.

📌 *For detailed feature importance analysis, visit the Explainability page.*"""
        else:
            return """📊 **Feature Importance**

No feature importance data is currently available. This could be because the model hasn't been trained or explainability analysis hasn't been completed.

📌 *Run the analysis pipeline to generate feature importance insights.*"""

    # Risks questions
    if 'risk' in message_lower or 'problem' in message_lower:
        if risks:
            risk_list = '\n'.join([f"  • {r}" for r in risks[:3]])
            return f"""⚠️ **Risks Identified**

The following risks were detected in your dataset:

{risk_list}

**Priority:** {len(risks) > 3 and 'Multiple risks require attention.' or 'Address the identified risks to improve outcomes.'}

📌 *Visit the AI Insights page for detailed risk analysis.*"""
        else:
            return """✅ **No Significant Risks Detected**

Your dataset appears to be well-structured with minimal risks identified during analysis.

📌 *Continue monitoring model performance as you scale.*"""

    # Recommendations questions
    if 'recommend' in message_lower or 'improve' in message_lower:
        if recommendations:
            rec_list = '\n'.join([f"  • {r}" for r in recommendations[:3]])
            return f"""🎯 **Recommendations**

Based on the analysis, here are the key recommendations:

{rec_list}

**Next Steps:** {insights.get('next_steps', ['Continue monitoring model performance', 'Retrain periodically'])[0]}

📌 *Visit the AI Insights page for a complete set of recommendations.*"""
        else:
            return """📋 **No Specific Recommendations**

No actionable recommendations were generated during the analysis.

**General Advice:**
- Continue monitoring model performance
- Ensure data quality remains high
- Consider periodic retraining with new data"""

    # Dataset overview questions
    if 'dataset' in message_lower or 'overview' in message_lower or 'about' in message_lower:
        return f"""📁 **Dataset Overview**

**{dataset.get('file_name', 'Unknown')}**
- Rows: {rows:,}
- Columns: {cols}
- Quality Score: {quality_score}/100
- AI Health Score: {health_score}/100 ({health_confidence} confidence)

**Summary:**
{executive_summary or 'No executive summary available.'}

📌 *Visit the Analysis page for comprehensive dataset exploration.*"""

    # General help
    return """💡 **I can help you with:**

• Dataset quality and overview
• Model performance and selection
• Feature importance and explainability
• Risks and recommendations
• Improving your model

**Try asking:**
• "What is the quality of my dataset?"
• "Which model performed best?"
• "What are the most important features?"
• "What are the biggest risks?"
• "How can I improve my model?"

*I analyze your dataset's context to provide accurate answers.*"""
