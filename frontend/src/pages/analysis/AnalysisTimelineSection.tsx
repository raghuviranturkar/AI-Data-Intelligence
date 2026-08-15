import React, { useEffect, useState } from 'react'
import { CheckCircle, Loader2, Clock, AlertCircle, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

export interface TimelineStep {
  id: string
  label: string
  status: 'completed' | 'running' | 'pending' | 'error'
  timestamp?: string
  description?: string
}

interface AnalysisTimelineSectionProps {
  steps: TimelineStep[]
  className?: string
}

const AnalysisTimelineSection: React.FC<AnalysisTimelineSectionProps> = ({
  steps,
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

  const getStatusIcon = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" style={{ color: colors.accent.teal }} />
      case 'running': return <Loader2 className="h-4 w-4 animate-spin" style={{ color: colors.accent.amber }} />
      case 'error': return <AlertCircle className="h-4 w-4" style={{ color: colors.accent.coral }} />
      default: return <Clock className="h-4 w-4" style={{ color: colors.textDim }} />
    }
  }

  const getStatusColor = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed': return colors.accent.teal
      case 'running': return colors.accent.amber
      case 'error': return colors.accent.coral
      default: return colors.textDim
    }
  }

  const getStatusBg = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed': return isDark ? 'rgba(62,207,142,0.05)' : '#F0FDF4'
      case 'running': return isDark ? 'rgba(240,169,78,0.05)' : '#FFFBEB'
      case 'error': return isDark ? 'rgba(242,85,90,0.05)' : '#FEF2F2'
      default: return colors.panelAlt
    }
  }

  const completedCount = steps.filter(s => s.status === 'completed').length
  const totalCount = steps.length
  const allCompleted = completedCount === totalCount

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
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Analysis Timeline</h3>
        <Badge variant={allCompleted ? 'success' : 'warning'} size="sm">
          {completedCount}/{totalCount} Complete
        </Badge>
        {allCompleted && (
          <Badge variant="success" size="sm">✓ All Done</Badge>
        )}
      </div>

      <div 
        className="rounded-md border p-5"
        style={{ 
          backgroundColor: colors.panel,
          borderColor: colors.border
        }}
      >
        <div className="relative">
          {/* Vertical line */}
          <div 
            className="absolute left-4 top-2 bottom-2 w-0.5"
            style={{ backgroundColor: colors.border }}
          />

          <div className="space-y-3">
            {steps.map((step) => {
              const statusColor = getStatusColor(step.status)
              const statusBg = getStatusBg(step.status)

              return (
                <div key={step.id} className="relative flex items-start gap-4">
                  {/* Status indicator */}
                  <div 
                    className="relative z-10 flex h-8 w-8 items-center justify-center rounded-md border transition-colors duration-300"
                    style={{ 
                      backgroundColor: statusBg,
                      borderColor: statusColor,
                    }}
                  >
                    {getStatusIcon(step.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p 
                        className="text-xs font-medium"
                        style={{ 
                          color: step.status === 'completed' ? colors.text : 
                                 step.status === 'running' ? colors.accent.amber : 
                                 step.status === 'error' ? colors.accent.coral : 
                                 colors.textDim
                        }}
                      >
                        {step.label}
                      </p>
                      {step.timestamp && (
                        <span className="text-[10px] font-mono" style={{ color: colors.textDim }}>
                          {step.timestamp}
                        </span>
                      )}
                    </div>
                    {step.description && (
                      <p className="text-[10px] font-mono mt-0.5" style={{ color: colors.textMuted }}>
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalysisTimelineSection
