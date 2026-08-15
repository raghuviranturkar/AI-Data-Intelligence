import React, { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface OutlierChartsProps {
  data: any
}

const OutlierCharts: React.FC<OutlierChartsProps> = ({ data }) => {
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

  const outliers = data?.outliers || {}
  const analysis = outliers?.analysis || {}
  const features = Object.entries(analysis)

  if (features.length === 0) {
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
            <Shield className="h-4 w-4" style={{ color: colors.accent.teal }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Outlier Analysis</h3>
        </div>
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 mx-auto mb-3" style={{ color: colors.accent.teal }} />
          <p className="text-sm font-medium" style={{ color: colors.accent.teal }}>No outliers detected</p>
          <p className="text-xs font-mono mt-1" style={{ color: colors.textMuted }}>
            All numeric columns are within expected ranges
          </p>
        </div>
      </div>
    )
  }

  const severityColors = {
    High: {
      border: isDark ? 'rgba(242,85,90,0.3)' : 'rgba(242,85,90,0.2)',
      bg: isDark ? 'rgba(242,85,90,0.08)' : 'rgba(242,85,90,0.05)',
    },
    Medium: {
      border: isDark ? 'rgba(240,169,78,0.3)' : 'rgba(240,169,78,0.2)',
      bg: isDark ? 'rgba(240,169,78,0.08)' : 'rgba(240,169,78,0.05)',
    },
    Low: {
      border: isDark ? 'rgba(62,207,142,0.3)' : 'rgba(62,207,142,0.2)',
      bg: isDark ? 'rgba(62,207,142,0.08)' : 'rgba(62,207,142,0.05)',
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
          <AlertTriangle className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Outlier Analysis</h3>
        <span className="text-xs font-mono" style={{ color: colors.textMuted }}>· {features.length} columns</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.slice(0, 8).map(([column, info]: [string, any]) => {
          const outlierData = info?.outlier_analysis || {}
          const count = outlierData.outlier_count || 0
          const percentage = outlierData.outlier_percentage || 0
          const severity = info?.severity || 'None'
          const riskScore = info?.risk_score || 0

          const severityStyle = severityColors[severity as keyof typeof severityColors] || severityColors.None
          const badge = severityBadges[severity as keyof typeof severityBadges] || severityBadges.None
          const barColor = count > 20 ? colors.accent.coral : count > 10 ? colors.accent.amber : colors.accent.teal

          return (
            <div 
              key={column} 
              className="rounded-md border p-4 transition-all duration-200 hover:shadow-lg"
              style={{ 
                backgroundColor: severityStyle.bg,
                borderColor: severityStyle.border
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-medium" style={{ color: colors.text }}>{column}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={badge.variant} size="sm">{badge.label}</Badge>
                    <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>
                      {count} outliers ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono" style={{ color: colors.textMuted }}>Risk Score</p>
                  <p className="text-sm font-bold" style={{ color: colors.text }}>{riskScore}</p>
                </div>
              </div>
              <div className="mt-3 w-full h-1 rounded-full" style={{ backgroundColor: colors.border }}>
                <div 
                  className="h-1 rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${Math.min(percentage * 2, 100)}%`,
                    backgroundColor: barColor
                  }} 
                />
              </div>
              <p className="mt-2 text-[10px] font-mono" style={{ color: colors.textMuted }}>
                {info?.recommendation?.action || 'Review recommended'}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OutlierCharts
