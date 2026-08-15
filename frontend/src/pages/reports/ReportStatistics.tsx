import React, { useEffect, useState } from 'react'
import { Download, FileText, Clock, Calendar, TrendingUp } from 'lucide-react'

interface ReportStatisticsProps {
  downloads: number
  reportsGenerated: number
  avgGenerationTime: string
  lastGenerated: string
}

const ReportStatistics: React.FC<ReportStatisticsProps> = ({
  downloads,
  reportsGenerated,
  avgGenerationTime,
  lastGenerated,
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
      label: 'Total Downloads', 
      value: downloads, 
      icon: <Download className="h-4 w-4" />, 
      color: colors.accent.amber 
    },
    { 
      label: 'Reports Generated', 
      value: reportsGenerated, 
      icon: <FileText className="h-4 w-4" />, 
      color: colors.accent.azure 
    },
    { 
      label: 'Avg Generation Time', 
      value: avgGenerationTime, 
      icon: <Clock className="h-4 w-4" />, 
      color: colors.accent.teal 
    },
    { 
      label: 'Last Generated', 
      value: lastGenerated, 
      icon: <Calendar className="h-4 w-4" />, 
      color: colors.accent.purple 
    },
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
          <TrendingUp className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Report Statistics</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="p-4 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center gap-2">
              <div style={{ color: item.color }}>{item.icon}</div>
              <span className="text-xs font-mono" style={{ color: colors.textMuted }}>{item.label}</span>
            </div>
            <p className="text-xl font-bold mt-1" style={{ color: colors.text }}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReportStatistics
