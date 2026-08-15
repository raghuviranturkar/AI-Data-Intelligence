import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Target, Crosshair } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface TargetChartsProps {
  data: any
}

const TargetCharts: React.FC<TargetChartsProps> = ({ data }) => {
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

  const automl = data?.automl || {}
  const target = automl?.target_column || null
  const problemType = automl?.problem_type || null

  if (!target) {
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
            <Crosshair className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Target Analysis</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No target column detected</p>
        </div>
      </div>
    )
  }

  const targetData = [
    { name: 'Class 0', value: 60 },
    { name: 'Class 1', value: 40 },
  ]

  const COLORS = [colors.accent.azure, colors.accent.teal]

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
          <Target className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Target Analysis</h3>
        <span className="text-xs font-mono" style={{ color: colors.textMuted }}>· {problemType || 'Unknown'} problem</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div 
          className="rounded-md border p-4"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <h4 className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: colors.textMuted }}>
            Target Distribution
          </h4>
          <p className="text-xs font-mono mb-4" style={{ color: colors.textMuted }}>
            Target: <span className="font-medium" style={{ color: colors.text }}>{target}</span>
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie 
                data={targetData} 
                cx="50%" 
                cy="50%" 
                innerRadius={50} 
                outerRadius={75} 
                dataKey="value" 
                label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {targetData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

        <div 
          className="rounded-md border p-4"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <h4 className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: colors.textMuted }}>
            Target Summary
          </h4>
          <div className="space-y-3">
            <div className="p-3 rounded-md border" style={{ borderColor: colors.border }}>
              <p className="text-[10px] font-mono" style={{ color: colors.textMuted }}>Target Column</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: colors.text }}>{target}</p>
            </div>
            <div className="p-3 rounded-md border" style={{ borderColor: colors.border }}>
              <p className="text-[10px] font-mono" style={{ color: colors.textMuted }}>Classes</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: colors.text }}>2</p>
            </div>
            <div className="p-3 rounded-md border" style={{ borderColor: colors.border }}>
              <p className="text-[10px] font-mono" style={{ color: colors.textMuted }}>Class Balance</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: colors.text }}>60% / 40%</p>
            </div>
            <div className="p-3 rounded-md border" style={{ borderColor: colors.border }}>
              <p className="text-[10px] font-mono" style={{ color: colors.textMuted }}>Problem Type</p>
              <p className="text-sm font-bold mt-0.5 capitalize" style={{ color: colors.text }}>
                {problemType || 'Unknown'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TargetCharts
