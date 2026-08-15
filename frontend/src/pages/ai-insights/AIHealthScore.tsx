import React, { useEffect, useState } from 'react'
import { Award, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface AIHealthScoreProps {
  score: number
  confidence: string
  datasetName: string
}

const AIHealthScore: React.FC<AIHealthScoreProps> = ({ score, confidence, datasetName }) => {
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

  const getScoreColor = () => {
    if (score >= 70) return colors.accent.teal
    if (score >= 50) return colors.accent.amber
    return colors.accent.coral
  }

  const getScoreLevel = () => {
    if (score >= 70) return 'Good'
    if (score >= 50) return 'Moderate'
    return 'Needs Improvement'
  }

  const getScoreBg = () => {
    if (score >= 70) return colors.accent.teal
    if (score >= 50) return colors.accent.amber
    return colors.accent.coral
  }

  const confidenceColors = {
    High: 'success',
    Medium: 'warning',
    Low: 'danger'
  } as const

  return (
    <div 
      className="rounded-lg border p-6 transition-colors duration-300"
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.border,
        borderLeft: `4px solid ${getScoreBg()}`
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div 
            className="p-3 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <Award className="h-7 w-7" style={{ color: getScoreBg() }} />
          </div>
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>
              AI Health Score
            </h2>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-4xl font-bold" style={{ color: colors.text }}>{score}</span>
              <span className="text-2xl font-bold" style={{ color: colors.textDim }}>/ 100</span>
              <Badge variant={confidenceColors[confidence as keyof typeof confidenceColors] || 'default'} size="md">
                {confidence} Confidence
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[180px]">
          <div className="flex justify-between text-xs font-mono mb-1">
            <span style={{ color: getScoreBg() }}>{getScoreLevel()}</span>
            <span style={{ color: colors.textMuted }}>{score}%</span>
          </div>
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.border }}>
            <div 
              className="h-2 rounded-full transition-all duration-500"
              style={{ 
                width: `${score}%`,
                backgroundColor: getScoreBg()
              }}
            />
          </div>
          <p className="text-[10px] font-mono mt-1" style={{ color: colors.textDim }}>
            Dataset: {datasetName}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AIHealthScore
