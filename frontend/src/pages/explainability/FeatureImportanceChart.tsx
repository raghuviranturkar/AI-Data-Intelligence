import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from '../../context/ThemeContext'
import { Badge } from '../../components/common/Badge'

interface FeatureImportanceChartProps {
  featureRanking: any[]
}

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({ featureRanking }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (featureRanking.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Global Feature Importance</h3>
        <p className="text-gray-400 dark:text-gray-500">No feature importance data available</p>
      </div>
    )
  }

  const colors = {
    grid: isDark ? '#334155' : '#E5E7EB',
    text: isDark ? '#94A3B8' : '#6B7280',
  }

  const chartData = featureRanking.map((item) => ({
    name: item.feature,
    importance: item.importance,
    percentage: item.percentage || 0,
  }))

  // Color gradient based on importance
  const getBarColor = (percentage: number) => {
    if (percentage > 15) return '#4F46E5'
    if (percentage > 8) return '#818CF8'
    if (percentage > 3) return '#A5B4FC'
    return '#C7D2FE'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Global Feature Importance</h3>
        <Badge variant="info" size="sm">{featureRanking.length} Features</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
              <XAxis type="number" domain={[0, 'dataMax + 0.05']} stroke={colors.text} tick={{ fill: colors.text }} />
              <YAxis dataKey="name" type="category" stroke={colors.text} tick={{ fill: colors.text }} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
                  borderRadius: '8px',
                }}
                formatter={(value: any, name: string) => {
                  if (name === 'percentage') return `${(value * 100).toFixed(1)}%`
                  return value
                }}
              />
              <Bar dataKey="percentage" name="Importance" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage * 100)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Top Feature</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{chartData[0]?.name || 'N/A'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">{(chartData[0]?.percentage * 100 || 0).toFixed(1)}% impact</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400">Top 3 Features</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {chartData.slice(0, 3).map((d: any) => d.name).join(', ')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {chartData.slice(0, 3).reduce((acc, d) => acc + d.percentage * 100, 0).toFixed(1)}% cumulative impact
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeatureImportanceChart
