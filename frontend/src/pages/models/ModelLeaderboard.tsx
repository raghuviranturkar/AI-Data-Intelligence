import React, { useState, useEffect } from 'react'
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
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const colors = {
    border: isDark ? '#232B35' : '#E2E8F0',
    panel: isDark ? '#12181F' : '#FFFFFF',
    panelAlt: isDark ? '#0B0F14' : '#F8FAFC',
    text: isDark ? '#EDF1F5' : '#0F172A',
    textMuted: isDark ? '#8B96A5' : '#64748B',
    textDim: isDark ? '#4A5563' : '#94A3B8',
    accent: {
      amber: '#F0A94E',
      teal: '#3ECF8E',
      azure: '#4EA1F0',
    }
  }

  if (rankedModels.length === 0) {
    return (
      <div 
        className="rounded-lg border p-6 transition-colors duration-300"
        style={{ 
          backgroundColor: colors.panel,
          borderColor: colors.border
        }}
      >
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Model Leaderboard</h3>
        <p className="text-sm font-mono mt-2" style={{ color: colors.textMuted }}>No models to display</p>
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
      case 1: return <Trophy className="h-5 w-5" style={{ color: colors.accent.amber }} />
      case 2: return <Award className="h-5 w-5" style={{ color: colors.textMuted }} />
      case 3: return <Medal className="h-5 w-5" style={{ color: '#B48CF2' }} />
      default: return <span className="text-sm font-mono" style={{ color: colors.textDim }}>{rank}</span>
    }
  }

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return null
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-3 w-3" />
      : <ChevronDown className="h-3 w-3" />
  }

  return (
    <div 
      className="rounded-lg border p-6 transition-colors duration-300"
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="p-1.5 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <Trophy className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-base font-semibold" style={{ color: colors.text }}>Model Leaderboard</h3>
          <Badge variant="info" size="sm">{rankedModels.length} Models</Badge>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: colors.border }}>
              <th 
                className="px-3 py-2 text-left text-xs font-mono cursor-pointer hover:opacity-80 transition-opacity"
                style={{ color: colors.textMuted }}
                onClick={() => handleSort('rank')}
              >
                Rank {getSortIcon('rank')}
              </th>
              <th 
                className="px-3 py-2 text-left text-xs font-mono cursor-pointer hover:opacity-80 transition-opacity"
                style={{ color: colors.textMuted }}
                onClick={() => handleSort('model_name')}
              >
                Model {getSortIcon('model_name')}
              </th>
              <th 
                className="px-3 py-2 text-right text-xs font-mono cursor-pointer hover:opacity-80 transition-opacity"
                style={{ color: colors.textMuted }}
                onClick={() => handleSort('score')}
              >
                Score {getSortIcon('score')}
              </th>
              <th 
                className="px-3 py-2 text-right text-xs font-mono cursor-pointer hover:opacity-80 transition-opacity"
                style={{ color: colors.textMuted }}
                onClick={() => handleSort('cv_score')}
              >
                CV Score {getSortIcon('cv_score')}
              </th>
              <th 
                className="px-3 py-2 text-right text-xs font-mono cursor-pointer hover:opacity-80 transition-opacity"
                style={{ color: colors.textMuted }}
                onClick={() => handleSort('training_time')}
              >
                Time {getSortIcon('training_time')}
              </th>
              <th className="px-3 py-2 text-center text-xs font-mono" style={{ color: colors.textMuted }}>
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
                    'border-b transition-colors',
                    isBest ? 'bg-[#F0A94E]/5' : ''
                  )}
                  style={{ 
                    borderColor: colors.border,
                    backgroundColor: isBest ? 'rgba(240,169,78,0.05)' : undefined
                  }}
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      {getRankIcon(model.rank)}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-medium text-sm" style={{ color: colors.text }}>
                      {model.model_name}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="font-mono text-sm" style={{ color: colors.text }}>
                      {model.score ? (model.score * 100).toFixed(1) : 'N/A'}%
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="font-mono text-sm" style={{ color: colors.textMuted }}>
                      {model.cv_score ? (model.cv_score * 100).toFixed(1) : 'N/A'}%
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <span className="font-mono text-sm" style={{ color: colors.textMuted }}>
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
