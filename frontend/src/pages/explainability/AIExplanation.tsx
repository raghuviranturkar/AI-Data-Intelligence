import React from 'react'
import { Sparkles } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface AIExplanationProps {
  localExplanation: any
}

const AIExplanation: React.FC<AIExplanationProps> = ({ localExplanation }) => {
  if (!localExplanation || !localExplanation.summary) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI Explanation</h3>
        <p className="text-gray-400 dark:text-gray-500">No AI explanation available</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl shadow-md p-6 border border-primary-200 dark:border-primary-800">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-primary-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">🤖 AI Explanation</h3>
        <Badge variant="info" size="sm">Conversational</Badge>
      </div>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
        {localExplanation.summary}
      </p>
    </div>
  )
}

export default AIExplanation
