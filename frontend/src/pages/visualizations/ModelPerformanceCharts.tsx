import React, { useEffect, useState } from 'react'
import { Gauge, Brain } from 'lucide-react'
import { cn } from '../../utils/cn'

interface ModelPerformanceChartsProps {
  data: any
}

const ModelPerformanceCharts: React.FC<ModelPerformanceChartsProps> = ({ data }) => {
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
      coral: '#F2555A',
      purple: '#B48CF2',
    }
  }

  const automl = data?.automl || {}
  const bestModel = automl?.best_model || {}
  const metrics = bestModel?.metrics || {}

  if (Object.keys(metrics).length === 0) {
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
            <Gauge className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Model Performance</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No performance metrics available</p>
        </div>
      </div>
    )
  }

  const metricItems = [
    { key: 'accuracy', label: 'Accuracy', value: metrics.accuracy, color: colors.accent.azure },
    { key: 'precision', label: 'Precision', value: metrics.precision, color: colors.accent.teal },
    { key: 'recall', label: 'Recall', value: metrics.recall, color: colors.accent.amber },
    { key: 'f1', label: 'F1 Score', value: metrics.f1, color: colors.accent.purple },
  ]

  const validMetrics = metricItems.filter(m => m.value !== undefined && m.value !== null)

  if (validMetrics.length === 0) {
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
            <Brain className="h-4 w-4" style={{ color: colors.accent.amber }} />
          </div>
          <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Model Performance</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-sm font-mono" style={{ color: colors.textMuted }}>No performance metrics available</p>
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
          <Gauge className="h-4 w-4" style={{ color: colors.accent.amber }} />
        </div>
        <h3 className="text-sm font-semibold" style={{ color: colors.text }}>Model Performance</h3>
        <span className="text-xs font-mono" style={{ color: colors.textMuted }}>
          · {bestModel.name || 'N/A'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {validMetrics.map((metric) => (
          <div 
            key={metric.key} 
            className="p-4 rounded-md border text-center"
            style={{ 
              backgroundColor: colors.panelAlt,
              borderColor: colors.border
            }}
          >
            <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: colors.textMuted }}>
              {metric.label}
            </p>
            <p className="text-2xl font-bold mt-1" style={{ color: metric.color }}>
              {(metric.value * 100).toFixed(1)}%
            </p>
            <div className="mt-2 w-full h-1 rounded-full" style={{ backgroundColor: colors.border }}>
              <div
                className="h-1 rounded-full transition-all duration-500"
                style={{ 
                  width: `${Math.min(metric.value * 100, 100)}%`,
                  backgroundColor: metric.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {bestModel.cv_score && (
        <div 
          className="mt-3 p-3 rounded-md border"
          style={{ 
            backgroundColor: colors.panelAlt,
            borderColor: colors.border
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono" style={{ color: colors.textMuted }}>Cross-Validation Score</span>
            <span className="text-sm font-bold" style={{ color: colors.text }}>
              {(bestModel.cv_score * 100).toFixed(1)}%
            </span>
          </div>
          <div className="mt-1.5 w-full h-1 rounded-full" style={{ backgroundColor: colors.border }}>
            <div
              className="h-1 rounded-full transition-all duration-500"
              style={{ 
                width: `${Math.min(bestModel.cv_score * 100, 100)}%`,
                backgroundColor: colors.accent.teal
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ModelPerformanceCharts
