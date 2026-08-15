import React, { useEffect, useState } from 'react'
import { CheckCircle, AlertTriangle, XCircle, Info, Shield } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface ValidationItem {
  label: string
  value: string | number | boolean
  status: 'success' | 'warning' | 'error' | 'info'
}

interface DataValidationSectionProps {
  items: ValidationItem[]
  warnings?: string[]
  className?: string
}

const DataValidationSection: React.FC<DataValidationSectionProps> = ({
  items,
  warnings = [],
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

  const getStatusIcon = (status: ValidationItem['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4" style={{ color: colors.accent.teal }} />
      case 'warning': return <AlertTriangle className="h-4 w-4" style={{ color: colors.accent.amber }} />
      case 'error': return <XCircle className="h-4 w-4" style={{ color: colors.accent.coral }} />
      default: return <Info className="h-4 w-4" style={{ color: colors.accent.azure }} />
    }
  }

  const getStatusColor = (status: ValidationItem['status']) => {
    switch (status) {
      case 'success': return { border: isDark ? 'rgba(62,207,142,0.2)' : '#BBF7D0', bg: isDark ? 'rgba(62,207,142,0.05)' : '#F0FDF4' }
      case 'warning': return { border: isDark ? 'rgba(240,169,78,0.2)' : '#FDE68A', bg: isDark ? 'rgba(240,169,78,0.05)' : '#FFFBEB' }
      case 'error': return { border: isDark ? 'rgba(242,85,90,0.2)' : '#FECACA', bg: isDark ? 'rgba(242,85,90,0.05)' : '#FEF2F2' }
      default: return { border: isDark ? 'rgba(78,161,240,0.2)' : '#BFDBFE', bg: isDark ? 'rgba(78,161,240,0.05)' : '#EFF6FF' }
    }
  }

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
          <Shield className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Data Validation</h3>
        <Badge variant="info" size="sm">{items.length} Checks</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, index) => {
          const statusStyle = getStatusColor(item.status)
          return (
            <div
              key={index}
              className="rounded-md border p-3 transition-colors duration-200"
              style={{ 
                backgroundColor: statusStyle.bg,
                borderColor: statusStyle.border
              }}
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(item.status)}
                <div>
                  <p className="text-xs font-medium" style={{ color: colors.text }}>{item.label}</p>
                  <p className="text-xs font-mono mt-0.5" style={{ color: colors.textMuted }}>
                    {typeof item.value === 'boolean' 
                      ? item.value ? 'Passed' : 'Failed' 
                      : String(item.value)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {warnings.length > 0 && (
        <div 
          className="rounded-md p-4 border"
          style={{ 
            backgroundColor: isDark ? 'rgba(240,169,78,0.05)' : '#FFFBEB',
            borderColor: isDark ? 'rgba(240,169,78,0.2)' : '#FDE68A'
          }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" style={{ color: colors.accent.amber }} />
            <div>
              <p className="text-xs font-semibold" style={{ color: colors.accent.amber }}>Validation Warnings</p>
              <ul className="mt-1 space-y-1">
                {warnings.map((warning, i) => (
                  <li key={i} className="text-xs font-mono" style={{ color: colors.textMuted }}>• {warning}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataValidationSection
