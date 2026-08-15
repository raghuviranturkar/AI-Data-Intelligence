import React, { useEffect, useState } from 'react'
import { TrendingUp, Minus, TrendingDown, Layers } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface FeatureCategoriesProps {
  featureRanking: any[]
}

const FeatureCategories: React.FC<FeatureCategoriesProps> = ({ featureRanking }) => {
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

  if (featureRanking.length === 0) {
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
            <Layers className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Feature Categories</h3>
        </div>
        <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No data available</p>
      </div>
    )
  }

  const highImpact = featureRanking.filter(item => item.percentage * 100 > 15)
  const mediumImpact = featureRanking.filter(item => item.percentage * 100 > 5 && item.percentage * 100 <= 15)
  const lowImpact = featureRanking.filter(item => item.percentage * 100 <= 5)

  const renderCategory = (items: any[], label: string, icon: React.ReactNode, color: string) => {
    if (items.length === 0) return null
    return (
      <div 
        className="rounded-md border p-3"
        style={{ 
          backgroundColor: colors.panelAlt,
          borderColor: colors.border
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <span className="text-xs font-medium" style={{ color: colors.text }}>{label}</span>
          <Badge variant="info" size="sm">{items.length}</Badge>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <span 
              key={item.feature} 
              className="px-2.5 py-1 rounded text-[10px] font-mono"
              style={{ 
                backgroundColor: color,
                color: isDark ? '#EDF1F5' : '#0F172A'
              }}
            >
              {item.feature}
            </span>
          ))}
        </div>
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
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="p-1.5 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <Layers className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Feature Categories</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {renderCategory(
          highImpact,
          'High Impact',
          <TrendingUp className="h-4 w-4" style={{ color: colors.accent.teal }} />,
          isDark ? 'rgba(62,207,142,0.15)' : '#D1FAE5'
        )}
        {renderCategory(
          mediumImpact,
          'Medium Impact',
          <Minus className="h-4 w-4" style={{ color: colors.accent.amber }} />,
          isDark ? 'rgba(240,169,78,0.15)' : '#FDE68A'
        )}
        {renderCategory(
          lowImpact,
          'Low Impact',
          <TrendingDown className="h-4 w-4" style={{ color: colors.textDim }} />,
          isDark ? 'rgba(74,85,99,0.3)' : '#F1F5F9'
        )}
      </div>
    </div>
  )
}

export default FeatureCategories
