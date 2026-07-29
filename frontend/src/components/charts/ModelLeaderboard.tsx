import React from 'react'
import { Trophy, Award, Medal, TrendingUp, TrendingDown } from 'lucide-react'
import { Badge } from '../common/Badge'
import { useTheme } from '../../context/ThemeContext'

interface ModelData {
  rank: number
  model_name: string
  score: number
  cv_score?: number
}

interface ModelLeaderboardProps {
  data: ModelData[]
  title?: string
}

const ModelLeaderboard: React.FC<ModelLeaderboardProps> = ({
  data,
  title = 'Model Performance Leaderboard',
}) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2: return <Award className="h-5 w-5 text-gray-400" />
      case 3: return <Medal className="h-5 w-5 text-amber-600" />
      default: return <span className="text-sm text-gray-400">{rank}</span>
    }
  }

  const getStatus = (rank: number) => {
    switch (rank) {
      case 1: return { label: 'Best', color: 'success' as const }
      case 2: return { label: 'Good', color: 'info' as const }
      case 3: return { label: 'Good', color: 'info' as const }
      case 4: return { label: 'Fair', color: 'warning' as const }
      default: return { label: 'Fair', color: 'default' as const }
    }
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="flex items-center justify-center h-[200px] text-gray-400 dark:text-gray-500">
          No model data available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Rank</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Model</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Score</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">CV Score</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((model) => {
              const status = getStatus(model.rank)
              return (
                <tr
                  key={model.model_name}
                  className={`border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${
                    model.rank === 1 ? 'bg-success-50/30 dark:bg-success-900/10' : ''
                  }`}
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      {getRankIcon(model.rank)}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {model.model_name}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="font-mono text-gray-900 dark:text-white">
                      {model.score.toFixed(3)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="font-mono text-gray-500 dark:text-gray-400">
                      {model.cv_score ? model.cv_score.toFixed(3) : '—'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Badge variant={status.color} size="sm">
                      {status.label}
                    </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ModelLeaderboard
