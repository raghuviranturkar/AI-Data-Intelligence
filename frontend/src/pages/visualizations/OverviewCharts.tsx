import React from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useTheme } from '../../context/ThemeContext'

interface OverviewChartsProps {
  data: any
}

const OverviewCharts: React.FC<OverviewChartsProps> = ({ data }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const dataset = data?.dataset || {}
  const missingValues = dataset?.missing_values || {}

  const colors = {
    grid: isDark ? '#334155' : '#E5E7EB',
    text: isDark ? '#94A3B8' : '#6B7280',
    background: isDark ? '#1E293B' : '#FFFFFF',
  }

  // Dataset composition data
  const compositionData = [
    { name: 'Numeric', value: dataset?.numeric_columns?.length || 0, color: '#4F46E5' },
    { name: 'Categorical', value: dataset?.categorical_columns?.length || 0, color: '#22C55E' },
    { name: 'Boolean', value: dataset?.boolean_columns?.length || 0, color: '#F59E0B' },
    { name: 'Datetime', value: dataset?.datetime_columns?.length || 0, color: '#EF4444' },
  ].filter(d => d.value > 0)

  // Missing values data
  const missingData = Object.entries(missingValues).map(([key, value]) => ({
    name: key,
    missing: value as number,
  })).filter(d => d.missing > 0).slice(0, 15)

  // Data types distribution
  const dtypes = dataset?.dtypes || {}
  const dtypeCounts: Record<string, number> = {}
  Object.values(dtypes).forEach((type: string) => {
    const key = type.split('[')[0]
    dtypeCounts[key] = (dtypeCounts[key] || 0) + 1
  })
  const dtypeData = Object.entries(dtypeCounts).map(([key, value]) => ({
    name: key,
    count: value,
  }))

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Dataset Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Composition Chart */}
        {compositionData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Dataset Composition</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={compositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {compositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
          </div>
        )}

        {/* Missing Values Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:col-span-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
            Missing Values {missingData.length === 0 && '✅ None detected'}
          </h3>
          {missingData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={missingData}>
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                <XAxis dataKey="name" stroke={colors.text} tick={{ fill: colors.text, fontSize: 11 }} />
                <YAxis stroke={colors.text} tick={{ fill: colors.text }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="missing" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px] text-gray-400 dark:text-gray-500">
              <p>✅ No missing values detected</p>
            </div>
          )}
        </div>

        {/* Data Types Distribution */}
        {dtypeData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Data Types</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dtypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} horizontal={false} />
                <XAxis type="number" stroke={colors.text} tick={{ fill: colors.text }} />
                <YAxis dataKey="name" type="category" stroke={colors.text} tick={{ fill: colors.text }} width={60} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                    border: `1px solid ${isDark ? '#334155' : '#E5E7EB'}`,
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#818CF8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default OverviewCharts
