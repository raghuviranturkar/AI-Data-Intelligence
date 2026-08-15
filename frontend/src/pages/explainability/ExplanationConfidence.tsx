import React, { useEffect, useState } from 'react'
import { Award, Shield } from 'lucide-react'
import { cn } from '../../utils/cn'

interface ExplanationConfidenceProps {
  confidence: {
    level: string
    score: number
    reason: string
  }
}

const ExplanationConfidence: React.FC<ExplanationConfidenceProps> = ({ confidence }) => {
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

  const { level, score, reason } = confidence

  const getColor = () => {
    if (level === 'High') return colors.accent.teal
    if (level === 'Medium') return colors.accent.amber
    return colors.accent.coral
  }

  const getTextColor = () => {
    if (level === 'High') return colors.accent.teal
    if (level === 'Medium') return colors.accent.amber
    return colors.accent.coral
  }

  const getMessage = () => {
    if (level === 'High') {
      return 'The explanation is reliable and consistent across all predictions.'
    } else if (level === 'Medium') {
      return 'The explanation is generally reliable but may vary for some predictions.'
    }
    return 'The explanation has limited reliability. Consider using additional methods.'
  }

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
          <Shield className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Explanation Confidence</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-28 h-28 mx-auto">
              <svg className="transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="52"
                  cx="60"
                  cy="60"
                />
                <circle
                  strokeWidth="10"
                  strokeDasharray={Math.PI * 2 * 52}
                  strokeDashoffset={Math.PI * 2 * 52 * (1 - (score || 0) / 100)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="52"
                  cx="60"
                  cy="60"
                  style={{ color: getColor() }}
                />
                <text
                  x="60"
                  y="60"
                  textAnchor="middle"
                  dy=".3em"
                  className="text-xl font-bold"
                  fill="currentColor"
                  style={{ color: colors.text }}
                >
                  {Math.round(score)}%
                </text>
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xl font-bold" style={{ color: getTextColor() }}>{level} Confidence</p>
          <p className="text-xs font-mono mt-1" style={{ color: colors.textMuted }}>{reason}</p>
        </div>

        <div 
          className="flex flex-col justify-center p-3 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>What this means</p>
          <p className="text-xs font-mono mt-1" style={{ color: colors.textMuted }}>{getMessage()}</p>
        </div>
      </div>
    </div>
  )
}

export default ExplanationConfidence
