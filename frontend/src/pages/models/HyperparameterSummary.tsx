import React from 'react'
import { Settings } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface HyperparameterSummaryProps {
  bestModel: any
}

const HyperparameterSummary: React.FC<HyperparameterSummaryProps> = ({ bestModel }) => {
  // This is a placeholder - backend doesn't expose hyperparameters yet
  const hasParams = false

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hyperparameter Summary</h3>
        <Badge variant="info" size="sm">Coming Soon</Badge>
      </div>
      {hasParams ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* This will be populated when backend exposes hyperparameters */}
        </div>
      ) : (
        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hyperparameter details will be available in a future version.
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            The AutoML engine will expose detailed hyperparameters for each model.
          </p>
        </div>
      )}
    </div>
  )
}

export default HyperparameterSummary
