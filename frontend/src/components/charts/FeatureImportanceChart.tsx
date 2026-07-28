import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from '../../context/ThemeContext'

interface FeatureImportanceChartProps {
  data: Array<{
    feature: string
    importance: number
  }>
  title?: string
}

const FeatureImportanceChart: React.FC<FeatureImportanceChartProps> = ({
  data,
  title = 'Feature Importance',
}) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const colors = {
    grid: isDark ? '#334155' : '#E5E7EB',
    text: isDark ? '#94A3B8' : '#6B7280',
    bar: isDark ? '#818CF8' : '#4F46E5',
    background: isDark ? '#1E293B' : '#FFFFFF',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
          <XAxis 
            type="number" 
            domain={[0, 1]} 
            stroke={colors.text}
            tick={{ fill: colors.text }}
          />
          <YAxis 
            dataKey="feature" 
            type="category" 
            width={80}
            stroke={colors.text}
            tick={{ fill: colors.text }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
              borderRadius: '8px',
              color: isDark ? '#F8FAFC' : '#0F172A'
            }}
          />
          <Bar dataKey="importance" fill={colors.bar} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default FeatureImportanceChart
