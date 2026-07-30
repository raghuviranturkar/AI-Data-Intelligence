import React from 'react'
import { Award, AlertTriangle, Copy, Database, FileX, Hash } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface DataQualitySectionProps {
  qualityScore: number
  totalWarnings: number
  duplicateRows: number
  missingValues: number
  highMissingColumns: string[]
  constantColumns: string[]
  className?: string
}

const DataQualitySection: React.FC<DataQualitySectionProps> = ({
  qualityScore,
  totalWarnings,
  duplicateRows,
  missingValues,
  highMissingColumns,
  constantColumns,
  className,
}) => {
  const getScoreLevel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'text-success-500', barColor: 'bg-success-500' }
    if (score >= 60) return { label: 'Good', color: 'text-warning-500', barColor: 'bg-warning-500' }
    return { label: 'Needs Improvement', color: 'text-danger-500', barColor: 'bg-danger-500' }
  }

  const level = getScoreLevel(qualityScore)

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-2">
        <Award className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Data Quality Analysis</h3>
        <Badge variant="info" size="sm">{qualityScore}/100</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">Quality Score</p>
            <Badge variant="success" size="sm">{level.label}</Badge>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{qualityScore}/100</p>
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className={cn('h-2 rounded-full transition-all duration-500', level.barColor)}
              style={{ width: `${qualityScore}%` }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">Warnings</p>
            <Badge variant={totalWarnings > 0 ? 'warning' : 'success'} size="sm">
              {totalWarnings > 0 ? 'Review' : 'Clear'}
            </Badge>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalWarnings}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Total warnings detected</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">Duplicate Rows</p>
            <Badge variant={duplicateRows > 0 ? 'warning' : 'success'} size="sm">
              {duplicateRows > 0 ? 'Found' : 'Clean'}
            </Badge>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{duplicateRows}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Duplicate records</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">Missing Values</p>
            <Badge variant={missingValues > 0 ? 'warning' : 'success'} size="sm">
              {missingValues > 0 ? 'Review' : 'Complete'}
            </Badge>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{missingValues}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Total missing cells</p>
        </div>
      </div>

      {(highMissingColumns.length > 0 || constantColumns.length > 0) && (
        <div className="bg-warning-50 dark:bg-warning-900/20 rounded-lg p-4 border border-warning-200 dark:border-warning-800">
          <div className="space-y-2">
            {highMissingColumns.length > 0 && (
              <div>
                <p className="text-sm font-medium text-warning-700 dark:text-warning-400">
                  ⚠️ High Missing Values ({highMissingColumns.length} columns)
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {highMissingColumns.join(', ')}
                </p>
              </div>
            )}
            {constantColumns.length > 0 && (
              <div>
                <p className="text-sm font-medium text-warning-700 dark:text-warning-400">
                  ⚠️ Constant Columns ({constantColumns.length} columns)
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {constantColumns.join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DataQualitySection
