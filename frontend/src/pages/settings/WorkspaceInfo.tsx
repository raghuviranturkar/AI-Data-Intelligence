import React, { useEffect, useState } from 'react'
import { Briefcase, Tag, Code, GitBranch, Calendar, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

const WorkspaceInfo: React.FC = () => {
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
    }
  }

  const infoItems = [
    { label: 'Project Name', value: 'AI Data Intelligence', icon: <Tag className="h-4 w-4" />, color: colors.accent.amber },
    { label: 'Application Version', value: 'v1.0.0', icon: <Code className="h-4 w-4" />, color: colors.accent.azure },
    { label: 'Backend Version', value: 'FastAPI 0.104.1', icon: <GitBranch className="h-4 w-4" />, color: colors.accent.purple },
    { label: 'Frontend Version', value: 'React 18 + TypeScript', icon: <Calendar className="h-4 w-4" />, color: colors.accent.azure },
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
          <Briefcase className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Workspace Information</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {infoItems.map((item, index) => (
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
              <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>{item.label}</span>
            </div>
            <p className="text-sm font-medium mt-0.5" style={{ color: colors.text }}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkspaceInfo
