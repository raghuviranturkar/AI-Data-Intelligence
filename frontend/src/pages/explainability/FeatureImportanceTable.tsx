import React from 'react'
import { Badge } from '../../components/common/Badge'

interface FeatureImportanceTableProps {
  featureRanking: any[]
}

const FeatureImportanceTable: React.FC<FeatureImportanceTableProps> = ({ featureRanking }) => {
  if (featureRanking.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feature Importance Table</h3>
        <p className="text-gray-400 dark:text-gray-500">No data available</p>
      </div>
    )
  }

  const getImpactLevel = (percentage: number) => {
    if (percentage > 15) return { label: 'High', color: 'success' as const }
    if (percentage > 5) return { label: 'Medium', color: 'warning' as const }
    return { label: 'Low', color: 'default' as const }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Feature Importance Table</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">#</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Feature</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Importance</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Percentage</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">Impact</th>
            </tr>
          </thead>
          <tbody>
            {featureRanking.map((item, index) => {
              const impact = getImpactLevel(item.percentage * 100)
              return (
                <tr
                  key={item.feature}
                  className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-3 py-2 text-sm text-gray-400">{index + 1}</td>
                  <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">{item.feature}</td>
                  <td className="px-3 py-2 text-right font-mono text-gray-600 dark:text-gray-300">
                    {item.importance.toFixed(3)}
                  </td>
                  <td className="px-3 py-2 text-right font-mono text-gray-600 dark:text-gray-300">
                    {(item.percentage * 100).toFixed(1)}%
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Badge variant={impact.color} size="sm">{impact.label}</Badge>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default FeatureImportanceTable
