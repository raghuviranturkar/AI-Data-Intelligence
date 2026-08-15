import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { PieChart, Tag } from 'lucide-react'
import { cn } from '../../utils/cn'

interface CategoryChartsProps {
  data: any
}

const CategoryCharts: React.FC<CategoryChartsProps> = ({ data }) => {
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
  const categoricalColumns = dataset?.categorical_columns || []
  const categoricalData = data?.validation?.profiling?.categorical_analysis || {}

  const chartColors = {
    grid: isDark ? '#232B35' : '#E5E7EB',
    text: isDark ? '#8B96A5' : '#6B7280',
  }

  const COLORS = [
    colors.accent.azure,
    colors.accent.teal,
    colors.accent.amber,
    colors.accent.purple,
    colors.accent.coral,
    '#14B8A6',
    '#F97316',
    '#6366F1',
    '#EC4899',
    '#8B5CF6'
  ]

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
      <div 
        className="rounded-lg border p-6 transition-colors duration-300"
        style={{ 
          backgroundColor: colors.panel,
          borderColor: colors.border
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="p-1.5 rounded-md border"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <Tag className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Category Analysis</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No categorical columns available</p>
        </div>
      </div>
    )
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
          <PieChart className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Category Analysis</h3>
        <span className="text-xs font-mono" style={{ color: colors.textMuted }}>· {categoricalColumns.length} columns</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categoricalColumns.slice(0, 4).map((col: string) => {
          const data = getCategoryData(col)
          
          if (data.length === 0) {
            return (
              <div 
                key={col} 
                className="rounded-md border p-4"
                style={{ 
                  backgroundColor: colors.panelAlt,
                  borderColor: colors.border
                }}
              >
                <h4 className="text-sm font-medium" style={{ color: colors.text }}>{col}</h4>
                <p className="text-xs font-mono mt-2" style={{ color: colors.textMuted }}>No category data available</p>
              </div>
            )
          }

          return (
            <div 
              key={col} 
              className="rounded-md border p-4"
              style={{ 
                backgroundColor: colors.panelAlt,
                borderColor: colors.border
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium" style={{ color: colors.text }}>{col}</h4>
                <span className="text-[10px] font-mono" style={{ color: colors.textDim }}>
                  Top {data.length} categories
                </span>
              </div>
              <div className="text-[10px] font-mono mb-3" style={{ color: colors.textMuted }}>
                Most common: <span className="font-medium" style={{ color: colors.text }}>{data[0]?.name || 'N/A'}</span>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={data} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} horizontal={false} />
                  <XAxis type="number" stroke={chartColors.text} tick={{ fill: chartColors.text, fontSize: 9 }} />
                  <YAxis dataKey="name" type="category" stroke={chartColors.text} tick={{ fill: chartColors.text, fontSize: 9 }} width={50} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#12181F' : '#FFFFFF',
                      border: `1px solid ${isDark ? '#232B35' : '#E5E7EB'}`,
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
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryCharts
