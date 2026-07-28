import React from 'react'
import { cn } from '../../utils/cn'

interface SkeletonCardProps {
  className?: string
  count?: number
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ className, count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 p-6 animate-pulse transition-colors duration-300',
            className
          )}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          </div>
        </div>
      ))}
    </>
  )
}

export default SkeletonCard
