import React, { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus, Grid } from 'lucide-react'
import { cn } from '../../utils/cn'

interface FeatureContributionCardsProps {
  localExplanation: any
}

const FeatureContributionCards: React.FC<FeatureContributionCardsProps> = ({ localExplanation }) => {
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

  const contributions = localExplanation?.feature_contributions || []

  if (contributions.length === 0) {
    return null
  }

  const getDirection = (value: number) => {
    if (value > 0.1) return { label: 'High Positive', icon: TrendingUp, color: colors.accent.teal }
    if (value > 0.05) return { label: 'Positive', icon: TrendingUp, color: colors.accent.teal }
    if (value < -0.1) return { label: 'High Negative', icon: TrendingDown, color: colors.accent.coral }
    if (value < -0.05) return { label: 'Negative', icon: TrendingDown, color: colors.accent.coral }
    return { label: 'Neutral', icon: Minus, color: colors.textDim }
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
          <Grid className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Feature Contributions</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {contributions.slice(0, 9).map((item: any, index: number) => {
          const direction = getDirection(item.shap_value || 0)
          const Icon = direction.icon

          return (
            <div 
              key={index} 
              className="p-3 rounded-md border"
              style={{ 
                backgroundColor: colors.panelAlt,
                borderColor: colors.border
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: colors.text }}>{item.feature}</span>
                <Icon className="h-4 w-4" style={{ color: direction.color }} />
              </div>
              <div className="mt-1.5 flex items-center justify-between">
                <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>{direction.label}</span>
                <span className="text-xs font-bold" style={{ color: direction.color }}>
                  {(item.shap_value * 100 || 0).toFixed(1)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default FeatureContributionCards
