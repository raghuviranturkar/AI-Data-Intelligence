import React, { useEffect, useState } from 'react'
import { Share2, Mail, Send, Users, Cloud, Link } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

const ShareOptions: React.FC = () => {
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

  const options = [
    { name: 'Email', icon: Mail, color: colors.accent.azure },
    { name: 'Slack', icon: Send, color: colors.accent.purple },
    { name: 'Teams', icon: Users, color: colors.accent.amber },
    { name: 'Google Drive', icon: Cloud, color: colors.accent.teal },
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
          <Share2 className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Share Report</h3>
        <Badge variant="info" size="sm">Coming Soon</Badge>
      </div>

      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <div
            key={option.name}
            className="flex items-center gap-3 px-4 py-3 rounded-md border opacity-60 cursor-not-allowed transition-all duration-200"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <option.icon className="h-5 w-5" style={{ color: option.color }} />
            <span className="text-sm font-medium" style={{ color: colors.textMuted }}>{option.name}</span>
            <Badge variant="default" size="sm">Soon</Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ShareOptions
