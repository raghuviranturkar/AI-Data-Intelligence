import React from 'react'
import { Award } from 'lucide-react'

interface ExplanationConfidenceProps {
  confidence: {
    level: string
    score: number
    reason: string
  }
}

const ExplanationConfidence: React.FC<ExplanationConfidenceProps> = ({ confidence }) => {
  const { level, score, reason } = confidence

  const getColor = () => {
    if (level === 'High') return 'bg-success-500'
    if (level === 'Medium') return 'bg-warning-500'
    return 'bg-danger-500'
  }

  const getTextColor = () => {
    if (level === 'High') return 'text-success-600 dark:text-success-400'
    if (level === 'Medium') return 'text-warning-600 dark:text-warning-400'
    return 'text-danger-600 dark:text-danger-400'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Explanation Confidence</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-32 h-32 mx-auto">
              <svg className="transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="52"
                  cx="60"
                  cy="60"
                />
                <circle
                  className={getColor()}
                  strokeWidth="10"
                  strokeDasharray={Math.PI * 2 * 52}
                  strokeDashoffset={Math.PI * 2 * 52 * (1 - (score || 0) / 100)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="52"
                  cx="60"
                  cy="60"
                />
                <text
                  x="60"
                  y="60"
                  textAnchor="middle"
                  dy=".3em"
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                  fill="currentColor"
                >
                  {Math.round(score)}%
                </text>
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className={`text-2xl font-bold ${getTextColor()}`}>{level} Confidence</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{reason}</p>
        </div>

        <div className="flex flex-col justify-center p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">What this means</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {level === 'High'
              ? 'The explanation is reliable and consistent across all predictions.'
              : level === 'Medium'
              ? 'The explanation is generally reliable but may vary for some predictions.'
              : 'The explanation has limited reliability. Consider using additional methods.'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ExplanationConfidence
