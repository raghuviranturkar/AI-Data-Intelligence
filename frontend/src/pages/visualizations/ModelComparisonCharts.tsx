import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { GitBranch, Trophy } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface ModelComparisonChartsProps {
  data: any
}

const ModelComparisonCharts: React.FC<ModelComparisonChartsProps> = ({ data }) => {
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
      purple: '#B48CF2',
    }
  }

  const automl = data?.automl || {}
  const rankedModels = automl?.ranked_models || []
  const bestModel = automl?.best_model || {}

  const chartColors = {
    grid: isDark ? '#232B35' : '#E5E7EB',
    text: isDark ? '#8B96A5' : '#6B7280',
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
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="p-1.5 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <GitBranch className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Model Comparison</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No model data available</p>
        </div>
      </div>
    )
  }

  const chartData = rankedModels.map((model: any) => ({
    name: model.model_name,
    score: model.score,
    cvScore: model.cv_score || 0,
    isBest: model.rank === 1,
  }))

  return (
    <div 
      className="rounded-lg border p-6 transition-colors duration-300"
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div 
          className="p-1.5 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <Trophy className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Model Comparison</h3>
        <span className="text-xs font-mono" style={{ color: colors.textMuted }}>· {rankedModels.length} models</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <div 
            className="rounded-md border p-4"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <h4 className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: colors.textMuted }}>
              Performance Comparison
            </h4>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="name" stroke={chartColors.text} tick={{ fill: chartColors.text, fontSize: 10 }} interval={0} />
                <YAxis domain={[0, 1]} stroke={chartColors.text} tick={{ fill: chartColors.text }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#12181F' : '#FFFFFF',
                    border: `1px solid ${isDark ? '#232B35' : '#E5E7EB'}`,
                    borderRadius: '8px',
                  }}
                />
                <Legend wrapperStyle={{ color: isDark ? '#8B96A5' : '#6B7280' }} />
                <Bar dataKey="score" name="Test Score" fill={colors.accent.azure} radius={[4, 4, 0, 0]} />
                <Bar dataKey="cvScore" name="CV Score" fill={colors.accent.purple} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div 
            className="rounded-md border p-4 h-full"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <h4 className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: colors.textMuted }}>
              Leaderboard
            </h4>
            <div className="space-y-2.5">
              {rankedModels.slice(0, 5).map((model: any) => (
                <div 
                  key={model.model_name} 
                  className="p-3 rounded-md border transition-all duration-200"
                  style={{ 
                    borderColor: model.rank === 1 ? colors.accent.amber : colors.border,
                    backgroundColor: model.rank === 1 ? (isDark ? 'rgba(240,169,78,0.08)' : 'rgba(240,169,78,0.05)') : 'transparent'
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold" style={{ color: colors.textDim }}>#{model.rank}</span>
                      <span className="text-xs font-medium" style={{ color: colors.text }}>{model.model_name}</span>
                    </div>
                    {model.rank === 1 && <Badge variant="success" size="sm">🏆 Best</Badge>}
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] font-mono" style={{ color: colors.textMuted }}>
                    <span>Score: {model.score.toFixed(3)}</span>
                    <span>CV: {model.cv_score?.toFixed(3) || '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModelComparisonCharts
