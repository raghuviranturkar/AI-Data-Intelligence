import React from 'react'
import { useData } from '../../context/DataContext'
import { useNavigate } from 'react-router-dom'
import { 
  Loader2, 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  TrendingDown,
  Brain,
  Shield,
  CheckCircle,
  ArrowRight,
  Target,
  Award,
  Activity,
  FileText,
  Sparkles,
  BarChart3,
  Settings,
  GitBranch,
  Zap
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import Card from '../../components/common/Card'

// Import sub-components
import AIHealthScore from './AIHealthScore'
import AIExecutiveSummary from './AIExecutiveSummary'
import DataQualityInsights from './DataQualityInsights'
import EDAInsights from './EDAInsights'
import ModelInsights from './ModelInsights'
import ExplainabilityInsights from './ExplainabilityInsights'
import StrengthsWeaknessesRisks from './StrengthsWeaknessesRisks'
import RecommendationsNextSteps from './RecommendationsNextSteps'

const AIInsightsPage: React.FC = () => {
  const { data, isLoading, error } = useData()
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Generating AI insights...</p>
        <div className="mt-2 text-sm text-gray-400 dark:text-gray-500 space-y-1">
          <p>Analyzing dataset</p>
          <p>Analyzing quality</p>
          <p>Analyzing EDA</p>
          <p>Analyzing models</p>
          <p>Analyzing explainability</p>
          <p>Preparing recommendations</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="h-12 w-12 text-danger-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Unable to load AI insights</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Sparkles className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">No dataset analyzed yet</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
          Upload a dataset to generate AI insights.
        </p>
        <Button variant="primary" size="lg" className="mt-6" onClick={() => navigate('/upload')}>
          Upload Dataset
        </Button>
      </div>
    )
  }

  // Extract insights data
  const insights = data?.insights || {}
  const dataset = data?.dataset || {}
  const validation = data?.validation || {}
  const automl = data?.automl || {}
  const explainability = data?.explainability || {}
  const healthScore = insights?.ai_health_score?.score || 0
  const healthConfidence = insights?.ai_health_score?.confidence || 'Medium'

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
            <Sparkles className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Insights</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              What the system understands about your dataset, models, and what you should do next
            </p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge variant="info" size="sm">
            <FileText className="h-3 w-3 inline mr-1" />
            {dataset?.file_name || 'Unknown dataset'}
          </Badge>
          <Badge variant="info" size="sm">
            <Activity className="h-3 w-3 inline mr-1" />
            {dataset?.shape?.rows || 0} rows
          </Badge>
          <Badge variant="info" size="sm">
            <BarChart3 className="h-3 w-3 inline mr-1" />
            {dataset?.shape?.columns || 0} columns
          </Badge>
        </div>
      </div>

      {/* AI Health Score */}
      <AIHealthScore 
        score={healthScore}
        confidence={healthConfidence}
        datasetName={dataset?.file_name || 'Unknown'}
      />

      {/* Executive Summary */}
      <AIExecutiveSummary summary={insights?.executive_summary || ''} />

      {/* Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataQualityInsights 
          qualityScore={validation?.quality?.quality_score || 0}
          warnings={validation?.quality?.warnings || []}
          totalWarnings={validation?.quality?.total_warnings || 0}
        />
        <EDAInsights insights={insights?.eda_insights || []} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ModelInsights 
          bestModel={automl?.best_model?.name || 'N/A'}
          modelsTrained={automl?.models_trained || 0}
          modelScore={automl?.best_model?.score || 0}
          modelInsights={insights?.model_insights || []}
          onNavigate={() => navigate('/models')}
        />
        <ExplainabilityInsights 
          shapAvailable={explainability?.shap_available || false}
          explainabilityInsights={insights?.explainability_insights || []}
          onNavigate={() => navigate('/explainability')}
        />
      </div>

      {/* Strengths, Weaknesses & Risks */}
      <StrengthsWeaknessesRisks 
        strengths={insights?.strengths || []}
        weaknesses={insights?.weaknesses || []}
        risks={insights?.risks || []}
      />

      {/* Recommendations & Next Steps */}
      <RecommendationsNextSteps 
        recommendations={insights?.recommendations || []}
        nextSteps={insights?.next_steps || []}
      />
    </div>
  )
}

export default AIInsightsPage
