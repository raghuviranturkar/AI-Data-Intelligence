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
    success: 'bg-success-50 border-success-200 text-success-700',
    warning: 'bg-warning-50 border-warning-200 text-warning-700',
    error: 'bg-danger-50 border-danger-200 text-danger-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
    pending: 'bg-gray-50 border-gray-200 text-gray-700',
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
        'rounded-xl border p-4',
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
