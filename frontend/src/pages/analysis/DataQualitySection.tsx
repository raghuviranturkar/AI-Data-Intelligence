import React, { useEffect, useState } from 'react'
import { Award, AlertTriangle, Copy, Database, FileX, Hash, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface DataQualitySectionProps {
  qualityScore: number
  totalWarnings: number
  duplicateRows: number
  missingValues: number
  highMissingColumns: string[]
  constantColumns: string[]
  className?: string
}

const DataQualitySection: React.FC<DataQualitySectionProps> = ({
  qualityScore,
  totalWarnings,
  duplicateRows,
  missingValues,
  highMissingColumns,
  constantColumns,
  className,
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
      coral: '#F2555A',
    }
  }

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: colors.accent.teal, barColor: colors.accent.teal }
    if (score >= 60) return { label: 'Good', color: colors.accent.amber, barColor: colors.accent.amber }
    return { label: 'Needs Improvement', color: colors.accent.coral, barColor: colors.accent.coral }
  }

  const level = getScoreLevel(qualityScore)

  const qualityItems = [
    { 
      label: 'Quality Score', 
      value: `${qualityScore}/100`, 
      icon: <Award className="h-4 w-4" />, 
      badge: level.label,
      color: level.color
    },
    { 
      label: 'Warnings', 
      value: totalWarnings, 
      icon: <AlertTriangle className="h-4 w-4" />, 
      badge: totalWarnings > 0 ? 'Review' : 'Clear',
      color: totalWarnings > 0 ? colors.accent.amber : colors.accent.teal
    },
    { 
      label: 'Duplicate Rows', 
      value: duplicateRows, 
      icon: <Copy className="h-4 w-4" />, 
      badge: duplicateRows > 0 ? 'Found' : 'Clean',
      color: duplicateRows > 0 ? colors.accent.amber : colors.accent.teal
    },
    { 
      label: 'Missing Values', 
      value: missingValues, 
      icon: <Database className="h-4 w-4" />, 
      badge: missingValues > 0 ? 'Review' : 'Complete',
      color: missingValues > 0 ? colors.accent.amber : colors.accent.teal
    },
  ]

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
          <Activity className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Data Quality Analysis</h3>
        <Badge variant="info" size="sm">{qualityScore}/100</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {qualityItems.map((item, index) => (
          <div 
            key={index} 
            className="rounded-md border p-4"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span style={{ color: item.color }}>{item.icon}</span>
                <span className="text-[10px] font-mono" style={{ color: colors.textMuted }}>{item.label}</span>
              </div>
              <Badge variant={item.badge === 'Clear' || item.badge === 'Clean' || item.badge === 'Complete' ? 'success' : 'warning'} size="sm">
                {item.badge}
              </Badge>
            </div>
            <p className="text-xl font-bold mt-1" style={{ color: colors.text }}>{item.value}</p>
          </div>
        ))}
      </div>

      {(highMissingColumns.length > 0 || constantColumns.length > 0) && (
        <div 
          className="rounded-md p-4 border"
          style={{ 
            backgroundColor: isDark ? 'rgba(240,169,78,0.05)' : '#FFFBEB',
            borderColor: isDark ? 'rgba(240,169,78,0.2)' : '#FDE68A'
          }}
        >
          <div className="space-y-2">
            {highMissingColumns.length > 0 && (
              <div>
                <p className="text-xs font-semibold" style={{ color: colors.accent.amber }}>
                  ⚠️ High Missing Values ({highMissingColumns.length} columns)
                </p>
                <p className="text-xs font-mono mt-1" style={{ color: colors.textMuted }}>
                  {highMissingColumns.join(', ')}
                </p>
              </div>
            )}
            {constantColumns.length > 0 && (
              <div>
                <p className="text-xs font-semibold" style={{ color: colors.accent.amber }}>
                  ⚠️ Constant Columns ({constantColumns.length} columns)
                </p>
                <p className="text-xs font-mono mt-1" style={{ color: colors.textMuted }}>
                  {constantColumns.join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DataQualitySection
