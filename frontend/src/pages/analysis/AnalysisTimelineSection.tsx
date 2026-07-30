import React from 'react'
import { CheckCircle, Loader2, Clock, AlertCircle } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

export interface TimelineStep {
  id: string
  label: string
  status: 'completed' | 'running' | 'pending' | 'error'
  timestamp?: string
  description?: string
}

interface AnalysisTimelineSectionProps {
  steps: TimelineStep[]
  className?: string
}

const AnalysisTimelineSection: React.FC<AnalysisTimelineSectionProps> = ({
  steps,
  className,
}) => {
  const getStatusIcon = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-success-500" />
      case 'running': return <Loader2 className="h-5 w-5 text-primary-500 animate-spin" />
      case 'error': return <AlertCircle className="h-5 w-5 text-danger-500" />
      default: return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed': return 'border-success-500'
      case 'running': return 'border-primary-500'
      case 'error': return 'border-danger-500'
      default: return 'border-gray-300 dark:border-gray-600'
    }
  }

  const getStatusBg = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed': return 'bg-success-50 dark:bg-success-900/20'
      case 'running': return 'bg-primary-50 dark:bg-primary-900/20'
      case 'error': return 'bg-danger-50 dark:bg-danger-900/20'
      default: return 'bg-gray-50 dark:bg-gray-800/50'
    }
  }

  // Calculate completion stats
  const completedCount = steps.filter(s => s.status === 'completed').length
  const totalCount = steps.length
  const allCompleted = completedCount === totalCount

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analysis Timeline</h3>
        <Badge variant={allCompleted ? 'success' : 'warning'} size="sm">
          {completedCount}/{totalCount} Complete
        </Badge>
        {allCompleted && (
          <Badge variant="success" size="sm">✓ All Done</Badge>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="relative flex items-start gap-4">
                {/* Status indicator */}
                <div className={cn(
                  'relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-300',
                  getStatusColor(step.status),
                  getStatusBg(step.status)
                )}>
                  {getStatusIcon(step.status)}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className={cn(
                      'font-medium',
                      step.status === 'completed' ? 'text-gray-900 dark:text-white' :
                      step.status === 'running' ? 'text-primary-600 dark:text-primary-400' :
                      step.status === 'error' ? 'text-danger-600 dark:text-danger-400' :
                      'text-gray-400 dark:text-gray-500'
                    )}>
                      {step.label}
                    </p>
                    {step.timestamp && (
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {step.timestamp}
                      </span>
                    )}
                  </div>
                  {step.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisTimelineSection
