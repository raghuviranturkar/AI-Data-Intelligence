import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { BarChart3, TrendingUp } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface FeatureImportanceChartProps {
  featureRanking: any[]
}

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ featureRanking }) => {
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

  if (featureRanking.length === 0) {
    return (
      <div 
        className="rounded-lg border p-5 transition-colors duration-300"
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
            <BarChart3 className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Global Feature Importance</h3>
        </div>
        <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No feature importance data available</p>
      </div>
    )
  }

  const chartColors = {
    grid: isDark ? '#232B35' : '#E5E7EB',
    text: isDark ? '#8B96A5' : '#6B7280',
  }

  const chartData = featureRanking.map((item) => ({
    name: item.feature,
    importance: item.importance,
    percentage: item.percentage || 0,
  }))

  const getBarColor = (percentage: number) => {
    if (percentage > 15) return colors.accent.azure
    if (percentage > 8) return colors.accent.purple
    if (percentage > 3) return colors.accent.teal
    return colors.textDim
  }

  return (
    <div 
      className="rounded-lg border p-5 transition-colors duration-300"
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
            <TrendingUp className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Global Feature Importance</h3>
          <Badge variant="info" size="sm">{featureRanking.length} Features</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} horizontal={false} />
              <XAxis type="number" domain={[0, 'dataMax + 0.05']} stroke={chartColors.text} tick={{ fill: chartColors.text }} />
              <YAxis dataKey="name" type="category" stroke={chartColors.text} tick={{ fill: chartColors.text }} width={70} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#12181F' : '#FFFFFF',
                  border: `1px solid ${isDark ? '#232B35' : '#E5E7EB'}`,
                  borderRadius: '8px',
                }}
                formatter={(value: any, name: string) => {
                  if (name === 'percentage') return `${(value * 100).toFixed(1)}%`
                  return value
                }}
              />
              <Bar dataKey="percentage" name="Importance" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage * 100)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <div 
            className="p-3 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Top Feature</p>
            <p className="text-base font-bold" style={{ color: colors.text }}>{chartData[0]?.name || 'N/A'}</p>
            <p className="text-xs font-mono" style={{ color: colors.accent.amber }}>
              {(chartData[0]?.percentage * 100 || 0).toFixed(1)}% impact
            </p>
          </div>
          <div 
            className="p-3 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Top 3 Features</p>
            <p className="text-xs font-mono" style={{ color: colors.text }}>
              {chartData.slice(0, 3).map((d: any) => d.name).join(', ')}
            </p>
            <p className="text-[10px] font-mono mt-1" style={{ color: colors.textDim }}>
              {chartData.slice(0, 3).reduce((acc, d) => acc + d.percentage * 100, 0).toFixed(1)}% cumulative impact
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureImportanceChart
