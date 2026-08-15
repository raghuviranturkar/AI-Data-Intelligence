import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { TrendingUp } from 'lucide-react'

interface PerformanceChartsProps {
  rankedModels: any[]
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ rankedModels }) => {
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

  if (rankedModels.length === 0) {
    return (
      <div 
        className="rounded-lg border p-6 transition-colors duration-300"
        style={{ 
          backgroundColor: colors.panel,
          borderColor: colors.border
        }}
      >
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Performance Comparison</h3>
        <p className="text-sm font-mono mt-2" style={{ color: colors.textMuted }}>No performance data available</p>
      </div>
    )
  }

  const chartData = rankedModels.map((model) => ({
    name: model.model_name,
    score: model.score ? model.score * 100 : 0,
    cvScore: model.cv_score ? model.cv_score * 100 : 0,
    time: model.training_time || 0,
  }))

  const chartColors = {
    grid: isDark ? '#232B35' : '#E5E7EB',
    text: isDark ? '#8B96A5' : '#6B7280',
  }

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
          <TrendingUp className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Performance Comparison</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Comparison */}
        <div>
          <h4 className="text-xs font-mono mb-3" style={{ color: colors.textMuted }}>Score Comparison</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="name" stroke={chartColors.text} tick={{ fill: chartColors.text, fontSize: 10 }} interval={0} />
              <YAxis domain={[0, 100]} stroke={chartColors.text} tick={{ fill: chartColors.text }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#12181F' : '#FFFFFF',
                  border: `1px solid ${isDark ? '#232B35' : '#E5E7EB'}`,
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="score" name="Score" fill={colors.accent.amber} radius={[4, 4, 0, 0]} />
              <Bar dataKey="cvScore" name="CV Score" fill={colors.accent.azure} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Training Time */}
        <div>
          <h4 className="text-xs font-mono mb-3" style={{ color: colors.textMuted }}>Training Time</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} horizontal={false} />
              <XAxis type="number" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
              <YAxis dataKey="name" type="category" stroke={chartColors.text} tick={{ fill: chartColors.text, fontSize: 10 }} width={60} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#12181F' : '#FFFFFF',
                  border: `1px solid ${isDark ? '#232B35' : '#E5E7EB'}`,
                  borderRadius: '8px',
                }}
                formatter={(value: any) => `${value.toFixed(2)}s`}
              />
              <Bar dataKey="time" name="Training Time" fill={colors.accent.purple} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default PerformanceCharts
