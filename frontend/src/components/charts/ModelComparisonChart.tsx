import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from '../../context/ThemeContext'

interface ModelComparisonChartProps {
  data: Array<{
    model: string
    score: number
    cvScore: number
  }>
  title?: string
}

const ModelComparisonChart: React.FC<ModelComparisonChartProps> = ({
  data,
  title = 'Model Performance Comparison',
}) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const colors = {
    grid: isDark ? '#334155' : '#E5E7EB',
    text: isDark ? '#94A3B8' : '#6B7280',
    bar1: isDark ? '#818CF8' : '#4F46E5',
    bar2: isDark ? '#6366F1' : '#6366F1',
    background: isDark ? '#1E293B' : '#FFFFFF',
    legend: isDark ? '#94A3B8' : '#6B7280',
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
          <XAxis 
            dataKey="model" 
            stroke={colors.text}
            tick={{ fill: colors.text }}
          />
          <YAxis 
            domain={[0, 1]} 
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
          <Legend 
            wrapperStyle={{ color: colors.legend }}
          />
          <Bar dataKey="score" fill={colors.bar1} radius={[4, 4, 0, 0]} />
          <Bar dataKey="cvScore" fill={colors.bar2} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ModelComparisonChart
