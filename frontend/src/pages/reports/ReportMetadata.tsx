import React, { useEffect, useState } from 'react'
import { Info, Database, BarChart3, Award, Brain, Clock } from 'lucide-react'

interface ReportMetadataProps {
  datasetName: string
  rows: number
  columns: number
  qualityScore: number
  bestModel: string
  generatedAt: string
}

const ReportMetadata: React.FC<ReportMetadataProps> = ({
  datasetName,
  rows,
  columns,
  qualityScore,
  bestModel,
  generatedAt,
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
    { label: 'Dataset', value: datasetName, icon: <Database className="h-4 w-4" />, color: colors.accent.amber },
    { label: 'Rows', value: rows.toLocaleString(), icon: <BarChart3 className="h-4 w-4" />, color: colors.accent.azure },
    { label: 'Columns', value: columns.toLocaleString(), icon: <BarChart3 className="h-4 w-4" />, color: colors.accent.purple },
    { label: 'Quality Score', value: `${qualityScore}/100`, icon: <Award className="h-4 w-4" />, color: colors.accent.teal },
    { label: 'Best Model', value: bestModel, icon: <Brain className="h-4 w-4" />, color: colors.accent.amber },
    { label: 'Generated At', value: generatedAt, icon: <Clock className="h-4 w-4" />, color: colors.textMuted },
  ]

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
          <Info className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Report Metadata</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="p-3 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center gap-2">
              <span style={{ color: item.color }}>{item.icon}</span>
              <span className="text-xs font-mono" style={{ color: colors.textMuted }}>{item.label}</span>
            </div>
            <p className="text-sm font-medium mt-1" style={{ color: colors.text }}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReportMetadata
