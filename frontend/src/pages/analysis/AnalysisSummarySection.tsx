import React from 'react'
import { CheckCircle, Clock, Database, Brain, FileText, AlertTriangle, Award } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface AnalysisSummarySectionProps {
  modulesExecuted: number
  warnings: number
  insightsGenerated: number
  qualityScore: number
  duration: string
  status: 'success' | 'warning' | 'error'
  className?: string
}

const AnalysisSummarySection: React.FC<AnalysisSummarySectionProps> = ({
  modulesExecuted,
  warnings,
  insightsGenerated,
  qualityScore,
  duration,
  status,
  className,
}) => {
  const statusConfig = {
    success: { label: 'Success', variant: 'success' as const, icon: CheckCircle },
    warning: { label: 'Completed with Warnings', variant: 'warning' as const, icon: AlertTriangle },
    error: { label: 'Failed', variant: 'danger' as const, icon: AlertTriangle },
  }

  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <Award className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analysis Summary</h3>
        <Badge variant="info" size="sm">Complete</Badge>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'p-2 rounded-lg',
              status === 'success' ? 'bg-success-50 dark:bg-success-900/20' :
              status === 'warning' ? 'bg-warning-50 dark:bg-warning-900/20' :
              'bg-danger-50 dark:bg-danger-900/20'
            )}>
              <StatusIcon className={cn(
                'h-5 w-5',
                status === 'success' ? 'text-success-500' :
                status === 'warning' ? 'text-warning-500' :
                'text-danger-500'
              )} />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Analysis Status</p>
              <Badge variant={config.variant} size="sm">{config.label}</Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{duration}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Modules</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{modulesExecuted}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Warnings</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{warnings}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Insights</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{insightsGenerated}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Quality</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{qualityScore}/100</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisSummarySection
