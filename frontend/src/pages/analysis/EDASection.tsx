import React, { useState } from 'react'
import { TrendingUp, TrendingDown, BarChart3, Lightbulb, ChevronDown, ChevronRight } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface Insight {
  title: string
  description: string
  severity: 'positive' | 'negative' | 'warning' | 'info'
  recommendation?: string
}

interface ColumnStat {
  column: string
  mean?: number
  median?: number
  std?: number
  min?: number
  max?: number
  unique?: number
}

interface EDASectionProps {
  insights: Insight[]
  strongCorrelations: Array<{ feature1: string; feature2: string; correlation: number }>
  columnStats?: ColumnStat[]
  className?: string
}

const EDASection: React.FC<EDASectionProps> = ({
  insights,
  strongCorrelations,
  columnStats = [],
  className,
}) => {
  const [expanded, setExpanded] = useState(false)

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

      {/* Column Statistics */}
      {columnStats.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-white">Column Statistics</span>
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </button>
          {expanded && (
            <div className="p-4 pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Column</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Mean</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Median</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Std Dev</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Min</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Max</th>
                      <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Unique</th>
                    </tr>
                  </thead>
                  <tbody>
                    {columnStats.slice(0, 10).map((stat) => (
                      <tr key={stat.column} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">{stat.column}</td>
                        <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-300">{stat.mean?.toFixed(2) || '—'}</td>
                        <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-300">{stat.median?.toFixed(2) || '—'}</td>
                        <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-300">{stat.std?.toFixed(2) || '—'}</td>
                        <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-300">{stat.min?.toFixed(2) || '—'}</td>
                        <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-300">{stat.max?.toFixed(2) || '—'}</td>
                        <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-300">{stat.unique || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {columnStats.length > 10 && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    Showing top 10 columns. {columnStats.length - 10} more not displayed.
                  </p>
                )}
              </div>
            </div>
          )}
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
