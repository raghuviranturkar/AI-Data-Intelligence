import React from 'react'
import { CheckCircle, Clock, Award, Activity, AlertTriangle } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface AnalysisOverviewProps {
  datasetName: string
  status: 'completed' | 'running' | 'failed' | 'warning'
  timestamp: string
  duration: string
  healthScore: number
  qualityScore: number
  className?: string
}

const AnalysisOverview: React.FC<AnalysisOverviewProps> = ({
  datasetName,
  status,
  timestamp,
  duration,
  healthScore,
  qualityScore,
  className,
}) => {
  const statusConfig = {
    completed: { label: 'Completed', variant: 'success' as const, icon: CheckCircle },
    running: { label: 'Running', variant: 'warning' as const, icon: Activity },
    failed: { label: 'Failed', variant: 'danger' as const, icon: AlertTriangle },
    warning: { label: 'Warning', variant: 'warning' as const, icon: AlertTriangle },
  }

  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6', className)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={cn(
            'p-3 rounded-lg',
            status === 'completed' ? 'bg-success-50 dark:bg-success-900/20' :
            status === 'warning' ? 'bg-warning-50 dark:bg-warning-900/20' :
            status === 'failed' ? 'bg-danger-50 dark:bg-danger-900/20' :
            'bg-primary-50 dark:bg-primary-900/20'
          )}>
            <StatusIcon className={cn(
              'h-6 w-6',
              status === 'completed' ? 'text-success-500' :
              status === 'warning' ? 'text-warning-500' :
              status === 'failed' ? 'text-danger-500' :
              'text-primary-500'
            )} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analysis Overview</h2>
              <Badge variant={config.variant} size="md">{config.label}</Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{datasetName}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{timestamp}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Activity className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">AI Health Score</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{healthScore}/100</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Quality Score</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{qualityScore}/100</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{status}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Dataset</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{datasetName}</p>
        </div>
      </div>
    </div>
  )
}

export default AnalysisOverview
