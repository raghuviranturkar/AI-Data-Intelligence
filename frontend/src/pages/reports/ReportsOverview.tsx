import React, { useEffect, useState } from 'react'
import { FileText, FileSpreadsheet, Award, Clock, Database, Activity } from 'lucide-react'

interface ReportsOverviewProps {
  reportsCount: number
  formats: string[]
  status: string
  generatedAt: string
  datasetName: string
  healthScore: number
}

const ReportsOverview: React.FC<ReportsOverviewProps> = ({
  reportsCount,
  formats,
  status,
  generatedAt,
  datasetName,
  healthScore,
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
      label: 'Reports Generated',
      value: reportsCount,
      icon: <FileText className="h-4 w-4" />,
      color: colors.accent.amber,
    },
    {
      label: 'Available Formats',
      value: formats.join(' • '),
      icon: <FileSpreadsheet className="h-4 w-4" />,
      color: colors.accent.azure,
    },
    {
      label: 'Report Status',
      value: status,
      icon: <Award className="h-4 w-4" />,
      color: colors.accent.teal,
    },
    {
      label: 'Generated At',
      value: generatedAt,
      icon: <Clock className="h-4 w-4" />,
      color: colors.textMuted,
    },
    {
      label: 'Dataset',
      value: datasetName,
      icon: <Database className="h-4 w-4" />,
      color: colors.accent.purple,
    },
    {
      label: 'AI Health Score',
      value: `${healthScore}%`,
      icon: <Activity className="h-4 w-4" />,
      color: healthScore >= 70 ? colors.accent.teal : colors.accent.amber,
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {items.map((item, index) => (
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
            <span className="text-sm font-bold" style={{ color: colors.text }}>{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ReportsOverview
