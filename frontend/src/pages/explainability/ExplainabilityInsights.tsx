import React, { useEffect, useState } from 'react'
import { Lightbulb, Sparkles } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface ExplainabilityInsightsProps {
  insights: any
}

const ExplainabilityInsights: React.FC<ExplainabilityInsightsProps> = ({ insights }) => {
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
      azure: '#4EA1F0',
    }
  }

  const explanations = insights?.explanations || []
  const insightsList = insights?.insights || []

  if (explanations.length === 0 && insightsList.length === 0) {
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
            <Sparkles className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Explainability Insights</h3>
        </div>
        <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No insights available</p>
      </div>
    )
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
          <Lightbulb className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Explainability Insights</h3>
        <Badge variant="info" size="sm">AI Generated</Badge>
      </div>

      <div className="space-y-2.5">
        {explanations.map((text: string, index: number) => (
          <div 
            key={index} 
            className="p-3 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <p className="text-xs font-mono" style={{ color: colors.textMuted }}>{text}</p>
          </div>
        ))}
        {insightsList.map((text: string, index: number) => (
          <div 
            key={index} 
            className="p-3 rounded-md border"
            style={{ 
              backgroundColor: isDark ? 'rgba(78,161,240,0.05)' : '#EFF6FF',
              borderColor: isDark ? 'rgba(78,161,240,0.2)' : '#BFDBFE'
            }}
          >
            <p className="text-xs font-mono" style={{ color: colors.accent.azure }}>💡 {text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ExplainabilityInsights
