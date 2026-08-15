import React, { useEffect, useState } from 'react'
import { Award, AlertTriangle, CheckCircle, Info, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface DataQualityInsightsProps {
  qualityScore: number
  warnings: string[]
  totalWarnings: number
}

const DataQualityInsights: React.FC<DataQualityInsightsProps> = ({
  qualityScore,
  warnings,
  totalWarnings
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

  const getScoreLevel = () => {
    if (qualityScore >= 80) return { label: 'Excellent', color: colors.accent.teal }
    if (qualityScore >= 60) return { label: 'Good', color: colors.accent.azure }
    if (qualityScore >= 40) return { label: 'Fair', color: colors.accent.amber }
    return { label: 'Needs Improvement', color: colors.accent.coral }
  }

  const level = getScoreLevel()

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
          <Activity className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Data Quality Insights</h3>
        <Badge variant="info" size="sm">{qualityScore}/100</Badge>
      </div>

      <div className="space-y-3">
        <div 
          className="flex items-center justify-between p-3 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-md border"
              style={{ 
                backgroundColor: colors.panel,
                borderColor: colors.border
              }}
            >
              <Award className="h-4 w-4" style={{ color: level.color }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: colors.text }}>Quality Score</p>
              <p className="text-[10px] font-mono" style={{ color: level.color }}>{level.label}</p>
            </div>
          </div>
          <span className="text-2xl font-bold" style={{ color: colors.text }}>{qualityScore}%</span>
        </div>

        <div 
          className="flex items-center justify-between p-3 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-md border"
              style={{ 
                backgroundColor: colors.panel,
                borderColor: colors.border
              }}
            >
              <AlertTriangle className="h-4 w-4" style={{ color: colors.accent.amber }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: colors.text }}>Warnings</p>
              <p className="text-[10px] font-mono" style={{ color: colors.textMuted }}>Issues detected</p>
            </div>
          </div>
          <span className="text-2xl font-bold" style={{ color: colors.text }}>{totalWarnings}</span>
        </div>

        {warnings.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>
              Details
            </p>
            {warnings.slice(0, 3).map((warning, index) => (
              <div 
                key={index} 
                className="flex items-start gap-2 p-2.5 rounded-md border"
                style={{ 
                  backgroundColor: isDark ? 'rgba(240,169,78,0.05)' : '#FFFBEB',
                  borderColor: isDark ? 'rgba(240,169,78,0.15)' : '#FDE68A'
                }}
              >
                <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: colors.accent.amber }} />
                <span className="text-xs font-mono" style={{ color: colors.textMuted }}>{warning}</span>
              </div>
            ))}
            {warnings.length > 3 && (
              <p className="text-[10px] font-mono" style={{ color: colors.textDim }}>
                + {warnings.length - 3} more warnings
              </p>
            )}
          </div>
        )}

        {warnings.length === 0 && (
          <div 
            className="flex items-center gap-2 p-3 rounded-md border"
            style={{ 
              backgroundColor: isDark ? 'rgba(62,207,142,0.05)' : '#F0FDF4',
              borderColor: isDark ? 'rgba(62,207,142,0.15)' : '#BBF7D0'
            }}
          >
            <CheckCircle className="h-4 w-4" style={{ color: colors.accent.teal }} />
            <span className="text-xs font-mono" style={{ color: colors.accent.teal }}>No quality warnings detected</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default DataQualityInsights
