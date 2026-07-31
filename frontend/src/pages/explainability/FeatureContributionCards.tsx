import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface FeatureContributionCardsProps {
  localExplanation: any
}

const FeatureContributionCards: React.FC<FeatureContributionCardsProps> = ({ localExplanation }) => {
  const contributions = localExplanation?.feature_contributions || []

  if (contributions.length === 0) {
    return null
  }

  const getDirection = (value: number) => {
    if (value > 0.1) return { label: 'High Positive', icon: TrendingUp, color: 'text-success-600 dark:text-success-400' }
    if (value > 0.05) return { label: 'Positive', icon: TrendingUp, color: 'text-success-500 dark:text-success-300' }
    if (value < -0.1) return { label: 'High Negative', icon: TrendingDown, color: 'text-danger-600 dark:text-danger-400' }
    if (value < -0.05) return { label: 'Negative', icon: TrendingDown, color: 'text-danger-500 dark:text-danger-300' }
    return { label: 'Neutral', icon: Minus, color: 'text-gray-500 dark:text-gray-400' }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feature Contributions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contributions.slice(0, 9).map((item: any, index: number) => {
          const direction = getDirection(item.shap_value || 0)
          const Icon = direction.icon

          return (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">{item.feature}</span>
                <Icon className={`h-4 w-4 ${direction.color}`} />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">{direction.label}</span>
                <span className={`font-bold ${direction.color}`}>
                  {(item.shap_value * 100 || 0).toFixed(1)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FeatureContributionCards
