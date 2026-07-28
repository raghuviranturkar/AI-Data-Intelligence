import React from 'react'
import { cn } from '../../utils/cn'

interface MetricCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  subtitle?: string
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
  }
  className?: string
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  className,
}) => {
  return (
    <div className={cn('bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-medium ${
                  trend.direction === 'up'
                    ? 'text-success-600'
                    : trend.direction === 'down'
                    ? 'text-danger-600'
                    : 'text-gray-500'
                }`}
              >
                {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '→'} {trend.value}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-lg bg-primary-50 text-primary-600">{icon}</div>
        )}
      </div>
    </div>
  )
}

export default MetricCard
