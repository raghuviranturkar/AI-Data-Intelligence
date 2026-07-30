import React from 'react'
import { Award, TrendingUp, Clock, Eye } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { cn } from '../../utils/cn'

interface CandidateModelsProps {
  rankedModels: any[]
  bestModelName: string
  onSelectModel?: (modelName: string) => void
}

const CandidateModels: React.FC<CandidateModelsProps> = ({
  rankedModels,
  bestModelName,
  onSelectModel,
}) => {
  if (rankedModels.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Candidate Models</h3>
        <p className="text-gray-400 dark:text-gray-500">No models available</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Candidate Models</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {rankedModels.map((model) => {
          const isBest = model.model_name === bestModelName
          const score = model.score || 0

          return (
            <div
              key={model.model_name}
              className={cn(
                'rounded-lg border p-4 transition-all duration-200 hover:shadow-md',
                isBest
                  ? 'border-yellow-400 dark:border-yellow-600 bg-yellow-50/50 dark:bg-yellow-900/10'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30'
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {model.model_name}
                    </p>
                    {isBest && <Award className="h-4 w-4 text-yellow-500 flex-shrink-0" />}
                  </div>
                  {isBest && (
                    <Badge variant="success" size="sm">🏆 Best Model</Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<Eye className="h-3 w-3" />}
                  onClick={() => onSelectModel?.(model.model_name)}
                >
                  View
                </Button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-1 text-xs">
                <div className="text-gray-500 dark:text-gray-400">Score</div>
                <div className="text-right font-medium text-gray-900 dark:text-white">
                  {score ? (score * 100).toFixed(1) : 'N/A'}%
                </div>
                <div className="text-gray-500 dark:text-gray-400">Rank</div>
                <div className="text-right font-medium text-gray-900 dark:text-white">
                  #{model.rank}
                </div>
              </div>

              <div className="mt-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                <div
                  className={cn(
                    'h-1 rounded-full transition-all duration-500',
                    isBest ? 'bg-yellow-500' : 'bg-primary-600'
                  )}
                  style={{ width: `${Math.min(score * 100, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CandidateModels
