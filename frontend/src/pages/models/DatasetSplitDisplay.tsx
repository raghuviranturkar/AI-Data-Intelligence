import React, { useEffect, useState } from 'react'
import { PieChart, Database } from 'lucide-react'

interface DatasetSplitDisplayProps {
  datasetSplit: any
}

const DatasetSplitDisplay: React.FC<DatasetSplitDisplayProps> = ({ datasetSplit }) => {
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

  const trainSize = datasetSplit?.train_size || 0
  const valSize = datasetSplit?.validation_size || 0
  const testSize = datasetSplit?.test_size || 0
  const total = trainSize + valSize + testSize

  if (total === 0) {
    return (
      <div 
        className="rounded-lg border p-6 transition-colors duration-300"
        style={{ 
          backgroundColor: colors.panel,
          borderColor: colors.border
        }}
      >
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Dataset Split</h3>
        <p className="text-sm font-mono mt-2" style={{ color: colors.textMuted }}>No dataset split data available</p>
      </div>
    )
  }

  const trainPct = (trainSize / total * 100).toFixed(0)
  const valPct = (valSize / total * 100).toFixed(0)
  const testPct = (testSize / total * 100).toFixed(0)

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
          <Database className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Dataset Split</h3>
      </div>

      <div className="space-y-4">
        <div className="flex h-8 w-full overflow-hidden rounded-md">
          <div 
            className="flex items-center justify-center text-xs text-white font-medium"
            style={{ 
              width: `${trainPct}%`,
              backgroundColor: colors.accent.azure
            }}
          >
            {trainPct}%
          </div>
          <div 
            className="flex items-center justify-center text-xs text-white font-medium"
            style={{ 
              width: `${valPct}%`,
              backgroundColor: colors.accent.amber
            }}
          >
            {valPct}%
          </div>
          <div 
            className="flex items-center justify-center text-xs text-white font-medium"
            style={{ 
              width: `${testPct}%`,
              backgroundColor: colors.accent.purple
            }}
          >
            {testPct}%
          </div>
        </div>
        
        <div className="flex justify-center gap-6 text-sm font-mono">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: colors.accent.azure }} />
            <span style={{ color: colors.textMuted }}>Train ({trainPct}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: colors.accent.amber }} />
            <span style={{ color: colors.textMuted }}>Validation ({valPct}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded" style={{ backgroundColor: colors.accent.purple }} />
            <span style={{ color: colors.textMuted }}>Test ({testPct}%)</span>
          </div>
        </div>
        
        <div className="text-center text-xs font-mono" style={{ color: colors.textDim }}>
          Total: {total} samples
        </div>
      </div>
    </div>
  )
}

export default DatasetSplitDisplay
