import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { useTheme } from '../../context/ThemeContext'

interface PerformanceChartsProps {
  rankedModels: any[]
}

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ rankedModels }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  if (rankedModels.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Comparison</h3>
        <p className="text-gray-400 dark:text-gray-500">No performance data available</p>
      </div>
    )
  }

  const colors = {
    grid: isDark ? '#334155' : '#E5E7EB',
    text: isDark ? '#94A3B8' : '#6B7280',
  }

  const chartData = rankedModels.map((model) => ({
    name: model.model_name,
    score: model.score ? model.score * 100 : 0,
    cvScore: model.cv_score ? model.cv_score * 100 : 0,
    time: model.training_time || 0,
  }))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Comparison</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Comparison */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Score Comparison</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="name" stroke={colors.text} tick={{ fill: colors.text, fontSize: 10 }} interval={0} />
              <YAxis domain={[0, 100]} stroke={colors.text} tick={{ fill: colors.text }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="score" name="Score" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cvScore" name="CV Score" fill="#818CF8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Training Time */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Training Time</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
              <XAxis type="number" stroke={colors.text} tick={{ fill: colors.text }} />
              <YAxis dataKey="name" type="category" stroke={colors.text} tick={{ fill: colors.text, fontSize: 10 }} width={60} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
                  borderRadius: '8px',
                }}
                formatter={(value: any) => `${value.toFixed(2)}s`}
              />
              <Bar dataKey="time" name="Training Time" fill="#F59E0B" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default PerformanceCharts
