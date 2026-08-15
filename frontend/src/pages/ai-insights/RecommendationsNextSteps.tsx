import React, { useEffect, useState } from 'react'
import { Lightbulb, List, ArrowRight, Sparkles } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface RecommendationsNextStepsProps {
  recommendations: string[]
  nextSteps: string[]
}

const RecommendationsNextSteps: React.FC<RecommendationsNextStepsProps> = ({
  recommendations,
  nextSteps
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
    }
  }

  const hasContent = recommendations.length > 0 || nextSteps.length > 0

  if (!hasContent) {
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
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Recommendations & Next Steps</h3>
        </div>
        <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No recommendations available.</p>
      </div>
    )
  }

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
          <Sparkles className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Recommendations & Next Steps</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4" style={{ color: colors.accent.amber }} />
            <h4 className="text-xs font-semibold" style={{ color: colors.text }}>🎯 Recommendations</h4>
            <Badge variant="info" size="sm">{recommendations.length}</Badge>
          </div>
          {recommendations.length > 0 ? (
            <ul className="space-y-2.5">
              {recommendations.slice(0, 5).map((item, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3 p-3 rounded-md border"
                  style={{ 
                    backgroundColor: colors.panelAlt,
                    borderColor: colors.border
                  }}
                >
                  <span className="text-xs font-bold" style={{ color: colors.accent.amber }}>{index + 1}</span>
                  <span className="text-xs font-mono" style={{ color: colors.textMuted }}>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs font-mono" style={{ color: colors.textMuted }}>No recommendations available</p>
          )}
        </div>

        {/* Next Steps */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <List className="h-4 w-4" style={{ color: colors.accent.azure }} />
            <h4 className="text-xs font-semibold" style={{ color: colors.text }}>📋 Next Steps</h4>
            <Badge variant="info" size="sm">{nextSteps.length}</Badge>
          </div>
          {nextSteps.length > 0 ? (
            <ul className="space-y-2.5">
              {nextSteps.slice(0, 5).map((step, index) => (
                <li 
                  key={index} 
                  className="flex items-start gap-3 p-3 rounded-md border"
                  style={{ 
                    backgroundColor: colors.panelAlt,
                    borderColor: colors.border
                  }}
                >
                  <span className="text-xs font-bold" style={{ color: colors.accent.azure }}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs font-mono" style={{ color: colors.textMuted }}>{step}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs font-mono" style={{ color: colors.textMuted }}>No next steps available</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default RecommendationsNextSteps
