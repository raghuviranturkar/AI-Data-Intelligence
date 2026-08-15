import React, { useEffect, useState } from 'react'
import { CheckCircle, Clock, Award, Activity, AlertTriangle, Layers } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface AnalysisOverviewProps {
  datasetName: string
  status: 'completed' | 'running' | 'failed' | 'warning'
  timestamp: string
  duration: string
  healthScore: number
  qualityScore: number
  className?: string
}

const AnalysisOverview: React.FC<AnalysisOverviewProps> = ({
  datasetName,
  status,
  timestamp,
  duration,
  healthScore,
  qualityScore,
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
    completed: { label: 'Completed', variant: 'success' as const, icon: CheckCircle, color: colors.accent.teal },
    running: { label: 'Running', variant: 'warning' as const, icon: Activity, color: colors.accent.amber },
    failed: { label: 'Failed', variant: 'danger' as const, icon: AlertTriangle, color: colors.accent.coral },
    warning: { label: 'Warning', variant: 'warning' as const, icon: AlertTriangle, color: colors.accent.amber },
  }

  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <div 
      className={cn('rounded-lg border p-6 transition-colors duration-300', className)}
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.border
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div 
            className="p-3 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <StatusIcon className="h-6 w-6" style={{ color: config.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight" style={{ color: colors.text }}>Analysis Overview</h2>
              <Badge variant={config.variant} size="md">{config.label}</Badge>
            </div>
            <p className="text-sm font-mono mt-0.5" style={{ color: colors.textMuted }}>{datasetName}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-mono" style={{ color: colors.textMuted }}>
            <Clock className="h-4 w-4" />
            <span>{timestamp}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-mono" style={{ color: colors.textMuted }}>
            <Activity className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t" style={{ borderColor: colors.border }}>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>AI Health Score</p>
          <p className="text-lg font-bold" style={{ color: colors.text }}>{healthScore}/100</p>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Quality Score</p>
          <p className="text-lg font-bold" style={{ color: colors.text }}>{qualityScore}/100</p>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Status</p>
          <p className="text-sm font-medium capitalize" style={{ color: colors.text }}>{status}</p>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Dataset</p>
          <p className="text-sm font-medium truncate" style={{ color: colors.text }}>{datasetName}</p>
        </div>
      </div>
    </div>
  )
}

export default AnalysisOverview
