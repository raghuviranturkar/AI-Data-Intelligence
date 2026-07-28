import React from 'react'
import { cn } from '../../utils/cn'

interface EmptyStateProps {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => {
  return (
    <div className={cn('empty-state', className)}>
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export default EmptyState
