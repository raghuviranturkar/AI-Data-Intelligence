import React from 'react'
import { 
  CheckCircle, 
  Clock, 
  Database, 
  Brain, 
  FileText, 
  TrendingUp,
  Award,
  Activity
} from 'lucide-react'
import { Badge } from '../common/Badge'
import { cn } from '../../utils/cn'

interface AnalysisSessionSummaryProps {
  datasetName: string
  duration: string
  modulesExecuted: number
  modelsTrained: number
  reportsGenerated: number
  status: 'success' | 'partial' | 'failed'
  className?: string
}

const AnalysisSessionSummary: React.FC<AnalysisSessionSummaryProps> = ({
  datasetName,
  duration,
  modulesExecuted,
  modelsTrained,
  reportsGenerated,
  status,
  className,
}) => {
  const statusConfig = {
    success: {
      label: 'Success',
      color: 'text-success-600 dark:text-success-400',
      bg: 'bg-success-50 dark:bg-success-900/20',
      border: 'border-success-200 dark:border-success-800',
      icon: CheckCircle,
    },
    partial: {
      label: 'Partial',
      color: 'text-warning-600 dark:text-warning-400',
      bg: 'bg-warning-50 dark:bg-warning-900/20',
      border: 'border-warning-200 dark:border-warning-800',
      icon: Activity,
    },
    failed: {
      label: 'Failed',
      color: 'text-danger-600 dark:text-danger-400',
      bg: 'bg-danger-50 dark:bg-danger-900/20',
      border: 'border-danger-200 dark:border-danger-800',
      icon: Activity,
    },
  }

  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <div className={cn(
      'bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6',
      'border-l-4',
      config.border,
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-lg', config.bg)}>
            <StatusIcon className={cn('h-6 w-6', config.color)} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Analysis Session Summary
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {datasetName}
            </p>
          </div>
        </div>
        <Badge variant={status === 'success' ? 'success' : status === 'partial' ? 'warning' : 'danger'} size="lg">
          {config.label}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <Clock className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{duration}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <Database className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{modulesExecuted}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Modules</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <Brain className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{modelsTrained}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Models</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <FileText className="h-5 w-5 text-gray-400 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{reportsGenerated}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Reports</p>
        </div>
      </div>
    </div>
  )
}

export default AnalysisSessionSummary
