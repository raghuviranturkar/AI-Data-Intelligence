import React, { useEffect, useState } from 'react'
import { Brain, GitBranch, Clock, Shield, Zap, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface ModelPreferencesProps {
  settings: any
  onSettingChange: (key: string, value: any) => void
}

const ModelPreferences: React.FC<ModelPreferencesProps> = ({
  settings,
  onSettingChange,
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
    }
  }

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
          <Activity className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Model Preferences</h3>
        <Badge variant="info" size="sm">ML</Badge>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: colors.textMuted }}>
              Random Seed
            </label>
            <input
              type="number"
              value={settings.randomSeed}
              onChange={(e) => onSettingChange('randomSeed', parseInt(e.target.value) || 42)}
              className="w-full rounded-md border px-3 py-2 text-sm font-mono transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.panelAlt,
                borderColor: colors.border,
                color: colors.text,
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: colors.textMuted }}>
              Train/Test Split
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.trainTestSplit}
              onChange={(e) => onSettingChange('trainTestSplit', parseFloat(e.target.value) || 0.2)}
              className="w-full rounded-md border px-3 py-2 text-sm font-mono transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.panelAlt,
                borderColor: colors.border,
                color: colors.text,
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: colors.textMuted }}>
              CV Folds
            </label>
            <input
              type="number"
              value={settings.cvFolds}
              onChange={(e) => onSettingChange('cvFolds', parseInt(e.target.value) || 5)}
              className="w-full rounded-md border px-3 py-2 text-sm font-mono transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.panelAlt,
                borderColor: colors.border,
                color: colors.text,
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: colors.textMuted }}>
              Max Training Time (s)
            </label>
            <input
              type="number"
              value={settings.maxTrainingTime}
              onChange={(e) => onSettingChange('maxTrainingTime', parseInt(e.target.value) || 300)}
              className="w-full rounded-md border px-3 py-2 text-sm font-mono transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.panelAlt,
                borderColor: colors.border,
                color: colors.text,
              }}
            />
          </div>
        </div>

        <div 
          className="flex items-center justify-between p-3 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <div className="flex items-center gap-3">
            <Zap className="h-4 w-4" style={{ color: colors.textMuted }} />
            <span className="text-sm font-medium" style={{ color: colors.text }}>Enable Auto Feature Engineering</span>
          </div>
          <button
            onClick={() => onSettingChange('enableAutoFeatureEngineering', !settings.enableAutoFeatureEngineering)}
            className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            style={{
              backgroundColor: settings.enableAutoFeatureEngineering ? colors.accent.amber : (isDark ? '#4A5563' : '#D1D5DB'),
            }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.enableAutoFeatureEngineering ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModelPreferences
