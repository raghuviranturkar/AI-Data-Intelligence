import React, { useEffect, useState } from 'react'
import { TrendingUp, GitBranch } from 'lucide-react'
import { Badge } from '../../components/common/Badge'
import { cn } from '../../utils/cn'

interface CorrelationChartsProps {
  data: any
}

const CorrelationCharts: React.FC<CorrelationChartsProps> = ({ data }) => {
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

  const eda = data?.eda || {}
  const correlationMatrix = eda?.correlation?.matrix?.matrix || {}
  const strongCorrelations = eda?.correlation?.strong_correlations?.strong_correlations || []

  const columns = Object.keys(correlationMatrix)

  const getColor = (value: number) => {
    const abs = Math.abs(value)
    if (abs > 0.7) return colors.accent.coral
    if (abs > 0.5) return colors.accent.amber
    if (abs > 0.3) return colors.accent.azure
    if (abs > 0.1) return colors.accent.purple
    return colors.textDim
  }

  const getBgColor = (value: number) => {
    const abs = Math.abs(value)
    if (abs > 0.7) return isDark ? 'rgba(242,85,90,0.2)' : 'rgba(242,85,90,0.1)'
    if (abs > 0.5) return isDark ? 'rgba(240,169,78,0.2)' : 'rgba(240,169,78,0.1)'
    if (abs > 0.3) return isDark ? 'rgba(78,161,240,0.2)' : 'rgba(78,161,240,0.1)'
    if (abs > 0.1) return isDark ? 'rgba(180,140,242,0.2)' : 'rgba(180,140,242,0.1)'
    return 'transparent'
  }

  const displayColumns = columns.slice(0, 10)

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
          <GitBranch className="h-4 w-4" style={{ color: colors.accent.azure }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Correlation Analysis</h3>
        <span className="text-xs font-mono" style={{ color: colors.textMuted }}>· {columns.length} features</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Heatmap */}
        <div className="lg:col-span-2">
          <div 
            className="rounded-md border p-4"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <h4 className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: colors.textMuted }}>
              Correlation Heatmap
            </h4>
            {displayColumns.length > 1 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-1.5 text-left text-[10px] font-mono sticky left-0" style={{ color: colors.textMuted, backgroundColor: colors.panelAlt, zIndex: 10 }}></th>
                      {displayColumns.map((col) => (
                        <th key={col} className="p-1.5 text-center text-[10px] font-mono min-w-[40px]" style={{ color: colors.textMuted }}>
                          <span className="block truncate max-w-[50px]" title={col}>
                            {col}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {displayColumns.map((row) => (
                      <tr key={row}>
                        <td className="p-1.5 text-[10px] font-mono sticky left-0" style={{ color: colors.textMuted, backgroundColor: colors.panelAlt, zIndex: 10 }}>
                          <span className="block truncate max-w-[50px]" title={row}>
                            {row}
                          </span>
                        </td>
                        {displayColumns.map((col) => {
                          const value = correlationMatrix[row]?.[col] ?? 0
                          const isSelf = row === col
                          return (
                            <td key={col} className="p-1 text-center">
                              <div
                                className={cn(
                                  'rounded-md p-1.5 text-[10px] font-mono transition-colors',
                                  isSelf ? 'ring-1' : ''
                                )}
                                style={{
                                  backgroundColor: isSelf ? 'transparent' : getBgColor(value),
                                  color: isSelf ? colors.text : getColor(value),
                                  borderColor: colors.border,
                                }}
                                title={`${row} ↔ ${col}: ${value.toFixed(2)}`}
                              >
                                {isSelf ? '1.0' : value.toFixed(2)}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {columns.length > 10 && (
                  <p className="text-[10px] font-mono mt-2" style={{ color: colors.textDim }}>
                    Showing top 10 features. {columns.length - 10} more not displayed.
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px]">
                <p className="text-sm font-mono" style={{ color: colors.textMuted }}>
                  Need at least 2 numeric columns for correlation analysis
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Strong Correlations */}
        <div>
          <div 
            className="rounded-md border p-4 h-full"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <h4 className="text-xs font-mono uppercase tracking-wider mb-3" style={{ color: colors.textMuted }}>
              <TrendingUp className="h-3.5 w-3.5 inline mr-1.5" />
              Strong Correlations
            </h4>
            {strongCorrelations.length > 0 ? (
              <div className="space-y-2.5">
                {strongCorrelations.slice(0, 5).map((corr: any, i: number) => {
                  const isPositive = corr.correlation > 0
                  return (
                    <div key={i} className="p-3 rounded-md border" style={{ borderColor: colors.border }}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium" style={{ color: colors.text }}>
                          {corr.feature_1} ↔ {corr.feature_2}
                        </span>
                        <Badge variant={isPositive ? 'success' : 'danger'} size="sm">
                          {isPositive ? 'Positive' : 'Negative'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 h-1 rounded-full" style={{ backgroundColor: colors.border }}>
                          <div
                            className="h-1 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${Math.abs(corr.correlation) * 100}%`,
                              backgroundColor: isPositive ? colors.accent.teal : colors.accent.coral
                            }}
                          />
                        </div>
                        <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
                          {corr.correlation.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )
                })}
                {strongCorrelations.length > 5 && (
                  <p className="text-[10px] font-mono" style={{ color: colors.textDim }}>
                    + {strongCorrelations.length - 5} more
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px]">
                <p className="text-sm font-mono" style={{ color: colors.textMuted }}>
                  No strong correlations detected
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CorrelationCharts
