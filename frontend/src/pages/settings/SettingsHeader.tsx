import React, { useEffect, useState } from 'react'
import { Settings, Save, RotateCcw, Sparkles } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface SettingsHeaderProps {
  onSave: () => void
  onReset: () => void
  hasUnsavedChanges: boolean
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  onSave,
  onReset,
  hasUnsavedChanges,
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
    }
  }

  return (
    <div 
      className="rounded-lg border p-6 transition-colors duration-300 sticky top-16 z-20"
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.border
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div 
            className="p-3 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <Settings className="h-6 w-6" style={{ color: colors.accent.amber }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: colors.text }}>Settings</h1>
            <p className="text-sm font-mono" style={{ color: colors.textMuted }}>
              Configure your workspace, preferences, and analysis options.
            </p>
            {hasUnsavedChanges && (
              <Badge variant="warning" size="sm" className="mt-1">
                Unsaved changes
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={onSave}
            className="font-medium"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={onReset}
            className="font-medium"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SettingsHeader
