import React, { useEffect, useState } from 'react'
import { Shield, CheckCircle, AlertCircle, Eye } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface ExplainabilityChartsProps {
  data: any
}

const ExplainabilityCharts: React.FC<ExplainabilityChartsProps> = ({ data }) => {
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
      purple: '#B48CF2',
    }
  }

  const explainability = data?.explainability || {}
  const importance = explainability?.feature_importance || {}
  const shapAvailable = explainability?.shap_available || false
  const ranking = explainability?.feature_ranking || []

  const topFeatures = ranking.slice(0, 5)

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
          <Eye className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Model Explainability</h3>
        <span className="text-xs font-mono" style={{ color: colors.textMuted }}>· {Object.keys(importance).length} features</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div 
          className="rounded-md border p-4"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4" style={{ color: colors.accent.azure }} />
            <h4 className="text-xs font-semibold" style={{ color: colors.text }}>Explainability Status</h4>
            <Badge variant={shapAvailable ? 'success' : 'warning'} size="sm">
              {shapAvailable ? 'SHAP Available' : 'Using Model Importance'}
            </Badge>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-md border" style={{ borderColor: colors.border }}>
              <span className="text-xs font-mono" style={{ color: colors.textMuted }}>Features Explained</span>
              <span className="text-xs font-medium" style={{ color: colors.text }}>{Object.keys(importance).length}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-md border" style={{ borderColor: colors.border }}>
              <span className="text-xs font-mono" style={{ color: colors.textMuted }}>Method</span>
              <span className="text-xs font-medium" style={{ color: colors.text }}>{shapAvailable ? 'SHAP' : 'Model Importance'}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-md border" style={{ borderColor: colors.border }}>
              <span className="text-xs font-mono" style={{ color: colors.textMuted }}>Top Features</span>
              <span className="text-xs font-medium" style={{ color: colors.text }}>{topFeatures.length}</span>
            </div>
          </div>
        </div>

        <div 
          className="rounded-md border p-4"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <h4 className="text-xs font-semibold mb-3" style={{ color: colors.text }}>Top Features</h4>
          <div className="space-y-2.5">
            {topFeatures.map((item: any, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[10px] font-mono" style={{ color: colors.textDim }}>#{item.rank}</span>
                <span className="text-xs font-medium flex-1" style={{ color: colors.text }}>{item.feature}</span>
                <div className="w-20 h-1.5 rounded-full" style={{ backgroundColor: colors.border }}>
                  <div 
                    className="h-1.5 rounded-full transition-all duration-500" 
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: colors.accent.azure
                    }} 
                  />
                </div>
                <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>{item.percentage.toFixed(0)}%</span>
              </div>
            ))}
            {topFeatures.length === 0 && (
              <p className="text-xs font-mono" style={{ color: colors.textMuted }}>No feature ranking available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExplainabilityCharts
