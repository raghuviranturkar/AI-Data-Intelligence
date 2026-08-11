import React from 'react'
import { Sparkles, FileText, Brain, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface AIExecutiveSummaryProps {
  summary: string
}

const AIExecutiveSummary: React.FC<AIExecutiveSummaryProps> = ({ summary }) => {
  if (!summary) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Executive Summary</h3>
          <Badge variant="info" size="sm">AI Generated</Badge>
        </div>
        <p className="text-gray-500 dark:text-gray-400">No executive summary available for this dataset.</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-xl shadow-md p-6 border border-primary-200 dark:border-primary-800">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🤖 AI Executive Summary</h3>
        <Badge variant="info" size="sm">AI Generated</Badge>
      </div>
      <div className="space-y-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
          {summary}
        </p>
        <div className="flex flex-wrap gap-4 pt-3 border-t border-primary-200 dark:border-primary-800">
          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <FileText className="h-3 w-3" />
            Dataset analyzed
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Brain className="h-3 w-3" />
            Models evaluated
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Activity className="h-3 w-3" />
            Insights generated
          </span>
        </div>
      </div>
    </div>
  )
}

export default AIExecutiveSummary
