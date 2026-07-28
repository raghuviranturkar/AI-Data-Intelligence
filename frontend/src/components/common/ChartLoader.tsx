import React from 'react'
import { cn } from '../../utils/cn'

interface ChartLoaderProps {
  className?: string
}

const ChartLoader: React.FC<ChartLoaderProps> = ({ className }) => {
  return (
    <div className={cn('bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse', className)}>
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded" />
    </div>
  )
}

export default ChartLoader
