import React from 'react'

interface CorrelationHeatmapProps {
  data: Record<string, Record<string, number>>
  title?: string
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  data,
  title = 'Correlation Heatmap',
}) => {
  const columns = Object.keys(data)
  const rows = columns

  const getColor = (value: number) => {
    const abs = Math.abs(value)
    if (abs > 0.7) return 'bg-primary-600'
    if (abs > 0.5) return 'bg-primary-400'
    if (abs > 0.3) return 'bg-primary-200'
    if (abs > 0.1) return 'bg-primary-100'
    return 'bg-gray-100'
  }

  const getTextColor = (value: number) => {
    const abs = Math.abs(value)
    if (abs > 0.5) return 'text-white'
    return 'text-gray-900'
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-sm font-medium text-gray-500"></th>
              {columns.map((col) => (
                <th key={col} className="p-2 text-center text-sm font-medium text-gray-500">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <td className="p-2 text-sm font-medium text-gray-700">{row}</td>
                {columns.map((col) => {
                  const value = data[row]?.[col] ?? 0
                  return (
                    <td key={col} className="p-2 text-center">
                      <div
                        className={`rounded-lg p-2 text-xs font-medium ${getColor(value)} ${getTextColor(value)}`}
                      >
                        {value.toFixed(2)}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CorrelationHeatmap
