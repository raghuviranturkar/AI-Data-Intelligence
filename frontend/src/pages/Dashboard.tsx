import React from 'react'
import { 
  Award, 
  Activity, 
  Brain,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  Shield,
  Lightbulb,
  Loader2,
  Database
} from 'lucide-react'
import Card from '../components/common/Card'
import MetricCard from '../components/cards/MetricCard'
import InsightCard from '../components/cards/InsightCard'
import HorizontalPipeline from '../components/pipeline/HorizontalPipeline'
import { Button } from '../components/common/Button'
import { FeatureImportanceChart, ModelComparisonChart } from '../components/charts'
import { useData } from '../context/DataContext'
import EmptyState from '../components/common/EmptyState'

const sampleStages = [
  { id: 'upload', label: 'Upload', icon: <Database className="h-6 w-6" />, status: 'completed' as const },
  { id: 'validation', label: 'Validation', icon: <CheckCircle className="h-6 w-6" />, status: 'completed' as const },
  { id: 'cleaning', label: 'Cleaning', icon: <Activity className="h-6 w-6" />, status: 'completed' as const },
  { id: 'eda', label: 'EDA', icon: <TrendingUp className="h-6 w-6" />, status: 'completed' as const },
  { id: 'feature_engineering', label: 'Feature Eng.', icon: <Brain className="h-6 w-6" />, status: 'completed' as const },
  { id: 'automl', label: 'AutoML', icon: <Brain className="h-6 w-6" />, status: 'completed' as const },
  { id: 'explainability', label: 'Explainability', icon: <Shield className="h-6 w-6" />, status: 'completed' as const },
  { id: 'insights', label: 'AI Insights', icon: <Lightbulb className="h-6 w-6" />, status: 'completed' as const },
  { id: 'reports', label: 'Reports', icon: <FileText className="h-6 w-6" />, status: 'waiting' as const },
]

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useData()

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading analysis results...</p>
      </div>
    )
  }

  // Error state
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

  // Empty state - No icon, just clean text
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">No Dataset Uploaded</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
          Upload a dataset to start your analysis journey and unlock AI-powered insights.
        </p>
        <Button variant="primary" size="lg" className="mt-6" onClick={() => window.location.href = '/upload'}>
          Upload Dataset
        </Button>
      </div>
    )
  }

  // Extract data from the pipeline result
  const dataset = data?.dataset || {}
  const validation = data?.validation || { quality: { quality_score: 0, warnings: [], total_warnings: 0 } }
  const automl = data?.automl || { best_model: { name: 'N/A', score: 0, cv_score: 0, reason: '' }, models_trained: 0, ranked_models: [] }
  const insights = data?.insights || { 
    ai_health_score: { score: 0, confidence: 'N/A' }, 
    executive_summary: '', 
    recommendations: [], 
    strengths: [], 
    weaknesses: [], 
    risks: [] 
  }
  const explainability = data?.explainability || { feature_importance: {}, feature_ranking: [] }

  const qualityScore = validation?.quality?.quality_score || 0
  const healthScore = insights?.ai_health_score?.score || 0
  const healthConfidence = insights?.ai_health_score?.confidence || 'N/A'
  const bestModel = automl?.best_model?.name || 'N/A'
  const modelsTrained = automl?.models_trained || 0
  const rows = dataset?.shape?.rows || 0
  const columns = dataset?.shape?.columns || 0
  const warnings = validation?.quality?.total_warnings || 0

  const featureImportance = explainability?.feature_ranking?.map((item: any) => ({
    feature: item.feature,
    importance: item.importance
  })) || []

  const modelComparison = automl?.ranked_models?.map((model: any) => ({
    model: model.model_name,
    score: model.score,
    cvScore: model.cv_score || 0
  })) || []

  return (
    <div className="space-y-6">
      <HorizontalPipeline 
        stages={sampleStages} 
        currentStage={8} 
        overallProgress={100}
      />

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <MetricCard
          title="Dataset"
          value={rows.toLocaleString()}
          icon={<Database className="h-6 w-6" />}
          subtitle={`${columns} columns`}
        />
        <MetricCard
          title="Quality Score"
          value={`${qualityScore}/100`}
          icon={<Award className="h-6 w-6" />}
          subtitle={warnings > 0 ? `${warnings} warnings` : 'No warnings'}
        />
        <MetricCard
          title="AI Health Score"
          value={`${healthScore}/100`}
          icon={<Activity className="h-6 w-6" />}
          subtitle={`${healthConfidence} confidence`}
        />
        <MetricCard
          title="Best Model"
          value={bestModel}
          icon={<Brain className="h-6 w-6" />}
          subtitle={`${modelsTrained} models trained`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featureImportance.length > 0 ? (
          <FeatureImportanceChart data={featureImportance} />
        ) : (
          <Card className="flex items-center justify-center h-[350px]">
            <p className="text-gray-400 dark:text-gray-500">No feature importance data available</p>
          </Card>
        )}
        {modelComparison.length > 0 ? (
          <ModelComparisonChart data={modelComparison} />
        ) : (
          <Card className="flex items-center justify-center h-[350px]">
            <p className="text-gray-400 dark:text-gray-500">No model comparison data available</p>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {insights?.executive_summary && (
          <InsightCard
            title="Executive Summary"
            description={insights.executive_summary}
            type="info"
            severity="low"
            footer="AI-generated summary based on your data"
          />
        )}

        {insights?.recommendations && insights.recommendations.length > 0 && (
          <InsightCard
            title="Key Recommendations"
            description={insights.recommendations.join('. ')}
            type="warning"
            severity="medium"
            metadata={[
              { label: 'Total Recommendations', value: insights.recommendations.length.toString() }
            ]}
            footer="Actionable insights for your data pipeline"
          />
        )}

        {insights?.strengths && insights.strengths.length > 0 && (
          <InsightCard
            title="Strengths"
            description={insights.strengths.join('. ')}
            type="positive"
            severity="low"
            metadata={[
              { label: 'Total Strengths', value: insights.strengths.length.toString() }
            ]}
          />
        )}

        {(insights?.weaknesses?.length > 0 || insights?.risks?.length > 0) && (
          <InsightCard
            title="Areas for Improvement"
            description={[...(insights.weaknesses || []), ...(insights.risks || [])].join('. ')}
            type="negative"
            severity="medium"
            metadata={[
              { label: 'Issues Found', value: ((insights.weaknesses?.length || 0) + (insights.risks?.length || 0)).toString() }
            ]}
            footer="Consider addressing these for better results"
          />
        )}
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📄 Generate Reports</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Export your analysis in multiple formats</p>
          </div>
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <Button variant="primary" size="md" icon={<Download className="h-4 w-4" />}>
              PDF
            </Button>
            <Button variant="secondary" size="md" icon={<Download className="h-4 w-4" />}>
              HTML
            </Button>
            <Button variant="secondary" size="md" icon={<Download className="h-4 w-4" />}>
              Markdown
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default Dashboard
