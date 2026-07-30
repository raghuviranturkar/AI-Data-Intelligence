import React from 'react'
import { useTheme } from '../../context/ThemeContext'

interface ConfusionMatrixProps {
  matrix: number[][]
  labels?: string[]
}

const ConfusionMatrix: React.FC<ConfusionMatrixProps> = ({ matrix, labels = ['Positive', 'Negative'] }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (!matrix || matrix.length === 0) {
    return <p className="text-gray-400 dark:text-gray-500">No confusion matrix available</p>
  }

  const maxVal = Math.max(...matrix.flat())

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

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400"></th>
            {labels.map((label, i) => (
              <th key={i} className="p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                Predicted {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <td className="p-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">
                Actual {labels[i] || `Class ${i}`}
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
  )
}

export default ConfusionMatrix
