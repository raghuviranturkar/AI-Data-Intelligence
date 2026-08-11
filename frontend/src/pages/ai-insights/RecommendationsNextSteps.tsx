import React from 'react'
import { Lightbulb, List, ArrowRight } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface RecommendationsNextStepsProps {
  recommendations: string[]
  nextSteps: string[]
}

const RecommendationsNextSteps: React.FC<RecommendationsNextStepsProps> = ({
  recommendations,
  nextSteps
}) => {
  const hasContent = recommendations.length > 0 || nextSteps.length > 0

  if (!hasContent) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommendations & Next Steps</h3>
        <p className="text-gray-500 dark:text-gray-400">No recommendations available.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🎯 Recommendations</h3>
            <Badge variant="info" size="sm">{recommendations.length}</Badge>
          </div>
          {recommendations.length > 0 ? (
            <ul className="space-y-3">
              {recommendations.slice(0, 5).map((item, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{index + 1}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No recommendations available</p>
          )}
        </div>

        {/* Next Steps */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <List className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">📋 Next Steps</h3>
            <Badge variant="info" size="sm">{nextSteps.length}</Badge>
          </div>
          {nextSteps.length > 0 ? (
            <ul className="space-y-3">
              {nextSteps.slice(0, 5).map((step, index) => (
                <li key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{String(index + 1).padStart(2, '0')}</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No next steps available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecommendationsNextSteps
