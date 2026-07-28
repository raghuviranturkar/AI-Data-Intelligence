import React from 'react'
import { cn } from '../../utils/cn'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'bordered'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', children, ...props }, ref) => {
    const paddingStyles = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-6',
      lg: 'p-8',
    }

    const variantStyles = {
      default: 'bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/50',
      interactive: 'bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/50 hover:shadow-lg dark:hover:shadow-gray-900/70 hover:-translate-y-1 transition-all duration-200',
      bordered: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl',
          variantStyles[variant],
          paddingStyles[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

export default Card
