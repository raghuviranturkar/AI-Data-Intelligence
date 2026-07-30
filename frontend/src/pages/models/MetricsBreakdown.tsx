import React from 'react'
import { Award, TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react'
import { cn } from '../../utils/cn'

interface MetricsBreakdownProps {
  bestModel: any
}

const MetricsBreakdown: React.FC<MetricsBreakdownProps> = ({ bestModel }) => {
  const metrics = bestModel?.metrics || {}

  const metricItems = [
    { key: 'accuracy', label: 'Accuracy', icon: Award, color: 'text-primary-600 dark:text-primary-400' },
    { key: 'precision', label: 'Precision', icon: TrendingUp, color: 'text-success-600 dark:text-success-400' },
    { key: 'recall', label: 'Recall', icon: Target, color: 'text-blue-600 dark:text-blue-400' },
    { key: 'f1', label: 'F1 Score', icon: BarChart3, color: 'text-purple-600 dark:text-purple-400' },
  ]

  const validMetrics = metricItems.filter(m => metrics[m.key] !== undefined && metrics[m.key] !== null)

  if (validMetrics.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Metrics Breakdown</h3>
        <p className="text-gray-400 dark:text-gray-500">No metrics available</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Metrics Breakdown</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {validMetrics.map((metric) => {
          const value = metrics[metric.key] || 0
          const Icon = metric.icon

          return (
            <div key={metric.key} className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2">
                <Icon className={`h-4 w-4 ${metric.color}`} />
                <span className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {(value * 100).toFixed(1)}%
              </p>
              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${value > 0.8 ? 'bg-success-500' : value > 0.6 ? 'bg-warning-500' : 'bg-danger-500'}`}
                  style={{ width: `${Math.min(value * 100, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MetricsBreakdown
