import React, { useEffect, useState } from 'react'
import { Settings, CheckCircle, AlertTriangle, Info, Wrench, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface FeatureEngineeringSectionProps {
  featureRoles: Record<string, string>
  encoding: Record<string, any>
  scaling: Record<string, any>
  transformations: Record<string, any>
  interactions: any[]
  lowVariance: any[]
  mlReadiness: {
    score: number
    status: string
    recommendation: string
    issues: string[]
  }
  className?: string
}

const FeatureEngineeringSection: React.FC<FeatureEngineeringSectionProps> = ({
  featureRoles,
  encoding,
  scaling,
  transformations,
  interactions,
  lowVariance,
  mlReadiness,
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
      coral: '#F2555A',
    }
  }

  const readinessColor = mlReadiness.status === 'Ready' ? colors.accent.teal : colors.accent.amber

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
          <Wrench className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Feature Engineering</h3>
        <Badge variant="info" size="sm">ML Ready</Badge>
      </div>

      <div 
        className="rounded-md border p-4"
        style={{ 
          backgroundColor: colors.panelAlt,
          borderColor: colors.border
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>ML Readiness Score</p>
            <p className="text-2xl font-bold" style={{ color: colors.text }}>{mlReadiness.score}/100</p>
          </div>
          <Badge variant={mlReadiness.status === 'Ready' ? 'success' : 'warning'} size="md">
            {mlReadiness.status}
          </Badge>
        </div>
        <p className="text-xs font-mono mt-2" style={{ color: colors.textMuted }}>{mlReadiness.recommendation}</p>
        {mlReadiness.issues.length > 0 && (
          <div className="mt-3 pt-3 border-t" style={{ borderColor: colors.border }}>
            <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Issues to Address</p>
            <ul className="mt-1 space-y-1">
              {mlReadiness.issues.map((issue, i) => (
                <li key={i} className="text-xs font-mono" style={{ color: colors.textMuted }}>• {issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div 
          className="rounded-md border p-4"
          style={{ 
            backgroundColor: colors.panel,
            borderColor: colors.border
          }}
        >
          <p className="text-xs font-medium mb-2" style={{ color: colors.text }}>Feature Roles</p>
          <div className="space-y-1">
            {Object.entries(featureRoles).slice(0, 10).map(([col, role]) => (
              <div key={col} className="flex items-center justify-between text-xs font-mono">
                <span style={{ color: colors.textMuted }}>{col}</span>
                <Badge variant="default" size="sm">{role}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div 
            className="rounded-md border p-4"
            style={{ 
              backgroundColor: colors.panel,
              borderColor: colors.border
            }}
          >
            <p className="text-xs font-medium mb-2" style={{ color: colors.text }}>Encoding Recommendations</p>
            <div className="space-y-1">
              {Object.entries(encoding).slice(0, 5).map(([col, rec]) => (
                <div key={col} className="flex items-center justify-between text-xs font-mono">
                  <span style={{ color: colors.textMuted }}>{col}</span>
                  <Badge variant="info" size="sm">{rec.recommended_encoding || 'None'}</Badge>
                </div>
              ))}
            </div>
          </div>
          <div 
            className="rounded-md border p-4"
            style={{ 
              backgroundColor: colors.panel,
              borderColor: colors.border
            }}
          >
            <p className="text-xs font-medium mb-2" style={{ color: colors.text }}>Scaling Recommendations</p>
            <div className="space-y-1">
              {Object.entries(scaling).slice(0, 5).map(([col, rec]) => (
                <div key={col} className="flex items-center justify-between text-xs font-mono">
                  <span style={{ color: colors.textMuted }}>{col}</span>
                  <Badge variant="info" size="sm">{rec.recommended_scaling || 'None'}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {interactions.length > 0 && (
        <div 
          className="rounded-md border p-4"
          style={{ 
            backgroundColor: colors.panel,
            borderColor: colors.border
          }}
        >
          <p className="text-xs font-medium mb-2" style={{ color: colors.text }}>Interaction Suggestions</p>
          <div className="space-y-1">
            {interactions.slice(0, 5).map((interaction, i) => (
              <div key={i} className="text-xs font-mono" style={{ color: colors.textMuted }}>
                {interaction.feature1} × {interaction.feature2}
                <span className="text-[10px] ml-2" style={{ color: colors.textDim }}>
                  (r={interaction.correlation?.toFixed(2) || 'N/A'})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {lowVariance.length > 0 && (
        <div 
          className="rounded-md p-4 border"
          style={{ 
            backgroundColor: isDark ? 'rgba(240,169,78,0.05)' : '#FFFBEB',
            borderColor: isDark ? 'rgba(240,169,78,0.2)' : '#FDE68A'
          }}
        >
          <p className="text-xs font-semibold mb-2" style={{ color: colors.accent.amber }}>Low Variance Features</p>
          <div className="space-y-1">
            {lowVariance.slice(0, 5).map((item, i) => (
              <div key={i} className="text-xs font-mono" style={{ color: colors.textMuted }}>
                {item.column} - {item.reason}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FeatureEngineeringSection
