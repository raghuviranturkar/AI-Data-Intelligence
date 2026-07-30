import React from 'react'
import { TrendingUp } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { Badge } from '../../components/common/Badge'

interface CorrelationChartsProps {
  data: any
}

const CorrelationCharts: React.FC<CorrelationChartsProps> = ({ data }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const eda = data?.eda || {}
  const correlationMatrix = eda?.correlation?.matrix?.matrix || {}
  const strongCorrelations = eda?.correlation?.strong_correlations?.strong_correlations || []

  const columns = Object.keys(correlationMatrix)

  const getColor = (value: number) => {
    const abs = Math.abs(value)
    if (abs > 0.7) return isDark ? 'bg-primary-600' : 'bg-primary-600'
    if (abs > 0.5) return isDark ? 'bg-primary-400' : 'bg-primary-400'
    if (abs > 0.3) return isDark ? 'bg-primary-300' : 'bg-primary-300'
    if (abs > 0.1) return isDark ? 'bg-primary-200' : 'bg-primary-200'
    return isDark ? 'bg-gray-700' : 'bg-gray-100'
  }

  const getTextColor = (value: number) => {
    const abs = Math.abs(value)
    if (abs > 0.5) return 'text-white'
    return isDark ? 'text-gray-300' : 'text-gray-900'
  }

  // Limit to 10 columns for readability
  const displayColumns = columns.slice(0, 10)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Correlation Analysis</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Correlation Heatmap</h3>
          {displayColumns.length > 1 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 sticky left-0 bg-white dark:bg-gray-800 z-10"></th>
                    {displayColumns.map((col) => (
                      <th key={col} className="p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[50px]">
                        <span className="block truncate max-w-[60px]" title={col}>
                          {col}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayColumns.map((row) => (
                    <tr key={row}>
                      <td className="p-2 text-xs font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-gray-800 z-10">
                        <span className="block truncate max-w-[60px]" title={row}>
                          {row}
                        </span>
                      </td>
                      {displayColumns.map((col) => {
                        const value = correlationMatrix[row]?.[col] ?? 0
                        const isSelf = row === col
                        return (
                          <td key={col} className="p-1 text-center">
                            <div
                              className={`rounded-lg p-2 text-xs font-medium transition-colors ${getColor(value)} ${getTextColor(value)} ${isSelf ? 'ring-2 ring-gray-300 dark:ring-gray-600' : ''}`}
                              title={`${row} ↔ ${col}: ${value.toFixed(2)}`}
                            >
                              {isSelf ? '1.0' : value.toFixed(2)}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              {columns.length > 10 && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Showing top 10 features. {columns.length - 10} more not displayed.
                </p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-400 dark:text-gray-500">
              Need at least 2 numeric columns for correlation analysis
            </div>
          )}
        </div>

        {/* Strong Correlations */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Strong Correlations</h3>
          {strongCorrelations.length > 0 ? (
            <div className="space-y-3">
              {strongCorrelations.slice(0, 5).map((corr: any, i: number) => {
                const isPositive = corr.correlation > 0
                return (
                  <div key={i} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {corr.feature_1} ↔ {corr.feature_2}
                      </span>
                      <Badge variant={isPositive ? 'success' : 'danger'} size="sm">
                        {isPositive ? 'Positive' : 'Negative'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${isPositive ? 'bg-success-500' : 'bg-danger-500'}`}
                          style={{ width: `${Math.abs(corr.correlation) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
                        {corr.correlation.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )
              })}
              {strongCorrelations.length > 5 && (
                <p className="text-xs text-gray-400 dark:text-gray-500">+ {strongCorrelations.length - 5} more</p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-gray-400 dark:text-gray-500">
              No strong correlations detected
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CorrelationCharts
