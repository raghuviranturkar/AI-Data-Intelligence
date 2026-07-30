import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useTheme } from '../../context/ThemeContext'

interface TargetChartsProps {
  data: any
}

const TargetCharts: React.FC<TargetChartsProps> = ({ data }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const automl = data?.automl || {}
  const target = automl?.target_column || null
  const problemType = automl?.problem_type || null

  if (!target) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Target Analysis</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-400 dark:text-gray-500">No target column detected</p>
        </div>
      </div>
    )
  }

  // Sample target distribution data
  const targetData = [
    { name: 'Class 0', value: 60 },
    { name: 'Class 1', value: 40 },
  ]

  const COLORS = ['#4F46E5', '#22C55E']

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Target Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Target Distribution</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Target: <span className="font-medium">{target}</span></p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={targetData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label>
                {targetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                  border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <span className="text-gray-500 dark:text-gray-400">Problem Type: <span className="font-medium text-gray-900 dark:text-white capitalize">{problemType || 'Unknown'}</span></span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Target Summary</h3>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Target Column</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{target}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Classes</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">2</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">Class Balance</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">60% / 40%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TargetCharts
