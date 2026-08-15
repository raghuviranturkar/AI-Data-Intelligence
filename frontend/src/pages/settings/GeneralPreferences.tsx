import React, { useEffect, useState } from 'react'
import { Globe, LayoutDashboard, Moon, Sun, Monitor, Settings } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'
import { useTheme } from '../../context/ThemeContext'

interface GeneralPreferencesProps {
  settings: any
  onSettingChange: (key: string, value: any) => void
}

const GeneralPreferences: React.FC<GeneralPreferencesProps> = ({
  settings,
  onSettingChange,
}) => {
  const { theme, toggleTheme } = useTheme()
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

  const themes = [
    { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
    { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
    { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
  ]

  const pages = [
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'analysis', label: 'Analysis' },
    { value: 'visualizations', label: 'Visualizations' },
    { value: 'models', label: 'Models' },
  ]

  const handleThemeChange = (value: string) => {
    onSettingChange('theme', value)
    toggleTheme()
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
          <Globe className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>General Preferences</h3>
        <Badge variant="info" size="sm">Basic</Badge>
      </div>

      <div className="space-y-4">
        {/* Theme Selection */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: colors.textMuted }}>
            Default Theme
          </label>
          <div className="flex gap-2">
            {themes.map((themeOption) => (
              <button
                key={themeOption.value}
                onClick={() => handleThemeChange(themeOption.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all text-sm font-mono ${
                  settings.theme === themeOption.value
                    ? 'border-[#F0A94E] bg-[#F0A94E]/10 text-[#F0A94E]'
                    : 'border-[#232B35] hover:border-[#3A4453]'
                }`}
                style={{
                  backgroundColor: settings.theme === themeOption.value ? 'rgba(240,169,78,0.05)' : colors.panelAlt,
                  borderColor: settings.theme === themeOption.value ? colors.accent.amber : colors.border,
                  color: settings.theme === themeOption.value ? colors.accent.amber : colors.textMuted,
                }}
              >
                {themeOption.icon}
                <span>{themeOption.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Default Landing Page */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: colors.textMuted }}>
            Default Landing Page
          </label>
          <div className="flex flex-wrap gap-2">
            {pages.map((page) => (
              <button
                key={page.value}
                onClick={() => onSettingChange('defaultPage', page.value)}
                className={`px-3 py-1.5 rounded-md border transition-all text-xs font-mono ${
                  settings.defaultPage === page.value
                    ? 'border-[#F0A94E] bg-[#F0A94E]/10 text-[#F0A94E]'
                    : 'hover:border-[#3A4453]'
                }`}
                style={{
                  backgroundColor: settings.defaultPage === page.value ? 'rgba(240,169,78,0.05)' : colors.panelAlt,
                  borderColor: settings.defaultPage === page.value ? colors.accent.amber : colors.border,
                  color: settings.defaultPage === page.value ? colors.accent.amber : colors.textMuted,
                }}
              >
                {page.label}
              </button>
            ))}
          </div>
        </div>

        {/* Placeholder options */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: colors.textMuted }}>
              Language
            </label>
            <select 
              className="w-full rounded-md border px-3 py-2 text-sm font-mono transition-colors focus:outline-none focus:ring-2 opacity-60 cursor-not-allowed"
              style={{
                backgroundColor: colors.panelAlt,
                borderColor: colors.border,
                color: colors.text,
              }}
              disabled
            >
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
            <p className="text-[10px] font-mono mt-1" style={{ color: colors.textDim }}>Coming soon</p>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: colors.textMuted }}>
              Time Zone
            </label>
            <select 
              className="w-full rounded-md border px-3 py-2 text-sm font-mono transition-colors focus:outline-none focus:ring-2 opacity-60 cursor-not-allowed"
              style={{
                backgroundColor: colors.panelAlt,
                borderColor: colors.border,
                color: colors.text,
              }}
              disabled
            >
              <option>UTC-5 (Eastern)</option>
              <option>UTC-8 (Pacific)</option>
              <option>UTC+0 (GMT)</option>
              <option>UTC+5:30 (IST)</option>
            </select>
            <p className="text-[10px] font-mono mt-1" style={{ color: colors.textDim }}>Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneralPreferences
