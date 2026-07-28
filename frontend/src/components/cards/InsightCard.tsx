import React from 'react'
import { cn } from '../../utils/cn'

interface InsightCardProps {
  title: string
  description: string
  type?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
  className?: string
}

const InsightCard: React.FC<InsightCardProps> = ({
  title,
  description,
  type = 'neutral',
  icon,
  className,
}) => {
  const typeColors = {
    positive: 'border-l-success-500 bg-success-50',
    negative: 'border-l-danger-500 bg-danger-50',
    neutral: 'border-l-primary-500 bg-primary-50',
  }

  return (
    <div
      className={cn(
        'rounded-xl border-l-4 p-4',
        typeColors[type],
        className
      )}
    >
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5">{icon}</div>}
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  )
}

export default InsightCard
