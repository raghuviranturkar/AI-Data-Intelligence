import React, { useEffect, useState } from 'react'
import { Brain, Award, TrendingUp, Clock, Target, BarChart3 } from 'lucide-react'
import { cn } from '../../utils/cn'

interface ModelsOverviewProps {
  modelsTrained: number
  bestModel: any
  problemType: string
  rankedModels: any[]
}

const ModelsOverview: React.FC<ModelsOverviewProps> = ({
  modelsTrained,
  bestModel,
  problemType,
  rankedModels,
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

  const bestScore = bestModel?.score || 0
  const cvScore = bestModel?.cv_score || 0
  const trainingTime = bestModel?.training_time || 0

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
      coral: '#F2555A',
    }
  }

  const overviewItems = [
    {
      label: 'Models Trained',
      value: modelsTrained.toString(),
      icon: <Brain className="h-4 w-4" />,
      color: colors.accent.amber,
    },
    {
      label: 'Best Model',
      value: bestModel?.name || 'N/A',
      icon: <Award className="h-4 w-4" />,
      color: colors.accent.teal,
      subtitle: bestScore ? `${(bestScore * 100).toFixed(1)}%` : undefined,
    },
    {
      label: 'Best Score',
      value: bestScore ? `${(bestScore * 100).toFixed(1)}%` : 'N/A',
      icon: <TrendingUp className="h-4 w-4" />,
      color: colors.accent.azure,
      subtitle: `CV: ${cvScore ? (cvScore * 100).toFixed(1) : 'N/A'}%`,
    },
    {
      label: 'Training Time',
      value: trainingTime ? `${trainingTime.toFixed(2)}s` : 'N/A',
      icon: <Clock className="h-4 w-4" />,
      color: colors.accent.purple,
    },
    {
      label: 'Problem Type',
      value: problemType || 'Unknown',
      icon: <Target className="h-4 w-4" />,
      color: colors.accent.amber,
    },
    {
      label: 'Total Models',
      value: rankedModels.length.toString(),
      icon: <BarChart3 className="h-4 w-4" />,
      color: colors.accent.azure,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {overviewItems.map((item, index) => (
        <div
          key={index}
          className="rounded-lg border p-4 transition-colors duration-300"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <div className="flex items-center gap-2">
            <div style={{ color: item.color }}>{item.icon}</div>
            <span className="text-xs font-mono" style={{ color: colors.textMuted }}>{item.label}</span>
          </div>
          <div className="mt-1">
            <span className="text-xl font-bold" style={{ color: colors.text }}>{item.value}</span>
            {item.subtitle && (
              <span className="block text-xs font-mono" style={{ color: colors.textMuted }}>{item.subtitle}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ModelsOverview
