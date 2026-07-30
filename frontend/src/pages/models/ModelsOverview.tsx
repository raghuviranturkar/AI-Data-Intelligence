import React from 'react'
import { Brain, Award, TrendingUp, Clock, Target, BarChart3 } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface ModelsOverviewProps {
  modelsTrained: number
  bestModel: any
  problemType: string
  rankedModels: any[]
}

const ModelsOverview: React.FC<ModelsOverviewProps> = ({
  modelsTrained,
  bestModel,
  problemType,
  rankedModels,
}) => {
  const bestScore = bestModel?.score || 0
  const cvScore = bestModel?.cv_score || 0
  const trainingTime = bestModel?.training_time || 0

  const overviewItems = [
    {
      label: 'Models Trained',
      value: modelsTrained.toString(),
      icon: <Brain className="h-5 w-5" />,
      color: 'text-primary-600 dark:text-primary-400',
      bg: 'bg-primary-50 dark:bg-primary-900/20',
    },
    {
      label: 'Best Model',
      value: bestModel?.name || 'N/A',
      icon: <Award className="h-5 w-5" />,
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      subtitle: bestScore ? `${(bestScore * 100).toFixed(1)}%` : undefined,
    },
    {
      label: 'Best Score',
      value: bestScore ? `${(bestScore * 100).toFixed(1)}%` : 'N/A',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-success-600 dark:text-success-400',
      bg: 'bg-success-50 dark:bg-success-900/20',
      subtitle: `CV: ${cvScore ? (cvScore * 100).toFixed(1) : 'N/A'}%`,
    },
    {
      label: 'Training Time',
      value: trainingTime ? `${trainingTime.toFixed(2)}s` : 'N/A',
      icon: <Clock className="h-5 w-5" />,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Problem Type',
      value: problemType || 'Unknown',
      icon: <Target className="h-5 w-5" />,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      label: 'Total Models',
      value: rankedModels.length.toString(),
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {overviewItems.map((item, index) => (
        <div
          key={index}
          className={`${item.bg} rounded-xl p-4 border border-gray-100 dark:border-gray-700 transition-all duration-200 hover:shadow-md`}
        >
          <div className="flex items-center gap-2">
            <div className={item.color}>{item.icon}</div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
          </div>
          <div className="mt-1">
            <span className="text-xl font-bold text-gray-900 dark:text-white">{item.value}</span>
            {item.subtitle && (
              <span className="block text-xs text-gray-500 dark:text-gray-400">{item.subtitle}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ModelsOverview
