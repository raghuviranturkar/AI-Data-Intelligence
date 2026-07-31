import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface DecisionBreakdownProps {
  localExplanation: any
}

const DecisionBreakdown: React.FC<DecisionBreakdownProps> = ({ localExplanation }) => {
  const contributions = localExplanation?.feature_contributions || []

  if (contributions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Decision Breakdown</h3>
        <p className="text-gray-400 dark:text-gray-500">No contribution data available</p>
      </div>
    )
  }

  const maxContribution = Math.max(...contributions.map((c: any) => Math.abs(c.shap_value || 0)))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Decision Breakdown</h3>
      <div className="space-y-3">
        {contributions.slice(0, 8).map((item: any, index: number) => {
          const value = item.shap_value || 0
          const isPositive = value > 0
          const intensity = Math.min(Math.abs(value) / (maxContribution || 1), 1)

          return (
            <div key={index} className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 w-24 truncate">
                {item.feature}
              </span>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${
                    isPositive ? 'bg-success-500' : 'bg-danger-500'
                  }`}
                  style={{
                    width: `${Math.abs(intensity * 100)}%`,
                    float: isPositive ? 'left' : 'right',
                  }}
                />
              </div>
              <span
                className={`text-sm font-medium w-16 text-right ${
                  isPositive ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'
                }`}
              >
                {isPositive ? '+' : ''}{(value * 100).toFixed(0)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DecisionBreakdown
