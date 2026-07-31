import React from 'react'
import { Eye, TrendingUp, TrendingDown } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface LocalExplanationProps {
  localExplanation: any
}

const LocalExplanation: React.FC<LocalExplanationProps> = ({ localExplanation }) => {
  if (!localExplanation || !localExplanation.prediction) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Local Explanation</h3>
        <p className="text-gray-400 dark:text-gray-500">No local explanation available</p>
      </div>
    )
  }

  const reasons = localExplanation.reasons || []
  const summary = localExplanation.summary || 'No summary available'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="h-5 w-5 text-primary-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Local Explanation</h3>
        <Badge variant="info" size="sm">Single Prediction</Badge>
        <Badge variant="success" size="sm">Prediction: {localExplanation.prediction}</Badge>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">{summary}</p>
      </div>

      <div className="space-y-2">
        {reasons.map((reason: string, index: number) => {
          const isPositive = reason.includes('increased')
          return (
            <div
              key={index}
              className={`p-3 rounded-lg flex items-center gap-2 ${
                isPositive
                  ? 'bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-400'
                  : 'bg-danger-50 dark:bg-danger-900/20 text-danger-700 dark:text-danger-400'
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="text-sm">{reason}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LocalExplanation
