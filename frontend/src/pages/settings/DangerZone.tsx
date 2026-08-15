import React, { useEffect, useState } from 'react'
import { AlertTriangle, Trash2, RefreshCcw, XCircle, Activity } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { cn } from '../../utils/cn'

const DangerZone: React.FC = () => {
  const [isDark, setIsDark] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

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
      coral: '#F2555A',
      teal: '#3ECF8E',
    }
  }

  const handleAction = (action: string) => {
    if (confirm(`Are you sure you want to ${action}? This action cannot be undone.`)) {
      // Perform the action
      if (action === 'clear session') {
        localStorage.removeItem('appSettings')
        localStorage.removeItem('analysisData')
        setToast({ message: 'Session cleared successfully!', type: 'success' })
      } else if (action === 'remove cached data') {
        localStorage.clear()
        setToast({ message: 'Cached data removed successfully!', type: 'success' })
      } else if (action === 'reset settings') {
        localStorage.removeItem('appSettings')
        setToast({ message: 'Settings reset to defaults!', type: 'info' })
      }
      setTimeout(() => setToast(null), 5000)
    }
  }

  const actions = [
    { 
      label: 'Clear Current Session', 
      description: 'Remove all current analysis data',
      icon: <Trash2 className="h-4 w-4" />,
      action: 'clear session',
      color: colors.accent.coral
    },
    { 
      label: 'Remove Cached Data', 
      description: 'Clear all cached files and results',
      icon: <RefreshCcw className="h-4 w-4" />,
      action: 'remove cached data',
      color: colors.accent.amber
    },
    { 
      label: 'Reset Settings', 
      description: 'Restore all settings to defaults',
      icon: <XCircle className="h-4 w-4" />,
      action: 'reset settings',
      color: colors.accent.amber
    },
  ]

  return (
    <div 
      className="rounded-lg border-2 p-5 transition-colors duration-300"
      style={{ 
        backgroundColor: isDark ? 'rgba(242,85,90,0.05)' : '#FEF2F2',
        borderColor: isDark ? 'rgba(242,85,90,0.2)' : '#FECACA'
      }}
    >
      {toast && (
        <div 
          className="mb-4 p-3 rounded-md border text-sm font-mono"
          style={{ 
            backgroundColor: isDark ? 'rgba(62,207,142,0.08)' : '#F0FDF4',
            borderColor: isDark ? 'rgba(62,207,142,0.2)' : '#BBF7D0',
            color: colors.accent.teal
          }}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div 
          className="p-1.5 rounded-md border"
          style={{ 
            backgroundColor: isDark ? 'rgba(242,85,90,0.08)' : '#FEF2F2',
            borderColor: isDark ? 'rgba(242,85,90,0.2)' : '#FECACA'
          }}
        >
          <AlertTriangle className="h-4 w-4" style={{ color: colors.accent.coral }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.accent.coral }}>Danger Zone</h3>
      </div>

      <div className="space-y-3">
        {actions.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 rounded-md border"
            style={{ 
              backgroundColor: colors.panel,
              borderColor: colors.border
            }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: colors.text }}>{item.label}</p>
              <p className="text-[10px] font-mono" style={{ color: colors.textMuted }}>{item.description}</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleAction(item.action)}
              className="font-medium"
            >
              {item.icon}
              <span className="ml-2">{item.label.split(' ')[0]}</span>
            </Button>
          </div>
        ))}

        <p className="text-[10px] font-mono" style={{ color: colors.accent.coral }}>
          ⚠️ These actions are irreversible. Proceed with caution.
        </p>
      </div>
    </div>
  )
}

export default DangerZone
