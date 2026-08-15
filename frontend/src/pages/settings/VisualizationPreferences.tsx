import React, { useEffect, useState } from 'react'
import { TrendingUp, Layout, Grid, Eye, MousePointer, Maximize, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface VisualizationPreferencesProps {
  settings: any
  onSettingChange: (key: string, value: any) => void
}

const VisualizationPreferences: React.FC<VisualizationPreferencesProps> = ({
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

  const animSpeeds = [
    { value: 'slow', label: 'Slow' },
    { value: 'medium', label: 'Medium' },
    { value: 'fast', label: 'Fast' },
  ]

  const chartThemes = [
    { value: 'default', label: 'Default' },
    { value: 'dark', label: 'Dark' },
    { value: 'colorful', label: 'Colorful' },
    { value: 'monochrome', label: 'Monochrome' },
  ]

  const toggleOptions = [
    { key: 'showGridLines', label: 'Show Grid Lines', icon: Grid },
    { key: 'enableTooltips', label: 'Enable Tooltips', icon: Eye },
    { key: 'compactLayout', label: 'Compact Layout', icon: Layout },
    { key: 'largeCards', label: 'Large Cards', icon: Maximize },
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
          <Activity className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Visualization Preferences</h3>
        <Badge variant="info" size="sm">Charts</Badge>
      </div>

      <div className="space-y-4">
        {/* Chart Theme */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: colors.textMuted }}>
            Default Chart Theme
          </label>
          <div className="flex flex-wrap gap-2">
            {chartThemes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => onSettingChange('chartTheme', theme.value)}
                className={`px-3 py-1.5 rounded-md border transition-all text-xs font-mono ${
                  settings.chartTheme === theme.value
                    ? 'border-[#F0A94E] bg-[#F0A94E]/10 text-[#F0A94E]'
                    : 'hover:border-[#3A4453]'
                }`}
                style={{
                  backgroundColor: settings.chartTheme === theme.value ? 'rgba(240,169,78,0.05)' : colors.panelAlt,
                  borderColor: settings.chartTheme === theme.value ? colors.accent.amber : colors.border,
                  color: settings.chartTheme === theme.value ? colors.accent.amber : colors.textMuted,
                }}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        {/* Animation Speed */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: colors.textMuted }}>
            Animation Speed
          </label>
          <div className="flex gap-2">
            {animSpeeds.map((speed) => (
              <button
                key={speed.value}
                onClick={() => onSettingChange('animationSpeed', speed.value)}
                className={`px-4 py-1.5 rounded-md border transition-all text-xs font-mono ${
                  settings.animationSpeed === speed.value
                    ? 'border-[#F0A94E] bg-[#F0A94E]/10 text-[#F0A94E]'
                    : 'hover:border-[#3A4453]'
                }`}
                style={{
                  backgroundColor: settings.animationSpeed === speed.value ? 'rgba(240,169,78,0.05)' : colors.panelAlt,
                  borderColor: settings.animationSpeed === speed.value ? colors.accent.amber : colors.border,
                  color: settings.animationSpeed === speed.value ? colors.accent.amber : colors.textMuted,
                }}
              >
                {speed.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-2">
          {toggleOptions.map(({ key, label, icon: Icon }) => (
            <div 
              key={key} 
              className="flex items-center justify-between p-2.5 rounded-md border"
              style={{ 
                backgroundColor: colors.panelAlt,
                borderColor: colors.border
              }}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-3 w-3" style={{ color: colors.textMuted }} />
                <span className="text-[11px] font-mono" style={{ color: colors.text }}>{label}</span>
              </div>
              <button
                onClick={() => onSettingChange(key, !settings[key])}
                className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                style={{
                  backgroundColor: settings[key] ? colors.accent.amber : (isDark ? '#4A5563' : '#D1D5DB'),
                }}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                    settings[key] ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VisualizationPreferences
