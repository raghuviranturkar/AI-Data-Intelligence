import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useTheme } from '../../context/ThemeContext'

interface CategoryChartsProps {
  data: any
}

const CategoryCharts: React.FC<CategoryChartsProps> = ({ data }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const dataset = data?.dataset || {}
  const categoricalColumns = dataset?.categorical_columns || []

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

  // Generate sample data for categorical columns
  const getCategoryData = (col: string) => {
    const categories = ['Category A', 'Category B', 'Category C', 'Category D', 'Category E']
    return categories.map(cat => ({
      name: cat,
      count: Math.floor(Math.random() * 100) + 10,
    }))
  }

  const colors = {
    grid: isDark ? '#334155' : '#E5E7EB',
    text: isDark ? '#94A3B8' : '#6B7280',
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Category Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoricalColumns.slice(0, 4).map((col: string) => {
          const data = getCategoryData(col)
          return (
            <div key={col} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="font-medium text-gray-900 dark:text-white">{col}</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                  <XAxis dataKey="name" stroke={colors.text} tick={{ fill: colors.text, fontSize: 10 }} />
                  <YAxis stroke={colors.text} tick={{ fill: colors.text }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" fill="#22C55E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryCharts
