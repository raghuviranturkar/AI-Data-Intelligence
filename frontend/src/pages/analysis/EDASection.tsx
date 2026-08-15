import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, BarChart3, Lightbulb, ChevronDown, ChevronRight, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface Insight {
  title: string
  description: string
  severity: 'positive' | 'negative' | 'warning' | 'info'
  recommendation?: string
}

interface ColumnStat {
  column: string
  mean?: number
  median?: number
  std?: number
  min?: number
  max?: number
  unique?: number
}

interface EDASectionProps {
  insights: Insight[]
  strongCorrelations: Array<{ feature1: string; feature2: string; correlation: number }>
  columnStats?: ColumnStat[]
  className?: string
}

const EDASection: React.FC<EDASectionProps> = ({
  insights,
  strongCorrelations,
  columnStats = [],
  className,
}) => {
  const [expanded, setExpanded] = useState(false)
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
      coral: '#F2555A',
      purple: '#B48CF2',
    }
  }

  const severityColors = {
    positive: {
      border: isDark ? 'rgba(62,207,142,0.2)' : '#BBF7D0',
      bg: isDark ? 'rgba(62,207,142,0.05)' : '#F0FDF4',
    },
    negative: {
      border: isDark ? 'rgba(242,85,90,0.2)' : '#FECACA',
      bg: isDark ? 'rgba(242,85,90,0.05)' : '#FEF2F2',
    },
    warning: {
      border: isDark ? 'rgba(240,169,78,0.2)' : '#FDE68A',
      bg: isDark ? 'rgba(240,169,78,0.05)' : '#FFFBEB',
    },
    info: {
      border: isDark ? 'rgba(78,161,240,0.2)' : '#BFDBFE',
      bg: isDark ? 'rgba(78,161,240,0.05)' : '#EFF6FF',
    },
  }

  const severityIcons = {
    positive: TrendingUp,
    negative: TrendingDown,
    warning: TrendingDown,
    info: Lightbulb,
  }

  const severityIconColors = {
    positive: colors.accent.teal,
    negative: colors.accent.coral,
    warning: colors.accent.amber,
    info: colors.accent.azure,
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-3">
        <div 
          className="p-1.5 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <Activity className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Exploratory Data Analysis</h3>
        <Badge variant="info" size="sm">{insights.length} Insights</Badge>
      </div>

      {strongCorrelations.length > 0 && (
        <div 
          className="rounded-md border p-4"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: colors.text }}>Strong Correlations Detected</p>
          <div className="space-y-2">
            {strongCorrelations.map((corr, i) => (
              <div key={i} className="flex items-center justify-between text-xs font-mono">
                <span style={{ color: colors.textMuted }}>
                  {corr.feature1} ↔ {corr.feature2}
                </span>
                <Badge variant="info" size="sm">r = {corr.correlation.toFixed(2)}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Column Statistics */}
      {columnStats.length > 0 && (
        <div 
          className="rounded-md border overflow-hidden"
          style={{ 
            backgroundColor: colors.panel,
            borderColor: colors.border
          }}
        >
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between p-3 transition-colors"
            style={{ backgroundColor: colors.panelAlt }}
          >
            <span className="text-xs font-medium" style={{ color: colors.text }}>Column Statistics</span>
            {expanded ? (
              <ChevronDown className="h-4 w-4" style={{ color: colors.textDim }} />
            ) : (
              <ChevronRight className="h-4 w-4" style={{ color: colors.textDim }} />
            )}
          </button>
          {expanded && (
            <div className="p-3 pt-2 border-t" style={{ borderColor: colors.border }}>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b" style={{ borderColor: colors.border }}>
                      <th className="px-2 py-1.5 text-left font-mono" style={{ color: colors.textMuted }}>Column</th>
                      <th className="px-2 py-1.5 text-right font-mono" style={{ color: colors.textMuted }}>Mean</th>
                      <th className="px-2 py-1.5 text-right font-mono" style={{ color: colors.textMuted }}>Median</th>
                      <th className="px-2 py-1.5 text-right font-mono" style={{ color: colors.textMuted }}>Std Dev</th>
                      <th className="px-2 py-1.5 text-right font-mono" style={{ color: colors.textMuted }}>Min</th>
                      <th className="px-2 py-1.5 text-right font-mono" style={{ color: colors.textMuted }}>Max</th>
                      <th className="px-2 py-1.5 text-right font-mono" style={{ color: colors.textMuted }}>Unique</th>
                    </tr>
                  </thead>
                  <tbody>
                    {columnStats.slice(0, 10).map((stat) => (
                      <tr key={stat.column} className="border-b" style={{ borderColor: colors.border }}>
                        <td className="px-2 py-1.5 font-medium" style={{ color: colors.text }}>{stat.column}</td>
                        <td className="px-2 py-1.5 text-right font-mono" style={{ color: colors.textMuted }}>{stat.mean?.toFixed(2) || '—'}</td>
                        <td className="px-2 py-1.5 text-right font-mono" style={{ color: colors.textMuted }}>{stat.median?.toFixed(2) || '—'}</td>
                        <td className="px-2 py-1.5 text-right font-mono" style={{ color: colors.textMuted }}>{stat.std?.toFixed(2) || '—'}</td>
                        <td className="px-2 py-1.5 text-right font-mono" style={{ color: colors.textMuted }}>{stat.min?.toFixed(2) || '—'}</td>
                        <td className="px-2 py-1.5 text-right font-mono" style={{ color: colors.textMuted }}>{stat.max?.toFixed(2) || '—'}</td>
                        <td className="px-2 py-1.5 text-right font-mono" style={{ color: colors.textMuted }}>{stat.unique || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {columnStats.length > 10 && (
                  <p className="text-[10px] font-mono mt-2" style={{ color: colors.textDim }}>
                    Showing top 10 columns. {columnStats.length - 10} more not displayed.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2.5">
        {insights.map((insight, i) => {
          const Icon = severityIcons[insight.severity]
          const colors_ = severityColors[insight.severity]
          const iconColor = severityIconColors[insight.severity]
          return (
            <div
              key={i}
              className="rounded-md border-l-4 p-3.5"
              style={{ 
                backgroundColor: colors_.bg,
                borderColor: colors_.border,
                borderLeftColor: iconColor,
              }}
            >
              <div className="flex items-start gap-3">
                <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: iconColor }} />
                <div className="flex-1">
                  <p className="text-xs font-medium" style={{ color: colors.text }}>{insight.title}</p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: colors.textMuted }}>{insight.description}</p>
                  {insight.recommendation && (
                    <p className="text-xs font-mono mt-1" style={{ color: colors.accent.amber }}>
                      💡 {insight.recommendation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EDASection
