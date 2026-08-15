import React, { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, TrendingDown, Lightbulb, ArrowUpRight } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../utils/cn'

interface EDAInsightsProps {
  insights: string[]
}

const EDAInsights: React.FC<EDAInsightsProps> = ({ insights }) => {
  const navigate = useNavigate()
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

  if (!insights || insights.length === 0) {
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
            <BarChart3 className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>EDA Insights</h3>
          <Badge variant="info" size="sm">0</Badge>
        </div>
        <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No EDA insights available.</p>
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="p-1.5 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <BarChart3 className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>EDA Insights</h3>
          <Badge variant="info" size="sm">{insights.length}</Badge>
        </div>
        <button 
          onClick={() => navigate('/analysis')}
          className="text-xs font-mono flex items-center gap-1 transition-colors hover:opacity-80"
          style={{ color: colors.accent.azure }}
        >
          View Analysis
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-2.5">
        {insights.slice(0, 5).map((insight, index) => (
          <div 
            key={index} 
            className="flex items-start gap-3 p-2.5 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <Lightbulb className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: colors.accent.amber }} />
            <p className="text-xs font-mono" style={{ color: colors.textMuted }}>{insight}</p>
          </div>
        ))}
        {insights.length > 5 && (
          <p className="text-[10px] font-mono" style={{ color: colors.textDim }}>+ {insights.length - 5} more insights</p>
        )}
      </div>
    </div>
  )
}

export default EDAInsights
