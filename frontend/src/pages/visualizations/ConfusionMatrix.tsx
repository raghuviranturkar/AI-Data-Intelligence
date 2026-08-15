import React, { useEffect, useState } from 'react'
import { Grid, Layers } from 'lucide-react'
import { cn } from '../../utils/cn'

interface ConfusionMatrixProps {
  matrix: number[][]
  labels?: string[]
}

const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({ matrix, labels = ['Positive', 'Negative'] }) => {
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

  if (!matrix || matrix.length === 0) {
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
            <Grid className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Confusion Matrix</h3>
        </div>
        <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No confusion matrix available</p>
      </div>
    )
  }

  const maxVal = Math.max(...matrix.flat())

  const getColor = (value: number) => {
    const intensity = maxVal > 0 ? (value / maxVal) * 100 : 0
    if (isDark) {
      return `rgba(78, 161, 240, ${intensity / 100 * 0.7 + 0.1})`
    }
    return `rgba(78, 161, 240, ${intensity / 100 * 0.6 + 0.1})`
  }

  const getTextColor = (value: number) => {
    const intensity = maxVal > 0 ? (value / maxVal) * 100 : 0
    return intensity > 50 ? 'text-white' : (isDark ? 'text-[#EDF1F5]' : 'text-[#0F172A]')
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
          <Grid className="h-4 w-4" style={{ color: colors.accent.azure }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Confusion Matrix</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse max-w-md mx-auto">
          <thead>
            <tr>
              <th className="p-2 text-left text-xs font-mono" style={{ color: colors.textMuted }}></th>
              {labels.map((label, i) => (
                <th key={i} className="p-2 text-center text-xs font-mono" style={{ color: colors.textMuted }}>
                  Pred {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, i) => (
              <tr key={i}>
                <td className="p-2 text-left text-xs font-mono" style={{ color: colors.textMuted }}>
                  Actual {labels[i] || `Class ${i}`}
                </td>
                {row.map((value, j) => (
                  <td key={j} className="p-2 text-center">
                    <div
                      className={`rounded-md p-3 transition-colors font-mono ${getTextColor(value)}`}
                      style={{ backgroundColor: getColor(value) }}
                    >
                      {value}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex justify-center gap-6 text-xs font-mono" style={{ color: colors.textMuted }}>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: getColor(maxVal) }} />
          <span>High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: getColor(maxVal * 0.5) }} />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: getColor(0) }} />
          <span>Low</span>
        </div>
      </div>
    </div>
  )
}

export default ConfusionMatrix
