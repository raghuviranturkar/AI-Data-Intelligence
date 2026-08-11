import React from 'react'
import { Award, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface DataQualityInsightsProps {
  qualityScore: number
  warnings: string[]
  totalWarnings: number
}

const DataQualityInsights: React.FC<DataQualityInsightsProps> = ({
  qualityScore,
  warnings,
  totalWarnings
}) => {
  const getScoreLevel = () => {
    if (qualityScore >= 80) return { label: 'Excellent', color: 'success' }
    if (qualityScore >= 60) return { label: 'Good', color: 'info' }
    if (qualityScore >= 40) return { label: 'Fair', color: 'warning' }
    return { label: 'Needs Improvement', color: 'danger' }
  }

  const level = getScoreLevel()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Quality Insights</h3>
        <Badge variant="info" size="sm">{qualityScore}/100</Badge>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-${level.color}-50 dark:bg-${level.color}-900/20`}>
              <Award className={`h-4 w-4 text-${level.color}-600 dark:text-${level.color}-400`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Quality Score</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{level.label}</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{qualityScore}%</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Warnings</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Issues detected</p>
            </div>
          </div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{totalWarnings}</span>
        </div>

        {warnings.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Details</p>
            {warnings.slice(0, 3).map((warning, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{warning}</span>
              </div>
            ))}
            {warnings.length > 3 && (
              <p className="text-xs text-gray-400 dark:text-gray-500">+ {warnings.length - 3} more warnings</p>
            )}
          </div>
        )}

        {warnings.length === 0 && (
          <div className="flex items-center gap-2 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg">
            <CheckCircle className="h-5 w-5 text-success-500" />
            <span className="text-sm text-success-700 dark:text-success-400">No quality warnings detected</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default DataQualityInsights
