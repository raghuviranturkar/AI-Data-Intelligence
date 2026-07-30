import React from 'react'
import { Brain, Target, Clock, Award, RefreshCw, GitBranch } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { Button } from '../../components/common/Button'
import { cn } from '../../utils/cn'

interface ModelsHeaderProps {
  problemType: string
  targetColumn: string
  modelsTrained: number
  trainingTime: number
  bestModelName: string
  bestModelScore: number
}

const ModelsHeader: React.FC<ModelsHeaderProps> = ({
  problemType,
  targetColumn,
  modelsTrained,
  trainingTime,
  bestModelName,
  bestModelScore,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 sticky top-16 z-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-900/20">
            <Brain className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Models</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <Badge variant="info" size="sm">
                <Target className="h-3 w-3 inline mr-1" />
                {targetColumn}
              </Badge>
              <Badge variant="info" size="sm">
                {problemType}
              </Badge>
              <Badge variant="info" size="sm">
                <Brain className="h-3 w-3 inline mr-1" />
                {modelsTrained} Models
              </Badge>
              <Badge variant="info" size="sm">
                <Clock className="h-3 w-3 inline mr-1" />
                {trainingTime.toFixed(1)}s
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800">
            <Award className="h-4 w-4 text-success-600 dark:text-success-400" />
            <span className="text-sm font-medium text-success-700 dark:text-success-400">
              Best: {bestModelName} ({bestModelScore ? (bestModelScore * 100).toFixed(1) : 'N/A'}%)
            </span>
          </div>
          <Button variant="secondary" size="sm" icon={<RefreshCw className="h-4 w-4" />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" icon={<GitBranch className="h-4 w-4" />}>
            Compare
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ModelsHeader
