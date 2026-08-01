import React from 'react'
import { Brain, GitBranch, Clock, Shield, Zap } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface ModelPreferencesProps {
  settings: any
  onSettingChange: (key: string, value: any) => void
}

const ModelPreferences: React.FC<ModelPreferencesProps> = ({
  settings,
  onSettingChange,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Model Preferences</h3>
        <Badge variant="info" size="sm">ML</Badge>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Random Seed
            </label>
            <input
              type="number"
              value={settings.randomSeed}
              onChange={(e) => onSettingChange('randomSeed', parseInt(e.target.value) || 42)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Train/Test Split
            </label>
            <input
              type="number"
              step="0.01"
              value={settings.trainTestSplit}
              onChange={(e) => onSettingChange('trainTestSplit', parseFloat(e.target.value) || 0.2)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              CV Folds
            </label>
            <input
              type="number"
              value={settings.cvFolds}
              onChange={(e) => onSettingChange('cvFolds', parseInt(e.target.value) || 5)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max Training Time (s)
            </label>
            <input
              type="number"
              value={settings.maxTrainingTime}
              onChange={(e) => onSettingChange('maxTrainingTime', parseInt(e.target.value) || 300)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
          <div className="flex items-center gap-3">
            <Zap className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Auto Feature Engineering</span>
          </div>
          <button
            onClick={() => onSettingChange('enableAutoFeatureEngineering', !settings.enableAutoFeatureEngineering)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.enableAutoFeatureEngineering ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
            }`}
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
