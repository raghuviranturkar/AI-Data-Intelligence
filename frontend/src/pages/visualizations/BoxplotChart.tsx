import React, { useEffect, useState } from 'react'
import { TrendingUp, AlertCircle } from 'lucide-react'
import { cn } from '../../utils/cn'

interface BoxplotChartProps {
  data: {
    min: number
    q1: number
    median: number
    q3: number
    max: number
    outliers: number[]
    outliers_count: number
  }
  height?: number
  title?: string
}

const BoxplotChart: React.FC<BoxplotChartProps> = ({ data, height = 120, title }) => {
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
    }
  }

  const { min, q1, median, q3, max, outliers, outliers_count } = data
  const range = max - min || 1

  // Calculate positions as percentages
  const minPos = ((min - min) / range) * 80 + 10
  const q1Pos = ((q1 - min) / range) * 80 + 10
  const medianPos = ((median - min) / range) * 80 + 10
  const q3Pos = ((q3 - min) / range) * 80 + 10
  const maxPos = ((max - min) / range) * 80 + 10

  const boxColor = colors.accent.azure

  return (
    <div 
      className="rounded-md border p-4 transition-colors duration-300"
      style={{ 
        backgroundColor: colors.panelAlt,
        borderColor: colors.border
      }}
    >
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="h-3.5 w-3.5" style={{ color: colors.accent.amber }} />
          <h4 className="text-xs font-medium" style={{ color: colors.text }}>{title}</h4>
        </div>
      )}

      <div className="relative w-full" style={{ height: `${height}px` }}>
        <svg width="100%" height={height} viewBox={`0 0 100 ${height}`}>
          {/* Whiskers */}
          <line 
            x1={minPos} 
            y1={height * 0.4} 
            x2={q1Pos} 
            y2={height * 0.4} 
            stroke={boxColor} 
            strokeWidth="2" 
          />
          <line 
            x1={maxPos} 
            y1={height * 0.4} 
            x2={q3Pos} 
            y2={height * 0.4} 
            stroke={boxColor} 
            strokeWidth="2" 
          />
          <line 
            x1={minPos} 
            y1={height * 0.3} 
            x2={minPos} 
            y2={height * 0.5} 
            stroke={boxColor} 
            strokeWidth="2" 
          />
          <line 
            x1={maxPos} 
            y1={height * 0.3} 
            x2={maxPos} 
            y2={height * 0.5} 
            stroke={boxColor} 
            strokeWidth="2" 
          />

          {/* Box */}
          <rect 
            x={q1Pos} 
            y={height * 0.25} 
            width={q3Pos - q1Pos} 
            height={height * 0.3} 
            fill={boxColor} 
            opacity="0.25" 
            stroke={boxColor} 
            strokeWidth="2" 
            rx="2" 
          />

          {/* Median line */}
          <line 
            x1={medianPos} 
            y1={height * 0.2} 
            x2={medianPos} 
            y2={height * 0.6} 
            stroke={boxColor} 
            strokeWidth="3" 
            strokeLinecap="round"
          />

          {/* Outliers */}
          {outliers.slice(0, 15).map((outlier, i) => {
            const pos = ((outlier - min) / range) * 80 + 10
            return (
              <circle 
                key={i} 
                cx={pos} 
                cy={height * 0.4} 
                r="3.5" 
                fill={colors.accent.coral} 
                opacity="0.8"
                stroke={isDark ? '#0B0F14' : '#FFFFFF'}
                strokeWidth="1"
              />
            )
          })}

          {/* Labels */}
          <text 
            x="50%" 
            y={height - 2} 
            textAnchor="middle" 
            fontSize="10" 
            fontFamily="monospace"
            fill={isDark ? '#4A5563' : '#94A3B8'}
          >
            Outliers: {outliers_count}
          </text>

          {/* Min/Max labels */}
          <text 
            x={minPos} 
            y="12" 
            textAnchor="middle" 
            fontSize="8" 
            fontFamily="monospace"
            fill={isDark ? '#4A5563' : '#94A3B8'}
          >
            {min.toFixed(2)}
          </text>
          <text 
            x={maxPos} 
            y="12" 
            textAnchor="middle" 
            fontSize="8" 
            fontFamily="monospace"
            fill={isDark ? '#4A5563' : '#94A3B8'}
          >
            {max.toFixed(2)}
          </text>
        </svg>
      </div>

      {/* Stats Summary */}
      <div className="mt-2 grid grid-cols-5 gap-1 text-center text-[9px] font-mono" style={{ color: colors.textMuted }}>
        <div>
          <span className="block text-[8px] uppercase" style={{ color: colors.textDim }}>Min</span>
          <span style={{ color: colors.text }}>{min.toFixed(2)}</span>
        </div>
        <div>
          <span className="block text-[8px] uppercase" style={{ color: colors.textDim }}>Q1</span>
          <span style={{ color: colors.text }}>{q1.toFixed(2)}</span>
        </div>
        <div>
          <span className="block text-[8px] uppercase" style={{ color: colors.textDim }}>Median</span>
          <span style={{ color: colors.accent.amber }}>{median.toFixed(2)}</span>
        </div>
        <div>
          <span className="block text-[8px] uppercase" style={{ color: colors.textDim }}>Q3</span>
          <span style={{ color: colors.text }}>{q3.toFixed(2)}</span>
        </div>
        <div>
          <span className="block text-[8px] uppercase" style={{ color: colors.textDim }}>Max</span>
          <span style={{ color: colors.text }}>{max.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default BoxplotChart
