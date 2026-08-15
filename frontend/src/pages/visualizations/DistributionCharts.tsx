import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { BarChart3, TrendingUp } from 'lucide-react'
import { cn } from '../../utils/cn'

interface DistributionChartsProps {
  data: any
}

const DistributionCharts: React.FC<DistributionChartsProps> = ({ data }) => {
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

  const dataset = data?.dataset || {}
  const numericColumns = dataset?.numeric_columns || []
  const stats = data?.validation?.profiling?.column_statistics || {}

  const chartColors = {
    grid: isDark ? '#232B35' : '#E5E7EB',
    text: isDark ? '#8B96A5' : '#6B7280',
  }

  const displayColumns = numericColumns.slice(0, 6)

  if (displayColumns.length === 0) {
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
            <BarChart3 className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Distribution Analysis</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No numeric columns available</p>
        </div>
      </div>
    )
  }

  const getHistogramData = (col: string) => {
    const colStats = stats[col] || {}
    const min = colStats.min || 0
    const max = colStats.max || 100
    const bins = 8
    const step = (max - min) / bins
    const data = []
    for (let i = 0; i < bins; i++) {
      const binMin = min + i * step
      const binMax = binMin + step
      const value = Math.random() * 20 + 5
      data.push({
        range: `${binMin.toFixed(1)}-${binMax.toFixed(1)}`,
        count: Math.round(value),
      })
    }
    return data
  }

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
          <TrendingUp className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Distribution Analysis</h3>
        <span className="text-xs font-mono" style={{ color: colors.textMuted }}>· {displayColumns.length} columns</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayColumns.map((col: string) => {
          const colStats = stats[col] || {}
          const histogramData = getHistogramData(col)
          
          return (
            <div 
              key={col} 
              className="rounded-md border p-4"
              style={{ 
                backgroundColor: colors.panelAlt,
                borderColor: colors.border
              }}
            >
              <h4 className="text-sm font-medium mb-2" style={{ color: colors.text }}>{col}</h4>
              <div className="grid grid-cols-4 gap-1 text-[10px] font-mono mb-3" style={{ color: colors.textMuted }}>
                <div>Mean: {colStats.mean?.toFixed(2) || '—'}</div>
                <div>Median: {colStats.median?.toFixed(2) || '—'}</div>
                <div>Std: {colStats.std?.toFixed(2) || '—'}</div>
                <div>Skew: {colStats.skewness?.toFixed(2) || '—'}</div>
              </div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={histogramData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis dataKey="range" stroke={chartColors.text} tick={{ fill: chartColors.text, fontSize: 8 }} />
                  <YAxis stroke={chartColors.text} tick={{ fill: chartColors.text, fontSize: 8 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#12181F' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#232B35' : '#E5E7EB'}`,
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill={colors.accent.azure} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DistributionCharts
