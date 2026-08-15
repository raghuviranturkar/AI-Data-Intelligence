import React, { useEffect, useState } from 'react'
import { HardDrive, FileText, Database, Clock, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

const StorageInfo: React.FC = () => {
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
      azure: '#4EA1F0',
      purple: '#B48CF2',
      teal: '#3ECF8E',
    }
  }

  const stats = [
    { label: 'Reports Generated', value: '0', icon: <FileText className="h-4 w-4" />, color: colors.accent.amber },
    { label: 'Datasets Processed', value: '0', icon: <Database className="h-4 w-4" />, color: colors.accent.azure },
    { label: 'Last Analysis', value: 'N/A', icon: <Clock className="h-4 w-4" />, color: colors.accent.purple },
    { label: 'Storage Used', value: '0 KB', icon: <HardDrive className="h-4 w-4" />, color: colors.accent.teal },
  ]

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
          <HardDrive className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Storage</h3>
        <Badge variant="info" size="sm">Local</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="p-3 rounded-md border text-center"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <span style={{ color: stat.color }}>{stat.icon}</span>
            </div>
            <p className="text-xl font-bold" style={{ color: colors.text }}>{stat.value}</p>
            <p className="text-[10px] font-mono" style={{ color: colors.textMuted }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StorageInfo
