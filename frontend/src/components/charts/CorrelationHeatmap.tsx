import React from 'react'
import { useTheme } from '../../context/ThemeContext'

interface CorrelationHeatmapProps {
  data: Record<string, Record<string, number>>
  title?: string
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  data,
  title = 'Correlation Heatmap',
}) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const columns = Object.keys(data)
  const rows = columns

  const getColor = (value: number) => {
    const abs = Math.abs(value)
    if (abs > 0.7) return 'bg-primary-600 dark:bg-primary-500'
    if (abs > 0.5) return 'bg-primary-400 dark:bg-primary-400'
    if (abs > 0.3) return 'bg-primary-200 dark:bg-primary-700'
    if (abs > 0.1) return 'bg-primary-100 dark:bg-primary-800'
    return 'bg-gray-100 dark:bg-gray-700'
  }

  const getTextColor = (value: number) => {
    const abs = Math.abs(value)
    if (abs > 0.5) return 'text-white'
    return isDark ? 'text-gray-200' : 'text-gray-900'
  }

  const getTooltip = (row: string, col: string, value: number) => {
    if (row === col) return `${row} (self-correlation: 1.00)`
    return `${row} ↔ ${col}: ${value.toFixed(2)}`
  }

  // If no data or empty matrix
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center h-[300px] text-gray-400 dark:text-gray-500">
          No correlation data available
        </div>
      </div>
    )
  }

  // If only one column, show message
  if (columns.length < 2) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center h-[300px] text-gray-400 dark:text-gray-500">
          Need at least 2 numeric columns for correlation analysis
        </div>
      </div>
    )
  }

  // Limit to max 10 columns for readability
  const displayColumns = columns.slice(0, 10)
  const displayRows = rows.slice(0, 10)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 sticky left-0 bg-white dark:bg-gray-800 z-10"></th>
              {displayColumns.map((col) => (
                <th
                  key={col}
                  className="p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 min-w-[60px]"
                >
                  <span className="block truncate max-w-[80px]" title={col}>
                    {col}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row) => (
              <tr key={row}>
                <td className="p-2 text-xs font-medium text-gray-700 dark:text-gray-300 sticky left-0 bg-white dark:bg-gray-800 z-10">
                  <span className="block truncate max-w-[80px]" title={row}>
                    {row}
                  </span>
                </td>
                {displayColumns.map((col) => {
                  const value = data[row]?.[col] ?? 0
                  const isSelf = row === col
                  return (
                    <td key={col} className="p-1 text-center">
                      <div
                        className={`rounded-lg p-2 text-xs font-medium transition-colors duration-200 ${
                          getColor(value)
                        } ${getTextColor(value)} ${isSelf ? 'ring-2 ring-gray-300 dark:ring-gray-600' : ''}`}
                        title={getTooltip(row, col, value)}
                      >
                        {isSelf ? '1.00' : value.toFixed(2)}
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
    </div>
  )
}

export default CorrelationHeatmap
