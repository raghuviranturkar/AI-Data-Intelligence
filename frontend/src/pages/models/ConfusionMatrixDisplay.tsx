import React, { useEffect, useState } from 'react'
import { Grid, Layers } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

interface ConfusionMatrixDisplayProps {
  bestModel: any
  problemType: string
}

const ConfusionMatrixDisplay: React.FC<ConfusionMatrixDisplayProps> = ({ bestModel, problemType }) => {
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

  const confusionMatrix = bestModel?.metrics?.confusion_matrix

  if (!confusionMatrix || !Array.isArray(confusionMatrix) || confusionMatrix.length === 0) {
    return null
  }

  if (problemType?.toLowerCase().includes('regression')) {
    return null
  }

  const maxVal = Math.max(...confusionMatrix.flat())

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

  const labels = confusionMatrix.map((_, i) => `Class ${i}`)

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
        <h3 className="text-base font-semibold" style={{ color: colors.text }}>Confusion Matrix</h3>
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
            {confusionMatrix.map((row, i) => (
              <tr key={i}>
                <td className="p-2 text-left text-xs font-mono" style={{ color: colors.textMuted }}>
                  Actual {labels[i]}
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
    </div>
  )
}

export default ConfusionMatrixDisplay
