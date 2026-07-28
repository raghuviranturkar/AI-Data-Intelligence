import React from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  AlertCircle,
  BarChart3,
  Activity
} from 'lucide-react'
import { cn } from '../../utils/cn'
import { Badge } from '../common/Badge'

export type InsightType = 'positive' | 'negative' | 'warning' | 'neutral' | 'info'

export interface InsightCardProps {
  title: string
  description: string
  type?: InsightType
  severity?: 'low' | 'medium' | 'high'
  icon?: React.ReactNode
  metadata?: {
    label: string
    value: string | number
  }[]
  footer?: string
  className?: string
}

const typeConfig = {
  positive: {
    icon: TrendingUp,
    color: 'text-success-600 dark:text-success-400',
    bg: 'bg-success-50 dark:bg-success-900/20',
    border: 'border-success-200 dark:border-success-800',
    badgeColor: 'success' as const,
  },
  negative: {
    icon: TrendingDown,
    color: 'text-danger-600 dark:text-danger-400',
    bg: 'bg-danger-50 dark:bg-danger-900/20',
    border: 'border-danger-200 dark:border-danger-800',
    badgeColor: 'danger' as const,
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-warning-600 dark:text-warning-400',
    bg: 'bg-warning-50 dark:bg-warning-900/20',
    border: 'border-warning-200 dark:border-warning-800',
    badgeColor: 'warning' as const,
  },
  info: {
    icon: Info,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    badgeColor: 'info' as const,
  },
  neutral: {
    icon: Activity,
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-50 dark:bg-gray-800/50',
    border: 'border-gray-200 dark:border-gray-700',
    badgeColor: 'default' as const,
  },
}

const severityLabels = {
  low: { label: 'Low', color: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' },
  medium: { label: 'Medium', color: 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400' },
  high: { label: 'High', color: 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-400' },
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  type = 'neutral',
  severity,
  icon,
  metadata = [],
  footer,
  className,
}) => {
  const config = typeConfig[type]
  const IconComponent = config.icon
  const SeverityBadge = severity ? severityLabels[severity] : null

  return (
    <div
      className={cn(
        'rounded-xl border p-5 transition-all duration-200 hover:shadow-md',
        config.bg,
        config.border,
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={cn('flex-shrink-0 mt-0.5', config.color)}>
            {icon || <IconComponent className="h-5 w-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {SeverityBadge && (
            <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', SeverityBadge.color)}>
              {SeverityBadge.label}
            </span>
          )}
          <Badge variant={config.badgeColor} size="sm">
            {type}
          </Badge>
        </div>
      </div>

      {/* Metadata */}
      {metadata.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4">
          {metadata.map((item, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}:</span>
              <span className="text-xs font-medium text-gray-900 dark:text-white">{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
          <p className="text-xs text-gray-500 dark:text-gray-400">{footer}</p>
        </div>
      )}
    </div>
  )
}

export default InsightCard
