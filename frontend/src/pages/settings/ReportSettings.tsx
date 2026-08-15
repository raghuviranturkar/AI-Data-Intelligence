import React, { useEffect, useState } from 'react'
import { FileText, File, FileCode, CheckSquare, Square, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface ReportSettingsProps {
  settings: any
  onSettingChange: (key: string, value: any) => void
}

const ReportSettings: React.FC<ReportSettingsProps> = ({
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
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Report Settings</h3>
        <Badge variant="info" size="sm">Export</Badge>
      </div>

      <div className="space-y-4">
        {/* Report Formats */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: colors.textMuted }}>
            Generate Formats
          </label>
          <div className="flex flex-wrap gap-2">
            {reportFormats.map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => onSettingChange(key, !settings[key])}
                className={`flex items-center gap-2 px-3 py-2 rounded-md border transition-all text-xs font-mono ${
                  settings[key]
                    ? 'border-[#F0A94E] bg-[#F0A94E]/10 text-[#F0A94E]'
                    : 'hover:border-[#3A4453]'
                }`}
                style={{
                  backgroundColor: settings[key] ? 'rgba(240,169,78,0.05)' : colors.panelAlt,
                  borderColor: settings[key] ? colors.accent.amber : colors.border,
                  color: settings[key] ? colors.accent.amber : colors.textMuted,
                }}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Default Report Name */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: colors.textMuted }}>
            Default Report Name
          </label>
          <input
            type="text"
            value={settings.reportName}
            onChange={(e) => onSettingChange('reportName', e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm font-mono transition-colors focus:outline-none focus:ring-2"
            style={{
              backgroundColor: colors.panelAlt,
              borderColor: colors.border,
              color: colors.text,
            }}
            placeholder="analysis_report"
          />
        </div>

        {/* Inclusions */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider mb-2" style={{ color: colors.textMuted }}>
            Include in Report
          </label>
          <div className="grid grid-cols-2 gap-2">
            {inclusions.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => onSettingChange(key, !settings[key])}
                className={`flex items-center gap-2 p-2 rounded-md border transition-all text-xs font-mono ${
                  settings[key]
                    ? 'border-[#F0A94E] bg-[#F0A94E]/10 text-[#F0A94E]'
                    : 'hover:border-[#3A4453]'
                }`}
                style={{
                  backgroundColor: settings[key] ? 'rgba(240,169,78,0.05)' : colors.panelAlt,
                  borderColor: settings[key] ? colors.accent.amber : colors.border,
                  color: settings[key] ? colors.accent.amber : colors.textMuted,
                }}
              >
                {settings[key] ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportSettings
