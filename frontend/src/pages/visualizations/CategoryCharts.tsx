import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { useTheme } from '../../context/ThemeContext'

interface CategoryChartsProps {
  data: any
}

const CategoryCharts: React.FC<CategoryChartsProps> = ({ data }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  
  const dataset = data?.dataset || {}
  const categoricalColumns = dataset?.categorical_columns || []
  const categoricalData = data?.validation?.profiling?.categorical_analysis || {}

  const colors = {
    grid: isDark ? '#334155' : '#E5E7EB',
    text: isDark ? '#94A3B8' : '#6B7280',
  }

  // Get real categorical data from backend
  const getCategoryData = (col: string) => {
    const colData = categoricalData[col] || {}
    const topCategories = colData.top_categories || {}
    const total = Object.values(topCategories).reduce((a: number, b: number) => a + b, 0)
    
    return Object.entries(topCategories).map(([name, count]) => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      count: count as number,
      percentage: total > 0 ? ((count as number) / total * 100) : 0,
    })).slice(0, 10)
  }

  if (categoricalColumns.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Category Analysis</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
          <p className="text-gray-400 dark:text-gray-500">No categorical columns available</p>
        </div>
      </div>
    )
  }

  const COLORS = ['#4F46E5', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#8B5CF6']

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Category Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoricalColumns.slice(0, 4).map((col: string) => {
          const data = getCategoryData(col)
          
          if (data.length === 0) {
            return (
              <div key={col} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">{col}</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">No category data available</p>
              </div>
            )
          }

          return (
            <div key={col} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">{col}</h3>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                Most common: <span className="font-medium text-gray-900 dark:text-white">{data[0]?.name || 'N/A'}</span>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
                  <XAxis type="number" stroke={colors.text} tick={{ fill: colors.text, fontSize: 10 }} />
                  <YAxis dataKey="name" type="category" stroke={colors.text} tick={{ fill: colors.text, fontSize: 10 }} width={60} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
                      borderRadius: '8px',
                    }}
                    formatter={(value: any, name: string) => {
                      if (name === 'count') return `${value} occurrences`
                      return value
                    }}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                Top {data.length} categories out of {Object.keys(data).length}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryCharts
