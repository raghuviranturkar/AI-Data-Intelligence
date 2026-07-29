import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { useTheme } from '../../context/ThemeContext'

interface MissingValuesChartProps {
  data: Array<{
    column: string
    missing: number
    total: number
    percentage: number
  }>
  title?: string
}

const MissingValuesChart: React.FC<MissingValuesChartProps> = ({
  data,
  title = 'Missing Values Analysis',
}) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const colors = {
    grid: isDark ? '#334155' : '#E5E7EB',
    text: isDark ? '#94A3B8' : '#6B7280',
    background: isDark ? '#1E293B' : '#FFFFFF',
  }

  // Filter columns with missing values
  const chartData = data.filter(item => item.missing > 0).slice(0, 15)

  if (chartData.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
        <div className="flex flex-col items-center justify-center h-[200px] text-gray-400 dark:text-gray-500">
          <p className="text-lg">✅ No missing values detected</p>
          <p className="text-sm mt-1">Your dataset is complete!</p>
        </div>
      </div>
    )
  }

  const maxPercentage = Math.max(...chartData.map(d => d.percentage))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={Math.max(200, chartData.length * 35)}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
          <XAxis 
            type="number" 
            domain={[0, Math.min(100, maxPercentage + 10)]}
            stroke={colors.text}
            tick={{ fill: colors.text, fontSize: 11 }}
            unit="%"
          />
          <YAxis 
            dataKey="column" 
            type="category" 
            width={80}
            stroke={colors.text}
            tick={{ fill: colors.text, fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
              border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
              borderRadius: '8px',
              color: isDark ? '#F8FAFC' : '#0F172A',
            }}
            formatter={(value: any, name: string) => {
              if (name === 'percentage') return `${value.toFixed(1)}%`
              if (name === 'missing') return `${value} missing`
              return value
            }}
          />
          <Bar 
            dataKey="percentage" 
            name="Missing %"
            radius={[0, 4, 4, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.percentage > 20 ? '#EF4444' : entry.percentage > 10 ? '#F59E0B' : '#22C55E'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex justify-end gap-4 mt-2 text-xs">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-danger-500"></span>
          &gt;20%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-warning-500"></span>
          10-20%
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-success-500"></span>
          &lt;10%
        </span>
      </div>
    </div>
  )
}

export default MissingValuesChart
