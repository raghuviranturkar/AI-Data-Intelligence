import React, { useEffect, useState } from 'react'
import { Table, List } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface FeatureImportanceTableProps {
  featureRanking: any[]
}

const FeatureImportanceTable: React.FC<FeatureImportanceTableProps> = ({ featureRanking }) => {
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
            <List className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Feature Importance Table</h3>
        </div>
        <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No data available</p>
      </div>
    )
  }

  const getImpactLevel = (percentage: number) => {
    if (percentage > 15) return { label: 'High', color: colors.accent.teal }
    if (percentage > 5) return { label: 'Medium', color: colors.accent.amber }
    return { label: 'Low', color: colors.textDim }
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
          <Table className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Feature Importance Table</h3>
        <Badge variant="info" size="sm">{featureRanking.length} Features</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: colors.border }}>
              <th className="px-3 py-2 text-left text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>#</th>
              <th className="px-3 py-2 text-left text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Feature</th>
              <th className="px-3 py-2 text-right text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Importance</th>
              <th className="px-3 py-2 text-right text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Percentage</th>
              <th className="px-3 py-2 text-center text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>Impact</th>
            </tr>
          </thead>
          <tbody>
            {featureRanking.map((item, index) => {
              const impact = getImpactLevel(item.percentage * 100)
              return (
                <tr
                  key={item.feature}
                  className="border-b transition-colors hover:opacity-80"
                  style={{ borderColor: colors.border }}
                >
                  <td className="px-3 py-2.5 text-xs font-mono" style={{ color: colors.textDim }}>{index + 1}</td>
                  <td className="px-3 py-2.5 text-xs font-medium" style={{ color: colors.text }}>{item.feature}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-xs" style={{ color: colors.textMuted }}>
                    {item.importance.toFixed(3)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono text-xs" style={{ color: colors.textMuted }}>
                    {(item.percentage * 100).toFixed(1)}%
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <Badge variant="default" size="sm">
                      <span style={{ color: impact.color }}>{impact.label}</span>
                    </Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FeatureImportanceTable
