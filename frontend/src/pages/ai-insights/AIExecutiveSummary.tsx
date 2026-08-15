import React, { useEffect, useState } from 'react'
import { Sparkles, FileText, Brain, Activity, Zap } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface AIExecutiveSummaryProps {
  summary: string
}

const AIExecutiveSummary: React.FC<AIExecutiveSummaryProps> = ({ summary }) => {
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
    }
  }

  if (!summary) {
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
            <Sparkles className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Executive Summary</h3>
          <Badge variant="info" size="sm">AI Generated</Badge>
        </div>
        <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No executive summary available for this dataset.</p>
      </div>
    )
  }

  return (
    <div 
      className="rounded-lg border p-6 transition-colors duration-300"
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
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>🤖 AI Executive Summary</h3>
        <Badge variant="info" size="sm">AI Generated</Badge>
      </div>
      <div className="space-y-4">
        <p className="text-sm font-mono leading-relaxed" style={{ color: colors.textMuted }}>
          {summary}
        </p>
        <div className="flex flex-wrap gap-4 pt-3 border-t" style={{ borderColor: colors.border }}>
          <span className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: colors.textDim }}>
            <FileText className="h-3 w-3" />
            Dataset analyzed
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: colors.textDim }}>
            <Brain className="h-3 w-3" />
            Models evaluated
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: colors.textDim }}>
            <Activity className="h-3 w-3" />
            Insights generated
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: colors.textDim }}>
            <Zap className="h-3 w-3" />
            Recommendations ready
          </span>
        </div>
      </div>
    </div>
  )
}

export default AIExecutiveSummary
