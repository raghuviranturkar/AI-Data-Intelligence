import React from 'react'
import { useTheme } from '../../context/ThemeContext'

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
}

const BoxplotChart: React.FC<BoxplotChartProps> = ({ data, height = 100 }) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const { min, q1, median, q3, max, outliers, outliers_count } = data
  const range = max - min || 1

  // Calculate positions as percentages
  const minPos = ((min - min) / range) * 80 + 10
  const q1Pos = ((q1 - min) / range) * 80 + 10
  const medianPos = ((median - min) / range) * 80 + 10
  const q3Pos = ((q3 - min) / range) * 80 + 10
  const maxPos = ((max - min) / range) * 80 + 10

  const boxColor = isDark ? '#818CF8' : '#4F46E5'

  return (
    <div className="relative w-full" style={{ height: `${height}px` }}>
      <svg width="100%" height={height} viewBox={`0 0 100 ${height}`}>
        {/* Whiskers */}
        <line x1={minPos} y1={height * 0.4} x2={q1Pos} y2={height * 0.4} stroke={boxColor} strokeWidth="2" />
        <line x1={maxPos} y1={height * 0.4} x2={q3Pos} y2={height * 0.4} stroke={boxColor} strokeWidth="2" />
        <line x1={minPos} y1={height * 0.3} x2={minPos} y2={height * 0.5} stroke={boxColor} strokeWidth="2" />
        <line x1={maxPos} y1={height * 0.3} x2={maxPos} y2={height * 0.5} stroke={boxColor} strokeWidth="2" />

        {/* Box */}
        <rect x={q1Pos} y={height * 0.25} width={q3Pos - q1Pos} height={height * 0.3} fill={boxColor} opacity="0.3" stroke={boxColor} strokeWidth="2" rx="2" />

        {/* Median line */}
        <line x1={medianPos} y1={height * 0.2} x2={medianPos} y2={height * 0.6} stroke={boxColor} strokeWidth="3" />

        {/* Outliers */}
        {outliers.slice(0, 10).map((outlier, i) => {
          const pos = ((outlier - min) / range) * 80 + 10
          return (
            <circle key={i} cx={pos} cy={height * 0.4} r="3" fill="#EF4444" opacity="0.8" />
          )
        })}

        {/* Labels */}
        <text x="50%" y={height - 5} textAnchor="middle" fontSize="10" fill={isDark ? '#94A3B8' : '#6B7280'}>
          Outliers: {outliers_count}
        </text>
      </svg>
    </div>
  )
}

export default BoxplotChart
