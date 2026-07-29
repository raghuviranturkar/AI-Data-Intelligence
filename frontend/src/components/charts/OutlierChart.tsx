import React from 'react'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

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
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const severityColors = {
    None: { bg: 'bg-success-100 dark:bg-success-900/30', text: 'text-success-700 dark:text-success-400', label: 'None' },
    Low: { bg: 'bg-success-100 dark:bg-success-900/30', text: 'text-success-700 dark:text-success-400', label: 'Low' },
    Medium: { bg: 'bg-warning-100 dark:bg-warning-900/30', text: 'text-warning-700 dark:text-warning-400', label: 'Medium' },
    High: { bg: 'bg-danger-100 dark:bg-danger-900/30', text: 'text-danger-700 dark:text-danger-400', label: 'High' },
  }

  const validData = data.filter(d => d.outlier_count > 0)

  if (validData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="flex flex-col items-center justify-center h-[200px] text-gray-400 dark:text-gray-500">
          <CheckCircle className="h-12 w-12 text-success-500 mb-2" />
          <p className="text-lg">✅ No significant outliers detected</p>
          <p className="text-sm mt-1">All numeric columns are within expected ranges</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-3">
        {validData.slice(0, 10).map((item) => {
          const severity = severityColors[item.severity as keyof typeof severityColors] || severityColors.Low
          const barWidth = Math.min(item.outlier_percentage * 5, 100)

          return (
            <div key={item.column} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.column}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${severity.bg} ${severity.text}`}>
                    {severity.label}
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.outlier_count} outliers ({item.outlier_percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    item.severity === 'High' ? 'bg-danger-500' :
                    item.severity === 'Medium' ? 'bg-warning-500' :
                    'bg-success-500'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          )
        })}
        {validData.length > 10 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Showing top 10 columns with outliers. {validData.length - 10} more not displayed.
          </p>
        )}
      </div>
    </div>
  )
}

export default OutlierChart
