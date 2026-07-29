import React from 'react'
import { AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { Badge } from '../common/Badge'
import { cn } from '../../utils/cn'

interface MissingValueItem {
  column: string
  missing: number
  total: number
  percentage: number
}

interface MissingValuesChartProps {
  data: MissingValueItem[]
  title?: string
}

const MissingValuesChart: React.FC<MissingValuesChartProps> = ({
  data,
  title = 'Missing Values Analysis',
}) => {
  const chartData = data.filter(item => item.missing > 0).slice(0, 15)

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-success-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <Badge variant="success" size="sm">Complete</Badge>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle className="h-12 w-12 text-success-500 mb-3" />
          <p className="text-lg font-medium text-gray-900 dark:text-white">No Missing Values Detected</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mt-1">
            Your dataset is complete. All columns have values for every row.
          </p>
        </div>
      </div>
    )
  }

  const getSeverity = (percentage: number) => {
    if (percentage > 20) return { label: 'Critical', color: 'danger' as const }
    if (percentage > 10) return { label: 'Warning', color: 'warning' as const }
    return { label: 'Minor', color: 'info' as const }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-warning-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <Badge variant="warning" size="sm">{chartData.length} Columns</Badge>
      </div>

      <div className="space-y-4">
        {chartData.map((item) => {
          const severity = getSeverity(item.percentage)
          const barWidth = Math.min(item.percentage, 100)

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
                  <Badge variant={severity.color} size="sm">
                    {severity.label}
                  </Badge>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.missing} missing
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    ({item.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className={cn(
                    'h-2.5 rounded-full transition-all duration-500',
                    item.percentage > 20 ? 'bg-danger-500' :
                    item.percentage > 10 ? 'bg-warning-500' :
                    'bg-success-500'
                  )}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {item.percentage > 20 ? '⚠️ Consider dropping or imputing' :
                   item.percentage > 10 ? '⚠️ Imputation recommended' :
                   '✓ Minor issue - impute or ignore'}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {data.length > 15 && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          Showing top 15 columns with missing values. {data.length - 15} more not displayed.
        </p>
      )}
    </div>
  )
}

export default MissingValuesChart
