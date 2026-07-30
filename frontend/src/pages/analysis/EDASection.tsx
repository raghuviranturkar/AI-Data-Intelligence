import React from 'react'
import { TrendingUp, TrendingDown, BarChart3, Lightbulb } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface Insight {
  title: string
  description: string
  severity: 'positive' | 'negative' | 'warning' | 'info'
  recommendation?: string
}

interface EDASectionProps {
  insights: Insight[]
  strongCorrelations: Array<{ feature1: string; feature2: string; correlation: number }>
  className?: string
}

const EDASection: React.FC<EDASectionProps> = ({
  insights,
  strongCorrelations,
  className,
}) => {
  const severityColors = {
    positive: 'border-l-success-500 bg-success-50 dark:bg-success-900/20',
    negative: 'border-l-danger-500 bg-danger-50 dark:bg-danger-900/20',
    warning: 'border-l-warning-500 bg-warning-50 dark:bg-warning-900/20',
    info: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20',
  }

  const severityIcons = {
    positive: TrendingUp,
    negative: TrendingDown,
    warning: TrendingDown,
    info: Lightbulb,
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Exploratory Data Analysis</h3>
        <Badge variant="info" size="sm">{insights.length} Insights</Badge>
      </div>

      {strongCorrelations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="font-medium text-gray-900 dark:text-white mb-2">Strong Correlations Detected</p>
          <div className="space-y-2">
            {strongCorrelations.map((corr, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  {corr.feature1} ↔ {corr.feature2}
                </span>
                <Badge variant="info" size="sm">r = {corr.correlation.toFixed(2)}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {insights.map((insight, i) => {
          const Icon = severityIcons[insight.severity]
          return (
            <div
              key={i}
              className={cn(
                'rounded-lg border-l-4 p-4',
                severityColors[insight.severity]
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn(
                  'h-5 w-5 flex-shrink-0 mt-0.5',
                  insight.severity === 'positive' ? 'text-success-500' :
                  insight.severity === 'negative' ? 'text-danger-500' :
                  insight.severity === 'warning' ? 'text-warning-500' :
                  'text-blue-500'
                )} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{insight.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">{insight.description}</p>
                  {insight.recommendation && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      💡 {insight.recommendation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EDASection
