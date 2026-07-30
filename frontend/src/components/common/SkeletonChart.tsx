import React from 'react'
import { cn } from '../../utils/cn'

interface SkeletonChartProps {
  className?: string
  height?: number
}

const SkeletonChart: React.FC<SkeletonChartProps> = ({ className, height = 300 }) => {
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse', className)}>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
      <div className={`h-[${height}px] bg-gray-200 dark:bg-gray-700 rounded`} />
    </div>
  )
}

export default SkeletonChart
