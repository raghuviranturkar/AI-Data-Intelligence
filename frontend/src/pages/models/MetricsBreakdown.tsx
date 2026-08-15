import React, { useEffect, useState } from 'react'
import { Award, TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react'
import { cn } from '../../utils/cn'

interface MetricsBreakdownProps {
  bestModel: any
}

const MetricsBreakdown: React.FC<MetricsBreakdownProps> = ({ bestModel }) => {
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
      coral: '#F2555A',
    }
  }

  const metrics = bestModel?.metrics || {}

  const metricItems = [
    { key: 'accuracy', label: 'Accuracy', icon: Award, color: colors.accent.amber },
    { key: 'precision', label: 'Precision', icon: TrendingUp, color: colors.accent.teal },
    { key: 'recall', label: 'Recall', icon: Target, color: colors.accent.azure },
    { key: 'f1', label: 'F1 Score', icon: BarChart3, color: colors.accent.purple },
  ]

  const validMetrics = metricItems.filter(m => metrics[m.key] !== undefined && metrics[m.key] !== null)

  if (validMetrics.length === 0) {
    return (
      <div 
        className="rounded-lg border p-6 transition-colors duration-300"
        style={{ 
          backgroundColor: colors.panel,
          borderColor: colors.border
        }}
      >
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Metrics Breakdown</h3>
        <p className="text-sm font-mono mt-2" style={{ color: colors.textMuted }}>No metrics available</p>
      </div>
    )
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
          <BarChart3 className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Metrics Breakdown</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {validMetrics.map((metric) => {
          const value = metrics[metric.key] || 0
          const Icon = metric.icon
          const isGood = value > 0.8
          const isMedium = value > 0.6

          return (
            <div key={metric.key} className="p-4 rounded-md border" style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}>
              <div className="flex items-center justify-center gap-2">
                <Icon className="h-4 w-4" style={{ color: metric.color }} />
                <span className="text-xs font-mono" style={{ color: colors.textMuted }}>{metric.label}</span>
              </div>
              <p className="text-2xl font-bold text-center mt-1" style={{ color: colors.text }}>
                {(value * 100).toFixed(1)}%
              </p>
              <div className="mt-2 w-full rounded-full h-1.5" style={{ backgroundColor: colors.border }}>
                <div
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(value * 100, 100)}%`,
                    backgroundColor: isGood ? colors.accent.teal : isMedium ? colors.accent.amber : colors.accent.coral
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MetricsBreakdown
