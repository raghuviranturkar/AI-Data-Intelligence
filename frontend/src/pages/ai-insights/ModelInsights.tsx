import React from 'react'
import { Brain, Award, TrendingUp, GitBranch } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { Link } from 'react-router-dom'

interface ModelInsightsProps {
  bestModel: string
  modelsTrained: number
  modelScore: number
  modelInsights: string[]
  onNavigate: () => void
}

const ModelInsights: React.FC<ModelInsightsProps> = ({
  bestModel,
  modelsTrained,
  modelScore,
  modelInsights,
  onNavigate
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Model Insights</h3>
          <Badge variant="info" size="sm">{modelsTrained} Models</Badge>
        </div>
        <button 
          onClick={onNavigate}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
        >
          View Models
          <GitBranch className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Best Model</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white truncate">{bestModel}</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{(modelScore * 100).toFixed(1)}%</p>
          </div>
        </div>

        {modelInsights && modelInsights.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Findings</p>
            {modelInsights.slice(0, 3).map((insight, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <Award className="h-4 w-4 text-primary-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{insight}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ModelInsights
