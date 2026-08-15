import React, { useEffect, useState } from 'react'
import { Lightbulb, CheckCircle, Shield, Zap, TrendingUp } from 'lucide-react'

interface ModelRecommendationProps {
  bestModel: any
}

const ModelRecommendation: React.FC<ModelRecommendationProps> = ({ bestModel }) => {
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
    }
  }

  const reason = bestModel?.reason || 'Selected based on overall performance'

  if (!bestModel || !bestModel.name) {
    return null
  }

  return (
    <div 
      className="rounded-lg border-l-4 p-6 transition-colors duration-300"
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.border,
        borderLeftColor: colors.accent.amber,
      }}
    >
      <div className="flex items-start gap-4">
        <div 
          className="p-2 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <Lightbulb className="h-5 w-5" style={{ color: colors.accent.amber }} />
        </div>
        <div>
          <h3 className="text-base font-semibold" style={{ color: colors.text }}>Model Recommendation</h3>
          <p className="text-sm font-mono mt-1" style={{ color: colors.textMuted }}>
            <span className="font-medium" style={{ color: colors.accent.amber }}>{bestModel.name}</span> was selected because:
          </p>
          <p className="text-sm font-mono mt-2" style={{ color: colors.textMuted }}>{reason}</p>
          <div className="mt-3 flex flex-wrap gap-4">
            <div className="flex items-center gap-1 text-xs font-mono" style={{ color: colors.textMuted }}>
              <CheckCircle className="h-3 w-3" style={{ color: colors.accent.teal }} />
              <span>Highest validation accuracy</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono" style={{ color: colors.textMuted }}>
              <Shield className="h-3 w-3" style={{ color: colors.accent.teal }} />
              <span>Lowest variance</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono" style={{ color: colors.textMuted }}>
              <TrendingUp className="h-3 w-3" style={{ color: colors.accent.teal }} />
              <span>Generalized well</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-mono" style={{ color: colors.textMuted }}>
              <Zap className="h-3 w-3" style={{ color: colors.accent.teal }} />
              <span>Fast training</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModelRecommendation
