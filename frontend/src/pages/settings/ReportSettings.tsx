import React from 'react'
import { FileText, File, FileCode, CheckSquare, Square } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

interface ReportSettingsProps {
  settings: any
  onSettingChange: (key: string, value: any) => void
}

const ReportSettings: React.FC<ReportSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  const reportFormats = [
    { key: 'generatePDF', label: 'PDF', icon: <FileText className="h-4 w-4" /> },
    { key: 'generateHTML', label: 'HTML', icon: <File className="h-4 w-4" /> },
    { key: 'generateMarkdown', label: 'Markdown', icon: <FileCode className="h-4 w-4" /> },
  ]

  const inclusions = [
    { key: 'includeExecutiveSummary', label: 'Executive Summary' },
    { key: 'includeVisualizations', label: 'Visualizations' },
    { key: 'includeAISummary', label: 'AI Insights' },
    { key: 'includeModelMetrics', label: 'Model Metrics' },
    { key: 'includeRecommendations', label: 'Recommendations' },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Report Settings</h3>
        <Badge variant="info" size="sm">Export</Badge>
      </div>

      <div className="space-y-4">
        {/* Report Formats */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Generate Formats
          </label>
          <div className="flex flex-wrap gap-3">
            {reportFormats.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => onSettingChange(key, !settings[key])}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  settings[key]
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {icon}
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Default Report Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Default Report Name
          </label>
          <input
            type="text"
            value={settings.reportName}
            onChange={(e) => onSettingChange('reportName', e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
            placeholder="analysis_report"
          />
        </div>

        {/* Inclusions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Include in Report
          </label>
          <div className="grid grid-cols-2 gap-2">
            {inclusions.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onSettingChange(key, !settings[key])}
                className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                  settings[key]
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {settings[key] ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportSettings
