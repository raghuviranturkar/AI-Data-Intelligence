import React, { useEffect, useState } from 'react'
import { CheckCircle, Layers } from 'lucide-react'
import { Badge } from '../../components/common/Badge'

const items = [
  'Dataset Overview',
  'Validation Report',
  'Missing Values',
  'Outlier Detection',
  'EDA',
  'Visualizations',
  'Feature Engineering',
  'AutoML',
  'Model Comparison',
  'Explainability',
  'AI Insights',
  'Recommendations',
]

const ReportContentSummary: React.FC = () => {
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
    accent: {
      teal: '#3ECF8E',
      amber: '#F0A94E',
    }
  }

  return (
    <div 
      className="rounded-lg border p-6 transition-colors duration-300"
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
          <Layers className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Report Content</h3>
        <Badge variant="info" size="sm">{items.length} Sections</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {items.map((item, index) => (
          <div 
            key={index} 
            className="flex items-center gap-2 p-2 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <CheckCircle className="h-4 w-4 flex-shrink-0" style={{ color: colors.accent.teal }} />
            <span className="text-sm font-mono" style={{ color: colors.textMuted }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReportContentSummary
