import React, { useEffect, useState } from 'react'
import { CheckCircle, Clock, Database, Brain, FileText, AlertTriangle, Award, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface AnalysisSummarySectionProps {
  modulesExecuted: number
  warnings: number
  insightsGenerated: number
  qualityScore: number
  duration: string
  status: 'success' | 'warning' | 'error'
  className?: string
}

const AnalysisSummarySection: React.FC<AnalysisSummarySectionProps> = ({
  modulesExecuted,
  warnings,
  insightsGenerated,
  qualityScore,
  duration,
  status,
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

  const statusConfig = {
    success: { label: 'Success', variant: 'success' as const, icon: CheckCircle, color: colors.accent.teal },
    warning: { label: 'Completed with Warnings', variant: 'warning' as const, icon: AlertTriangle, color: colors.accent.amber },
    error: { label: 'Failed', variant: 'danger' as const, icon: AlertTriangle, color: colors.accent.coral },
  }

  const config = statusConfig[status]
  const StatusIcon = config.icon

  const summaryItems = [
    { label: 'Modules', value: modulesExecuted, icon: <Database className="h-4 w-4" /> },
    { label: 'Warnings', value: warnings, icon: <AlertTriangle className="h-4 w-4" /> },
    { label: 'Insights', value: insightsGenerated, icon: <Brain className="h-4 w-4" /> },
    { label: 'Quality', value: `${qualityScore}/100`, icon: <Award className="h-4 w-4" /> },
  ]

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
          <Award className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Analysis Summary</h3>
        <Badge variant="info" size="sm">Complete</Badge>
      </div>

      <div 
        className="rounded-md border p-5"
        style={{ 
          backgroundColor: colors.panel,
          borderColor: colors.border
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-md border"
              style={{ 
                backgroundColor: colors.panelAlt,
                borderColor: config.color,
              }}
            >
              <StatusIcon className="h-5 w-5" style={{ color: config.color }} />
            </div>
            <div>
              <p className="text-xs font-medium" style={{ color: colors.text }}>Analysis Status</p>
              <Badge variant={config.variant} size="sm">{config.label}</Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono" style={{ color: colors.textMuted }}>Duration</p>
            <p className="text-lg font-semibold" style={{ color: colors.text }}>{duration}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
          {summaryItems.map((item, index) => (
            <div 
              key={index} 
              className="p-3 rounded-md border"
              style={{ 
                backgroundColor: colors.panelAlt,
                borderColor: colors.border
              }}
            >
              <div className="flex items-center gap-2">
                <span style={{ color: colors.textMuted }}>{item.icon}</span>
                <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>{item.label}</span>
              </div>
              <p className="text-lg font-bold mt-0.5" style={{ color: colors.text }}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnalysisSummarySection
