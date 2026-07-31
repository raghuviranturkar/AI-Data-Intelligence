import React from 'react'
import { Eye, Lock } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'

interface ReportPreviewProps {
  rows: number
  columns: number
  qualityScore: number
  bestModel: string
  healthScore: number
}

const ReportPreview: React.FC<ReportPreviewProps> = ({
  rows,
  columns,
  qualityScore,
  bestModel,
  healthScore,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report Preview</h3>
          <Badge variant="info" size="sm">Sample</Badge>
        </div>
        <Button variant="secondary" size="sm" icon={<Eye className="h-4 w-4" />}>
          Open Full Report
        </Button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-6 relative">
        <div className="space-y-4 opacity-75">
          <div className="border-b border-gray-200 dark:border-gray-600 pb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Executive Summary</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Dataset contains {rows} rows and {columns} columns.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Quality Score</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{qualityScore}/100</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Best Model</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{bestModel}</p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg col-span-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">AI Health Score</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{healthScore}%</p>
            </div>
          </div>
        </div>

        {/* Blur overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-50/80 dark:to-gray-800/80 rounded-lg flex items-end justify-center pb-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-lg shadow-lg">
            <Lock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">Download full report to view all content</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportPreview
