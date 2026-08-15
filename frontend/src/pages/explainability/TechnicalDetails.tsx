import React, { useEffect, useState } from 'react'
import { ChevronDown, ChevronRight, Info, Terminal } from 'lucide-react'
import { cn } from '../../utils/cn'

interface TechnicalDetailsProps {
  shapAvailable: boolean
  method: string
  modelName: string
  featureCount: number
  generatedAt: string
  expanded: boolean
  onToggle: () => void
}

const TechnicalDetails: React.FC<TechnicalDetailsProps> = ({
  shapAvailable,
  method,
  modelName,
  featureCount,
  generatedAt,
  expanded,
  onToggle,
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
      azure: '#4EA1F0',
    }
  }

  const details = [
    { label: 'Explanation Method', value: method },
    { label: 'Model', value: modelName },
    { label: 'Features Used', value: featureCount },
    { label: 'SHAP Available', value: shapAvailable ? 'Yes' : 'No' },
    { label: 'Generated At', value: new Date(generatedAt).toLocaleString() },
    { label: 'Pipeline Version', value: '1.0.0' },
  ]

  return (
    <div 
      className="rounded-lg border p-5 transition-colors duration-300"
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.border
      }}
    >
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-3">
          <div 
            className="p-1.5 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <Terminal className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Technical Details</h3>
        </div>
        {expanded ? (
          <ChevronDown className="h-4 w-4" style={{ color: colors.textDim }} />
        ) : (
          <ChevronRight className="h-4 w-4" style={{ color: colors.textDim }} />
        )}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t" style={{ borderColor: colors.border }}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {details.map((item, index) => (
              <div 
                key={index} 
                className="p-3 rounded-md border"
                style={{ 
                  backgroundColor: colors.panelAlt,
                  borderColor: colors.border
                }}
              >
                <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>
                  {item.label}
                </p>
                <p className="text-xs font-medium mt-0.5" style={{ color: colors.text }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TechnicalDetails
