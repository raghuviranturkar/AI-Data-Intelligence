import React, { useEffect, useState } from 'react'
import { Database, AlertTriangle, Filter, Scale, Clock, Activity } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface DataProcessingProps {
  settings: any
  onSettingChange: (key: string, value: any) => void
}

const DataProcessing: React.FC<DataProcessingProps> = ({
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
    }
  }

  const strategies = {
    missing: ['mean', 'median', 'mode', 'drop'],
    outlier: ['iqr', 'zscore', 'isolation_forest'],
    encoding: ['one_hot', 'label', 'target', 'frequency'],
    scaling: ['standard', 'minmax', 'robust'],
  }

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
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Data Processing</h3>
        <Badge variant="warning" size="sm">Future Config</Badge>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: colors.textMuted }}>
              Missing Value Strategy
            </label>
            <select
              value={settings.missingValueStrategy}
              onChange={(e) => onSettingChange('missingValueStrategy', e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm font-mono transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.panelAlt,
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              {strategies.missing.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <p className="text-[10px] font-mono mt-1" style={{ color: colors.textDim }}>⚠️ Not yet active</p>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: colors.textMuted }}>
              Outlier Strategy
            </label>
            <select
              value={settings.outlierStrategy}
              onChange={(e) => onSettingChange('outlierStrategy', e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm font-mono transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.panelAlt,
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              {strategies.outlier.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <p className="text-[10px] font-mono mt-1" style={{ color: colors.textDim }}>⚠️ Not yet active</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: colors.textMuted }}>
              Encoding Strategy
            </label>
            <select
              value={settings.encodingStrategy}
              onChange={(e) => onSettingChange('encodingStrategy', e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm font-mono transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.panelAlt,
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              {strategies.encoding.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <p className="text-[10px] font-mono mt-1" style={{ color: colors.textDim }}>⚠️ Not yet active</p>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: colors.textMuted }}>
              Scaling Strategy
            </label>
            <select
              value={settings.scalingStrategy}
              onChange={(e) => onSettingChange('scalingStrategy', e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm font-mono transition-colors focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.panelAlt,
                borderColor: colors.border,
                color: colors.text,
              }}
            >
              {strategies.scaling.map((s) => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <p className="text-[10px] font-mono mt-1" style={{ color: colors.textDim }}>⚠️ Not yet active</p>
          </div>
        </div>

        <div 
          className="p-3 rounded-md border"
          style={{ 
            backgroundColor: isDark ? 'rgba(240,169,78,0.05)' : '#FFFBEB',
            borderColor: isDark ? 'rgba(240,169,78,0.2)' : '#FDE68A'
          }}
        >
          <p className="text-xs font-mono" style={{ color: colors.accent.amber }}>
            ⚠️ These settings are placeholders for future implementation. The backend currently uses default strategies.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DataProcessing
