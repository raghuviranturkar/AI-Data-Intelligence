import React, { useEffect, useState } from 'react'
import { BarChart3, Target, Play, FileText, Shield, Lightbulb, Save, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface AnalysisPreferencesProps {
  settings: any
  onSettingChange: (key: string, value: any) => void
}

const AnalysisPreferences: React.FC<AnalysisPreferencesProps> = ({
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

  const preferences = [
    { key: 'autoDetectTarget', label: 'Auto Detect Target', icon: Target },
    { key: 'autoRunPipeline', label: 'Automatically Run Pipeline', icon: Play },
    { key: 'generateReports', label: 'Generate Reports After Analysis', icon: FileText },
    { key: 'enableExplainability', label: 'Enable Explainability', icon: Shield },
    { key: 'generateAIInsights', label: 'Generate AI Insights', icon: Lightbulb },
    { key: 'savePreviousResults', label: 'Save Previous Results', icon: Save },
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
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Analysis Preferences</h3>
        <Badge variant="info" size="sm">Active</Badge>
      </div>

      <div className="space-y-2.5">
        {preferences.map(({ key, label, icon: Icon }) => (
          <div 
            key={key} 
            className="flex items-center justify-between p-3 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4" style={{ color: colors.textMuted }} />
              <span className="text-sm font-medium" style={{ color: colors.text }}>{label}</span>
            </div>
            <button
              onClick={() => onSettingChange(key, !settings[key])}
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
              style={{
                backgroundColor: settings[key] ? colors.accent.amber : (isDark ? '#4A5563' : '#D1D5DB'),
              }}
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
