import React from 'react'
import { cn } from '../../utils/cn'

interface StatusCardProps {
  title: string
  status: 'success' | 'warning' | 'error' | 'info' | 'pending'
  message?: string
  className?: string
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  status,
  message,
  className,
}) => {
  const statusColors = {
    success: 'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800 text-success-700 dark:text-success-400',
    warning: 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800 text-warning-700 dark:text-warning-400',
    error: 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-400',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400',
    pending: 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-400',
  }

  const statusIcons = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'ℹ',
    pending: '⋯',
  }

  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-colors duration-200',
        statusColors[status],
        className
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold">{statusIcons[status]}</span>
        <div>
          <p className="font-medium">{title}</p>
          {message && <p className="text-sm opacity-75">{message}</p>}
        </div>
      </div>
    </div>
  )
}

export default StatusCard
