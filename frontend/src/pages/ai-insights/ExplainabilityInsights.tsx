import React, { useEffect, useState } from 'react'
import { Shield, CheckCircle, AlertCircle, Eye, ArrowUpRight } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface ExplainabilityInsightsProps {
  shapAvailable: boolean
  explainabilityInsights: string[]
  onNavigate: () => void
}

const ExplainabilityInsights: React.FC<ExplainabilityInsightsProps> = ({
  shapAvailable,
  explainabilityInsights,
  onNavigate
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
            <Shield className="h-4 w-4" style={{ color: colors.accent.azure }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Explainability Insights</h3>
          <Badge variant={shapAvailable ? 'success' : 'warning'} size="sm">
            {shapAvailable ? 'SHAP Available' : 'Model Importance'}
          </Badge>
        </div>
        <button 
          onClick={onNavigate}
          className="text-xs font-mono flex items-center gap-1 transition-colors hover:opacity-80"
          style={{ color: colors.accent.azure }}
        >
          View Explainability
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>

      <div className="space-y-3">
        <div 
          className="flex items-center gap-2 p-3 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          {shapAvailable ? (
            <>
              <CheckCircle className="h-4 w-4" style={{ color: colors.accent.teal }} />
              <span className="text-xs font-mono" style={{ color: colors.textMuted }}>SHAP explainability is available</span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4" style={{ color: colors.accent.amber }} />
              <span className="text-xs font-mono" style={{ color: colors.textMuted }}>Using model feature importance (SHAP not installed)</span>
            </>
          )}
        </div>

        {explainabilityInsights && explainabilityInsights.length > 0 && (
          <div className="space-y-2">
            {explainabilityInsights.slice(0, 3).map((insight, index) => (
              <div 
                key={index} 
                className="flex items-start gap-2 p-2.5 rounded-md border"
                style={{ 
                  backgroundColor: colors.panelAlt,
                  borderColor: colors.border
                }}
              >
                <Shield className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" style={{ color: colors.accent.azure }} />
                <span className="text-xs font-mono" style={{ color: colors.textMuted }}>{insight}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ExplainabilityInsights
