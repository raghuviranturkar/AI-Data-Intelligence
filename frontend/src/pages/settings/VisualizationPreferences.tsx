import React from 'react'
import { TrendingUp, Layout, Grid, Eye, MousePointer, Maximize } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface VisualizationPreferencesProps {
  settings: any
  onSettingChange: (key: string, value: any) => void
}

const VisualizationPreferences: React.FC<VisualizationPreferencesProps> = ({
  settings,
  onSettingChange,
}) => {
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Visualization Preferences</h3>
        <Badge variant="info" size="sm">Charts</Badge>
      </div>

      <div className="space-y-4">
        {/* Chart Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Default Chart Theme
          </label>
          <div className="flex flex-wrap gap-2">
            {chartThemes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => onSettingChange('chartTheme', theme.value)}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  settings.chartTheme === theme.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-sm">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Animation Speed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Animation Speed
          </label>
          <div className="flex gap-2">
            {animSpeeds.map((speed) => (
              <button
                key={speed.value}
                onClick={() => onSettingChange('animationSpeed', speed.value)}
                className={`px-4 py-1.5 rounded-lg border transition-all ${
                  settings.animationSpeed === speed.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-sm">{speed.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'showGridLines', label: 'Show Grid Lines', icon: Grid },
            { key: 'enableTooltips', label: 'Enable Tooltips', icon: Eye },
            { key: 'compactLayout', label: 'Compact Layout', icon: Layout },
            { key: 'largeCards', label: 'Large Cards', icon: Maximize },
          ].map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Icon className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                <span className="text-xs text-gray-700 dark:text-gray-300">{label}</span>
              </div>
              <button
                onClick={() => onSettingChange(key, !settings[key])}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  settings[key] ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
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
