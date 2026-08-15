import React, { useEffect, useState } from 'react'
import { Shield, AlertCircle, BarChart3, TrendingUp, TrendingDown, GitBranch, Sparkles } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface SHAPVisualizationsProps {
  shapAvailable: boolean
}

const SHAPVisualizations: React.FC<SHAPVisualizationsProps> = ({ shapAvailable }) => {
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

  const visualizations = [
    { name: 'Summary Plot', icon: BarChart3, available: shapAvailable },
    { name: 'Waterfall Plot', icon: TrendingUp, available: shapAvailable },
    { name: 'Force Plot', icon: TrendingDown, available: shapAvailable },
    { name: 'Dependence Plot', icon: GitBranch, available: shapAvailable },
  ]

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
            <Sparkles className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>SHAP Visualizations</h3>
          <Badge variant={shapAvailable ? 'success' : 'warning'} size="sm">
            {shapAvailable ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
      </div>

      {shapAvailable ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {visualizations.map((viz) => (
            <div
              key={viz.name}
              className="p-3 rounded-md border text-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              style={{ 
                backgroundColor: colors.panelAlt,
                borderColor: colors.border
              }}
            >
              <viz.icon className="h-6 w-6 mx-auto mb-1.5" style={{ color: colors.accent.azure }} />
              <p className="text-xs font-medium" style={{ color: colors.text }}>{viz.name}</p>
              <Badge variant="success" size="sm">Ready</Badge>
            </div>
          ))}
        </div>
      ) : (
        <div 
          className="p-5 rounded-md border text-center"
          style={{ 
            backgroundColor: isDark ? 'rgba(240,169,78,0.05)' : '#FFFBEB',
            borderColor: isDark ? 'rgba(240,169,78,0.2)' : '#FDE68A'
          }}
        >
          <AlertCircle className="h-8 w-8 mx-auto mb-2" style={{ color: colors.accent.amber }} />
          <p className="text-sm font-medium" style={{ color: colors.accent.amber }}>SHAP Package Not Installed</p>
          <p className="text-xs font-mono mt-1" style={{ color: colors.textMuted }}>
            Install SHAP to enable advanced visualizations. Currently using model feature importance.
          </p>
          <p className="text-[10px] font-mono mt-2" style={{ color: colors.textDim }}>
            Run: pip install shap
          </p>
        </div>
      )}
    </div>
  )
}

export default SHAPVisualizations
