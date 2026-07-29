import React from 'react'
import { AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown } from 'lucide-react'
import { Badge } from '../common/Badge'
import { cn } from '../../utils/cn'

interface OutlierData {
  column: string
  outlier_count: number
  outlier_percentage: number
  severity: string
}

interface OutlierChartProps {
  data: OutlierData[]
  title?: string
}

const OutlierChart: React.FC<OutlierChartProps> = ({
  data,
  title = 'Outlier Analysis',
}) => {
  const validData = data.filter(d => d.outlier_count > 0)

  if (validData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-success-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <Badge variant="success" size="sm">Stable</Badge>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle className="h-12 w-12 text-success-500 mb-3" />
          <p className="text-lg font-medium text-gray-900 dark:text-white">No Significant Outliers Detected</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mt-1">
            Your data distribution appears healthy. No unusual values were found in numeric columns.
          </p>
        </div>
      </div>
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return { bg: 'bg-danger-500', text: 'text-danger-500', label: 'High Risk' }
      case 'Medium': return { bg: 'bg-warning-500', text: 'text-warning-500', label: 'Moderate' }
      default: return { bg: 'bg-success-500', text: 'text-success-500', label: 'Low' }
    }
  }

  const getRecommendation = (severity: string, column: string) => {
    switch (severity) {
      case 'High': return `⚠️ Investigate unusual values in '${column}'`
      case 'Medium': return `📊 Review outliers in '${column}'`
      default: return `✓ Outliers in '${column}' may be legitimate`
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-warning-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <Badge variant="warning" size="sm">{validData.length} Columns</Badge>
      </div>

      <div className="space-y-4">
        {validData.slice(0, 10).map((item) => {
          const severity = getSeverityColor(item.severity)
          const barWidth = Math.min(item.outlier_percentage * 5, 100)

          return (
            <div
              key={item.column}
              className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.column}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className={cn('text-xs font-medium', severity.text)}>
                      {severity.label}
                    </span>
                    <div className={cn('h-2 w-2 rounded-full', severity.bg)} />
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.outlier_count} outliers
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    ({item.outlier_percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>

              {/* Box Plot Visualization */}
              <div className="relative h-12 my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                    <div
                      className={cn(
                        'h-1 rounded-full transition-all duration-500',
                        severity.bg
                      )}
                      style={{ width: `${Math.min(barWidth + 10, 100)}%` }}
                    />
                  </div>
                </div>
                {/* Outlier markers */}
                <div className="absolute inset-0 flex items-center">
                  {Array.from({ length: Math.min(item.outlier_count, 8) }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-3 w-3 rounded-full border-2 border-white dark:border-gray-800',
                        severity.bg
                      )}
                      style={{
                        position: 'absolute',
                        left: `${Math.random() * (barWidth + 5)}%`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {getRecommendation(item.severity, item.column)}
              </div>
            </div>
          )
        })}
      </div>

      {validData.length > 10 && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          Showing top 10 columns with outliers. {validData.length - 10} more not displayed.
        </p>
      )}
    </div>
  )
}

export default OutlierChart
