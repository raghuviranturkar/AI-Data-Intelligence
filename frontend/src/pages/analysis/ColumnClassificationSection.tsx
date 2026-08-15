import React, { useState, useEffect } from 'react'
import { 
  Hash, 
  FileText, 
  ToggleLeft, 
  Calendar, 
  Target, 
  Fingerprint,
  ChevronDown,
  ChevronRight,
  Layers
} from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface ClassificationData {
  identifier: string[]
  numeric: string[]
  categorical: string[]
  boolean: string[]
  datetime: string[]
  target_candidate: string[]
}

interface ColumnClassificationSectionProps {
  data: ClassificationData
  className?: string
}

const classificationConfig = {
  identifier: { icon: Fingerprint, label: 'Identifier', color: 'text-blue-500' },
  numeric: { icon: Hash, label: 'Numeric', color: 'text-green-500' },
  categorical: { icon: FileText, label: 'Categorical', color: 'text-purple-500' },
  boolean: { icon: ToggleLeft, label: 'Boolean', color: 'text-yellow-500' },
  datetime: { icon: Calendar, label: 'Datetime', color: 'text-red-500' },
  target_candidate: { icon: Target, label: 'Target Candidate', color: 'text-pink-500' },
}

const ColumnClassificationSection: React.FC<ColumnClassificationSectionProps> = ({
  data,
  className,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
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
    }
  }

  const toggleExpand = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const totalColumns = Object.values(data).reduce((acc, arr) => acc + arr.length, 0)

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center gap-3">
        <div 
          className="p-1.5 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <Layers className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Column Classification</h3>
        <Badge variant="info" size="sm">{totalColumns} Total</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(classificationConfig).map(([key, config]) => {
          const columns = data[key as keyof ClassificationData] || []
          const isExpanded = expanded[key] || false

          return (
            <div
              key={key}
              className="rounded-md border overflow-hidden transition-colors duration-300"
              style={{ 
                backgroundColor: colors.panel,
                borderColor: colors.border
              }}
            >
              <button
                onClick={() => toggleExpand(key)}
                className="w-full flex items-center justify-between p-3 hover:opacity-80 transition-opacity"
                style={{ backgroundColor: colors.panelAlt }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-md" style={{ backgroundColor: colors.panel }}>
                    <config.icon className="h-4 w-4" style={{ color: config.color }} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-medium" style={{ color: colors.text }}>{config.label}</p>
                    <p className="text-[10px] font-mono" style={{ color: colors.textMuted }}>{columns.length} columns</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" style={{ color: colors.textDim }} />
                ) : (
                  <ChevronRight className="h-4 w-4" style={{ color: colors.textDim }} />
                )}
              </button>

              {isExpanded && columns.length > 0 && (
                <div className="px-3 pb-3 pt-2 border-t" style={{ borderColor: colors.border }}>
                  <div className="flex flex-wrap gap-1">
                    {columns.map((col) => (
                      <span
                        key={col}
                        className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono"
                        style={{ 
                          backgroundColor: colors.panelAlt,
                          color: colors.textMuted
                        }}
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ColumnClassificationSection
