import React, { useState } from 'react'
import { useData } from '../../context/DataContext'
import { 
  Loader2, AlertTriangle, Brain, Target, Clock, Award, 
  TrendingUp, TrendingDown, CheckCircle, XCircle, 
  RefreshCw, BarChart3, Table2, GitBranch, Zap,
  Crown, Medal, Trophy
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import Card from '../../components/common/Card'

// Import sub-components
import ModelsHeader from './ModelsHeader'
import ModelsOverview from './ModelsOverview'
import PipelineTimeline from './PipelineTimeline'
import CandidateModels from './CandidateModels'
import ModelLeaderboard from './ModelLeaderboard'
import PerformanceCharts from './PerformanceCharts'
import BestModelDetails from './BestModelDetails'
import MetricsBreakdown from './MetricsBreakdown'
import ConfusionMatrixDisplay from './ConfusionMatrixDisplay'
import CrossValidationDisplay from './CrossValidationDisplay'
import DatasetSplitDisplay from './DatasetSplitDisplay'
import DeploymentReadiness from './DeploymentReadiness'
import ModelRecommendation from './ModelRecommendation'
import HyperparameterSummary from './HyperparameterSummary'

const ModelsPage: React.FC = () => {
  const { data, isLoading, error } = useData()
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading model results...</p>
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
        <Brain className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">No Models Available</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
          Upload a dataset to train models and explore AutoML results.
        </p>
        <Button variant="primary" size="lg" className="mt-6" onClick={() => window.location.href = '/upload'}>
          Upload Dataset
        </Button>
      </div>
    )
  }

  const automl = data?.automl || {}
  const problemType = automl?.problem_type || 'Unknown'
  const targetColumn = automl?.target_column || 'Not Detected'
  const modelsTrained = automl?.models_trained || 0
  const bestModel = automl?.best_model || {}
  const rankedModels = automl?.ranked_models || []

  // Check if we have model data
  const hasModels = modelsTrained > 0 || rankedModels.length > 0

  if (!hasModels) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Brain className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">No Models Trained</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
          AutoML training has not been completed for this dataset.
        </p>
        <Button variant="primary" size="lg" className="mt-6" onClick={() => window.location.href = '/upload'}>
          Upload Dataset
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <ModelsHeader 
        problemType={problemType}
        targetColumn={targetColumn}
        modelsTrained={modelsTrained}
        trainingTime={bestModel?.training_time || 2.4}
        bestModelName={bestModel?.name || 'N/A'}
        bestModelScore={bestModel?.score || 0}
      />

      {/* Overview Cards */}
      <ModelsOverview 
        modelsTrained={modelsTrained}
        bestModel={bestModel}
        problemType={problemType}
        rankedModels={rankedModels}
      />

      {/* Pipeline Timeline */}
      <PipelineTimeline />

      {/* Candidate Models */}
      <CandidateModels 
        rankedModels={rankedModels}
        bestModelName={bestModel?.name || 'N/A'}
        onSelectModel={setSelectedModel}
      />

      {/* Model Leaderboard */}
      <ModelLeaderboard rankedModels={rankedModels} />

      {/* Performance Charts */}
      <PerformanceCharts rankedModels={rankedModels} />

      {/* Best Model Details */}
      <BestModelDetails bestModel={bestModel} />

      {/* Metrics Breakdown */}
      <MetricsBreakdown bestModel={bestModel} />

      {/* Confusion Matrix */}
      <ConfusionMatrixDisplay bestModel={bestModel} problemType={problemType} />

      {/* Cross Validation */}
      <CrossValidationDisplay bestModel={bestModel} />

      {/* Model Recommendation */}
      <ModelRecommendation bestModel={bestModel} />

      {/* Dataset Split */}
      <DatasetSplitDisplay datasetSplit={automl?.dataset_split || {}} />

      {/* Deployment Readiness */}
      <DeploymentReadiness bestModel={bestModel} />

      {/* Hyperparameters */}
      <HyperparameterSummary bestModel={bestModel} />

      {/* Future Models */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Coming Soon</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {['XGBoost', 'LightGBM', 'CatBoost', 'Neural Network', 'SVM'].map((model) => (
            <div key={model} className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 text-center opacity-60">
              <Brain className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{model}</p>
              <Badge variant="default" size="sm">Coming Soon</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default ModelsPage
