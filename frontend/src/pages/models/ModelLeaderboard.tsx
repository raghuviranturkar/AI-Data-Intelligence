import React, { useState } from 'react'
import { Trophy, Award, Medal, TrendingUp, TrendingDown, ChevronUp, ChevronDown } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface ModelLeaderboardProps {
  rankedModels: any[]
}

type SortKey = 'rank' | 'model_name' | 'score' | 'cv_score' | 'training_time'

const ModelLeaderboard: React.FC<ModelLeaderboardProps> = ({ rankedModels }) => {
  const [sortKey, setSortKey] = useState<SortKey>('rank')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  if (rankedModels.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Model Leaderboard</h3>
        <p className="text-gray-400 dark:text-gray-500">No models to display</p>
      </div>
    )
  }

  const sortedModels = [...rankedModels].sort((a, b) => {
    let aVal = a[sortKey] ?? 0
    let bVal = b[sortKey] ?? 0
    if (sortKey === 'model_name') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal)
    }
    return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
  })

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2: return <Award className="h-5 w-5 text-gray-400" />
      case 3: return <Medal className="h-5 w-5 text-amber-600" />
      default: return <span className="text-sm text-gray-400">{rank}</span>
    }
  }

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return null
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-3 w-3" />
      : <ChevronDown className="h-3 w-3" />
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Model Leaderboard</h3>
        <Badge variant="info" size="sm">{rankedModels.length} Models</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => handleSort('rank')}
              >
                Rank {getSortIcon('rank')}
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => handleSort('model_name')}
              >
                Model {getSortIcon('model_name')}
              </th>
              <th 
                className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => handleSort('score')}
              >
                Score {getSortIcon('score')}
              </th>
              <th 
                className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => handleSort('cv_score')}
              >
                CV Score {getSortIcon('cv_score')}
              </th>
              <th 
                className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => handleSort('training_time')}
              >
                Time {getSortIcon('training_time')}
              </th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedModels.map((model) => {
              const isBest = model.rank === 1
              const status = isBest ? 'Best' : model.rank <= 3 ? 'Good' : 'Fair'
              const statusColor = isBest ? 'success' : model.rank <= 3 ? 'info' : 'default'

              return (
                <tr
                  key={model.model_name}
                  className={cn(
                    'border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors',
                    isBest ? 'bg-success-50/30 dark:bg-success-900/10' : ''
                  )}
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
                      {model.score ? (model.score * 100).toFixed(1) : 'N/A'}%
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="font-mono text-gray-500 dark:text-gray-400">
                      {model.cv_score ? (model.cv_score * 100).toFixed(1) : 'N/A'}%
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="font-mono text-gray-500 dark:text-gray-400">
                      {model.training_time ? model.training_time.toFixed(2) : '—'}s
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <Badge variant={statusColor as any} size="sm">
                      {status}
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
