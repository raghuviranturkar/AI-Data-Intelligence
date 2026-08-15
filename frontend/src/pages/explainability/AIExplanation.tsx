import React, { useEffect, useState } from 'react'
import { Sparkles, MessageSquare } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface AIExplanationProps {
  localExplanation: any
}

const AIExplanation: React.FC<AIExplanationProps> = ({ localExplanation }) => {
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
    }
  }

  if (!localExplanation || !localExplanation.summary) {
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
            <MessageSquare className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>AI Explanation</h3>
        </div>
        <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No AI explanation available</p>
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
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="p-1.5 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <Sparkles className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>🤖 AI Explanation</h3>
        <Badge variant="info" size="sm">Conversational</Badge>
      </div>
      <p className="text-sm font-mono leading-relaxed" style={{ color: colors.textMuted }}>
        {localExplanation.summary}
      </p>
    </div>
  )
}

export default AIExplanation
