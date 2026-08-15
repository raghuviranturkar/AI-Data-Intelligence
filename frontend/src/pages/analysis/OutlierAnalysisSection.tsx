import React, { useEffect, useState } from 'react'
import { AlertTriangle, TrendingUp, TrendingDown, Info, Shield, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface OutlierFeature {
  column: string
  outlier_count: number
  outlier_percentage: number
  severity: string
  risk_score: number
  distribution: string
  recommendation: string
}

interface OutlierAnalysisSectionProps {
  features: OutlierFeature[]
  summary: {
    total_outliers: number
    highest_risk_column: string
    columns_with_outliers: number
    ranking: string[]
  }
  className?: string
}

const OutlierAnalysisSection: React.FC<OutlierAnalysisSectionProps> = ({
  features,
  summary,
  className,
}) => {
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
    }
  }

  const severityColors = {
    High: {
      border: isDark ? 'rgba(242,85,90,0.2)' : '#FECACA',
      bg: isDark ? 'rgba(242,85,90,0.05)' : '#FEF2F2',
    },
    Medium: {
      border: isDark ? 'rgba(240,169,78,0.2)' : '#FDE68A',
      bg: isDark ? 'rgba(240,169,78,0.05)' : '#FFFBEB',
    },
    Low: {
      border: isDark ? 'rgba(62,207,142,0.2)' : '#BBF7D0',
      bg: isDark ? 'rgba(62,207,142,0.05)' : '#F0FDF4',
    },
    None: {
      border: colors.border,
      bg: colors.panelAlt,
    },
  }

  const severityBadges = {
    High: { label: 'High Risk', variant: 'danger' as const },
    Medium: { label: 'Moderate', variant: 'warning' as const },
    Low: { label: 'Low', variant: 'success' as const },
    None: { label: 'None', variant: 'default' as const },
  }

  const severityColors_ = {
    High: colors.accent.coral,
    Medium: colors.accent.amber,
    Low: colors.accent.teal,
    None: colors.textDim,
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
          <Shield className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Outlier Analysis</h3>
        <Badge variant="info" size="sm">{features.length} Features</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div 
          className="rounded-md border p-3"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Total Outliers</p>
          <p className="text-xl font-bold" style={{ color: colors.text }}>{summary.total_outliers}</p>
        </div>
        <div 
          className="rounded-md border p-3"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Columns Affected</p>
          <p className="text-xl font-bold" style={{ color: colors.text }}>{summary.columns_with_outliers}</p>
        </div>
        <div 
          className="rounded-md border p-3"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Highest Risk</p>
          <p className="text-xs font-medium truncate" style={{ color: colors.text }}>{summary.highest_risk_column || 'None'}</p>
        </div>
        <div 
          className="rounded-md border p-3"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Risk Ranking</p>
          <p className="text-xs font-medium truncate" style={{ color: colors.text }}>
            {summary.ranking.slice(0, 3).join(' → ') || 'N/A'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {features.map((feature) => {
          const badge = severityBadges[feature.severity as keyof typeof severityBadges] || severityBadges.None
          const severityStyle = severityColors[feature.severity as keyof typeof severityColors] || severityColors.None
          const severityColor = severityColors_[feature.severity as keyof typeof severityColors_] || colors.textDim

          return (
            <div
              key={feature.column}
              className="rounded-md border p-3.5 transition-all duration-200 hover:shadow-lg"
              style={{ 
                backgroundColor: severityStyle.bg,
                borderColor: severityStyle.border
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: colors.text }}>{feature.column}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                    <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>
                      {feature.outlier_count} outliers ({feature.outlier_percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono" style={{ color: colors.textMuted }}>Risk Score</p>
                  <p className="text-sm font-bold" style={{ color: severityColor }}>{feature.risk_score}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-4 text-[10px] font-mono" style={{ color: colors.textMuted }}>
                <span>Distribution: {feature.distribution}</span>
                <span className="w-px h-3" style={{ backgroundColor: colors.border }} />
                <span style={{ color: colors.textDim }}>{feature.recommendation}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OutlierAnalysisSection
