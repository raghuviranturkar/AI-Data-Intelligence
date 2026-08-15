import React, { useEffect, useState } from 'react'
import { Lightbulb, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, List, Sparkles } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface AIInsightsSectionProps {
  executiveSummary: string
  strengths: string[]
  weaknesses: string[]
  risks: string[]
  recommendations: string[]
  nextSteps: string[]
  healthScore: {
    score: number
    confidence: string
  }
  className?: string
}

const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({
  executiveSummary,
  strengths,
  weaknesses,
  risks,
  recommendations,
  nextSteps,
  healthScore,
  className,
}) => {
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

  const confidenceColors = {
    High: colors.accent.teal,
    Medium: colors.accent.amber,
    Low: colors.accent.coral,
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-3">
        <div 
          className="p-1.5 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <Sparkles className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>AI Insights</h3>
        <Badge variant="info" size="sm">Business Intelligence</Badge>
      </div>

      <div 
        className="rounded-md border p-4"
        style={{ 
          backgroundColor: colors.panelAlt,
          borderColor: colors.border
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>AI Health Score</p>
            <p className="text-2xl font-bold" style={{ color: colors.text }}>{healthScore.score}/100</p>
          </div>
          <Badge variant={healthScore.confidence === 'High' ? 'success' : 'warning'} size="md">
            {healthScore.confidence} Confidence
          </Badge>
        </div>
      </div>

      <div 
        className="rounded-md p-4 border"
        style={{ 
          backgroundColor: isDark ? 'rgba(240,169,78,0.05)' : '#FFFBEB',
          borderColor: isDark ? 'rgba(240,169,78,0.2)' : '#FDE68A'
        }}
      >
        <p className="text-xs font-mono leading-relaxed" style={{ color: colors.textMuted }}>
          {executiveSummary}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {strengths.length > 0 && (
          <div 
            className="rounded-md p-3.5 border"
            style={{ 
              backgroundColor: isDark ? 'rgba(62,207,142,0.05)' : '#F0FDF4',
              borderColor: isDark ? 'rgba(62,207,142,0.2)' : '#BBF7D0'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4" style={{ color: colors.accent.teal }} />
              <p className="text-xs font-semibold" style={{ color: colors.accent.teal }}>Strengths</p>
            </div>
            <ul className="space-y-1">
              {strengths.map((item, i) => (
                <li key={i} className="text-xs font-mono flex items-start gap-2" style={{ color: colors.textMuted }}>
                  <span className="text-[10px]" style={{ color: colors.accent.teal }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {weaknesses.length > 0 && (
          <div 
            className="rounded-md p-3.5 border"
            style={{ 
              backgroundColor: isDark ? 'rgba(242,85,90,0.05)' : '#FEF2F2',
              borderColor: isDark ? 'rgba(242,85,90,0.2)' : '#FECACA'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="h-4 w-4" style={{ color: colors.accent.coral }} />
              <p className="text-xs font-semibold" style={{ color: colors.accent.coral }}>Weaknesses</p>
            </div>
            <ul className="space-y-1">
              {weaknesses.map((item, i) => (
                <li key={i} className="text-xs font-mono flex items-start gap-2" style={{ color: colors.textMuted }}>
                  <span className="text-[10px]" style={{ color: colors.accent.coral }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {risks.length > 0 && (
          <div 
            className="rounded-md p-3.5 border"
            style={{ 
              backgroundColor: isDark ? 'rgba(240,169,78,0.05)' : '#FFFBEB',
              borderColor: isDark ? 'rgba(240,169,78,0.2)' : '#FDE68A'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4" style={{ color: colors.accent.amber }} />
              <p className="text-xs font-semibold" style={{ color: colors.accent.amber }}>Risks</p>
            </div>
            <ul className="space-y-1">
              {risks.map((item, i) => (
                <li key={i} className="text-xs font-mono flex items-start gap-2" style={{ color: colors.textMuted }}>
                  <span className="text-[10px]" style={{ color: colors.accent.amber }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recommendations.length > 0 && (
          <div 
            className="rounded-md p-3.5 border"
            style={{ 
              backgroundColor: isDark ? 'rgba(78,161,240,0.05)' : '#EFF6FF',
              borderColor: isDark ? 'rgba(78,161,240,0.2)' : '#BFDBFE'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4" style={{ color: colors.accent.azure }} />
              <p className="text-xs font-semibold" style={{ color: colors.accent.azure }}>Recommendations</p>
            </div>
            <ul className="space-y-1">
              {recommendations.map((item, i) => (
                <li key={i} className="text-xs font-mono flex items-start gap-2" style={{ color: colors.textMuted }}>
                  <span className="text-[10px]" style={{ color: colors.accent.azure }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {nextSteps.length > 0 && (
        <div 
          className="rounded-md p-4 border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <List className="h-4 w-4" style={{ color: colors.textMuted }} />
            <p className="text-xs font-semibold" style={{ color: colors.text }}>Next Steps</p>
          </div>
          <ul className="space-y-1">
            {nextSteps.map((step, i) => (
              <li key={i} className="text-xs font-mono flex items-start gap-2" style={{ color: colors.textMuted }}>
                <span className="text-[10px]" style={{ color: colors.textDim }}>{i + 1}.</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AIInsightsSection
