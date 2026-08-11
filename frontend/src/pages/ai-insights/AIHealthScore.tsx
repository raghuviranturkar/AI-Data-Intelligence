import React from 'react'
import { Award, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface AIHealthScoreProps {
  score: number
  confidence: string
  datasetName: string
}

const AIHealthScore: React.FC<AIHealthScoreProps> = ({ score, confidence, datasetName }) => {
  const getScoreColor = () => {
    if (score >= 70) return 'text-success-500'
    if (score >= 50) return 'text-warning-500'
    return 'text-danger-500'
  }

  const getScoreLevel = () => {
    if (score >= 70) return 'Good'
    if (score >= 50) return 'Moderate'
    return 'Needs Improvement'
  }

  const getScoreBg = () => {
    if (score >= 70) return 'bg-success-500'
    if (score >= 50) return 'bg-warning-500'
    return 'bg-danger-500'
  }

  const confidenceColors = {
    High: 'success',
    Medium: 'warning',
    Low: 'danger'
  } as const

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-primary-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20">
            <Award className="h-8 w-8 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Health Score</h2>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">{score}</span>
              <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">/ 100</span>
              <Badge variant={confidenceColors[confidence as keyof typeof confidenceColors] || 'default'} size="md">
                {confidence} Confidence
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 dark:text-gray-300">{getScoreLevel()}</span>
            <span className="text-gray-500 dark:text-gray-400">{score}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${getScoreBg()}`}
              style={{ width: `${score}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Dataset: {datasetName}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AIHealthScore
