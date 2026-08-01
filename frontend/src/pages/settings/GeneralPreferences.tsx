import React from 'react'
import { Globe, LayoutDashboard, Moon, Sun, Monitor } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface GeneralPreferencesProps {
  settings: any
  onSettingChange: (key: string, value: any) => void
}

const GeneralPreferences: React.FC<GeneralPreferencesProps> = ({
  settings,
  onSettingChange,
}) => {
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General Preferences</h3>
        <Badge variant="info" size="sm">Basic</Badge>
      </div>

      <div className="space-y-4">
        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Default Theme
          </label>
          <div className="flex gap-2">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => onSettingChange('theme', theme.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  settings.theme === theme.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {theme.icon}
                <span className="text-sm">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Default Landing Page */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Default Landing Page
          </label>
          <div className="flex flex-wrap gap-2">
            {pages.map((page) => (
              <button
                key={page.value}
                onClick={() => onSettingChange('defaultPage', page.value)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  settings.defaultPage === page.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-sm">{page.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Placeholder options */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Language
            </label>
            <select 
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
              disabled
            >
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Coming soon</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time Zone
            </label>
            <select 
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
              disabled
            >
              <option>UTC-5 (Eastern)</option>
              <option>UTC-8 (Pacific)</option>
              <option>UTC+0 (GMT)</option>
              <option>UTC+5:30 (IST)</option>
            </select>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneralPreferences
