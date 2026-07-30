import React from 'react'
import { Lightbulb, CheckCircle, Shield, Zap, TrendingUp } from 'lucide-react'

interface ModelRecommendationProps {
  bestModel: any
}

const ModelRecommendation: React.FC<ModelRecommendationProps> = ({ bestModel }) => {
  const reason = bestModel?.reason || 'Selected based on overall performance'

  if (!bestModel || !bestModel.name) {
    return null
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 border-l-4 border-primary-500">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20">
          <Lightbulb className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Model Recommendation</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            <span className="font-medium">{bestModel.name}</span> was selected because:
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{reason}</p>
          <div className="mt-3 flex flex-wrap gap-4">
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <CheckCircle className="h-3 w-3 text-success-500" />
              <span>Highest validation accuracy</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Shield className="h-3 w-3 text-success-500" />
              <span>Lowest variance</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <TrendingUp className="h-3 w-3 text-success-500" />
              <span>Generalized well</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Zap className="h-3 w-3 text-success-500" />
              <span>Fast training</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModelRecommendation
