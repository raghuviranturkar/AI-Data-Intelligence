import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface CrossValidationDisplayProps {
  bestModel: any
}

const CrossValidationDisplay: React.FC<CrossValidationDisplayProps> = ({ bestModel }) => {
  const cvResults = bestModel?.cv_results || {}
  const mean = cvResults?.mean || 0
  const std = cvResults?.std || 0

  if (!mean && !std) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cross Validation</h3>
        <p className="text-gray-400 dark:text-gray-500">No CV data available</p>
      </div>
    )
  }

  const stability = std < 0.03 ? 'Stable' : std < 0.08 ? 'Moderate' : 'Unstable'
  const stabilityColor = stability === 'Stable' ? 'success' : stability === 'Moderate' ? 'warning' : 'danger'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Cross Validation</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{(mean * 100).toFixed(1)}%</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Std Deviation</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{(std * 100).toFixed(1)}%</p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Stability</p>
          <Badge variant={stabilityColor as any} size="lg">
            {stability}
          </Badge>
        </div>
      </div>
    </div>
  )
}

export default CrossValidationDisplay
