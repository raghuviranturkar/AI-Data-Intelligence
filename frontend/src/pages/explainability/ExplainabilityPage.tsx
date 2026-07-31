import React, { useState } from 'react'
import { useData } from '../../context/DataContext'
import { 
  Loader2, AlertTriangle, Shield, Brain, Sparkles, 
  RefreshCw, Eye, BarChart3, ChevronDown, ChevronRight
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import Card from '../../components/common/Card'

// Import sub-components
import ExplainabilityHeader from './ExplainabilityHeader'
import ExplainabilityOverview from './ExplainabilityOverview'
import ExplainabilityPipeline from './ExplainabilityPipeline'
import FeatureImportanceChart from './FeatureImportanceChart'
import FeatureImportanceTable from './FeatureImportanceTable'
import FeatureCategories from './FeatureCategories'
import GlobalExplanation from './GlobalExplanation'
import LocalExplanation from './LocalExplanation'
import DecisionBreakdown from './DecisionBreakdown'
import SHAPVisualizations from './SHAPVisualizations'
import AIExplanation from './AIExplanation'
import ExplanationConfidence from './ExplanationConfidence'
import ExplainabilityInsights from './ExplainabilityInsights'
import ResponsibleAIPanel from './ResponsibleAIPanel'
import TechnicalDetails from './TechnicalDetails'
import FeatureContributionCards from './FeatureContributionCards'

const ExplainabilityPage: React.FC = () => {
  const { data, isLoading, error } = useData()
  const [technicalExpanded, setTechnicalExpanded] = useState(false)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading explainability results...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertTriangle className="h-12 w-12 text-danger-500" />
        <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Failed to load data</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Shield className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">No Explainability Data</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
          Upload a dataset and train a model to explore explainability insights.
        </p>
        <Button variant="primary" size="lg" className="mt-6" onClick={() => window.location.href = '/upload'}>
          Upload Dataset
        </Button>
      </div>
    )
  }

  const explainability = data?.explainability || {}
  const automl = data?.automl || {}
  const bestModel = automl?.best_model || {}
  const shapAvailable = explainability?.shap_available || false
  const featureRanking = explainability?.feature_ranking || []
  const featureImportance = explainability?.feature_importance || {}
  const globalExplanation = explainability?.global_explanation || {}
  const localExplanation = explainability?.local_explanation || {}
  const insights = explainability?.insights || {}

  const hasExplainability = featureRanking.length > 0 || Object.keys(featureImportance).length > 0

  if (!hasExplainability) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Shield className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">No Explainability Available</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
          Model explainability results are not available for this dataset.
        </p>
        <Button variant="primary" size="lg" className="mt-6" onClick={() => window.location.href = '/upload'}>
          Upload Dataset
        </Button>
      </div>
    )
  }

  const mostImportantFeature = featureRanking.length > 0 ? featureRanking[0]?.feature : 'N/A'

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <ExplainabilityHeader 
        shapAvailable={shapAvailable}
        featureCount={featureRanking.length}
        mostImportantFeature={mostImportantFeature}
        method={shapAvailable ? 'SHAP' : 'Model Importance'}
        modelName={bestModel?.name || 'N/A'}
      />

      {/* Overview Cards */}
      <ExplainabilityOverview 
        shapAvailable={shapAvailable}
        featureCount={featureRanking.length}
        mostImportantFeature={mostImportantFeature}
        method={shapAvailable ? 'SHAP' : 'Model Importance'}
        modelName={bestModel?.name || 'N/A'}
        confidence={explainability?.confidence?.level || 'Medium'}
      />

      {/* Pipeline */}
      <ExplainabilityPipeline shapAvailable={shapAvailable} />

      {/* Feature Importance Chart */}
      <FeatureImportanceChart featureRanking={featureRanking} />

      {/* Feature Importance Table */}
      <FeatureImportanceTable featureRanking={featureRanking} />

      {/* Feature Categories */}
      <FeatureCategories featureRanking={featureRanking} />

      {/* Global Explanation */}
      <GlobalExplanation globalExplanation={globalExplanation} />

      {/* Local Explanation */}
      <LocalExplanation localExplanation={localExplanation} />

      {/* Decision Breakdown */}
      <DecisionBreakdown localExplanation={localExplanation} />

      {/* Feature Contribution Cards */}
      <FeatureContributionCards localExplanation={localExplanation} />

      {/* SHAP Visualizations */}
      <SHAPVisualizations shapAvailable={shapAvailable} />

      {/* AI Explanation */}
      <AIExplanation localExplanation={localExplanation} />

      {/* Explanation Confidence */}
      <ExplanationConfidence confidence={explainability?.confidence || { level: 'Medium', score: 70, reason: 'SHAP not available - using model feature importance instead' }} />

      {/* Explainability Insights */}
      <ExplainabilityInsights insights={insights} />

      {/* Responsible AI Panel */}
      <ResponsibleAIPanel shapAvailable={shapAvailable} />

      {/* Technical Details */}
      <TechnicalDetails 
        shapAvailable={shapAvailable}
        method={shapAvailable ? 'SHAP' : 'Model Importance'}
        modelName={bestModel?.name || 'N/A'}
        featureCount={featureRanking.length}
        generatedAt={new Date().toISOString()}
        expanded={technicalExpanded}
        onToggle={() => setTechnicalExpanded(!technicalExpanded)}
      />
    </div>
  )
}

export default ExplainabilityPage
