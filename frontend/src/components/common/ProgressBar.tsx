import React from 'react'
import { cn } from '../../utils/cn'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showLabel?: boolean
  className?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showLabel = true,
  className,
  variant = 'default',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const variantColors = {
    default: 'bg-primary-600 dark:bg-primary-500',
    success: 'bg-success-500 dark:bg-success-400',
    warning: 'bg-warning-500 dark:bg-warning-400',
    danger: 'bg-danger-500 dark:bg-danger-400',
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-1">
        {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
        {showLabel && (
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{Math.round(percentage)}%</span>
        )}
      </div>
      <div className="progress-bar">
        <div
          className={`progress-bar-fill ${variantColors[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
