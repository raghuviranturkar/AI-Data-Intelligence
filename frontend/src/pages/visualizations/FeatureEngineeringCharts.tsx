import React, { useEffect, useState } from 'react'
import { Settings, Wrench, BarChart3 } from 'lucide-react'
import { cn } from '../../utils/cn'

interface FeatureEngineeringChartsProps {
  data: any
}

const FeatureEngineeringCharts: React.FC<FeatureEngineeringChartsProps> = ({ data }) => {
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

  const featureEng = data?.feature_engineering || {}
  const roles = featureEng?.feature_roles || {}
  const mlReadiness = featureEng?.ml_readiness || { score: 0, status: 'Unknown' }

  const featureCount = Object.keys(roles).length
  const ready = mlReadiness.status === 'Ready'

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
          <Wrench className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Feature Engineering</h3>
        <span className="text-xs font-mono" style={{ color: colors.textMuted }}>· {featureCount} features</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          className="rounded-md border p-4"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <Settings className="h-5 w-5 mb-2" style={{ color: colors.accent.azure }} />
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Total Features</p>
          <p className="text-2xl font-bold" style={{ color: colors.text }}>{featureCount}</p>
        </div>

        <div 
          className="rounded-md border p-4"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <BarChart3 className={`h-5 w-5 mb-2 ${ready ? 'text-[#3ECF8E]' : 'text-[#F0A94E]'}`} />
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>ML Readiness</p>
          <p className="text-2xl font-bold" style={{ color: colors.text }}>{mlReadiness.score || 0}/100</p>
          <p className="text-xs font-mono capitalize" style={{ color: ready ? colors.accent.teal : colors.accent.amber }}>
            {mlReadiness.status || 'Unknown'}
          </p>
        </div>

        <div 
          className="rounded-md border p-4"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Encoding Required</p>
          <p className="text-2xl font-bold" style={{ color: colors.text }}>{featureEng?.encoding_required || 0}</p>
          <p className="text-xs font-mono" style={{ color: colors.textMuted }}>columns need encoding</p>
        </div>

        <div 
          className="rounded-md border p-4"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Scaling Required</p>
          <p className="text-2xl font-bold" style={{ color: colors.text }}>{featureEng?.scaling_required || 0}</p>
          <p className="text-xs font-mono" style={{ color: colors.textMuted }}>columns need scaling</p>
        </div>
      </div>
    </div>
  )
}

export default FeatureEngineeringCharts
