import React, { useEffect, useState } from 'react'
import { Lightbulb, CheckCircle, AlertTriangle, TrendingDown, TrendingUp, Zap } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { cn } from '../../utils/cn'

interface InsightsChartsProps {
  data: any
}

const InsightsCharts: React.FC<InsightsChartsProps> = ({ data }) => {
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
      purple: '#B48CF2',
    }
  }

  const insights = data?.insights || {}
  const healthScore = insights?.ai_health_score || { score: 0, confidence: 'Unknown' }

  return (
    <div 
      className="rounded-lg border p-6 transition-colors duration-300"
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div 
          className="p-1.5 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <Zap className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>AI Insights</h3>
        <span className="text-xs font-mono" style={{ color: colors.textMuted }}>· {healthScore.confidence} confidence</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* AI Health Score */}
        <div 
          className="rounded-md border p-4 flex flex-col items-center"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <div className="w-28 h-28">
            <CircularProgressbar
              value={healthScore.score}
              text={`${healthScore.score}%`}
              styles={buildStyles({
                textColor: healthScore.score >= 70 ? colors.accent.teal : colors.accent.amber,
                pathColor: healthScore.score >= 70 ? colors.accent.teal : colors.accent.amber,
                trailColor: isDark ? '#232B35' : '#E5E7EB',
              })}
            />
          </div>
          <p className="mt-2 text-xs font-medium" style={{ color: colors.text }}>AI Health Score</p>
          <Badge variant={healthScore.confidence === 'High' ? 'success' : 'warning'} size="sm">
            {healthScore.confidence} Confidence
          </Badge>
        </div>

        {/* Strengths */}
        {insights?.strengths?.length > 0 && (
          <div 
            className="rounded-md border p-4"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-4 w-4" style={{ color: colors.accent.teal }} />
              <h4 className="text-xs font-semibold" style={{ color: colors.text }}>Strengths</h4>
              <Badge variant="success" size="sm">{insights.strengths.length}</Badge>
            </div>
            <ul className="space-y-1.5">
              {insights.strengths.slice(0, 3).map((item: string, i: number) => (
                <li key={i} className="text-xs font-mono flex items-start gap-1.5" style={{ color: colors.textMuted }}>
                  <span className="text-[10px]" style={{ color: colors.accent.teal }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weaknesses */}
        {insights?.weaknesses?.length > 0 && (
          <div 
            className="rounded-md border p-4"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="h-4 w-4" style={{ color: colors.accent.coral }} />
              <h4 className="text-xs font-semibold" style={{ color: colors.text }}>Weaknesses</h4>
              <Badge variant="danger" size="sm">{insights.weaknesses.length}</Badge>
            </div>
            <ul className="space-y-1.5">
              {insights.weaknesses.slice(0, 3).map((item: string, i: number) => (
                <li key={i} className="text-xs font-mono flex items-start gap-1.5" style={{ color: colors.textMuted }}>
                  <span className="text-[10px]" style={{ color: colors.accent.coral }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks */}
        {insights?.risks?.length > 0 && (
          <div 
            className="rounded-md border p-4"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4" style={{ color: colors.accent.amber }} />
              <h4 className="text-xs font-semibold" style={{ color: colors.text }}>Risks</h4>
              <Badge variant="warning" size="sm">{insights.risks.length}</Badge>
            </div>
            <ul className="space-y-1.5">
              {insights.risks.slice(0, 3).map((item: string, i: number) => (
                <li key={i} className="text-xs font-mono flex items-start gap-1.5" style={{ color: colors.textMuted }}>
                  <span className="text-[10px]" style={{ color: colors.accent.amber }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {insights?.recommendations?.length > 0 && (
        <div 
          className="mt-4 rounded-md border p-4"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4" style={{ color: colors.accent.amber }} />
            <h4 className="text-xs font-semibold" style={{ color: colors.text }}>Key Recommendations</h4>
            <Badge variant="info" size="sm">{insights.recommendations.length}</Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {insights.recommendations.slice(0, 4).map((item: string, i: number) => (
              <div 
                key={i} 
                className="p-2.5 rounded-md border"
                style={{ 
                  backgroundColor: isDark ? 'rgba(78,161,240,0.05)' : 'rgba(78,161,240,0.03)',
                  borderColor: colors.border
                }}
              >
                <p className="text-xs font-mono" style={{ color: colors.textMuted }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default InsightsCharts
