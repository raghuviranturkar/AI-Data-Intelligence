import React, { useEffect, useState } from 'react'
import { Server, Database, FileText, Shield, Brain, Activity, CheckCircle } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

const SystemStatus: React.FC = () => {
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

  const statuses = [
    { label: 'Backend', icon: Server, status: 'online', color: colors.accent.teal },
    { label: 'API', icon: Activity, status: 'connected', color: colors.accent.azure },
    { label: 'Reports', icon: FileText, status: 'available', color: colors.accent.purple },
    { label: 'AI Insights', icon: Brain, status: 'ready', color: colors.accent.amber },
    { label: 'Explainability', icon: Shield, status: 'ready', color: colors.accent.teal },
    { label: 'Database', icon: Database, status: 'connected', color: colors.accent.azure },
  ]

  const allReady = statuses.every(s => s.status !== 'offline' && s.status !== 'error')

  return (
    <div 
      className="rounded-lg border p-5 transition-colors duration-300"
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="p-1.5 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <Server className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>System Status</h3>
          <Badge variant="success" size="sm">All Systems Go</Badge>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-mono" style={{ color: colors.accent.teal }}>Operational</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
        {statuses.map(({ label, icon: Icon, status, color }) => (
          <div 
            key={label} 
            className="flex items-center justify-between p-2.5 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4" style={{ color }} />
              <span className="text-xs font-mono" style={{ color: colors.textMuted }}>{label}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[10px] font-mono" style={{ color: colors.accent.teal }}>{status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t flex justify-center gap-4 text-[10px] font-mono" style={{ borderColor: colors.border, color: colors.textDim }}>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          All systems operational
        </span>
      </div>
    </div>
  )
}

export default SystemStatus
