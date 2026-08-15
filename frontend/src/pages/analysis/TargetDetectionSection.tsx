import React, { useEffect, useState } from 'react'
import { Target, CheckCircle, AlertTriangle, Info, Crosshair } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface TargetDetectionSectionProps {
  target: string
  confidence: number
  problemType: string
  reason: string
  alternatives: string[]
  className?: string
}

const TargetDetectionSection: React.FC<TargetDetectionSectionProps> = ({
  target,
  confidence,
  problemType,
  reason,
  alternatives,
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
      purple: '#B48CF2',
    }
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
          <Crosshair className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Target Detection</h3>
        <Badge variant="success" size="sm">Detected</Badge>
      </div>

      <div 
        className="rounded-md border p-5"
        style={{ 
          backgroundColor: colors.panel,
          borderColor: colors.border
        }}
      >
        <div className="flex items-start gap-4">
          <div 
            className="p-3 rounded-md border flex-shrink-0"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <Target className="h-6 w-6" style={{ color: colors.accent.amber }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <p className="text-xl font-bold" style={{ color: colors.text }}>{target}</p>
              <Badge variant="success" size="sm">Primary Target</Badge>
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-md border" style={{ 
                backgroundColor: colors.panelAlt,
                borderColor: colors.border
              }}>
                <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Confidence</p>
                <p className="text-lg font-bold" style={{ color: colors.accent.teal }}>{confidence}%</p>
              </div>
              <div className="p-3 rounded-md border" style={{ 
                backgroundColor: colors.panelAlt,
                borderColor: colors.border
              }}>
                <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Problem Type</p>
                <p className="text-lg font-bold capitalize" style={{ color: colors.text }}>{problemType}</p>
              </div>
              <div className="p-3 rounded-md border" style={{ 
                backgroundColor: colors.panelAlt,
                borderColor: colors.border
              }}>
                <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Status</p>
                <Badge variant="success" size="md">Valid Target</Badge>
              </div>
            </div>
            <div 
              className="mt-3 p-3 rounded-md border"
              style={{ 
                backgroundColor: colors.panelAlt,
                borderColor: colors.border
              }}
            >
              <p className="text-xs font-mono" style={{ color: colors.textMuted }}>{reason}</p>
            </div>
          </div>
        </div>

        {alternatives.length > 0 && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.border }}>
            <p className="text-xs font-medium" style={{ color: colors.textMuted }}>Alternative Candidates</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {alternatives.map((alt) => (
                <Badge key={alt} variant="default" size="md">
                  {alt}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TargetDetectionSection
