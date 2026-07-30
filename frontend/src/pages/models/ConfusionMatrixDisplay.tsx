import React from 'react'
import { useTheme } from '../../context/ThemeContext'

interface ConfusionMatrixDisplayProps {
  bestModel: any
  problemType: string
}

const ConfusionMatrixDisplay: React.FC<ConfusionMatrixDisplayProps> = ({ bestModel, problemType }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const confusionMatrix = bestModel?.metrics?.confusion_matrix

  if (!confusionMatrix || !Array.isArray(confusionMatrix) || confusionMatrix.length === 0) {
    return null // Don't show if not available
  }

  if (problemType?.toLowerCase().includes('regression')) {
    return null // Hide for regression
  }

  const maxVal = Math.max(...confusionMatrix.flat())

  const getColor = (value: number) => {
    const intensity = maxVal > 0 ? (value / maxVal) * 100 : 0
    if (isDark) {
      return `rgba(99, 102, 241, ${intensity / 100 * 0.7 + 0.1})`
    }
    return `rgba(99, 102, 241, ${intensity / 100 * 0.6 + 0.1})`
  }

  const getTextColor = (value: number) => {
    const intensity = maxVal > 0 ? (value / maxVal) * 100 : 0
    return intensity > 50 ? 'text-white' : (isDark ? 'text-gray-200' : 'text-gray-900')
  }

  const labels = confusionMatrix.map((_, i) => `Class ${i}`)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confusion Matrix</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse max-w-md mx-auto">
          <thead>
            <tr>
              <th className="p-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400"></th>
              {labels.map((label, i) => (
                <th key={i} className="p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                  Pred {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {confusionMatrix.map((row, i) => (
              <tr key={i}>
                <td className="p-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                  Actual {labels[i]}
                </td>
                {row.map((value, j) => (
                  <td key={j} className="p-2 text-center">
                    <div
                      className={`rounded-lg p-3 transition-colors ${getTextColor(value)}`}
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
