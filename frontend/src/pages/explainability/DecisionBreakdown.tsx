import React, { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, GitBranch } from 'lucide-react'
import { cn } from '../../utils/cn'

interface DecisionBreakdownProps {
  localExplanation: any
}

const DecisionBreakdown: React.FC<DecisionBreakdownProps> = ({ localExplanation }) => {
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
            <GitBranch className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Decision Breakdown</h3>
        </div>
        <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No contribution data available</p>
      </div>
    )
  }

  const maxContribution = Math.max(...contributions.map((c: any) => Math.abs(c.shap_value || 0)))

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
          <GitBranch className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Decision Breakdown</h3>
      </div>

      <div className="space-y-2.5">
        {contributions.slice(0, 8).map((item: any, index: number) => {
          const value = item.shap_value || 0
          const isPositive = value > 0
          const intensity = Math.min(Math.abs(value) / (maxContribution || 1), 1)

          return (
            <div key={index} className="flex items-center gap-3">
              <span className="text-xs font-medium truncate w-24" style={{ color: colors.text }}>
                {item.feature}
              </span>
              <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.abs(intensity * 100)}%`,
                    backgroundColor: isPositive ? colors.accent.teal : colors.accent.coral,
                    float: isPositive ? 'left' : 'right',
                  }}
                />
              </div>
              <span
                className={`text-xs font-mono w-16 text-right ${
                  isPositive ? 'text-[#3ECF8E]' : 'text-[#F2555A]'
                }`}
              >
                {isPositive ? '+' : ''}{(value * 100).toFixed(0)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DecisionBreakdown
