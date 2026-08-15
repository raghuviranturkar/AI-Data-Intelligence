import React, { useEffect, useState } from 'react'
import { Eye, TrendingUp, TrendingDown, Target } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface LocalExplanationProps {
  localExplanation: any
}

const LocalExplanation: React.FC<LocalExplanationProps> = ({ localExplanation }) => {
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

  if (!localExplanation || !localExplanation.prediction) {
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
            <Target className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Local Explanation</h3>
        </div>
        <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No local explanation available</p>
      </div>
    )
  }

  const reasons = localExplanation.reasons || []
  const summary = localExplanation.summary || 'No summary available'

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
          <Eye className="h-4 w-4" style={{ color: colors.accent.azure }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Local Explanation</h3>
        <Badge variant="info" size="sm">Single Prediction</Badge>
        <Badge variant="success" size="sm">Prediction: {localExplanation.prediction}</Badge>
      </div>

      <div 
        className="p-3 rounded-md border mb-4"
        style={{ 
          backgroundColor: colors.panelAlt,
          borderColor: colors.border
        }}
      >
        <p className="text-xs font-mono" style={{ color: colors.textMuted }}>{summary}</p>
      </div>

      <div className="space-y-2">
        {reasons.map((reason: string, index: number) => {
          const isPositive = reason.includes('increased')
          return (
            <div
              key={index}
              className="p-3 rounded-md border flex items-center gap-2"
              style={{ 
                backgroundColor: isPositive 
                  ? (isDark ? 'rgba(62,207,142,0.05)' : '#F0FDF4')
                  : (isDark ? 'rgba(242,85,90,0.05)' : '#FEF2F2'),
                borderColor: isPositive 
                  ? (isDark ? 'rgba(62,207,142,0.2)' : '#BBF7D0')
                  : (isDark ? 'rgba(242,85,90,0.2)' : '#FECACA')
              }}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" style={{ color: colors.accent.teal }} />
              ) : (
                <TrendingDown className="h-4 w-4" style={{ color: colors.accent.coral }} />
              )}
              <span className="text-xs font-mono" style={{ color: colors.textMuted }}>{reason}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LocalExplanation
