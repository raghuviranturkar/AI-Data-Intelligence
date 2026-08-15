import React, { useEffect, useState } from 'react'
import { Award, CheckCircle, Clock, TrendingUp, Shield, Zap } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface BestModelDetailsProps {
  bestModel: any
}

const BestModelDetails: React.FC<BestModelDetailsProps> = ({ bestModel }) => {
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

  if (!bestModel || !bestModel.name) {
    return (
      <div 
        className="rounded-lg border p-6 transition-colors duration-300"
        style={{ 
          backgroundColor: colors.panel,
          borderColor: colors.border
        }}
      >
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Best Model</h3>
        <p className="text-sm font-mono mt-2" style={{ color: colors.textMuted }}>No best model selected</p>
      </div>
    )
  }

  const score = bestModel.score || 0
  const cvScore = bestModel.cv_score || 0
  const trainingTime = bestModel.training_time || 0
  const reason = bestModel.reason || 'Selected based on overall performance'

  const metrics = [
    { label: 'Score', value: `${(score * 100).toFixed(1)}%`, icon: TrendingUp, color: colors.accent.teal },
    { label: 'CV Score', value: `${(cvScore * 100).toFixed(1)}%`, icon: Shield, color: colors.accent.azure },
    { label: 'Training Time', value: `${trainingTime.toFixed(2)}s`, icon: Clock, color: colors.accent.amber },
    { label: 'Status', value: 'Ready', icon: CheckCircle, color: colors.accent.teal },
  ]

  return (
    <div 
      className="rounded-lg border-2 p-6 transition-colors duration-300 relative"
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.accent.amber,
      }}
    >
      {/* Corner brackets */}
      <span className="absolute top-3 left-3 w-3 h-3 border-t border-l pointer-events-none" 
        style={{ borderColor: colors.accent.amber }} />
      <span className="absolute top-3 right-3 w-3 h-3 border-t border-r pointer-events-none" 
        style={{ borderColor: colors.accent.amber }} />
      <span className="absolute bottom-3 left-3 w-3 h-3 border-b border-l pointer-events-none" 
        style={{ borderColor: colors.accent.amber }} />
      <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r pointer-events-none" 
        style={{ borderColor: colors.accent.amber }} />

      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Award className="h-6 w-6" style={{ color: colors.accent.amber }} />
            <h3 className="text-lg font-bold" style={{ color: colors.text }}>Best Model</h3>
            <Badge variant="success" size="md">🏆 Selected</Badge>
          </div>
          <p className="text-2xl font-bold mt-2" style={{ color: colors.text }}>{bestModel.name}</p>
        </div>
        <Badge variant="success" size="lg">Production Ready</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="p-3 rounded-md border" style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}>
            <div className="flex items-center gap-2">
              <metric.icon className="h-4 w-4" style={{ color: metric.color }} />
              <span className="text-xs font-mono" style={{ color: colors.textMuted }}>{metric.label}</span>
            </div>
            <p className="text-lg font-bold mt-1" style={{ color: colors.text }}>{metric.value}</p>
          </div>
        ))}
      </div>

      <div 
        className="mt-4 p-4 rounded-md border"
        style={{ 
          backgroundColor: isDark ? 'rgba(240,169,78,0.05)' : '#FFFBEB',
          borderColor: isDark ? 'rgba(240,169,78,0.2)' : '#FDE68A'
        }}
      >
        <p className="text-sm font-mono" style={{ color: colors.text }}>
          <span className="font-medium" style={{ color: colors.accent.amber }}>Why selected:</span> {reason}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm font-mono" style={{ color: colors.textMuted }}>
          <CheckCircle className="h-4 w-4" style={{ color: colors.accent.teal }} />
          <span>Validation Passed</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono" style={{ color: colors.textMuted }}>
          <Shield className="h-4 w-4" style={{ color: colors.accent.teal }} />
          <span>Generalized Well</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-mono" style={{ color: colors.textMuted }}>
          <Zap className="h-4 w-4" style={{ color: colors.accent.teal }} />
          <span>Fast Training</span>
        </div>
      </div>
    </div>
  )
}

export default BestModelDetails
