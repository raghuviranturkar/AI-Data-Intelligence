import React, { useEffect, useState } from 'react'
import { Rocket, Users, Cloud, Calendar, Key, Share2, Clock, Sparkles, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

const FutureFeatures: React.FC = () => {
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

  const features = [
    { name: 'Team Collaboration', icon: Users, color: colors.accent.azure },
    { name: 'User Accounts', icon: Rocket, color: colors.accent.purple },
    { name: 'Cloud Storage', icon: Cloud, color: colors.accent.azure },
    { name: 'Scheduled Analysis', icon: Calendar, color: colors.accent.teal },
    { name: 'API Keys', icon: Key, color: colors.accent.amber },
    { name: 'Workspace Sharing', icon: Share2, color: colors.accent.amber },
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
          <Rocket className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Future Features</h3>
        <Badge variant="info" size="sm">Coming Soon</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {features.map(({ name, icon: Icon, color }) => (
          <div
            key={name}
            className="flex flex-col items-center p-4 rounded-md border opacity-60 transition-all duration-200 hover:opacity-80"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <Icon className="h-6 w-6 mb-2" style={{ color }} />
            <span className="text-xs font-medium text-center" style={{ color: colors.text }}>{name}</span>
            <Badge variant="default" size="sm" className="mt-1">Soon</Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FutureFeatures
