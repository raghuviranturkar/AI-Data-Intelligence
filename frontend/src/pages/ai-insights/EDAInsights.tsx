import React from 'react'
import { BarChart3, TrendingUp, TrendingDown, Lightbulb } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { useNavigate } from 'react-router-dom'

interface EDAInsightsProps {
  insights: string[]
}

const EDAInsights: React.FC<EDAInsightsProps> = ({ insights }) => {
  const navigate = useNavigate()

  if (!insights || insights.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">EDA Insights</h3>
          <Badge variant="info" size="sm">0</Badge>
        </div>
        <p className="text-gray-500 dark:text-gray-400">No EDA insights available.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">EDA Insights</h3>
          <Badge variant="info" size="sm">{insights.length}</Badge>
        </div>
        <button 
          onClick={() => navigate('/analysis')}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
        >
          View Analysis
          <TrendingUp className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-3">
        {insights.slice(0, 5).map((insight, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <Lightbulb className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
          </div>
        ))}
        {insights.length > 5 && (
          <p className="text-xs text-gray-400 dark:text-gray-500">+ {insights.length - 5} more insights</p>
        )}
      </div>
    </div>
  )
}

export default EDAInsights
