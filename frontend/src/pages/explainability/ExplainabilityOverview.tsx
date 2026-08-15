import React, { useEffect, useState } from 'react'
import { Shield, Brain, BarChart3, Sparkles, Award, Target, Layers } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface ExplainabilityOverviewProps {
  shapAvailable: boolean
  featureCount: number
  mostImportantFeature: string
  method: string
  modelName: string
  confidence: string
}

const ExplainabilityOverview: React.FC<ExplainabilityOverviewProps> = ({
  shapAvailable,
  featureCount,
  mostImportantFeature,
  method,
  modelName,
  confidence,
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
      purple: '#B48CF2',
    }
  }

  const items = [
    {
      label: 'SHAP Status',
      value: shapAvailable ? 'Available' : 'Unavailable',
      icon: <Shield className="h-4 w-4" />,
      color: shapAvailable ? colors.accent.teal : colors.accent.amber,
    },
    {
      label: 'Features Explained',
      value: featureCount,
      icon: <BarChart3 className="h-4 w-4" />,
      color: colors.accent.azure,
    },
    {
      label: 'Explanation Confidence',
      value: confidence,
      icon: <Award className="h-4 w-4" />,
      color: confidence === 'High' ? colors.accent.teal : colors.accent.amber,
    },
    {
      label: 'Most Important Feature',
      value: mostImportantFeature,
      icon: <Sparkles className="h-4 w-4" />,
      color: colors.accent.amber,
    },
    {
      label: 'Explanation Method',
      value: method,
      icon: <Brain className="h-4 w-4" />,
      color: colors.accent.azure,
    },
    {
      label: 'Model',
      value: modelName,
      icon: <Target className="h-4 w-4" />,
      color: colors.accent.purple,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-md border p-3 transition-colors duration-300"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <div className="flex items-center gap-2">
            <div style={{ color: item.color }}>{item.icon}</div>
            <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>{item.label}</span>
          </div>
          <div className="mt-1">
            <span className="text-sm font-bold" style={{ color: colors.text }}>{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ExplainabilityOverview
