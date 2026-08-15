import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Database, PieChart as PieChartIcon, BarChart3, Activity } from 'lucide-react'
import { cn } from '../../utils/cn'

interface OverviewChartsProps {
  data: any
}

const OverviewCharts: React.FC<OverviewChartsProps> = ({ data }) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    checkDark()
    const observer = new MutationObserver(checkDark)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const colors = {
    border: isDark ? '#232B35' : '#E2E8F0',
    panel: isDark ? '#12181F' : '#FFFFFF',
    panelAlt: isDark ? '#0B0F14' : '#F8FAFC',
    text: isDark ? '#EDF1F5' : '#0F172A',
    textMuted: isDark ? '#8B96A5' : '#64748B',
    textDim: isDark ? '#4A5563' : '#94A3B8',
    accent: {
      amber: '#F0A94E',
      teal: '#3ECF8E',
      azure: '#4EA1F0',
      purple: '#B48CF2',
      coral: '#F2555A',
    }
  }

  const dataset = data?.dataset || {}
  const missingValues = dataset?.missing_values || {}

  // Dataset composition data
  const compositionData = [
    { name: 'Numeric', value: dataset?.numeric_columns?.length || 0, color: colors.accent.azure },
    { name: 'Categorical', value: dataset?.categorical_columns?.length || 0, color: colors.accent.teal },
    { name: 'Boolean', value: dataset?.boolean_columns?.length || 0, color: colors.accent.amber },
    { name: 'Datetime', value: dataset?.datetime_columns?.length || 0, color: colors.accent.coral },
  ].filter(d => d.value > 0)

  // Missing values data
  const missingData = Object.entries(missingValues).map(([key, value]) => ({
    name: key,
    missing: value as number,
  })).filter(d => d.missing > 0).slice(0, 15)

  // Data types distribution
  const dtypes = dataset?.dtypes || {}
  const dtypeCounts: Record<string, number> = {}
  Object.entries(dtypes).forEach(([key, val]) => {
    const typeName = String(val).split('[')[0]
    dtypeCounts[typeName] = (dtypeCounts[typeName] || 0) + 1
  })
  const dtypeData = Object.entries(dtypeCounts).map(([key, value]) => ({
    name: key,
    count: value,
  }))

  const chartColors = {
    grid: isDark ? '#232B35' : '#E5E7EB',
    text: isDark ? '#8B96A5' : '#6B7280',
  }

  return (
    <div 
      className="rounded-lg border p-6 transition-colors duration-300"
      style={{ 
        backgroundColor: colors.panel,
        borderColor: colors.border
      }}
    >
      <div className="flex items-center gap-3 mb-5">
        <div 
          className="p-1.5 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <Database className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Dataset Overview</h3>
        <span className="text-xs font-mono" style={{ color: colors.textMuted }}>· Composition & Quality</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Composition Chart */}
        {compositionData.length > 0 && (
          <div 
            className="rounded-md border p-4"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <h4 className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: colors.textMuted }}>
              <PieChartIcon className="h-3.5 w-3.5 inline mr-1.5" />
              Dataset Composition
            </h4>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={compositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {compositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#12181F' : '#FFFFFF',
                    border: `1px solid ${isDark ? '#232B35' : '#E5E7EB'}`,
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Missing Values Chart */}
        <div 
          className="rounded-md border p-4 md:col-span-2"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <h4 className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: colors.textMuted }}>
            <Activity className="h-3.5 w-3.5 inline mr-1.5" />
            Missing Values {missingData.length === 0 && '✅ None detected'}
          </h4>
          {missingData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={missingData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="name" stroke={chartColors.text} tick={{ fill: chartColors.text, fontSize: 10 }} />
                <YAxis stroke={chartColors.text} tick={{ fill: chartColors.text }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#12181F' : '#FFFFFF',
                    border: `1px solid ${isDark ? '#232B35' : '#E5E7EB'}`,
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="missing" fill={colors.accent.coral} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px]">
              <p className="text-sm font-mono" style={{ color: colors.accent.teal }}>
                ✅ No missing values detected
              </p>
            </div>
          )}
        </div>

        {/* Data Types Distribution */}
        {dtypeData.length > 0 && (
          <div 
            className="rounded-md border p-4"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <h4 className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: colors.textMuted }}>
              <BarChart3 className="h-3.5 w-3.5 inline mr-1.5" />
              Data Types
            </h4>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dtypeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} horizontal={false} />
                <XAxis type="number" stroke={chartColors.text} tick={{ fill: chartColors.text }} />
                <YAxis dataKey="name" type="category" stroke={chartColors.text} tick={{ fill: chartColors.text, fontSize: 10 }} width={50} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#12181F' : '#FFFFFF',
                    border: `1px solid ${isDark ? '#232B35' : '#E5E7EB'}`,
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill={colors.accent.purple} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default OverviewCharts
