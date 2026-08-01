import React from 'react'
import { BarChart3, Target, Play, FileText, Shield, Lightbulb, Save } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface AnalysisPreferencesProps {
  settings: any
  onSettingChange: (key: string, value: any) => void
}

const AnalysisPreferences: React.FC<AnalysisPreferencesProps> = ({
  settings,
  onSettingChange,
}) => {
  const preferences = [
    { key: 'autoDetectTarget', label: 'Auto Detect Target', icon: Target },
    { key: 'autoRunPipeline', label: 'Automatically Run Pipeline', icon: Play },
    { key: 'generateReports', label: 'Generate Reports After Analysis', icon: FileText },
    { key: 'enableExplainability', label: 'Enable Explainability', icon: Shield },
    { key: 'generateAIInsights', label: 'Generate AI Insights', icon: Lightbulb },
    { key: 'savePreviousResults', label: 'Save Previous Results', icon: Save },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analysis Preferences</h3>
        <Badge variant="info" size="sm">Active</Badge>
      </div>

      <div className="space-y-3">
        {preferences.map(({ key, label, icon: Icon }) => (
          <div key={key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
            </div>
            <button
              onClick={() => onSettingChange(key, !settings[key])}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings[key] ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AnalysisPreferences
