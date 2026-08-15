import React, { useEffect, useState } from 'react'
import { Settings, Sliders, Sparkles } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface HyperparameterSummaryProps {
  bestModel: any
}

const HyperparameterSummary: React.FC<HyperparameterSummaryProps> = ({ bestModel }) => {
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

  // This is a placeholder - backend doesn't expose hyperparameters yet
  const hasParams = false

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
          <Settings className="h-4 w-4" style={{ color: colors.accent.purple }} />
        </div>
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Hyperparameter Summary</h3>
        <Badge variant="info" size="sm">Coming Soon</Badge>
      </div>

      {hasParams ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* This will be populated when backend exposes hyperparameters */}
        </div>
      ) : (
        <div 
          className="p-4 rounded-md border text-center"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <Sliders className="h-8 w-8 mx-auto mb-2 opacity-40" style={{ color: colors.textMuted }} />
          <p className="text-sm font-mono" style={{ color: colors.textMuted }}>
            Hyperparameter details will be available in a future version.
          </p>
          <p className="text-xs font-mono mt-1" style={{ color: colors.textDim }}>
            The AutoML engine will expose detailed hyperparameters for each model.
          </p>
        </div>
      )}
    </div>
  )
}

export default HyperparameterSummary
