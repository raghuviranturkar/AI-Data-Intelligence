import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '../../context/ThemeContext'

interface DistributionChartsProps {
  data: any
}

const DistributionCharts: React.FC<DistributionChartsProps> = ({ data }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const dataset = data?.dataset || {}
  const numericColumns = dataset?.numeric_columns || []
  const stats = data?.validation?.profiling?.column_statistics || {}

  const colors = {
    grid: isDark ? '#334155' : '#E5E7EB',
    text: isDark ? '#94A3B8' : '#6B7280',
  }

  // Get first 6 numeric columns for display
  const displayColumns = numericColumns.slice(0, 6)

  if (displayColumns.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Distribution Analysis</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-400 dark:text-gray-500">No numeric columns available for distribution analysis</p>
        </div>
      </div>
    )
  }

  // Create histogram data for each column (simulated)
  const getHistogramData = (col: string) => {
    const colStats = stats[col] || {}
    const mean = colStats.mean || 0
    const std = colStats.std || 1
    const min = colStats.min || 0
    const max = colStats.max || 100
    
    // Generate bins
    const bins = 8
    const step = (max - min) / bins
    const data = []
    for (let i = 0; i < bins; i++) {
      const binMin = min + i * step
      const binMax = binMin + step
      const value = Math.random() * 20 + 5 // Simulated counts
      data.push({
        range: `${binMin.toFixed(1)}-${binMax.toFixed(1)}`,
        count: Math.round(value),
      })
    }
    return data
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Distribution Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayColumns.map((col: string) => {
          const colStats = stats[col] || {}
          const histogramData = getHistogramData(col)
          
          return (
            <div key={col} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="font-medium text-gray-900 dark:text-white">{col}</h3>
              <div className="grid grid-cols-4 gap-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <div>Mean: {colStats.mean?.toFixed(2) || '—'}</div>
                <div>Median: {colStats.median?.toFixed(2) || '—'}</div>
                <div>Std: {colStats.std?.toFixed(2) || '—'}</div>
                <div>Skew: {colStats.skewness?.toFixed(2) || '—'}</div>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={histogramData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                  <XAxis dataKey="range" stroke={colors.text} tick={{ fill: colors.text, fontSize: 8 }} tick={false} />
                  <YAxis stroke={colors.text} tick={{ fill: colors.text, fontSize: 8 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="#4F46E5" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DistributionCharts
