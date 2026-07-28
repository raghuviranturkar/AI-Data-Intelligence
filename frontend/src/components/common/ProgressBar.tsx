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
    default: 'bg-primary-600',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-1">
        {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
        {showLabel && (
          <span className="text-sm font-medium text-gray-500">{Math.round(percentage)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ease-out ${variantColors[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
