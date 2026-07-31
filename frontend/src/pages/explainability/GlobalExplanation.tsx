import React from 'react'
import { Sparkles } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface GlobalExplanationProps {
  globalExplanation: any
}

const GlobalExplanation: React.FC<GlobalExplanationProps> = ({ globalExplanation }) => {
  const summary = globalExplanation?.summary || []
  const insights = globalExplanation?.insights || []

  if (summary.length === 0 && insights.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Global Explanation</h3>
        <p className="text-gray-400 dark:text-gray-500">No global explanation available</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 border-l-4 border-primary-500">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Global Explanation</h3>
        <Badge variant="info" size="sm">AI Generated</Badge>
      </div>

      <div className="space-y-3">
        {summary.map((text: string, index: number) => (
          <p key={index} className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {text}
          </p>
        ))}
        {insights.map((text: string, index: number) => (
          <div key={index} className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">💡 {text}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-primary-500" />
          Key drivers identified
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-success-500" />
          Positive influences
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-danger-500" />
          Negative influences
        </span>
      </div>
    </div>
  )
}

export default GlobalExplanation
