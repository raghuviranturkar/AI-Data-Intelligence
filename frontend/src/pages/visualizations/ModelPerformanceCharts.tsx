import React from 'react'
import { useTheme } from '../../context/ThemeContext'

interface ModelPerformanceChartsProps {
  data: any
}

const ModelPerformanceCharts: React.FC<ModelPerformanceChartsProps> = ({ data }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const automl = data?.automl || {}
  const bestModel = automl?.best_model || {}
  const metrics = bestModel?.metrics || {}

  if (Object.keys(metrics).length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Model Performance</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-400 dark:text-gray-500">No performance metrics available</p>
        </div>
      </div>
    )
  }

  const metricItems = [
    { key: 'accuracy', label: 'Accuracy', value: metrics.accuracy, color: '#4F46E5' },
    { key: 'precision', label: 'Precision', value: metrics.precision, color: '#22C55E' },
    { key: 'recall', label: 'Recall', value: metrics.recall, color: '#F59E0B' },
    { key: 'f1', label: 'F1 Score', value: metrics.f1, color: '#EF4444' },
  ]

  const validMetrics = metricItems.filter(m => m.value !== undefined && m.value !== null)

  if (validMetrics.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Model Performance</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-400 dark:text-gray-500">No performance metrics available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Model Performance</h2>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Best Model: <span className="font-medium text-gray-900 dark:text-white">{bestModel.name || 'N/A'}</span></p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {validMetrics.map((metric) => (
            <div key={metric.key} className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">{metric.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white" style={{ color: metric.color }}>
                {(metric.value * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">CV Score</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{bestModel.cv_score ? (bestModel.cv_score * 100).toFixed(1) : 'N/A'}%</p>
        </div>
      </div>
    </div>
  )
}

export default ModelPerformanceCharts
