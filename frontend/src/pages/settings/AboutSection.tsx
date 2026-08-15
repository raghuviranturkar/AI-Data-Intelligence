import React, { useEffect, useState } from 'react'
import { Info, GitBranch, Code, Brain, Database, Shield, Sparkles, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

const AboutSection: React.FC = () => {
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
      purple: '#B48CF2',
    }
  }

  const features = [
    { label: 'AutoML', icon: <Brain className="h-4 w-4" />, color: colors.accent.amber },
    { label: 'Explainability', icon: <Shield className="h-4 w-4" />, color: colors.accent.teal },
    { label: 'Data Intelligence', icon: <Database className="h-4 w-4" />, color: colors.accent.azure },
    { label: 'FastAPI + React', icon: <Code className="h-4 w-4" />, color: colors.accent.purple },
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
          <Info className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>About</h3>
        <Badge variant="info" size="sm">v1.0.0</Badge>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-mono leading-relaxed" style={{ color: colors.textMuted }}>
          <span className="font-bold" style={{ color: colors.text }}>AI Data Intelligence</span> is a comprehensive data intelligence platform
          that automates the entire data science lifecycle from upload to insights.
        </p>

        <div className="grid grid-cols-2 gap-2">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 p-2 rounded-md border"
              style={{ 
                backgroundColor: colors.panelAlt,
                borderColor: colors.border
              }}
            >
              <span style={{ color: feature.color }}>{feature.icon}</span>
              <span className="text-xs font-mono" style={{ color: colors.textMuted }}>{feature.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-2 border-t" style={{ borderColor: colors.border }}>
          <a 
            href="#" 
            className="text-xs font-mono transition-colors hover:opacity-80"
            style={{ color: colors.textMuted }}
          >
            <GitBranch className="h-3.5 w-3.5 inline mr-1" />
            GitHub
          </a>
          <span className="text-xs font-mono" style={{ color: colors.textDim }}>MIT License</span>
          <span className="text-xs font-mono" style={{ color: colors.textDim }}>© 2026</span>
        </div>
      </div>
    </div>
  )
}

export default AboutSection
