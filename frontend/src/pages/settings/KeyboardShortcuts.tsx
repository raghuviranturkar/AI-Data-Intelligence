import React, { useEffect, useState } from 'react'
import { Keyboard, Command, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

const KeyboardShortcuts: React.FC = () => {
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
    }
  }

  const shortcuts = [
    { keys: ['Ctrl', 'U'], action: 'Upload Dataset' },
    { keys: ['Ctrl', 'R'], action: 'Generate Report' },
    { keys: ['Ctrl', 'D'], action: 'Dashboard' },
    { keys: ['Ctrl', 'M'], action: 'Models' },
    { keys: ['Ctrl', '/'], action: 'Search (coming soon)' },
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
          <Keyboard className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Keyboard Shortcuts</h3>
        <Badge variant="info" size="sm">Active</Badge>
      </div>

      <div className="space-y-2">
        {shortcuts.map(({ keys, action }) => (
          <div 
            key={action} 
            className="flex items-center justify-between p-2.5 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <span className="text-sm font-medium" style={{ color: colors.text }}>{action}</span>
            <div className="flex gap-1">
              {keys.map((key, i) => (
                <span 
                  key={i} 
                  className="px-2 py-0.5 rounded border text-[10px] font-mono"
                  style={{ 
                    backgroundColor: colors.panel,
                    borderColor: colors.border,
                    color: colors.textMuted
                  }}
                >
                  {key}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default KeyboardShortcuts
