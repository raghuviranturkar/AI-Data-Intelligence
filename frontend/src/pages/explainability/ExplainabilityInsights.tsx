import React from 'react'
import { Lightbulb } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface ExplainabilityInsightsProps {
  insights: any
}

const ExplainabilityInsights: React.FC<ExplainabilityInsightsProps> = ({ insights }) => {
  const explanations = insights?.explanations || []
  const insightsList = insights?.insights || []

  if (explanations.length === 0 && insightsList.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Explainability Insights</h3>
        <p className="text-gray-400 dark:text-gray-500">No insights available</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Explainability Insights</h3>
        <Badge variant="info" size="sm">AI Generated</Badge>
      </div>

      <div className="space-y-3">
        {explanations.map((text: string, index: number) => (
          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">{text}</p>
          </div>
        ))}
        {insightsList.map((text: string, index: number) => (
          <div key={index} className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">💡 {text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExplainabilityInsights
