import React from 'react'
import { useData } from '../context/DataContext'
import { 
  Database, 
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
  Clock,
  Target,
  BarChart3,
  Settings,
  GitBranch,
  Users,
  Zap,
  Server,
  HardDrive,
  Calendar,
  ArrowRight
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import Card from '../components/common/Card'
import ProgressBar from '../components/common/ProgressBar'

// Quick Navigation Card
const QuickNavCard: React.FC<{ 
  to: string; 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  color: string;
}> = ({ to, icon, title, description, color }) => {
  return (
    <Link to={to} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${color} bg-opacity-10 dark:bg-opacity-20`}>
              {icon}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
        </div>
      </div>
    </Link>
  )
}

// Timeline Item
const TimelineItem: React.FC<{ 
  time: string; 
  label: string; 
  icon: React.ReactNode;
  isLast?: boolean;
}> = ({ time, label, icon, isLast = false }) => {
  return (
    <div className="relative flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
          {icon}
        </div>
        {!isLast && (
          <div className="h-8 w-0.5 bg-gray-200 dark:bg-gray-700" />
        )}
      </div>
      <div className="flex-1 pt-1">
        <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{time}</p>
      </div>
    </div>
  )
}

// Activity Item
const ActivityItem: React.FC<{ 
  label: string; 
  icon: React.ReactNode;
  time: string;
  color?: string;
}> = ({ label, icon, time, color = 'text-primary-600' }) => {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
      <div className="flex items-center gap-3">
        <div className={color}>{icon}</div>
        <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500">{time}</span>
    </div>
  )
}

// Recent Dataset Item
const RecentDatasetItem: React.FC<{ 
  name: string; 
  rows: number; 
  status: string;
  date: string;
}> = ({ name, rows, status, date }) => {
  const statusColors = {
    'Ready': 'success',
    'Processing': 'warning',
    'Error': 'danger',
  } as const
  
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
      <div className="flex items-center gap-3">
        <FileText className="h-4 w-4 text-gray-400" />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{name}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{rows.toLocaleString()} rows</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={statusColors[status as keyof typeof statusColors] || 'default'} size="sm">
          {status}
        </Badge>
        <span className="text-xs text-gray-400 dark:text-gray-500">{date}</span>
      </div>
    </div>
  )
}

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useData()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 text-primary-600 animate-spin" />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading dashboard...</p>
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
        <Database className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">No Data Available</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
          Upload a dataset to start your analysis journey.
        </p>
        <Button variant="primary" size="lg" className="mt-6" onClick={() => window.location.href = '/upload'}>
          Upload Dataset
        </Button>
      </div>
    )
  }

  // Extract data
  const dataset = data?.dataset || {}
  const validation = data?.validation || {}
  const automl = data?.automl || {}
  const insights = data?.insights || {}
  const explainability = data?.explainability || {}

  const rows = dataset?.shape?.rows || 0
  const columns = dataset?.shape?.columns || 0
  const qualityScore = validation?.quality?.quality_score || 0
  const healthScore = insights?.ai_health_score?.score || 0
  const healthConfidence = insights?.ai_health_score?.confidence || 'Medium'
  const bestModel = automl?.best_model?.name || 'N/A'
  const modelsTrained = automl?.models_trained || 0
  const targetColumn = automl?.target_column || 'N/A'
  const reportsGenerated = 3
  const processingTime = '2.4s'
  const duplicates = dataset?.duplicate_rows || 0
  const missingValues = Object.values(dataset?.missing_values || {}).reduce((a: number, b: number) => a + b, 0)
  const totalRows = rows
  const missingPercentage = totalRows > 0 ? (missingValues / (totalRows * columns)) * 100 : 0

  const qualityLevel = qualityScore >= 80 ? 'Excellent' : qualityScore >= 60 ? 'Good' : 'Needs Improvement'
  const healthLevel = healthScore >= 70 ? 'Production Ready' : healthScore >= 50 ? 'Needs Review' : 'Not Ready'

  const insightsList = insights?.executive_summary 
    ? [insights.executive_summary, ...(insights?.recommendations || [])].slice(0, 4)
    : ['Dataset ready for analysis', 'Quality score is excellent', 'Model performance is good', 'Reports generated successfully']

  const recentDatasets = [
    { name: dataset?.file_name || 'Current Dataset', rows: rows, status: 'Ready' as const, date: 'Today' },
  ]

  const activities = [
    { label: 'Dataset uploaded', icon: <Upload className="h-3 w-3" />, time: 'Today 10:21', color: 'text-primary-500' },
    { label: 'Analysis completed', icon: <CheckCircle className="h-3 w-3" />, time: 'Today 10:25', color: 'text-success-500' },
    { label: 'Reports generated', icon: <FileText className="h-3 w-3" />, time: 'Today 10:26', color: 'text-blue-500' },
  ]

  const timelineData = [
    { time: '10:21', label: 'Dataset Uploaded', icon: <Upload className="h-4 w-4" /> },
    { time: '10:22', label: 'Validation Complete', icon: <CheckCircle className="h-4 w-4" /> },
    { time: '10:23', label: 'EDA Complete', icon: <BarChart3 className="h-4 w-4" /> },
    { time: '10:24', label: 'AutoML Finished', icon: <Brain className="h-4 w-4" /> },
    { time: '10:25', label: 'Reports Generated', icon: <FileText className="h-4 w-4" /> },
  ]

  const pipelineStages = [
    { id: 'upload', label: 'Upload', icon: <Upload className="h-4 w-4" />, status: 'completed' },
    { id: 'validation', label: 'Validation', icon: <CheckCircle className="h-4 w-4" />, status: 'completed' },
    { id: 'cleaning', label: 'Cleaning', icon: <Activity className="h-4 w-4" />, status: 'completed' },
    { id: 'eda', label: 'EDA', icon: <BarChart3 className="h-4 w-4" />, status: 'completed' },
    { id: 'feature', label: 'Feature Eng.', icon: <Settings className="h-4 w-4" />, status: 'completed' },
    { id: 'automl', label: 'AutoML', icon: <Brain className="h-4 w-4" />, status: 'completed' },
    { id: 'explainability', label: 'Explainability', icon: <Shield className="h-4 w-4" />, status: 'completed' },
    { id: 'insights', label: 'Insights', icon: <Lightbulb className="h-4 w-4" />, status: 'completed' },
    { id: 'reports', label: 'Reports', icon: <FileText className="h-4 w-4" />, status: 'completed' },
  ]

  const statusColors = {
    completed: 'text-success-500',
    running: 'text-primary-500 animate-pulse',
    waiting: 'text-gray-300 dark:text-gray-600',
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Good Afternoon 👋
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome back to AI Data Intelligence Platform
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Your latest dataset has been successfully analyzed.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="info" size="sm">
              <Database className="h-3 w-3 inline mr-1" />
              {dataset?.file_name || 'Unknown'}
            </Badge>
            <Badge variant="info" size="sm">
              <Clock className="h-3 w-3 inline mr-1" />
              Today 10:25
            </Badge>
            <Badge variant="success" size="sm">✓ Complete</Badge>
          </div>
        </div>
      </div>

      {/* Row 1: Executive KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-lg transition-all hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Dataset</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{rows.toLocaleString()}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{columns} columns</p>
            </div>
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
              <Database className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-lg transition-all hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Quality Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{qualityScore}/100</p>
              <Badge variant={qualityScore >= 80 ? 'success' : qualityScore >= 60 ? 'warning' : 'danger'} size="sm">
                {qualityLevel}
              </Badge>
            </div>
            <div className={`p-2 rounded-lg ${qualityScore >= 80 ? 'bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400' : 'bg-warning-50 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400'}`}>
              <Award className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-lg transition-all hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">AI Health Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{healthScore}%</p>
              <Badge variant={healthScore >= 70 ? 'success' : 'warning'} size="sm">
                {healthLevel}
              </Badge>
            </div>
            <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-lg transition-all hover:-translate-y-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Best Model</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white mt-1 truncate">{bestModel}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{(automl?.best_model?.score || 0) * 100}% accuracy</p>
            </div>
            <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
              <Brain className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Secondary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              <GitBranch className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Models Trained</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{modelsTrained}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
              <Target className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Target Variable</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white truncate">{targetColumn}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Reports Generated</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{reportsGenerated}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
              <Clock className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Processing Time</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{processingTime}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Overview + Pipeline Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dataset Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Dataset Overview</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50 pb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Name</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate ml-2">{dataset?.file_name || 'Unknown'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50 pb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Rows</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{rows.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50 pb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Columns</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{columns}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50 pb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Target</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{targetColumn}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700/50 pb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Missing Values</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{missingPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Duplicates</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">{duplicates}</span>
            </div>
          </div>
        </div>

        {/* Pipeline Status */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">AI Pipeline Status</h3>
          <div className="flex items-center justify-between overflow-x-auto py-2 gap-2">
            {pipelineStages.map((stage, index) => {
              const isLast = index === pipelineStages.length - 1
              const isCompleted = stage.status === 'completed'
              return (
                <div key={stage.id} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${isCompleted ? 'border-success-500 bg-success-50 dark:bg-success-900/30 text-success-500 dark:text-success-400' : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'}`}>
                      {isCompleted ? <CheckCircle className="h-4 w-4" /> : stage.icon}
                    </div>
                    <span className={`mt-1 text-[10px] font-medium text-center max-w-[40px] ${isCompleted ? 'text-success-600 dark:text-success-400' : 'text-gray-400 dark:text-gray-500'}`}>
                      {stage.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={`mx-1 h-0.5 w-4 md:w-6 ${isCompleted ? 'bg-success-500 dark:bg-success-400' : 'bg-gray-300 dark:bg-gray-600'}`} />
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-3 flex justify-center">
            <Badge variant="success" size="sm">✓ All stages completed</Badge>
          </div>
        </div>
      </div>

      {/* Dataset Health + Business Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dataset Health */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Dataset Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Quality</span>
                <span className="font-medium text-gray-900 dark:text-white">{qualityScore}%</span>
              </div>
              <ProgressBar value={qualityScore} variant={qualityScore >= 80 ? 'success' : qualityScore >= 60 ? 'warning' : 'danger'} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Completeness</span>
                <span className="font-medium text-gray-900 dark:text-white">{Math.round(100 - missingPercentage)}%</span>
              </div>
              <ProgressBar value={Math.round(100 - missingPercentage)} variant="success" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Consistency</span>
                <span className="font-medium text-gray-900 dark:text-white">{qualityScore >= 80 ? 94 : 78}%</span>
              </div>
              <ProgressBar value={qualityScore >= 80 ? 94 : 78} variant="success" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">Readiness</span>
                <span className="font-medium text-gray-900 dark:text-white">100%</span>
              </div>
              <ProgressBar value={100} variant="success" />
            </div>
          </div>
        </div>

        {/* Business Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Business Insights</h3>
          <div className="space-y-3">
            {insightsList.slice(0, 4).map((insight: string, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <Lightbulb className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommended Actions + Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recommended Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Deploy Best Model', icon: <Rocket className="h-4 w-4" />, to: '/models', color: 'text-primary-600' },
              { label: 'View Reports', icon: <FileText className="h-4 w-4" />, to: '/reports', color: 'text-blue-600' },
              { label: 'Inspect Outliers', icon: <AlertTriangle className="h-4 w-4" />, to: '/analysis', color: 'text-warning-600' },
              { label: 'Explore Explainability', icon: <Shield className="h-4 w-4" />, to: '/explainability', color: 'text-green-600' },
            ].map((action) => (
              <Link key={action.label} to={action.to} className="block">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/30 transition-colors">
                  <div className={action.color}>{action.icon}</div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { to: '/analysis', icon: <BarChart3 className="h-5 w-5" />, label: 'Analysis', color: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' },
              { to: '/visualizations', icon: <TrendingUp className="h-5 w-5" />, label: 'Visuals', color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
              { to: '/models', icon: <Brain className="h-5 w-5" />, label: 'Models', color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
              { to: '/explainability', icon: <Shield className="h-5 w-5" />, label: 'Explain', color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
              { to: '/insights', icon: <Lightbulb className="h-5 w-5" />, label: 'Insights', color: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' },
              { to: '/reports', icon: <FileText className="h-5 w-5" />, label: 'Reports', color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' },
            ].map((item) => (
              <Link key={item.to} to={item.to} className="block">
                <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600/30 transition-colors">
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Analysis Timeline + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Analysis Timeline */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Analysis Timeline</h3>
          <div className="space-y-0">
            {timelineData.map((item, index) => (
              <TimelineItem
                key={index}
                time={item.time}
                label={item.label}
                icon={item.icon}
                isLast={index === timelineData.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-0">
            {activities.map((activity, index) => (
              <ActivityItem
                key={index}
                label={activity.label}
                icon={activity.icon}
                time={activity.time}
                color={activity.color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Datasets + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Datasets */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Datasets</h3>
          <div className="space-y-0">
            {recentDatasets.map((dataset, index) => (
              <RecentDatasetItem
                key={index}
                name={dataset.name}
                rows={dataset.rows}
                status={dataset.status}
                date={dataset.date}
              />
            ))}
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">System Status</h3>
          <div className="space-y-3">
            {[
              { label: 'Backend', status: 'Healthy', icon: <Server className="h-4 w-4" /> },
              { label: 'AutoML', status: 'Ready', icon: <Brain className="h-4 w-4" /> },
              { label: 'Storage', status: 'Available', icon: <HardDrive className="h-4 w-4" /> },
              { label: 'Report Engine', status: 'Ready', icon: <FileText className="h-4 w-4" /> },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">{item.icon}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
                <Badge variant="success" size="sm">{item.status}</Badge>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-center text-xs text-gray-400 dark:text-gray-500">
            All systems operational ✓
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-4">
            <span>Platform v1.0.0</span>
            <span>•</span>
            <span>Backend v1.0.0</span>
            <span>•</span>
            <span>Models Available: {modelsTrained}</span>
          </div>
          <span>Last Updated: Today 10:25</span>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
