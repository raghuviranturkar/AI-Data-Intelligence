import React, { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus, Shield } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface CrossValidationDisplayProps {
  bestModel: any
}

const CrossValidationDisplay: React.FC<CrossValidationDisplayProps> = ({ bestModel }) => {
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

  const cvResults = bestModel?.cv_results || {}
  const mean = cvResults?.mean || 0
  const std = cvResults?.std || 0

  if (!mean && !std) {
    return (
      <div 
        className="rounded-lg border p-6 transition-colors duration-300"
        style={{ 
          backgroundColor: colors.panel,
          borderColor: colors.border
        }}
      >
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Cross Validation</h3>
        <p className="text-sm font-mono mt-2" style={{ color: colors.textMuted }}>No CV data available</p>
      </div>
    )
  }

  const stability = std < 0.03 ? 'Stable' : std < 0.08 ? 'Moderate' : 'Unstable'
  const stabilityColor = stability === 'Stable' ? 'success' : stability === 'Moderate' ? 'warning' : 'danger'

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
          <Shield className="h-4 w-4" style={{ color: colors.accent.azure }} />
        </div>
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Cross Validation</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div 
          className="p-4 rounded-md border text-center"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <p className="text-xs font-mono" style={{ color: colors.textMuted }}>Average Score</p>
          <p className="text-2xl font-bold mt-1" style={{ color: colors.text }}>{(mean * 100).toFixed(1)}%</p>
        </div>
        <div 
          className="p-4 rounded-md border text-center"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <p className="text-xs font-mono" style={{ color: colors.textMuted }}>Std Deviation</p>
          <p className="text-2xl font-bold mt-1" style={{ color: colors.text }}>{(std * 100).toFixed(1)}%</p>
        </div>
        <div 
          className="p-4 rounded-md border text-center"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <p className="text-xs font-mono" style={{ color: colors.textMuted }}>Stability</p>
          <div className="mt-1">
            <Badge variant={stabilityColor as any} size="lg">
              {stability}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CrossValidationDisplay
