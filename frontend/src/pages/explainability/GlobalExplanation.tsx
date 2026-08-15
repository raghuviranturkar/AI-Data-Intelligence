import React, { useEffect, useState } from 'react'
import { Sparkles, Globe } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface GlobalExplanationProps {
  globalExplanation: any
}

const GlobalExplanation: React.FC<GlobalExplanationProps> = ({ globalExplanation }) => {
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

  const summary = globalExplanation?.summary || []
  const insights = globalExplanation?.insights || []

  if (summary.length === 0 && insights.length === 0) {
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
            <Globe className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Global Explanation</h3>
        </div>
        <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No global explanation available</p>
      </div>
    )
  }

  return (
    <div 
      className="rounded-lg border p-5 transition-colors duration-300"
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.border,
        borderLeft: `4px solid ${colors.accent.amber}`
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
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Global Explanation</h3>
        <Badge variant="info" size="sm">AI Generated</Badge>
      </div>

      <div className="space-y-3">
        {summary.map((text: string, index: number) => (
          <p key={index} className="text-sm font-mono leading-relaxed" style={{ color: colors.textMuted }}>
            {text}
          </p>
        ))}
        {insights.map((text: string, index: number) => (
          <div 
            key={index} 
            className="p-3 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <p className="text-xs font-mono" style={{ color: colors.textMuted }}>💡 {text}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-[10px] font-mono" style={{ color: colors.textDim }}>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: colors.accent.azure }} />
          Key drivers identified
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: colors.accent.teal }} />
          Positive influences
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: colors.accent.coral }} />
          Negative influences
        </span>
      </div>
    </div>
  )
}

export default GlobalExplanation
