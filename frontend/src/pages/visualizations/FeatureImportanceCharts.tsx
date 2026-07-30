import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '../../context/ThemeContext'

interface FeatureImportanceChartsProps {
  data: any
}

const FeatureImportanceCharts: React.FC<FeatureImportanceChartsProps> = ({ data }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const explainability = data?.explainability || {}
  const featureRanking = explainability?.feature_ranking || []

  const colors = {
    grid: isDark ? '#334155' : '#E5E7EB',
    text: isDark ? '#94A3B8' : '#6B7280',
  }

  if (featureRanking.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Feature Importance</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-400 dark:text-gray-500">No feature importance data available</p>
        </div>
      </div>
    )
  }

  const chartData = featureRanking.map((item: any) => ({
    name: item.feature,
    importance: item.importance,
    percentage: item.percentage,
  }))

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Feature Importance</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
                <XAxis type="number" domain={[0, 'dataMax + 0.1']} stroke={colors.text} tick={{ fill: colors.text }} />
                <YAxis dataKey="name" type="category" stroke={colors.text} tick={{ fill: colors.text }} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
                    borderRadius: '8px',
                  }}
                  formatter={(value: any) => `${(value * 100).toFixed(1)}%`}
                />
                <Bar dataKey="importance" fill="#4F46E5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Top Feature</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{chartData[0]?.name || 'N/A'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{(chartData[0]?.percentage || 0).toFixed(1)}% impact</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Top 3 Features</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {chartData.slice(0, 3).map((d: any) => d.name).join(', ')}
              </p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Features</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{chartData.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureImportanceCharts
