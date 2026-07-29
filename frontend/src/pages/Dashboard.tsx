import React from 'react'
import { 
  Award, 
  Activity, 
  Brain,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  Shield,
  Lightbulb,
  Loader2,
  Database,
  BarChart3
} from 'lucide-react'
import Card from '../components/common/Card'
import MetricCard from '../components/cards/MetricCard'
import InsightCard from '../components/cards/InsightCard'
import HorizontalPipeline from '../components/pipeline/HorizontalPipeline'
import { Button } from '../components/common/Button'
import { 
  FeatureImportanceChart, 
  ModelComparisonChart,
  CorrelationHeatmap,
  MissingValuesChart,
  OutlierChart,
  ModelLeaderboard
} from '../components/charts'
import DatasetOverview from '../components/dashboard/DatasetOverview'
import { useData } from '../context/DataContext'

const sampleStages = [
  { id: 'upload', label: 'Upload', icon: <Database className="h-6 w-6" />, status: 'completed' as const },
  { id: 'validation', label: 'Validation', icon: <CheckCircle className="h-6 w-6" />, status: 'completed' as const },
  { id: 'cleaning', label: 'Cleaning', icon: <Activity className="h-6 w-6" />, status: 'completed' as const },
  { id: 'eda', label: 'EDA', icon: <TrendingUp className="h-6 w-6" />, status: 'completed' as const },
  { id: 'feature_engineering', label: 'Feature Eng.', icon: <BarChart3 className="h-6 w-6" />, status: 'completed' as const },
  { id: 'automl', label: 'AutoML', icon: <Brain className="h-6 w-6" />, status: 'completed' as const },
  { id: 'explainability', label: 'Explainability', icon: <Shield className="h-6 w-6" />, status: 'completed' as const },
  { id: 'insights', label: 'AI Insights', icon: <Lightbulb className="h-6 w-6" />, status: 'completed' as const },
  { id: 'reports', label: 'Reports', icon: <FileText className="h-6 w-6" />, status: 'waiting' as const },
]

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useData()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading analysis results...</p>
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
  const outliers = data?.outliers || { analysis: {}, summary: {} }

  const qualityScore = validation?.quality?.quality_score || 0
  const healthScore = insights?.ai_health_score?.score || 0
  const healthConfidence = insights?.ai_health_score?.confidence || 'N/A'
  const bestModel = automl?.best_model?.name || 'N/A'
  const modelsTrained = automl?.models_trained || 0
  const rows = dataset?.shape?.rows || 0
  const columns = dataset?.shape?.columns || 0
  const warnings = validation?.quality?.total_warnings || 0
  const duplicateRows = dataset?.duplicate_rows || 0

  const featureImportance = explainability?.feature_ranking?.map((item: any) => ({
    feature: item.feature,
    importance: item.importance
  })) || []

  const modelComparison = automl?.ranked_models?.map((model: any) => ({
    model: model.model_name,
    score: model.score,
    cvScore: model.cv_score || 0
  })) || []

  const leaderboardData = automl?.ranked_models?.map((model: any) => ({
    rank: model.rank,
    model_name: model.model_name,
    score: model.score,
    cv_score: model.cv_score || 0
  })) || []

  const missingValuesData = Object.entries(dataset?.missing_values || {}).map(([column, count]) => ({
    column,
    missing: count as number,
    total: rows,
    percentage: rows > 0 ? ((count as number) / rows) * 100 : 0
  }))

  const outlierData = Object.entries(outliers?.analysis || {}).map(([column, info]: [string, any]) => ({
    column,
    outlier_count: info?.outlier_analysis?.outlier_count || 0,
    outlier_percentage: info?.outlier_analysis?.outlier_percentage || 0,
    severity: info?.severity || 'None'
  }))

  const correlationData = data?.eda?.correlation?.matrix?.matrix || {}

  const numericFeatures = dataset?.numeric_columns?.length || 0
  const categoricalFeatures = dataset?.categorical_columns?.length || 0
  const missingCells = Object.values(dataset?.missing_values || {}).reduce((a: number, b: number) => a + b, 0)
  const memoryUsage = dataset?.memory_usage?.megabytes 
    ? `${dataset.memory_usage.megabytes.toFixed(2)} MB` 
    : 'N/A'

  const readiness = validation?.validation?.readiness?.status || 'Unknown'

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

      <DatasetOverview
        rows={rows}
        columns={columns}
        numericFeatures={numericFeatures}
        categoricalFeatures={categoricalFeatures}
        duplicateRows={duplicateRows}
        missingCells={missingCells}
        memoryUsage={memoryUsage}
        mlReadiness={readiness}
      />

      <CorrelationHeatmap data={correlationData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FeatureImportanceChart data={featureImportance} />
        <ModelLeaderboard data={leaderboardData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MissingValuesChart data={missingValuesData} />
        <OutlierChart data={outlierData} />
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
