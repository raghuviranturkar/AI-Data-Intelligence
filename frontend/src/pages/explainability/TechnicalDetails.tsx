import React from 'react'
import { ChevronDown, ChevronRight, Info } from 'lucide-react'

interface TechnicalDetailsProps {
  shapAvailable: boolean
  method: string
  modelName: string
  featureCount: number
  generatedAt: string
  expanded: boolean
  onToggle: () => void
}

const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({
  shapAvailable,
  method,
  modelName,
  featureCount,
  generatedAt,
  expanded,
  onToggle,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Technical Details</h3>
        </div>
        {expanded ? (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Explanation Method</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{method}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Model</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{modelName}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Features Used</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{featureCount}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">SHAP Available</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{shapAvailable ? 'Yes' : 'No'}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Generated At</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {new Date(generatedAt).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Pipeline Version</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">1.0.0</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TechnicalDetails
